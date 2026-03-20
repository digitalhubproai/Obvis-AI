# -*- coding: utf-8 -*-
import os
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, ConfigDict, Field, EmailStr
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import httpx
import json
from dotenv import load_dotenv
from sqlalchemy import Column, String, Text, DateTime, Integer, ForeignKey, JSON, Boolean, Float
from sqlalchemy.orm import Session, relationship
import base64
from PIL import Image
import io

# Import database configuration from database.py
from database import engine, SessionLocal, Base, get_db

load_dotenv()

app = FastAPI(title="Obvis Medical AI API", version="2.0.0")

# CORS Configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "your_super_secret_jwt_key_change_this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# OpenRouter API Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Emergency Symptoms - CRITICAL
EMERGENCY_SYMPTOMS = [
    "chest pain", "heart attack", "severe bleeding", "unconscious", "not breathing",
    "stroke", "seizure", "choking", "severe burn", "poisoning", "overdose",
    "suicide", "self harm", "severe allergic reaction", "anaphylaxis",
    "severe head injury", "broken bone", "eye injury", "severe abdominal pain",
    "vomiting blood", "coughing blood", "severe shortness of breath"
]

EMERGENCY_CONTACTS = {
    "ambulance": "911",
    "police": "911",
    "fire": "911",
    "poison_control": "1-800-222-1222",
    "suicide_prevention": "988"
}

# Medicine Interactions Database
MEDICINE_INTERACTIONS = {
    "aspirin": ["warfarin", "ibuprofen", "naproxen"],
    "ibuprofen": ["aspirin", "warfarin", "lisinopril"],
    "warfarin": ["aspirin", "ibuprofen", "vitamin k"],
    "lisinopril": ["potassium", "ibuprofen", "spironolactone"],
}

# Medical Departments with Specialist AI Doctors
MEDICAL_DEPARTMENTS = {
    "cardiology": {
        "name": "Cardiology",
        "specialist": "Dr. Sarah Mitchell - Cardiology Specialist",
        "description": "Heart and cardiovascular system specialist",
        "conditions": ["chest pain", "heart attack", "palpitations", "high blood pressure", "arrhythmia", "cardiac arrest", "angina", "heart failure"],
        "system_prompt": "You are Dr. Sarah Mitchell, a highly experienced cardiologist with 20+ years of expertise. You specialize in diagnosing and treating heart conditions. Ask 3-5 targeted questions about symptoms, then provide detailed diagnosis, medicine suggestions with dosages, and a clear summary."
    },
    "neurology": {
        "name": "Neurology",
        "specialist": "Dr. James Chen - Neurology Specialist",
        "description": "Brain and nervous system specialist",
        "conditions": ["headache", "migraine", "seizure", "epilepsy", "stroke", "dizziness", "neuropathy", "parkinson", "alzheimer"],
        "system_prompt": "You are Dr. James Chen, a renowned neurologist with expertise in brain and nervous system disorders. Ask 3-5 specific questions, then provide diagnosis, treatment plan, medications with dosages, and a comprehensive summary."
    },
    "dermatology": {
        "name": "Dermatology",
        "specialist": "Dr. Emily Rodriguez - Dermatology Specialist",
        "description": "Skin, hair, and nails specialist",
        "conditions": ["acne", "rash", "eczema", "psoriasis", "skin infection", "hair loss", "nail fungus", "melanoma", "dermatitis"],
        "system_prompt": "You are Dr. Emily Rodriguez, an expert dermatologist. Ask 3-5 questions about the skin condition, appearance, symptoms duration, and triggers. Provide diagnosis, topical/oral medications, skincare routine, and detailed summary."
    },
    "orthopedics": {
        "name": "Orthopedics",
        "specialist": "Dr. Michael Thompson - Orthopedics Specialist",
        "description": "Bones, joints, muscles, and ligaments specialist",
        "conditions": ["fracture", "joint pain", "arthritis", "back pain", "sprain", "torn ligament", "osteoporosis", "sciatica"],
        "system_prompt": "You are Dr. Michael Thompson, a skilled orthopedic surgeon. Ask 3-5 questions about pain location, intensity, movement limitations, and injury history. Provide diagnosis, treatment options, medications, physiotherapy advice, and summary."
    },
    "gastroenterology": {
        "name": "Gastroenterology",
        "specialist": "Dr. Priya Sharma - Gastroenterology Specialist",
        "description": "Digestive system specialist",
        "conditions": ["stomach pain", "acid reflux", "gastritis", "ibs", "diarrhea", "constipation", "ulcer", "hepatitis", "pancreatitis"],
        "system_prompt": "You are Dr. Priya Sharma, an experienced gastroenterologist. Ask 3-5 questions about digestive symptoms, diet, bowel movements, and pain patterns. Provide diagnosis, dietary recommendations, medications, and comprehensive summary."
    },
    "pulmonology": {
        "name": "Pulmonology",
        "specialist": "Dr. David Kim - Pulmonology Specialist",
        "description": "Respiratory system and lungs specialist",
        "conditions": ["cough", "asthma", "breathing difficulty", "pneumonia", "bronchitis", "copd", "tuberculosis", "sleep apnea"],
        "system_prompt": "You are Dr. David Kim, a pulmonology expert. Ask 3-5 questions about breathing patterns, cough type, triggers, and respiratory history. Provide diagnosis, inhaler/medications, breathing exercises, and detailed summary."
    },
    "endocrinology": {
        "name": "Endocrinology",
        "specialist": "Dr. Lisa Anderson - Endocrinology Specialist",
        "description": "Hormones and endocrine system specialist",
        "conditions": ["diabetes", "thyroid", "hormonal imbalance", "obesity", "metabolic disorder", "insulin resistance", "pcos"],
        "system_prompt": "You are Dr. Lisa Anderson, an endocrinology specialist. Ask 3-5 questions about symptoms, lifestyle, family history, and hormone-related issues. Provide diagnosis, lifestyle changes, medications, and comprehensive summary."
    },
    "urology": {
        "name": "Urology",
        "specialist": "Dr. Robert Wilson - Urology Specialist",
        "description": "Urinary tract and reproductive system specialist",
        "conditions": ["uti", "kidney stone", "bladder infection", "prostate", "urinary incontinence", "blood in urine"],
        "system_prompt": "You are Dr. Robert Wilson, a urology expert. Ask 3-5 questions about urinary symptoms, pain, frequency, and related issues. Provide diagnosis, medications, lifestyle advice, and detailed summary."
    },
    "gynecology": {
        "name": "Gynecology",
        "specialist": "Dr. Amanda Foster - Gynecology Specialist",
        "description": "Women's reproductive health specialist",
        "conditions": ["menstrual cramps", "pcos", "endometriosis", "vaginal infection", "infertility", "menopause", "pregnancy"],
        "system_prompt": "You are Dr. Amanda Foster, an experienced gynecologist. Ask 3-5 sensitive questions about symptoms, cycle, and reproductive health. Provide diagnosis, treatments, medications, and comprehensive summary."
    },
    "pediatrics": {
        "name": "Pediatrics",
        "specialist": "Dr. Jennifer Martinez - Pediatrics Specialist",
        "description": "Child health specialist",
        "conditions": ["fever", "cold", "cough", "vomit", "diarrhea", "allergy", "asthma", "infection", "rash"],
        "system_prompt": "You are Dr. Jennifer Martinez, a caring pediatrician. Ask 3-5 age-appropriate questions about child's symptoms, behavior, and history. Provide child-safe diagnosis, medications with pediatric dosages, and parent-friendly summary."
    },
    "ophthalmology": {
        "name": "Ophthalmology",
        "specialist": "Dr. Kevin Patel - Ophthalmology Specialist",
        "description": "Eye and vision specialist",
        "conditions": ["blurry vision", "eye pain", "red eye", "glaucoma", "cataract", "dry eye", "eye infection", "vision loss"],
        "system_prompt": "You are Dr. Kevin Patel, an ophthalmology expert. Ask 3-5 questions about vision problems, eye pain, duration, and visual history. Provide diagnosis, eye drops/medications, vision care, and detailed summary."
    },
    "ent": {
        "name": "ENT (Ear, Nose, Throat)",
        "specialist": "Dr. Rachel Green - ENT Specialist",
        "description": "Ear, nose, and throat specialist",
        "conditions": ["ear pain", "hearing loss", "sinus", "tonsillitis", "sore throat", "vertigo", "nose bleed", "snoring"],
        "system_prompt": "You are Dr. Rachel Green, an otolaryngology specialist. Ask 3-5 questions about ENT symptoms, pain, discharge, and related issues. Provide diagnosis, medications, home remedies, and comprehensive summary."
    },
    "general": {
        "name": "General Physician",
        "specialist": "Dr. Thomas Brown - General Physician",
        "description": "General health and primary care",
        "conditions": ["fever", "flu", "cold", "headache", "body pain", "fatigue", "weakness", "general weakness"],
        "system_prompt": "You are Dr. Thomas Brown, an experienced primary care physician. Ask 3-5 questions about general symptoms, duration, severity, and medical history. Provide diagnosis, OTC medications, home care, and detailed summary."
    }
}

# Database Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(20))
    age = Column(Integer)
    gender = Column(String(20))
    hashed_password = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    consultations = relationship("Consultation", back_populates="user")
    symptom_logs = relationship("SymptomLog", back_populates="user")


class Consultation(Base):
    __tablename__ = "consultations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    department = Column(String(50))
    symptoms = Column(Text)
    ai_questions = Column(JSON)
    patient_answers = Column(JSON)
    diagnosis = Column(Text)
    medicines = Column(JSON)
    summary = Column(Text)
    report_url = Column(String, nullable=True)
    report_analysis = Column(Text, nullable=True)
    status = Column(String(20), default="completed")
    ai_confidence = Column(Float, nullable=True)
    second_opinion = Column(Text, nullable=True)
    is_emergency = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="consultations")


class SymptomLog(Base):
    __tablename__ = "symptom_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    symptom = Column(String(255))
    severity = Column(Integer)  # 1-10 scale
    notes = Column(Text, nullable=True)
    logged_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="symptom_logs")


class MedicineReminder(Base):
    __tablename__ = "medicine_reminders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    medicine_name = Column(String(255))
    dosage = Column(String(100))
    frequency = Column(String(100))
    time_of_day = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class MedicalReport(Base):
    __tablename__ = "medical_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    report_type = Column(String(100))
    file_path = Column(String(255))
    analysis = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reports")


class AISession(Base):
    __tablename__ = "ai_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ai_sessions")


class Prescription(Base):
    __tablename__ = "prescriptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    consultation_id = Column(Integer, ForeignKey("consultations.id"))
    medicine_name = Column(String(255))
    dosage = Column(String(100))
    frequency = Column(String(100))
    duration = Column(String(100))
    instructions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="prescriptions")
    consultation = relationship("Consultation", back_populates="prescriptions")


# Add back-references to User and Consultation models
User.reports = relationship("MedicalReport", back_populates="user")
User.ai_sessions = relationship("AISession", back_populates="user")
User.prescriptions = relationship("Prescription", back_populates="user")
Consultation.prescriptions = relationship("Prescription", back_populates="consultation")


# Pydantic Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class SymptomInput(BaseModel):
    symptoms: str
    age: Optional[int] = None
    gender: Optional[str] = None
    medical_history: Optional[str] = None


class QuestionAnswer(BaseModel):
    question: str
    answer: str


class ConsultationRequest(BaseModel):
    symptoms: str
    department: str
    answers: List[QuestionAnswer]
    age: Optional[int] = None
    gender: Optional[str] = None
    medical_history: Optional[str] = None
    get_second_opinion: Optional[bool] = False


class SymptomLogCreate(BaseModel):
    symptom: str
    severity: int
    notes: Optional[str] = None


class MedicineInteractionCheck(BaseModel):
    medicines: List[str]


class DepartmentInfo(BaseModel):
    id: str
    name: str
    specialist: str
    description: str


# Helper Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# Helper Functions Implementation
def detect_emergency(symptoms: str) -> Tuple[bool, List[str]]:
    """Detect if symptoms indicate a medical emergency"""
    symptoms_lower = symptoms.lower()
    detected_emergencies = []

    for emergency_symptom in EMERGENCY_SYMPTOMS:
        if emergency_symptom in symptoms_lower:
            detected_emergencies.append(emergency_symptom)

    return len(detected_emergencies) > 0, detected_emergencies


def check_medicine_interactions(medicines: List[str]) -> List[Dict[str, str]]:
    """Check for drug interactions"""
    interactions = []
    medicines_lower = [m.lower().strip() for m in medicines]
    num_meds = len(medicines_lower)
    
    for i in range(num_meds):
        medicine = medicines_lower[i]
        if medicine in MEDICINE_INTERACTIONS:
            for j in range(i + 1, num_meds):
                other_medicine = medicines_lower[j]
                if other_medicine in MEDICINE_INTERACTIONS[medicine]:
                    interaction = {
                        "medicine1": medicine,
                        "medicine2": other_medicine,
                        "severity": "moderate",
                        "description": f"{medicine} may interact with {other_medicine}. Consult your doctor."
                    }
                    if interaction not in interactions:
                        interactions.append(interaction)
    
    return interactions


def detect_department(symptoms: str) -> str:
    """Detect the appropriate medical department based on symptoms"""
    symptoms_lower = symptoms.lower()
    best_dept = "general"
    max_score = 0

    # Expanded keywords for better matching
    department_keywords = {
        "cardiology": ["chest", "heart", "palpitation", "cardiac", "blood pressure", "angina", "heartbeat", "cardio", "hypertension", "bp", "pulse"],
        "neurology": ["headache", "migraine", "seizure", "dizzy", "neuro", "brain", "nerve", "numbness", "tingling", "tremor", "memory loss", "confusion", "stroke"],
        "dermatology": ["skin", "rash", "acne", "eczema", "psoriasis", "hair", "nail", "itch", "pimple", "dark spot", "pigmentation", "dermatitis", "fungal"],
        "orthopedics": ["bone", "joint", "fracture", "arthritis", "back pain", "sprain", "muscle", "knee", "shoulder", "hip", "spine", "ligament", "tendon", "neck pain"],
        "gastroenterology": ["stomach", "digest", "acid", "gastr", "bowel", "liver", "ulcer", "vomiting", "nausea", "diarrhea", "constipation", "gas", "bloating", "abdominal", "jaundice"],
        "pulmonology": ["breath", "lung", "cough", "asthma", "respiratory", "pneumonia", "wheezing", "shortness", "breathing", "chest congestion", "tuberculosis", "tb"],
        "endocrinology": ["diabetes", "thyroid", "hormone", "insulin", "metabolic", "weight gain", "weight loss", "pcos", "hypothyroid", "hyperthyroid"],
        "urology": ["urine", "kidney", "bladder", "prostate", "urinary", "uti", "burning urine", "frequent urination", "kidney stone", "blood in urine"],
        "gynecology": ["menstrual", "pregnancy", "vaginal", "womb", "ovary", "pcos", "period", "bleeding", "discharge", "infertility", "menopause"],
        "pediatrics": ["child", "baby", "infant", "pediatric", "boy", "girl", "years old", "age"],
        "ophthalmology": ["eye", "vision", "blurry", "cataract", "glaucoma", "red eye", "eye pain", "sight", "blind", "floaters"],
        "ent": ["ear", "nose", "throat", "sinus", "tonsil", "hearing", "sore throat", "ear pain", "nasal", "snoring", "vertigo", "dizziness"],
    }

    for dept, keywords in department_keywords.items():
        score = sum(1 for keyword in keywords if keyword in symptoms_lower)
        if score > max_score:
            max_score = score
            best_dept = dept

    # If no match found, use AI to detect
    if max_score == 0:
        # Return general but with low confidence - frontend can prompt user to select
        return "general"

    return best_dept



async def call_openrouter_ai(messages: List[Dict[str, str]], system_prompt: str, temperature: float = 0.7) -> str:
    """Call OpenRouter API for AI responses"""
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Obvis Medical AI"
    }

    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            *messages
        ],
        "temperature": temperature,
        "max_tokens": 2000
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(OPENROUTER_URL, headers=headers, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"AI API error: {response.text}")

        data = response.json()
        return data["choices"][0]["message"]["content"]





# API Endpoints
@app.get("/")
async def root():
    return {
        "name": "Obvis Medical AI API",
        "version": "2.0.0",
        "status": "running",
        "departments": len(MEDICAL_DEPARTMENTS),
        "features": ["Authentication", "Emergency Detection", "Second Opinion", "Medicine Interactions", "Symptom Tracking"]
    }


# Authentication Endpoints
@app.post("/api/auth/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        age=user_data.age,
        gender=user_data.gender,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }


@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user


@app.put("/api/auth/profile")
async def update_profile(
    name: Optional[str] = None,
    phone: Optional[str] = None,
    age: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    if name is not None:
        current_user.name = name
    if phone is not None:
        current_user.phone = phone
    if age is not None:
        current_user.age = age
    
    db.commit()
    db.refresh(current_user)
    return current_user


# Department Endpoints
@app.get("/api/departments", response_model=List[DepartmentInfo])
async def get_departments():
    """Get all medical departments with AI specialists"""
    return [
        DepartmentInfo(
            id=dept_id,
            name=dept["name"],
            specialist=dept["specialist"],
            description=dept["description"]
        )
        for dept_id, dept in MEDICAL_DEPARTMENTS.items()
    ]


@app.post("/api/detect-department")
async def detect_department_endpoint(symptom_input: SymptomInput):
    """Detect the appropriate department based on symptoms using AI"""
    # Check for emergency
    is_emergency, emergency_symptoms = detect_emergency(symptom_input.symptoms)

    # First try keyword-based detection
    department = detect_department(symptom_input.symptoms)
    
    # If no keyword match, use AI for better detection
    if department == "general":
        system_prompt = """You are a medical triage expert. Analyze the patient's symptoms and determine which medical department they should visit.

Respond with ONLY the department ID from this list:
- cardiology, neurology, dermatology, orthopedics, gastroenterology, pulmonology
- endocrinology, urology, gynecology, pediatrics, ophthalmology, ent, general

Choose the most appropriate department based on the primary symptoms."""

        messages = [
            {"role": "user", "content": f"Patient symptoms: {symptom_input.symptoms}\n\nAge: {symptom_input.age}\nGender: {symptom_input.gender}\n\nWhich department should this patient visit? Reply with only the department ID:"}
        ]

        try:
            ai_response = await call_openrouter_ai(messages, system_prompt, temperature=0.3)
            ai_dept = ai_response.strip().lower().split()[0] if ai_response else "general"
            
            # Validate AI response
            if ai_dept in MEDICAL_DEPARTMENTS:
                department = ai_dept
        except Exception:
            pass  # Fall back to keyword-based "general"

    response: Dict[str, Any] = {
        "department": department,
        "department_name": MEDICAL_DEPARTMENTS[department]["name"],
        "specialist": MEDICAL_DEPARTMENTS[department]["specialist"],
        "confidence": "high" if department != "general" else "low",
        "detection_method": "ai" if department != "general" and detect_department(symptom_input.symptoms) == "general" else "keyword"
    }

    if is_emergency:
        response["emergency"] = {
            "is_emergency": True,
            "detected_symptoms": emergency_symptoms,
            "message": "⚠️ Your symptoms may indicate a medical emergency. Please seek immediate medical attention.",
            "emergency_contacts": EMERGENCY_CONTACTS
        }

    return response


@app.post("/api/generate-questions")
async def generate_questions(symptom_input: SymptomInput):
    """Generate 3-5 diagnostic questions from AI doctor"""
    department = detect_department(symptom_input.symptoms)
    dept_info = MEDICAL_DEPARTMENTS[department]

    system_prompt = f"""{dept_info['system_prompt']}

Generate exactly 3-5 important diagnostic questions based on the patient's symptoms.
Format each question on a new line starting with 'Q1:', 'Q2:', etc.
Keep questions clear, specific, and relevant to the symptoms."""

    messages = [
        {"role": "user", "content": f"Patient symptoms: {symptom_input.symptoms}\n\nAge: {symptom_input.age}\nGender: {symptom_input.gender}\nMedical History: {symptom_input.medical_history or 'None'}\n\nPlease ask 3-5 diagnostic questions:"}
    ]

    response = await call_openrouter_ai(messages, system_prompt)

    # Parse questions from response
    questions = []
    for line in response.split('\n'):
        if ':' in line and ('Q' in line or 'Question' in line):
            question = line.split(':', 1)[1].strip()
            if question:
                questions.append(question)

    # Fallback if parsing fails
    if not questions:
        questions = [
            f"How long have you been experiencing these symptoms?",
            "On a scale of 1-10, how severe is your pain/discomfort?",
            "Have you taken any medication for this? If yes, what was the effect?",
            "Do you have any other medical conditions or allergies?",
            "Is there anything that makes your symptoms better or worse?"
        ]

    return {
        "department": department,
        "specialist": dept_info["specialist"],
        "questions": questions[:5]
    }


@app.post("/api/direct-consult")
async def direct_consult(symptom_input: SymptomInput, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Direct consultation - Get diagnosis and medicines immediately without Q&A"""
    # Check for emergency
    is_emergency, emergency_symptoms = detect_emergency(symptom_input.symptoms)
    
    department = detect_department(symptom_input.symptoms)
    dept_info = MEDICAL_DEPARTMENTS[department]

    system_prompt = f"""{dept_info['system_prompt']}

Provide your response in the following structured format:

DIAGNOSIS:
[Your diagnosis here based on symptoms]

MEDICINES:
1. Medicine Name - Dosage (e.g., 500mg twice daily for 5 days) - Purpose
2. [Continue for all medicines]

RECOMMENDATIONS:
- [Lifestyle/diet recommendations]
- [Tests if needed]
- [When to follow up]

SUMMARY:
[Clear summary explaining what's wrong, what the medicines do, and expected recovery]

IMPORTANT: Always include a disclaimer that this is AI-based advice and patient should consult a real doctor for serious conditions."""

    messages = [
        {"role": "user", "content": f"""Patient Information:
Symptoms: {symptom_input.symptoms}
Age: {symptom_input.age or 'Not provided'}
Gender: {symptom_input.gender or 'Not provided'}
Medical History: {symptom_input.medical_history or 'None'}

Please provide direct diagnosis, medicines, and summary:"""}
    ]

    ai_response = await call_openrouter_ai(messages, system_prompt)

    # Parse AI response
    diagnosis_lines = []
    medicines = []
    summary_lines = []
    recommendations = []

    sections = ai_response.split('\n')
    current_section = None

    for line in sections:
        if 'DIAGNOSIS:' in line:
            current_section = 'diagnosis'
        elif 'MEDICINES:' in line:
            current_section = 'medicines'
        elif 'RECOMMENDATIONS:' in line:
            current_section = 'recommendations'
        elif 'SUMMARY:' in line:
            current_section = 'summary'
        elif current_section == 'diagnosis' and line.strip():
            diagnosis_lines.append(line.strip())
        elif current_section == 'medicines' and line.strip():
            if line.strip().startswith(('1.', '2.', '3.', '4.', '5.', '-')):
                medicines.append(line.strip())
        elif current_section == 'recommendations' and line.strip():
            if line.strip().startswith('-'):
                recommendations.append(line.strip())
        elif current_section == 'summary' and line.strip():
            summary_lines.append(line.strip())

    diagnosis = "\n".join(diagnosis_lines)
    summary = "\n".join(summary_lines)

    # Fallback if parsing completely fails
    if not diagnosis.strip():
        diagnosis = ai_response
        summary = ai_response

    # Calculate AI confidence
    ai_confidence = 0.85 if len(symptom_input.symptoms) > 100 else 0.75

    # Create consultation record
    db_consultation = Consultation(
        user_id=current_user.id,
        department=department,
        symptoms=symptom_input.symptoms,
        ai_questions=[],
        patient_answers=[],
        diagnosis=diagnosis.strip(),
        medicines=medicines,
        summary=summary.strip(),
        ai_confidence=ai_confidence,
        is_emergency=is_emergency
    )
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)

    # Check medicine interactions
    medicine_names = [m.split('-')[0].strip().lstrip('1234567890.- ') for m in medicines]
    interactions = check_medicine_interactions(medicine_names)

    response: Dict[str, Any] = {
        "consultation_id": db_consultation.id,
        "department": department,
        "department_name": dept_info["name"],
        "specialist": dept_info["specialist"],
        "diagnosis": diagnosis.strip(),
        "medicines": medicines,
        "recommendations": recommendations,
        "summary": summary.strip(),
        "full_response": ai_response,
        "ai_confidence": ai_confidence,
        "medicine_interactions": interactions,
        "disclaimer": "⚠️ This is medical information generated by a specialist system. Always consult a licensed healthcare professional for serious conditions."
    }

    if is_emergency:
        response["emergency"] = {
            "is_emergency": True,
            "detected_symptoms": emergency_symptoms,
            "message": "⚠️ Your symptoms may indicate a medical emergency. Please seek immediate medical attention.",
            "emergency_contacts": EMERGENCY_CONTACTS
        }

    return response


@app.post("/api/consult")
async def consult_ai_doctor(
    consultation: ConsultationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get diagnosis and medicine from AI specialist doctor"""
    # Check for emergency
    is_emergency, emergency_symptoms = detect_emergency(consultation.symptoms)
    
    dept_info = MEDICAL_DEPARTMENTS.get(consultation.department, MEDICAL_DEPARTMENTS["general"])

    # Build conversation context
    answers_text = "\n".join([f"Q: {qa.question}\nA: {qa.answer}" for qa in consultation.answers])

    system_prompt = f"""{dept_info['system_prompt']}

Provide your response in the following structured format:

DIAGNOSIS:
[Your diagnosis here]

MEDICINES:
1. Medicine Name - Dosage (e.g., 500mg twice daily for 5 days) - Purpose
2. [Continue for all medicines]

RECOMMENDATIONS:
- [Lifestyle/diet recommendations]
- [Tests if needed]
- [When to follow up]

SUMMARY:
[Clear summary explaining what's wrong, what the medicines do, and expected recovery]

IMPORTANT: Always include a disclaimer that this is AI-based advice and patient should consult a real doctor for serious conditions."""

    messages = [
        {"role": "user", "content": f"""Patient Information:
Symptoms: {consultation.symptoms}
Age: {consultation.age or 'Not provided'}
Gender: {consultation.gender or 'Not provided'}
Medical History: {consultation.medical_history or 'None'}

Questions & Answers:
{answers_text}

Please provide diagnosis, medicines, and summary:"""}
    ]

    ai_response = await call_openrouter_ai(messages, system_prompt)

    # Parse AI response
    diagnosis_lines = []
    medicines = []
    summary_lines = []
    recommendations = []

    sections = ai_response.split('\n')
    current_section = None

    for line in sections:
        if 'DIAGNOSIS:' in line:
            current_section = 'diagnosis'
        elif 'MEDICINES:' in line:
            current_section = 'medicines'
        elif 'RECOMMENDATIONS:' in line:
            current_section = 'recommendations'
        elif 'SUMMARY:' in line:
            current_section = 'summary'
        elif current_section == 'diagnosis' and line.strip():
            diagnosis_lines.append(line.strip())
        elif current_section == 'medicines' and line.strip():
            if line.strip().startswith(('1.', '2.', '3.', '4.', '5.', '-')):
                medicines.append(line.strip())
        elif current_section == 'recommendations' and line.strip():
            if line.strip().startswith('-'):
                recommendations.append(line.strip())
        elif current_section == 'summary' and line.strip():
            summary_lines.append(line.strip())

    diagnosis = "\n".join(diagnosis_lines)
    summary = "\n".join(summary_lines)

    # Fallback if parsing fails
    if not diagnosis.strip():
        diagnosis = ai_response
        summary = ai_response

    # Get second opinion if requested
    second_opinion = None
    if consultation.get_second_opinion:
        second_opinion_system = """You are a second AI medical expert. Review the following diagnosis and provide a second opinion. Do you agree with the diagnosis? Would you suggest any additional tests or alternative treatments?"""
        
        second_opinion_messages = [
            {"role": "user", "content": f"Original Diagnosis:\n{diagnosis}\n\nMedicines:\n{medicines}\n\nPlease provide your second opinion:"}
        ]
        second_opinion = await call_openrouter_ai(second_opinion_messages, second_opinion_system)

    # Calculate AI confidence (simple heuristic)
    ai_confidence = 0.85 if len(answers_text) > 200 else 0.75

    # Create consultation record
    db_consultation = Consultation(
        user_id=current_user.id,
        department=consultation.department,
        symptoms=consultation.symptoms,
        ai_questions=[qa.question for qa in consultation.answers],
        patient_answers=[qa.answer for qa in consultation.answers],
        diagnosis=diagnosis.strip(),
        medicines=medicines,
        summary=summary.strip(),
        ai_confidence=ai_confidence,
        second_opinion=second_opinion,
        is_emergency=is_emergency
    )
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)

    # Check medicine interactions
    medicine_names = [m.split('-')[0].strip().lstrip('1234567890.- ') for m in medicines]
    interactions = check_medicine_interactions(medicine_names)

    response: Dict[str, Any] = {
        "consultation_id": db_consultation.id,
        "department": consultation.department,
        "department_name": dept_info["name"],
        "specialist": dept_info["specialist"],
        "diagnosis": diagnosis.strip(),
        "medicines": medicines,
        "recommendations": recommendations,
        "summary": summary.strip(),
        "full_response": ai_response,
        "ai_confidence": ai_confidence,
        "second_opinion": second_opinion,
        "medicine_interactions": interactions,
        "disclaimer": "⚠️ This is medical information generated by a specialist system. Always consult a licensed healthcare professional for serious conditions."
    }
    
    if is_emergency:
        response["emergency"] = {
            "is_emergency": True,
            "detected_symptoms": emergency_symptoms,
            "message": "⚠️ Your symptoms may indicate a medical emergency. Please seek immediate medical attention.",
            "emergency_contacts": EMERGENCY_CONTACTS
        }

    return response


# Symptom Tracking Endpoints
@app.post("/api/symptoms/log")
async def log_symptom(
    symptom_data: SymptomLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log a symptom for tracking"""
    db_symptom = SymptomLog(
        user_id=current_user.id,
        symptom=symptom_data.symptom,
        severity=symptom_data.severity,
        notes=symptom_data.notes
    )
    db.add(db_symptom)
    db.commit()
    db.refresh(db_symptom)
    return db_symptom


@app.get("/api/symptoms/history")
async def get_symptom_history(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get symptom history for the past N days"""
    from datetime import timedelta
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    symptoms = db.query(SymptomLog).filter(
        SymptomLog.user_id == current_user.id,
        SymptomLog.logged_at >= cutoff_date
    ).order_by(SymptomLog.logged_at.desc()).all()
    
    return symptoms


@app.get("/api/symptoms/analytics")
async def get_symptom_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get symptom analytics and insights"""
    from sqlalchemy import func
    
    # Get most common symptoms
    symptom_counts = db.query(
        SymptomLog.symptom,
        func.count(SymptomLog.id).label('count'),
        func.avg(SymptomLog.severity).label('avg_severity')
    ).filter(
        SymptomLog.user_id == current_user.id
    ).group_by(SymptomLog.symptom).order_by(func.count(SymptomLog.id).desc()).limit(10).all()
    
    # Calculate health score (simple algorithm)
    total_symptoms = db.query(SymptomLog).filter(SymptomLog.user_id == current_user.id).count()
    avg_severity = db.query(func.avg(SymptomLog.severity)).filter(SymptomLog.user_id == current_user.id).scalar()
    
    health_score = max(0, min(100, 100 - (avg_severity or 0) * 5 - total_symptoms))
    
    return {
        "health_score": round(health_score, 1),
        "total_symptoms_logged": total_symptoms,
        "average_severity": round(avg_severity or 0, 1),
        "most_common_symptoms": [
            {"symptom": s.symptom, "count": s.count, "avg_severity": round(float(s.avg_severity), 1)}
            for s in symptom_counts
        ]
    }


# Medicine Interaction Check
@app.post("/api/medicines/check-interactions")
async def check_interactions(data: MedicineInteractionCheck):
    """Check for drug interactions"""
    interactions = check_medicine_interactions(data.medicines)
    return {
        "medicines_checked": data.medicines,
        "interactions_found": len(interactions),
        "interactions": interactions,
        "safe": len(interactions) == 0
    }


# Consultation History
@app.get("/api/consultations")
async def get_consultations(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's consultation history"""
    consultations = db.query(Consultation).filter(
        Consultation.user_id == current_user.id
    ).order_by(Consultation.created_at.desc()).limit(limit).all()
    return consultations


@app.get("/api/consultations/{consultation_id}")
async def get_consultation(
    consultation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific consultation details"""
    consultation = db.query(Consultation).filter(
        Consultation.id == consultation_id,
        Consultation.user_id == current_user.id
    ).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return consultation


# Report Analysis
@app.post("/api/analyze-report")
async def analyze_medical_report(
    department: str = Form(...),
    symptoms: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Analyze uploaded medical report and connect with AI specialist"""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Please upload an image file (JPG, PNG)")

    # Read and process image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    # Convert image to base64 for API call
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()

    dept_info = MEDICAL_DEPARTMENTS.get(department, MEDICAL_DEPARTMENTS["general"])

    system_prompt = f"""{dept_info['system_prompt']}

You are analyzing a medical report image. Provide your analysis in this format:

REPORT ANALYSIS:
[Detailed analysis of the report findings]

DIAGNOSIS:
[Diagnosis based on report + symptoms]

MEDICINES:
1. [Medicine with dosage]
2. [Continue...]

SUMMARY:
[Clear explanation of report findings and what they mean for the patient]

DISCLAIMER:
This analysis is generated by a medical specialist system and should be verified by a licensed medical professional."""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Obvis Medical AI"
    }

    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"Analyze this medical report. Patient symptoms: {symptoms}"},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_base64}"}}
                ]
            }
        ],
        "max_tokens": 2500
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(OPENROUTER_URL, headers=headers, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"AI API error: {response.text}")

        data = response.json()
        ai_response = data["choices"][0]["message"]["content"]

    # Parse response
    analysis_lines = []
    diagnosis_lines = []
    medicines = []
    summary_lines = []

    sections = ai_response.split('\n')
    current_section = None

    for line in sections:
        if 'REPORT ANALYSIS:' in line:
            current_section = 'analysis'
        elif 'DIAGNOSIS:' in line:
            current_section = 'diagnosis'
        elif 'MEDICINES:' in line:
            current_section = 'medicines'
        elif 'SUMMARY:' in line:
            current_section = 'summary'
        elif current_section == 'analysis' and line.strip():
            analysis_lines.append(line.strip())
        elif current_section == 'diagnosis' and line.strip():
            diagnosis_lines.append(line.strip())
        elif current_section == 'medicines' and line.strip():
            if line.strip().startswith(('1.', '2.', '3.', '-')):
                medicines.append(line.strip())
        elif current_section == 'summary' and line.strip():
            summary_lines.append(line.strip())

    report_analysis = "\n".join(analysis_lines)
    diagnosis = "\n".join(diagnosis_lines)
    summary = "\n".join(summary_lines)

    if not report_analysis.strip() and not diagnosis.strip():
        report_analysis = ai_response
        diagnosis = ai_response

    return {
        "department": department,
        "department_name": dept_info["name"],
        "specialist": dept_info["specialist"],
        "report_analysis": report_analysis.strip(),
        "diagnosis": diagnosis.strip(),
        "medicines": medicines,
        "summary": summary.strip(),
        "full_response": ai_response,
        "disclaimer": "⚠️ This report analysis is generated by a medical specialist system. Please consult a licensed healthcare professional for verification."
    }


# Admin Stats (simple version)
@app.get("/api/admin/stats")
async def get_admin_stats(db: Session = Depends(get_db)):
    """Get platform statistics (admin endpoint)"""
    from sqlalchemy import func
    
    total_users = db.query(func.count(User.id)).scalar()
    total_consultations = db.query(func.count(Consultation.id)).scalar()
    
    # Consultations by department
    dept_stats = db.query(
        Consultation.department,
        func.count(Consultation.id).label('count')
    ).group_by(Consultation.department).all()
    
    return {
        "total_users": total_users,
        "total_consultations": total_consultations,
        "consultations_by_department": [
            {"department": d.department, "count": d.count}
            for d in dept_stats
        ]
    }


# Create database tables
Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
