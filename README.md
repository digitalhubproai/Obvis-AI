# 🏥 Obvis - AI Medical Agent Platform

<div align="center">

![Obvis Logo](https://img.shields.io/badge/Obvis-Medical%20AI-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Python](https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?style=for-the-badge&logo=fastapi)
![Deployed on Hugging Face](https://img.shields.io/badge/Deployed%20on-Hugging%20Face-FFD21E?style=for-the-badge&logo=huggingface)

**Your Personal AI Doctor - Available 24/7**

[🔗 GitHub Repository](https://github.com/digitalhubproai/Obvis-AI) • [🤗 Live Demo](https://huggingface.co/spaces/creativesar/Obvis_AI) • [Setup Guide](SETUP_GUIDE.md) • [API Docs](API_DOCUMENTATION.md)

</div>

---

## 📋 Overview

**Obvis** is an advanced AI-powered medical consultation platform that connects patients with specialist AI doctors across 13+ medical departments. Describe your symptoms, get automatically routed to the right specialist, answer diagnostic questions, and receive detailed diagnosis with medicine suggestions—all powered by state-of-the-art AI.

### ✨ Key Features

- 🤖 **13 Specialist AI Doctors** - Each department has its own AI specialist with expert knowledge
- 🎯 **Smart Triage** - Automatic department detection based on symptoms
- 💬 **Interactive Consultation** - AI asks 3-5 targeted diagnostic questions
- 💊 **Medicine Suggestions** - Detailed prescriptions with dosages and purposes
- 📊 **Report Analysis** - Upload medical reports for AI-powered analysis
- 📝 **Clear Summaries** - Easy-to-understand explanations of your condition
- 🗄️ **Neon PostgreSQL** - Reliable data storage with Neon Tech
- 🔌 **OpenRouter API** - Access to advanced AI models (GPT-4, Claude, etc.)

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend       │         │   AI Services   │
│   Next.js 16    │◄───────►│    FastAPI       │◄───────►│   OpenRouter    │
│   React 19      │  REST   │    Python 3.13   │  API    │   GPT-4/Claude  │
│   TypeScript    │         │                  │         │                 │
└─────────────────┘         └────────┬─────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │   Database       │
                            │   Neon PostgreSQL│
                            └──────────────────┘
```

---

## 🩺 Medical Departments & AI Specialists

| Department | AI Specialist | Conditions Treated |
|------------|--------------|-------------------|
| 🫀 **Cardiology** | Dr. Heart AI | Chest pain, heart attack, palpitations, BP |
| 🧠 **Neurology** | Dr. Brain AI | Headache, migraine, seizure, stroke |
| 🧴 **Dermatology** | Dr. Skin AI | Acne, rash, eczema, psoriasis |
| 🦴 **Orthopedics** | Dr. Bone AI | Fracture, joint pain, arthritis |
| 🍽️ **Gastroenterology** | Dr. Digest AI | Stomach pain, acid reflux, IBS |
| 🫁 **Pulmonology** | Dr. Lung AI | Cough, asthma, breathing difficulty |
| 🧪 **Endocrinology** | Dr. Hormone AI | Diabetes, thyroid, hormonal imbalance |
| 🚽 **Urology** | Dr. Urinary AI | UTI, kidney stone, bladder infection |
| 👩‍⚕️ **Gynecology** | Dr. Women's Health AI | Menstrual issues, PCOS, pregnancy |
| 👶 **Pediatrics** | Dr. Child AI | Child fever, cold, allergy |
| 👁️ **Ophthalmology** | Dr. Eye AI | Blurry vision, eye pain, glaucoma |
| 👂 **ENT** | Dr. ENT AI | Ear pain, sinus, sore throat |
| 🩺 **General** | Dr. General AI | Fever, flu, general weakness |

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.13** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Neon PostgreSQL** - [Sign up free](https://neon.tech)
- **OpenRouter API Key** - [Get key](https://openrouter.ai)

### Installation (Windows)

1. **Run Setup Script:**
   ```bash
   setup.bat
   ```

2. **Configure Environment:**
   - Edit `backend\.env` with your API keys
   - Add Neon PostgreSQL connection string
   - Add OpenRouter API key

3. **Start Application:**
   ```bash
   start.bat
   ```

4. **Open Browser:**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs

📖 **Detailed instructions:** [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## 💻 Project Structure

```
Obvis/
├── 📁 backend/                 # Python FastAPI Backend
│   ├── main.py                # Main API application
│   ├── database.py            # Database configuration
│   ├── schema.sql             # Database schema
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment template
│   └── .env                  # Environment variables
│
├── 📁 frontend/               # Next.js Frontend
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx      # Home page
│   │       ├── layout.tsx    # Root layout
│   │       ├── globals.css   # Global styles
│   │       ├── consult/
│   │       │   └── page.tsx  # Consultation page
│   │       └── upload-report/
│   │           └── page.tsx  # Report upload page
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── .env.local.example
│
├── setup.bat                  # Setup script
├── start.bat                  # Start script
├── README.md                  # This file
├── SETUP_GUIDE.md            # Detailed setup guide
└── API_DOCUMENTATION.md      # API reference
```

---

## 🔧 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16 | React Framework |
| React | 19 | UI Library |
| TypeScript | 5 | Type Safety |
| Tailwind CSS | 3 | Styling |
| Framer Motion | 11 | Animations |
| Axios | 1.6 | HTTP Client |
| React Dropzone | 14 | File Upload |
| Zustand | 5 | State Management |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.13 | Language |
| FastAPI | 0.115 | Web Framework |
| SQLAlchemy | 2.0 | ORM |
| PostgreSQL | - | Database (Neon) |
| Pydantic | 2.9 | Data Validation |
| HTTPX | 0.27 | Async HTTP |
| Pillow | 11 | Image Processing |
| python-dotenv | 1.0 | Environment |

### AI & APIs
| Service | Purpose |
|---------|---------|
| OpenRouter | AI Model Access (GPT-4, Claude) |
| Neon PostgreSQL | Serverless Database |

---

## 📖 How It Works

### 🔍 Symptom Consultation Flow

```
1. User describes symptoms
         ↓
2. AI detects appropriate department
         ↓
3. Connects to specialist AI doctor
         ↓
4. AI asks 3-5 diagnostic questions
         ↓
5. User provides answers
         ↓
6. AI provides:
   - Diagnosis
   - Medicines with dosages
   - Recommendations
   - Clear summary
```

### 📄 Medical Report Analysis Flow

```
1. User uploads report image
         ↓
2. User selects department
         ↓
3. User describes symptoms
         ↓
4. AI scans and analyzes report
         ↓
5. Specialist AI reviews findings
         ↓
6. AI provides:
   - Report analysis
   - Diagnosis (report + symptoms)
   - Medicines
   - Summary explanation
```

---

## 🌟 Demo Screenshots

### Home Page
- Beautiful landing page with feature highlights
- 13 department cards
- How it works section
- Quick access to consultation

### Consultation Page
- Step-by-step symptom input
- Real-time AI question generation
- Progressive question-answer flow
- Detailed results with medicines

### Report Upload
- Drag & drop file upload
- Department selection
- AI-powered report analysis
- Comprehensive results

---

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Detailed installation and configuration
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[Database Schema](backend/schema.sql)** - PostgreSQL schema

---

## 🔐 Environment Variables

### Backend (.env)
```env
OPENROUTER_API_KEY=sk_or_xxxxxxx
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
JWT_SECRET=your_secret_key
ALLOWED_ORIGINS=http://localhost:3000,https://creativesar-obvis-ai.hf.space
```

### Frontend (.env.local)
```env
# For local development:
NEXT_PUBLIC_API_URL=http://localhost:8000

# For Hugging Face production:
NEXT_PUBLIC_API_URL=https://creativesar-obvis-ai.hf.space
```

---

## 🧪 Testing

### Test Consultation
```bash
curl -X POST http://localhost:8000/api/detect-department \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "chest pain and shortness of breath"}'
```

### Test Report Upload
```bash
curl -X POST http://localhost:8000/api/analyze-report \
  -F "file=@report.jpg" \
  -F "department=cardiology" \
  -F "symptoms=chest pain"
```

---

## ⚠️ Medical Disclaimer

**IMPORTANT:** Obvis is an AI-powered information platform, NOT a replacement for professional medical advice.

- ❌ Not for medical emergencies
- ❌ Not a substitute for in-person doctor visits
- ✅ Use for informational purposes only
- ✅ Always consult licensed healthcare professionals
- ✅ Call emergency services for urgent conditions

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

This project is for educational and demonstration purposes.

---

## 👨‍💻 Development

### Run Backend Manually
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Run Frontend Manually
```bash
cd frontend
npm run dev
```

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🎯 Future Enhancements

- [ ] User authentication & profiles
- [ ] Consultation history
- [ ] Medicine reminders
- [ ] Multi-language support
- [ ] Voice input for symptoms
- [ ] Integration with pharmacies
- [ ] Appointment booking with real doctors
- [ ] Health analytics dashboard
- [ ] Mobile app (React Native)

---

## 📞 Support

For questions or issues:
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Check backend logs for errors
- Review browser console for frontend issues

---

<div align="center">

**Built with ❤️ for Healthcare**

[Obvis](#) - Your AI Medical Agent

</div>
"# Obvis-AI" 
