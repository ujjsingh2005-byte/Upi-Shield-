"""
FastAPI Main Application Module for UPI-Shield REST API.
Reuses existing src/ detection, scoring, explanation, guidance, OCR, and UPI parser modules.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

from src.preprocessing import TextProcessor
from src.detection import SignalDetector
from src.scoring import RiskEngine
from src.explanations import Explainer
from src.guidance import GuidanceEngine
from src.ocr import OCREngine
from src.upi import UPIParser

from api.schemas import (
    TextAnalysisRequest,
    UPIAnalysisRequest,
    SignalDetail,
    AnalysisResponse,
    UPIAnalysisResponse,
    ImageAnalysisResponse,
)

# Initialize FastAPI App
app = FastAPI(
    title="UPI-Shield REST API",
    description="Contextual Digital Payment Scam & Coercion Detection API",
    version="0.1.0"
)

# Configure CORS for Frontend Integration (Vercel / Local)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://upi-shield-lime.vercel.app",
        "https://upi-shield-three.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "*"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Shared Core Pipeline Instances
processor = TextProcessor()
detector = SignalDetector()
risk_engine = RiskEngine()
explainer = Explainer()
guidance_engine = GuidanceEngine()
ocr_engine = OCREngine()
upi_parser = UPIParser()


def _run_core_pipeline(text: str) -> AnalysisResponse:
    """Executes the existing core detection and scoring pipeline."""
    processed = processor.process(text)
    detection_res = detector.analyze(processed)
    risk_res = risk_engine.calculate_risk(detection_res)
    explanation_res = explainer.explain(detection_res, risk_res)
    guidance_res = guidance_engine.generate_guidance(risk_res.risk_level)

    signals_list = [
        SignalDetail(
            name=s.name,
            display_name=s.display_name,
            score=s.score,
            detected=s.detected,
            evidence=s.evidence,
            reasons=s.reasons
        ) for s in detection_res.signals
    ]

    extracted_context = {
        "char_count": processed.char_count,
        "word_count": processed.word_count,
        "has_urls": processed.has_urls,
        "extracted_urls": processed.extracted_urls,
        "has_upi_ids": processed.has_upi_ids,
        "extracted_upi_ids": processed.extracted_upi_ids,
        "has_phones": processed.has_phones,
        "extracted_phones": processed.extracted_phones,
        "has_amounts": processed.has_amounts,
        "extracted_amounts": processed.extracted_amounts,
        "is_truncated": processed.is_truncated,
    }

    return AnalysisResponse(
        score=risk_res.score,
        risk_level=risk_res.risk_level,
        triggered_signals=risk_res.triggered_signals,
        indicators=risk_res.signal_contributions,
        signals=signals_list,
        explanation_summary=explanation_res.summary,
        reasons=explanation_res.reasons,
        evidence=explanation_res.evidence_breakdown,
        recommendation_en=guidance_res.recommendation_en,
        recommendation_hi=guidance_res.recommendation_hi,
        action_bullets_en=guidance_res.action_bullet_points_en,
        action_bullets_hi=guidance_res.action_bullet_points_hi,
        extracted_context=extracted_context,
    )


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "app": "UPI-Shield", "version": "0.1.0"}


@app.post("/api/analyze/text", response_model=AnalysisResponse)
def analyze_text(payload: TextAnalysisRequest):
    """Analyzes message text for contextual digital payment scam and coercion signals."""
    if not payload.text or not payload.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text field cannot be empty."
        )
    try:
        return _run_core_pipeline(payload.text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis processing error: {str(e)}"
        )


@app.post("/api/analyze/upi", response_model=UPIAnalysisResponse)
def analyze_upi(payload: UPIAnalysisRequest):
    """Parses a upi://pay Payment Intent URI and evaluates transaction context risk."""
    if not payload.uri or not payload.uri.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="URI field cannot be empty."
        )

    intent_data = upi_parser.parse_uri(payload.uri)
    risk_analysis = None

    if intent_data.is_valid:
        context_text = intent_data.get_message_context()
        risk_analysis = _run_core_pipeline(context_text)

    return UPIAnalysisResponse(
        is_valid=intent_data.is_valid,
        payee_vpa=intent_data.payee_vpa,
        payee_name=intent_data.payee_name,
        amount=intent_data.amount,
        currency=intent_data.currency,
        transaction_note=intent_data.transaction_note,
        raw_uri=intent_data.raw_uri,
        errors=intent_data.errors,
        risk_analysis=risk_analysis,
    )


@app.post("/api/analyze/image", response_model=ImageAnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """Extracts text from uploaded screenshot image in-memory and analyzes threat indicators."""
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image file upload required."
        )

    try:
        content = await file.read()
        ocr_res = ocr_engine.extract_text_from_bytes(content, mime_type=file.content_type)
        risk_analysis = None

        if ocr_res.success and ocr_res.extracted_text.strip():
            risk_analysis = _run_core_pipeline(ocr_res.extracted_text)

        return ImageAnalysisResponse(
            ocr_success=ocr_res.success,
            extracted_text=ocr_res.extracted_text,
            ocr_error=ocr_res.error,
            risk_analysis=risk_analysis,
            process_time_ms=ocr_res.process_time_ms,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image upload processing error: {str(e)}"
        )
