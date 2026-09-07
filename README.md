# UPI-Shield 🛡️
> **Contextual Digital Payment Scam & Coercion Detector**  
> *Official Entry for CC-GFG-02 — Career Catalyst Club × GeeksforGeeks Hackathon*  
> **Tagline:** *"Stay Alert. Stay Safe."*

[![Live Demo](https://img.shields.io/badge/Live_App-Vercel-000000?style=for-the-badge&logo=vercel)](https://upi-shield-lime.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-Render-46E3B7?style=for-the-badge&logo=render)](https://upi-shield-2qwq.onrender.com/api/health)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/ujjsingh2005-byte/Upi-Shield-)

---

## 📌 Live Application & Resources

- **🌐 Web Application (Vercel)**: [https://upi-shield-lime.vercel.app](https://upi-shield-lime.vercel.app)
- **⚡ REST API Backend (Render)**: [https://upi-shield-2qwq.onrender.com](https://upi-shield-2qwq.onrender.com)
- **💚 API Health Status**: [https://upi-shield-2qwq.onrender.com/api/health](https://upi-shield-2qwq.onrender.com/api/health)
- **💻 Source Code Repository**: [https://github.com/ujjsingh2005-byte/Upi-Shield-](https://github.com/ujjsingh2005-byte/Upi-Shield-)

---

## 🎯 Project Overview & Problem Statement

### The Problem (CC-GFG-02)
Digital payment fraud and social engineering scams in India (especially targeting UPI users) rely heavily on coercion, artificial urgency, and impersonation. Fraudsters trick victims into scanning QR codes, sharing OTPs/PINs, or transferring money under false pretexts such as pending bill disconnections, fake bank verification, or reward claims.

### The Solution: UPI-Shield
**UPI-Shield** is a contextual scam-risk and coercion detector designed to protect users before they complete a digital payment. By analyzing payment-related messages, screenshots, and UPI intent links (`upi://pay`), UPI-Shield identifies deceptive patterns and provides transparent risk scoring and bilingual safety recommendations.

> ⚠️ **Important Disclaimer**: UPI-Shield is an explainable scam-risk and coercion indicator. It does not guarantee whether a transaction is 100% safe or malicious, but highlights social engineering warning signs to empower informed user decisions.

---

## ✨ Key Features

- 💬 **Message Scanner**: Paste suspicious SMS messages, WhatsApp chats, or payment requests to detect coercion indicators.
- 🖼️ **Screenshot Scanner**: Upload screenshots of payment receipts, chats, or notices to extract text via OCR and scan for fraud indicators.
- 🔗 **UPI Intent Analyzer**: Parse `upi://pay` payment links to decode transaction parameters (VPA, payee name, amount, note) and evaluate context risk.
- 📊 **Explainable Risk Scoring**: Generates a normalized **0–100 Risk Score** categorized into **LOW**, **MEDIUM**, **HIGH**, or **CRITICAL** risk levels.
- 🔍 **Contextual Category Detection**: Evaluates 6 core scam categories:
  1. *Urgency & Time Pressure*
  2. *Threat, Fear & Consequences*
  3. *Authority & Impersonation*
  4. *Payment Pressure & Demands*
  5. *Credential / Security-Action Requests* (OTP, UPI PIN, Anydesk)
  6. *Reward, Refund & Cashback Bait*
- 🌐 **Bilingual Safety Guidance**: Delivers actionable, step-by-step safety advice in both **English** and **Hindi**.
- 🔒 **Privacy-Friendly Processing**: In-memory processing with no persistent application log storage.

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Backend API** | Python 3.11, FastAPI, Uvicorn |
| **OCR Engine** | Tesseract OCR, Pytesseract |
| **Image Processing** | Pillow (PIL) |
| **Validation & Schemas** | Pydantic v2 |
| **Testing** | Pytest (56 automated tests) |
| **Local Fallback UI** | Streamlit |
| **Production Hosting** | Vercel (Frontend) + Render Docker (Backend API) |

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    User([👤 User]) -->|Interacts with Web UI| Frontend[⚛️ React + Vite + TypeScript Frontend]
    Frontend -->|REST API over HTTPS| Backend[⚡ FastAPI REST Backend]
    
    subgraph Core Pipeline [🛡️ UPI-Shield Core Engine]
        OCR[📷 Tesseract OCR Engine] --> Pre[📝 Text Preprocessor]
        UPI[🔗 UPI Intent URI Parser] --> Pre
        Text[💬 Message Text Input] --> Pre
        
        Pre -->|Normalized Tokens & Entites| Detector[🔍 Deception Signal Detector]
        Detector -->|Raw Category Weights| RiskEngine[📊 Risk Engine & Heuristics]
        RiskEngine -->|Score & Level| Explainer[💡 Risk Explainer]
        RiskEngine --> Guidance[🌐 Bilingual Guidance Engine]
    end
    
    Backend --> Core Pipeline
    Explainer --> Result[📋 Risk Score, Reasons & Bilingual Guidance]
    Guidance --> Result
    Result --> Frontend
```

---

## 📡 REST API Reference

### 1. Health Check
`GET /api/health`

**Response (`200 OK`)**:
```json
{
  "status": "ok",
  "app": "UPI-Shield",
  "version": "0.1.0"
}
```

---

### 2. Text Message Analysis
`POST /api/analyze/text`

**Request Payload**:
```json
{
  "text": "URGENT: Your refund of ₹4,999 is pending verification. Your UPI account will be suspended if you don't complete verification immediately. Click the link below and enter your OTP to receive the refund."
}
```

**Response (`200 OK`)**:
```json
{
  "score": 72.0,
  "risk_level": "HIGH",
  "triggered_signals": [
    "urgency",
    "threat",
    "credential_request",
    "reward_manipulation"
  ],
  "indicators": {
    "urgency": 12.0,
    "threat": 16.0,
    "authority": 0.0,
    "payment_pressure": 0.0,
    "credential_request": 18.0,
    "reward_manipulation": 12.0
  },
  "explanation_summary": "High risk detected (Score 72/100). Message exhibits strong urgency, coercive threats, credential request (OTP/PIN), and reward/refund baiting.",
  "reasons": [
    "Urgency keywords detected: 'urgent', 'immediately'",
    "Coercive threat detected: account suspension",
    "Credential request detected: OTP disclosure request",
    "Reward/Refund baiting detected: pending refund claim"
  ],
  "evidence": [
    "URGENT",
    "suspended",
    "OTP",
    "refund"
  ],
  "recommendation_en": "HIGH RISK: Do not share OTPs, UPI PINs, or click suspicious verification links. Official refunds never require entering a PIN or OTP to receive money.",
  "recommendation_hi": "उच्च जोखिम: कभी भी OTP या UPI PIN साझा न करें। रिफंड प्राप्त करने के लिए PIN दर्ज करने की आवश्यकता नहीं होती है।",
  "action_bullets_en": [
    "Do NOT share OTP or UPI PIN with anyone.",
    "Do NOT click unverified verification links.",
    "Remember: Receiving money via UPI NEVER requires entering your UPI PIN."
  ],
  "action_bullets_hi": [
    "किसी के भी साथ अपना OTP या UPI PIN साझा न करें।",
    "किसी संदिग्ध लिंक पर क्लिक न करें।",
    "याद रखें: UPI से पैसे प्राप्त करने के लिए कभी भी PIN डालने की आवश्यकता नहीं होती।"
  ],
  "extracted_context": {
    "char_count": 218,
    "word_count": 32,
    "has_urls": true,
    "extracted_urls": ["https://..."],
    "has_upi_ids": false,
    "has_phones": false,
    "has_amounts": true,
    "extracted_amounts": ["4999"]
  }
}
```

---

### 3. UPI Intent URI Analysis
`POST /api/analyze/upi`

**Request Payload**:
```json
{
  "uri": "upi://pay?pa=kycupdate@upi&pn=KYC%20Verification&am=1999&cu=INR&tn=Urgent%20KYC%20verification"
}
```

**Response (`200 OK`)**:
```json
{
  "is_valid": true,
  "payee_vpa": "kycupdate@upi",
  "payee_name": "KYC Verification",
  "amount": "1999.00",
  "currency": "INR",
  "transaction_note": "Urgent KYC verification",
  "raw_uri": "upi://pay?pa=kycupdate@upi&pn=KYC%20Verification&am=1999&cu=INR&tn=Urgent%20KYC%20verification",
  "errors": [],
  "risk_analysis": {
    "score": 36.0,
    "risk_level": "MEDIUM",
    "triggered_signals": ["urgency", "credential_request"]
  }
}
```

---

### 4. Screenshot OCR Image Analysis
`POST /api/analyze/image`

**Request Payload**: `multipart/form-data` with `file` field containing screenshot image (PNG, JPG, WEBP).

**Response (`200 OK`)**:
```json
{
  "ocr_success": true,
  "extracted_text": "URGENT: Your refund of Rs 4999 is pending verification...",
  "ocr_error": null,
  "risk_analysis": {
    "score": 72.0,
    "risk_level": "HIGH",
    "triggered_signals": ["urgency", "threat", "credential_request", "reward_manipulation"]
  },
  "process_time_ms": 1250.4
}
```

---

## 🛠️ Local Development & Setup Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **Tesseract OCR** (optional for local image OCR)

### 1. Clone Repository
```bash
git clone https://github.com/Arpankumar673/Upi-Shield-.git
cd Upi-Shield-
```

### 2. Backend Setup
```bash
# Create and activate Python virtual environment
python -m venv .venv

# On Windows:
.\.venv\Scripts\activate
# On macOS / Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server (runs on http://localhost:8000)
uvicorn api.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

### 4. Run Test Suite
```bash
# Run pytest automated test suite (56 tests)
pytest tests/

# Build frontend production bundle
cd frontend
npm run build
```

### 5. Run Local Streamlit Fallback Application
```bash
streamlit run app.py
```

---

## 🧪 Verification & Test Suite Summary

- **Pytest Automation**: 56 unit & integration tests passing (`100% pass rate`).
- **Core Test Cases**:
  - Safe transfer message: **0 / 100 (LOW)**
  - Official Refund Scam: **72 / 100 (HIGH)**
  - Electricity disconnection threat: **80 / 100 (HIGH)**
  - Direct OTP sharing request: **36 / 100 (MEDIUM)**
  - Benign cashback message: **9 / 100 (LOW)**
  - Normal UPI payment link: **0 / 100 (LOW)**
  - Suspicious KYC UPI link: **36 / 100 (MEDIUM)**

---

## 📜 Hackathon Details & License
- **Event**: Career Catalyst Club × GeeksforGeeks Hackathon
- **Track**: CC-GFG-02 — Contextual Digital Payment Scam & Coercion Detector
- **License**: MIT Open Source License
