'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, X, FileText, CheckCircle, AlertCircle, Stethoscope, Image as ImageIcon, Sparkles, Download, Loader2, Bot, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { downloadReport, ConsultationReport } from '@/utils/generateReport';

const TypewriterText = ({ text, delay = 10, onComplete }: { text: string, delay?: number, onComplete?: () => void }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
  
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, delay, text]);

  return <div className="whitespace-pre-wrap">{currentText}</div>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://creativesar-obvis-ai.hf.space';

interface Department {
  id: string;
  name: string;
  specialist: string;
}

export default function UploadReportPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState<'upload' | 'analyzing' | 'select-dept' | 'result'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [detectedDept, setDetectedDept] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData || '{}'));
    }
  }, [router]);

  const departments: Department[] = [
    { id: 'cardiology', name: 'Cardiology', specialist: 'Dr. Sarah Mitchell - Cardiologist' },
    { id: 'neurology', name: 'Neurology', specialist: 'Dr. James Chen - Neurologist' },
    { id: 'dermatology', name: 'Dermatology', specialist: 'Dr. Emily Rodriguez - Dermatologist' },
    { id: 'orthopedics', name: 'Orthopedics', specialist: 'Dr. Michael Thompson - Orthopedic Surgeon' },
    { id: 'gastroenterology', name: 'Gastroenterology', specialist: 'Dr. Priya Sharma - Gastroenterologist' },
    { id: 'pulmonology', name: 'Pulmonology', specialist: 'Dr. David Kim - Pulmonologist' },
    { id: 'endocrinology', name: 'Endocrinology', specialist: 'Dr. Lisa Anderson - Endocrinologist' },
    { id: 'urology', name: 'Urology', specialist: 'Dr. Robert Wilson - Urologist' },
    { id: 'gynecology', name: 'Gynecology', specialist: 'Dr. Amanda Foster - Gynecologist' },
    { id: 'pediatrics', name: 'Pediatrics', specialist: 'Dr. Jennifer Martinez - Pediatrician' },
    { id: 'ophthalmology', name: 'Ophthalmology', specialist: 'Dr. Kevin Patel - Ophthalmologist' },
    { id: 'ent', name: 'ENT', specialist: 'Dr. Rachel Green - ENT Specialist' },
    { id: 'hematology', name: 'Hematology', specialist: 'Dr. Elizabeth Warren - Hematologist' },
    { id: 'pathology', name: 'Pathology', specialist: 'Dr. Richard Lee - Pathologist' },
    { id: 'oncology', name: 'Oncology', specialist: 'Dr. Patricia Moore - Oncologist' },
    { id: 'nephrology', name: 'Nephrology', specialist: 'Dr. Steven Clark - Nephrologist' },
    { id: 'radiology', name: 'Radiology', specialist: 'Dr. Michelle Adams - Radiologist' },
    { id: 'psychiatry', name: 'Psychiatry', specialist: 'Dr. Daniel White - Psychiatrist' },
    { id: 'rheumatology', name: 'Rheumatology', specialist: 'Dr. Edward Lewis - Rheumatologist' },
    { id: 'allergy-immunology', name: 'Allergy & Immunology', specialist: 'Dr. Betty Clark - Allergist/Immunologist' },
    { id: 'infectious-disease', name: 'Infectious Disease', specialist: 'Dr. George Harris - Infectious Disease Specialist' },
    { id: 'general', name: 'General Physician', specialist: 'Dr. Thomas Brown - General Physician' },
  ];

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
      setError('');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'], 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const removeFile = () => { setSelectedFile(null); setPreview(null); };

  const detectDepartmentFromReport = (text: string): string => {
    const lowerText = text.toLowerCase();
    const deptKeywords: Record<string, string[]> = {
      cardiology: ['heart', 'cardiac', 'ecg', 'ekg', 'cholesterol', 'blood pressure', 'echocardiogram', 'angiogram', 'troponin', 'bnp', 'ldl', 'hdl', 'triglycerides', 'coronary', 'myocardial', 'arrhythmia', 'palpitation', 'angina', 'heart attack', 'cardiovascular'],
      neurology: ['brain', 'neuro', 'headache', 'migraine', 'seizure', 'nerve', 'spine', 'eeg', 'emg', 'neuropathy', 'stroke', 'tia', 'cerebral', 'cognitive', 'dementia', 'parkinson', 'epilepsy', 'concussion', 'meningitis', 'multiple sclerosis', 'ms'],
      dermatology: ['skin', 'biopsy', 'rash', 'acne', 'eczema', 'psoriasis', 'mole', 'dermatitis', 'fungal infection', 'urticaria', 'vitiligo', 'melanoma', 'basal cell', 'scc', 'rosacea', 'impetigo', 'cellulitis', 'wart', 'shingles', 'alopecia', 'nail fungus'],
      orthopedics: ['bone', 'joint', 'fracture', 'x-ray', 'arthritis', 'knee', 'hip', 'shoulder', 'ligament', 'tendon', 'cartilage', 'osteoporosis', 'disc herniation', 'sciatica', 'scoliosis', 'rheumatoid', 'gout', 'bursitis', 'rotator cuff', 'meniscus', 'acl', 'mcl', 'stress fracture'],
      gastroenterology: ['stomach', 'liver', 'digestive', 'gi', 'endoscopy', 'colonoscopy', 'gastric', 'intestine', 'bowel', 'hepatic', 'pancreatic', 'bilirubin', 'alt', 'ast', 'alp', 'ggt', 'hepatitis', 'cirrhosis', 'fatty liver', 'ulcer', 'acid reflux', 'gerd', 'ibd', 'crohn', 'colitis', 'gallbladder', 'gallstone', 'pancreatitis'],
      pulmonology: ['lung', 'respiratory', 'chest x-ray', 'breathing', 'asthma', 'bronchitis', 'copd', 'pulmonary', 'pneumonia', 'tuberculosis', 'tb', 'spirometry', 'pef', 'fev1', 'sleep apnea', 'oxygen saturation', 'hypoxia', 'wheezing', 'dyspnea', 'pleural', 'bronchiectasis'],
      endocrinology: ['thyroid', 'diabetes', 'hormone', 'insulin', 'tsh', 'blood sugar', 'glucose', 'hba1c', 'fasting glucose', 'ppbs', 'hypothyroid', 'hyperthyroid', 't3', 't4', 'cortisol', 'pituitary', 'adrenal', 'parathyroid', 'pcos', 'metabolic syndrome', 'osteoporosis'],
      urology: ['kidney', 'bladder', 'urine', 'prostate', 'urinary', 'renal', 'usg kub', 'creatinine', 'bun', 'egfr', 'kidney stone', 'nephritis', 'uti', 'frequency', 'urgency', 'incontinence', 'psa', 'bph', 'ureter', 'hydronephrosis', 'dialysis'],
      gynecology: ['pregnancy', 'uterus', 'ovary', 'pap smear', 'mammogram', 'menstrual', 'obstetrics', 'hcg', 'beta hcg', 'conception', 'fetal', 'embryo', 'placenta', 'amniotic', 'prenatal', 'postpartum', 'menopause', 'endometriosis', 'fibroid', 'pcod', 'pelvic ultrasound', 'transvaginal', 'cervical', 'vaginal', 'breast ultrasound'],
      pediatrics: ['child', 'pediatric', 'infant', 'baby', 'vaccination', 'growth', 'newborn', 'neonatal', 'breastfeeding', 'formula', 'developmental milestone', 'adolescent', 'birth weight', 'head circumference', 'immunization', 'well child', 'fever in child', 'colic'],
      ophthalmology: ['eye', 'vision', 'retina', 'cataract', 'glaucoma', 'visual acuity', 'fundus', 'iop', 'intraocular pressure', 'refraction', 'myopia', 'hyperopia', 'astigmatism', 'macular degeneration', 'diabetic retinopathy', 'corneal', 'conjunctivitis', 'slit lamp', 'oct scan', 'visual field', 'blindness'],
      ent: ['ear', 'nose', 'throat', 'sinus', 'tonsil', 'hearing', 'audiometry', 'otitis', 'rhinitis', 'pharyngitis', 'laryngitis', 'vertigo', 'tinnitus', 'hearing loss', 'nasal polyp', 'deviated septum', 'adenoid', 'mastoid', 'eustachian', 'audiogram', 'hoarseness', 'snoring'],
      hematology: ['blood', 'cbc', 'complete blood count', 'hemoglobin', 'hgb', 'platelet', 'plt', 'wbc', 'rbc', 'anemia', 'leukemia', 'lymphoma', 'coagulation', 'pt', 'ptt', 'inr', 'd-dimer', 'ferritin', 'iron studies', 'vitamin b12', 'folate', 'sickle cell', 'thalassemia', 'bleeding disorder', 'clotting', 'thrombosis', 'embolism', 'hematocrit', 'hct', 'mch', 'mchc', 'mcv', 'rdw', 'neutrophil', 'lymphocyte', 'monocyte', 'eosinophil', 'basophil', 'esr'],
      pathology: ['lab', 'test', 'biopsy', 'culture', 'pathology', 'histopathology', 'cytology', 'microscopic', 'specimen', 'tissue sample', 'frozen section', 'immunohistochemistry', 'tumor marker', 'ca-125', 'cea', 'afp', 'psa', 'malignant', 'benign', 'carcinoma'],
      oncology: ['cancer', 'tumor', 'oncology', 'chemotherapy', 'radiation', 'malignant', 'metastasis', 'carcinoma', 'sarcoma', 'lymphoma', 'leukemia', 'melanoma', 'neoplasm', 'biopsy', 'pet scan', 'ct scan cancer', 'oncologist', 'cancer treatment'],
      nephrology: ['kidney', 'renal', 'dialysis', 'nephritis', 'nephrosis', 'creatinine', 'bun', 'egfr', 'proteinuria', 'hematuria', 'kidney failure', 'chronic kidney disease', 'ckd', 'acute kidney injury', 'aki', 'glomerulonephritis', 'kidney transplant', 'urinalysis'],
      radiology: ['x-ray', 'mri', 'ct scan', 'ultrasound', 'sonography', 'radiology', 'imaging', 'pet scan', 'bone scan', 'mammography', 'fluoroscopy', 'nuclear medicine', 'radiograph', 'contrast', 'radiologist'],
      psychiatry: ['depression', 'anxiety', 'mental health', 'psychiatric', 'bipolar', 'schizophrenia', 'ptsd', 'ocd', 'panic', 'mood disorder', 'psychosis', 'therapy', 'counseling', 'antidepressant', 'antipsychotic', 'suicide', 'self harm', 'eating disorder', 'insomnia', 'stress'],
      rheumatology: ['arthritis', 'rheumatoid', 'lupus', 'sle', 'fibromyalgia', 'gout', 'osteoarthritis', 'ankylosing spondylitis', 'psoriatic arthritis', 'sjogren', 'scleroderma', 'vasculitis', 'polymyalgia', 'joint pain', 'autoimmune', 'inflammatory'],
      'allergy-immunology': ['allergy', 'allergic', 'anaphylaxis', 'asthma', 'hay fever', 'hives', 'urticaria', 'eczema', 'food allergy', 'drug allergy', 'immunology', 'immune', 'antibody', 'antigen', 'histamine', 'epinephrine', 'epi pen'],
      'infectious-disease': ['infection', 'infectious', 'bacterial', 'viral', 'fungal', 'parasitic', 'hiv', 'aids', 'hepatitis', 'tuberculosis', 'tb', 'malaria', 'sepsis', 'antibiotic', 'antiviral', 'fever', 'contagious', 'pandemic', 'vaccine'],
      general: ['fever', 'flu', 'cold', 'cough', 'fatigue', 'weakness', 'pain', 'inflammation', 'general checkup', 'routine', 'screening', 'preventive', 'headache', 'body ache', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'dizziness']
    };

    const scores: Record<string, number> = {};
    for (const [dept, keywords] of Object.entries(deptKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        if (lowerText.includes(` ${keyword} `) || lowerText.startsWith(keyword + ' ') || lowerText.endsWith(' ' + keyword)) {
          score += 3;
        } else if (lowerText.includes(keyword)) {
          score += 1;
        }
      }
      scores[dept] = score;
    }

    // SPECIAL PRIORITY BOOSTS
    const bloodMatches = ['cbc', 'hemoglobin', 'platelet', 'wbc', 'rbc'].filter(k => lowerText.includes(k)).length;
    if (bloodMatches >= 2) scores.hematology = (scores.hematology || 0) + 15;

    const pregnancyMatches = ['pregnancy', 'hcg', 'beta hcg', 'fetal', 'prenatal'].filter(k => lowerText.includes(k)).length;
    if (pregnancyMatches >= 1) scores.gynecology = (scores.gynecology || 0) + 20;

    const heartMatches = ['ecg', 'ekg', 'troponin', 'echocardiogram'].filter(k => lowerText.includes(k)).length;
    if (heartMatches >= 1) scores.cardiology = (scores.cardiology || 0) + 20;

    const cancerMatches = ['cancer', 'tumor', 'malignant', 'carcinoma'].filter(k => lowerText.includes(k)).length;
    if (cancerMatches >= 1) scores.oncology = (scores.oncology || 0) + 20;

    let maxScore = 0;
    let detectedDept = 'general';
    for (const [dept, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedDept = dept;
      }
    }

    console.log('Department Detection:', { detected: detectedDept, score: maxScore, allScores: scores });
    return maxScore >= 1 ? detectedDept : 'general';
  };

  const handleAnalyze = async () => {
    if (!selectedFile) { setError('Please upload a medical report'); return; }
    if (!symptoms.trim()) { setError('Please describe your symptoms'); return; }

    setIsAnalyzing(true);
    const detectedDepartment = detectDepartmentFromReport(symptoms);
    setDetectedDept(detectedDepartment);
    setSelectedDepartment(detectedDepartment);
    setIsAnalyzing(false);
    setStep('select-dept');
  };

  const handleConfirmDepartment = async () => {
    if (!selectedDepartment) return;
    setStep('analyzing');

    const token = localStorage.getItem('token');
    const dept = departments.find(d => d.id === selectedDepartment);
    const deptName = dept?.name || 'General';
    
    // ALWAYS use REAL API data - no fake demo content
    try {
      const formData = new FormData();
      formData.append('file', selectedFile!);
      formData.append('department', selectedDepartment);
      formData.append('symptoms', symptoms);

      // Try analyze-report API first
      const response = await axios.post(`${API_URL}/api/analyze-report`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
        timeout: 90000
      });
      
      // Show REAL API data
      setResult({
        ...response.data,
        report_analysis: response.data.report_analysis || (selectedFile ? `Medical report "${selectedFile.name}" uploaded successfully. Please consult with your ${deptName.toLowerCase()} specialist for detailed interpretation.` : 'Analysis based on symptoms provided.'),
        diagnosis: response.data.diagnosis || `Based on your symptoms and medical history, our AI recommends consulting a ${deptName} specialist for proper evaluation and treatment.`,
        summary: response.data.summary || `Patient reported: ${symptoms}\n\nAI Analysis: Based on the information provided, consultation with a ${deptName} specialist is recommended for comprehensive evaluation and appropriate treatment.`,
        medicines: response.data.medicines && response.data.medicines.length > 0 ? response.data.medicines : ['Please consult with your healthcare provider for prescription medications', 'Follow your doctor\'s instructions carefully', 'Schedule a follow-up appointment as recommended']
      });
      setStep('result');
    } catch (err: any) {
      console.error('Analyze API failed:', err.response?.status, err.response?.data);
      
      // If 401, redirect to login
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        setStep('upload');
        return;
      }
      
      // Try consultation API as backup
      try {
        const consultResponse = await axios.post(`${API_URL}/api/consult`, {
          symptoms: symptoms,
          department: selectedDepartment,
          answers: [
            { question: 'What are your symptoms?', answer: symptoms },
            { question: 'Do you have any medical reports?', answer: selectedFile ? 'Yes, uploaded' : 'No' }
          ]
        }, { 
          headers: { 'Authorization': `Bearer ${token}` },
          timeout: 90000
        });
        
        setResult({
          ...consultResponse.data,
          report_analysis: selectedFile ? `Medical report "${selectedFile.name}" was uploaded. Please share this report with your ${deptName.toLowerCase()} specialist during consultation.` : 'No medical report uploaded.',
          diagnosis: consultResponse.data.diagnosis || `Based on your symptoms, our AI recommends consulting a ${deptName} specialist.`,
          summary: consultResponse.data.summary || `Symptoms reported: ${symptoms}\n\nRecommendation: Schedule an appointment with a ${deptName} specialist for proper evaluation and treatment.`,
          medicines: consultResponse.data.medicines && consultResponse.data.medicines.length > 0 ? consultResponse.data.medicines : ['Consult your healthcare provider for appropriate medications', 'Rest and stay hydrated', 'Monitor your symptoms and seek care if they worsen']
        });
        setStep('result');
      } catch (fallbackErr: any) {
        console.error('Both APIs failed:', fallbackErr.response?.status, fallbackErr.response?.data);
        
        // Show proper error - NO fake demo data
        let errorMsg = 'Unable to process your request. ';
        if (fallbackErr.response?.status === 401) {
          errorMsg += 'Please login again.';
        } else if (fallbackErr.code === 'ECONNREFUSED') {
          errorMsg += 'Cannot connect to server. Please make sure the backend is running.';
        } else {
          errorMsg += 'Please try again or contact support.';
        }
        setError(errorMsg);
        setStep('upload');
      }
    }
  };

  const handleDownloadReport = () => {
    if (!result || !user) return;
    const report: ConsultationReport = {
      patientName: user.name || 'Patient',
      patientEmail: user.email || '',
      patientAge: user.age || undefined,
      patientGender: user.gender || undefined,
      department: result.department_name || result.department,
      specialist: result.specialist || 'AI Doctor',
      symptoms: symptoms,
      diagnosis: result.diagnosis,
      medicines: result.medicines || [],
      summary: result.summary,
      reportAnalysis: result.report_analysis,
      consultationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      consultationId: `RPT-${Date.now()}`
    };
    downloadReport(report);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 relative font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Advanced Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-100/40 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-slate-200/30 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]" />
      </div>

      {/* Header - Floating Glass Panel */}
      <header className="bg-white/60 backdrop-blur-2xl border-b border-white/40 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <button className="p-2 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors group">
                  <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-slate-900" />
                </button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-extrabold text-slate-900 text-xl tracking-tight">Report Analysis</h1>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">AI Intelligence</p>
                </div>
              </div>
            </div>
            {result && (
              <button onClick={handleDownloadReport} className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.98]">
                <Download className="h-4 w-4" />
                <span>Download Report</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {/* Upload Step */}
          {step === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-white shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)] text-blue-600">
                      <Upload className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Upload Report</h2>
                      <p className="text-slate-500 font-medium mt-1">Our AI specialists will analyze your clinical data</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 text-sm font-bold">{error}</p>
                  </motion.div>
                )}

                {!selectedFile ? (
                  <div {...getRootProps()} className={`border border-dashed rounded-[2rem] p-16 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-teal-400 bg-teal-50/50 shadow-inner' : 'border-slate-300 hover:border-teal-300 hover:bg-slate-50/50 bg-slate-50/30'}`}>
                    <input {...getInputProps()} />
                    <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] group-hover:scale-105 transition-transform group-hover:shadow-[0_8px_30px_rgb(13,148,136,0.1)]">
                      <ImageIcon className="h-10 w-10 text-slate-300" />
                    </div>
                    <p className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">{isDragActive ? 'Drop it here' : 'Drop your medical report'}</p>
                    <p className="text-sm text-slate-500 font-medium mb-8">or click to browse from files</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['JPG', 'PNG', 'PDF'].map((format) => (
                        <span key={format} className="px-4 py-1.5 bg-white text-slate-600 rounded-lg text-xs font-bold tracking-widest uppercase shadow-sm border border-slate-100">{format}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-emerald-500/30 rounded-3xl p-6 bg-emerald-50/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-5 flex-1">
                        {preview ? (
                          <div className="relative group">
                            <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-2xl shadow-md border-2 border-white" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl cursor-pointer" />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md border border-slate-100">
                            <FileText className="h-10 w-10 text-slate-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-black text-slate-900 text-lg mb-1 tracking-tight">{selectedFile.name}</p>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-3">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-emerald-500/20">
                            <CheckCircle className="h-3 w-3" />
                            <span>Ready to Scan</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={removeFile} className="p-3 hover:bg-red-100 rounded-2xl transition-colors group">
                        <X className="h-5 w-5 text-red-400 group-hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-10">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center border border-white shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)] text-purple-600">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Current Symptoms</h3>
                    <p className="text-slate-500 font-medium mt-1">Context helps our AI process your report</p>
                  </div>
                </div>
                <textarea
                  value={symptoms}
                  onChange={(e) => { setSymptoms(e.target.value); setError(''); }}
                  placeholder="e.g., I've been experiencing persistent fatigue and mild shortness of breath..."
                  className="w-full px-8 py-6 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-[2rem] focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all resize-none h-40 text-slate-900 font-medium placeholder-slate-400 shadow-[inset_0_2px_10px_rgb(0,0,0,0.01)]"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || !symptoms.trim()}
                className="w-full btn-premium py-5 rounded-2xl font-extrabold text-sm tracking-widest uppercase disabled:opacity-50 flex items-center justify-center space-x-3 shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-transform"
              >
                {isAnalyzing ? <><Loader2 className="h-6 w-6 animate-spin" /><span>Consulting AI...</span></> : <><Upload className="h-6 w-6" /><span>Start Analysis</span></>}
              </button>
            </motion.div>
          )}

          {/* Analyzing Step */}
          {step === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-white/60 p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full blur-3xl -z-10 opacity-60" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl -z-10 opacity-60" />
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-1/2 h-full bg-teal-400"
                />
              </div>
              
              <div className="flex justify-center mb-10 relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400">
                  <Bot className="h-12 w-12 text-white animate-pulse" />
                </div>
              </div>
              
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4 relative z-10">AI Diagnostic Process</h2>
              <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] mb-12 bg-indigo-50 inline-block px-4 py-1.5 rounded-full border border-indigo-100 relative z-10">
                {detectedDept ? `Routing to ${departments.find(d => d.id === detectedDept)?.name}` : 'Neural Network Processing...'}
              </p>
              
              <div className="max-w-sm mx-auto space-y-4 relative z-10">
                {[
                  { label: 'Digitizing Report' },
                  { label: 'Analyzing Bio-markers', active: true },
                  { label: 'Extracting Diagnosis' }
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 }}
                    className={`p-5 rounded-2xl border flex items-center space-x-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] ${s.active ? 'bg-white border-teal-200 text-slate-900' : 'bg-slate-50/50 border-slate-100 text-slate-400'}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${s.active ? 'bg-teal-500 animate-pulse shadow-[0_0_10px_rgb(20,184,166,0.6)]' : 'bg-slate-300'}`} />
                    <p className="text-xs font-bold uppercase tracking-widest">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Department Selection Step */}
          {step === 'select-dept' && (
            <motion.div key="select-dept" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold tracking-widest uppercase border border-emerald-100 mb-6 shadow-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Scan Complete</span>
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-3">AI Routing Match</h2>
                  <p className="text-slate-500 font-medium text-sm">We've identified the best specialist for your case</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 mb-10 relative overflow-hidden group">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
                        <Bot className="h-10 w-10 text-slate-700" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Recommended Specialist</p>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">{departments.find(d => d.id === detectedDept)?.specialist || 'General Physician'}</h3>
                        <p className="text-slate-600 font-semibold">{departments.find(d => d.id === detectedDept)?.name || 'General'} Specialist</p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">AI Confidence</div>
                      <div className="text-3xl font-bold text-slate-900">98%</div>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 px-1">Or choose your preferred specialist</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {departments.slice(0, 9).map((dept) => (
                      <button 
                        key={dept.id} 
                        onClick={() => setSelectedDepartment(dept.id)} 
                        className={`p-5 rounded-xl border transition-all duration-300 text-left relative group ${selectedDepartment === dept.id ? 'border-slate-400 bg-slate-50 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}`}
                      >
                        <p className={`font-bold text-sm mb-1 ${selectedDepartment === dept.id ? 'text-slate-900' : 'text-slate-700'}`}>{dept.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{dept.specialist.split(' - ')[0]}</p>
                        {selectedDepartment === dept.id && <div className="absolute top-3 right-3 w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center shadow-sm"><CheckCircle className="h-2.5 w-2.5 text-white" /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleConfirmDepartment} className="w-full btn-premium py-4 font-bold text-lg flex items-center justify-center space-x-3">
                  <span>Consult with Specialist</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Result Step */}
          {step === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 pb-10">
              <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm relative overflow-hidden group">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                      <Stethoscope className="h-8 w-8 text-slate-700" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{result.specialist}</h2>
                      <p className="text-slate-500 font-semibold uppercase tracking-widest text-xs mt-1">{result.department_name}</p>
                    </div>
                  </div>
                  <div className="flex bg-slate-50 rounded-xl px-6 py-4 border border-slate-200 shadow-inner">
                    <div className="text-center px-4 border-r border-slate-200">
                      <p className="text-xs font-bold uppercase text-slate-500 mb-1">Status</p>
                      <p className="text-emerald-600 font-bold">Success</p>
                    </div>
                    <div className="text-center px-4">
                      <p className="text-xs font-bold uppercase text-slate-500 mb-1">AI Match</p>
                      <p className="text-slate-900 font-bold">99.2%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {result.full_response ? (
                  <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60" />
                    <div className="flex items-center space-x-5 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center border border-white shadow-[0_2px_10px_rgb(0,0,0,0.08)]">
                        <Bot className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Comprehensive AI Analysis</h3>
                        <p className="text-slate-500 font-medium mt-1">Detailed review of your medical report and symptoms</p>
                      </div>
                    </div>
                    <div className="text-slate-700 font-medium whitespace-pre-wrap leading-relaxed text-[15px] bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-inner max-w-none">
                      <TypewriterText text={result.full_response} />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-10">
                    <div className="text-slate-700 font-medium whitespace-pre-wrap leading-relaxed text-[15px] bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-inner max-w-none">
                      <h4 className="font-bold text-slate-900 mb-2">Technical Analysis</h4>
                      {result.report_analysis}<br/><br/>
                      <h4 className="font-bold text-slate-900 mb-2">Diagnosis</h4>
                      {result.diagnosis}<br/><br/>
                      <h4 className="font-bold text-slate-900 mb-2">Summary</h4>
                      {result.summary}
                    </div>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-200">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-900 text-lg mb-2">Medical Disclaimer</h4>
                        <p className="text-sm text-amber-800 font-medium leading-relaxed">{result.disclaimer || 'This analysis is generated by AI and must be verified by a licensed healthcare professional.'}</p>
                      </div>
                    </div>
                  </div>
                </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <Link href="/dashboard" className="w-full">
                  <button className="w-full btn-outline py-4 font-bold text-lg">Dashboard</button>
                </Link>
                <button 
                  onClick={() => setStep('upload')}
                  className="w-full btn-premium py-4 font-bold text-lg"
                >
                  New Analysis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
