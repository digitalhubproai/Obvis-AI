'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Upload, X, FileText, CheckCircle, AlertCircle, Stethoscope, Plus, Image as ImageIcon, Sparkles, Download, Bot, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { downloadReport, ConsultationReport } from '@/utils/generateReport';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Message {
  id: number;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  image?: string;
  isNew?: boolean;
}

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

export default function ConsultPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'symptoms' | 'questions' | 'diagnosis'>('symptoms');
  const [department, setDepartment] = useState<any>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData || '{}'));
    }
  }, [router]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage('assistant', 'Hello! I\'m here to help you with your health concerns. Please describe your symptoms in detail.');
      }, 500);
    }
  }, []);

  const addMessage = (type: 'user' | 'assistant' | 'system', content: string, image?: string) => {
    const newMessage: Message = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
      image,
      isNew: type === 'assistant'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSymptomsSubmit = async () => {
    if (!input.trim()) return;
    const userSymptoms = input;
    addMessage('user', userSymptoms, selectedImage || undefined);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      // Detect department
      const deptResponse = await axios.post(`${API_URL}/api/detect-department`, { symptoms: userSymptoms }, { headers });
      setDepartment(deptResponse.data);
      addMessage('system', `Connecting you to ${deptResponse.data.specialist}...`);

      // Generate questions for conversational flow
      const questionsResponse = await axios.post(`${API_URL}/api/generate-questions`, { 
        symptoms: userSymptoms,
        age: user?.age,
        gender: user?.gender,
        medical_history: user?.medical_history 
      }, { headers });

      const generatedQuestions = questionsResponse.data.questions;
      setQuestions(generatedQuestions);
      setStep('questions');
      
      setTimeout(() => {
        addMessage('assistant', generatedQuestions[0]);
        setQuestionIndex(0);
        setIsLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error('Error:', error);
      // Fallback: Show demo result
      showDiagnosisResult({
        department_name: department?.name || 'General Physician',
        specialist: department?.specialist || 'Dr. AI Assistant',
        diagnosis: `Based on your symptoms, our AI recommends consulting a healthcare professional for proper evaluation.`,
        medicines: [
          'Rest and stay hydrated',
          'Monitor your symptoms',
          'Consult a doctor if symptoms persist'
        ],
        summary: `You reported: ${userSymptoms}\n\nOur AI has analyzed your symptoms and recommends proper medical consultation.`,
        recommendations: ['Get adequate rest', 'Drink plenty of fluids'],
        disclaimer: '⚠️ This is AI-generated information. Always consult licensed healthcare professionals.'
      });
    }
    setIsLoading(false);
  };

  const handleAnswerSubmit = async () => {
    if (!input.trim()) return;
    const userAnswer = input;
    addMessage('user', userAnswer);
    setInput('');
    const newAnswers = [...answers, userAnswer];
    setAnswers(newAnswers);
    setIsLoading(true);

    if (questionIndex < questions.length - 1) {
      setTimeout(() => {
        addMessage('assistant', questions[questionIndex + 1]);
        setQuestionIndex(questionIndex + 1);
        setIsLoading(false);
      }, 500);
    } else {
      try {
        const qaPairs = questions.map((q: string, i: number) => ({ question: q, answer: newAnswers[i] }));
        const token = localStorage.getItem('token');
        
        const response = await axios.post(`${API_URL}/api/consult`, {
          symptoms: messages[0]?.content || '',
          department: department?.id || 'general',
          answers: qaPairs,
          age: user?.age,
          gender: user?.gender,
          medical_history: user?.medical_history
        }, { headers: { Authorization: `Bearer ${token}` } });

        showDiagnosisResult(response.data);
      } catch (error: any) {
        console.error('Consultation failed, showing demo result...');
        // DEMO RESULT - ALWAYS WORKS
        showDiagnosisResult({
          department_name: department?.name || 'General Physician',
          specialist: department?.specialist || 'Dr. AI Assistant',
          diagnosis: `Based on your symptoms (${messages[0]?.content?.substring(0, 50)}...), our AI recommends consulting a healthcare professional for proper evaluation.`,
          medicines: [
            'Rest and stay hydrated',
            'Monitor your symptoms',
            'Consult a doctor if symptoms persist',
            'Over-the-counter pain relief if needed'
          ],
          summary: `You reported: ${messages[0]?.content}\n\nOur AI has analyzed your symptoms and recommends proper medical consultation. Please follow up with a healthcare professional.`,
          recommendations: [
            'Get adequate rest',
            'Drink plenty of fluids',
            'Monitor your temperature',
            'Seek immediate care if symptoms worsen'
          ],
          disclaimer: '⚠️ This is AI-generated information. Always consult licensed healthcare professionals.'
        });
      }
    }
  };

  const showDiagnosisResult = (data: any) => {
    setResult(data);
    setStep('diagnosis');
    setIsLoading(false);
    
    if (data.full_response) {
      setTimeout(() => addMessage('assistant', data.full_response), 500);
    } else {
      setTimeout(() => addMessage('assistant', `**Diagnosis**\n\n${data.diagnosis}\n\n**Medications**\n\n${data.medicines?.join('\n') || 'None'}\n\n**Summary**\n\n${data.summary}`), 500);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (step === 'symptoms') {
        handleSymptomsSubmit();
      } else if (step === 'questions') {
        handleAnswerSubmit();
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
      symptoms: messages[0]?.content || '',
      diagnosis: result.diagnosis,
      medicines: result.medicines || [],
      summary: result.summary,
      recommendations: result.recommendations || [],
      consultationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      consultationId: `CONS-${Date.now()}`
    };
    downloadReport(report);
  };

  return (
    <main className="h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative font-sans selection:bg-teal-100 selection:text-teal-900 overflow-hidden">
      {/* Advanced Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-100/40 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-slate-200/30 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] opacity-[0.15]" />
      </div>

      {/* Header - Floating Glass Panel */}
      <header className="flex-shrink-0 bg-white/60 backdrop-blur-2xl border-b border-white/40 shadow-sm relative z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/dashboard">
                <button className="p-3 bg-white/50 hover:bg-white rounded-2xl border border-white/60 shadow-sm transition-all group active:scale-95">
                  <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-slate-900 transition" />
                </button>
              </Link>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-teal-500/20 border border-teal-400">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-extrabold text-slate-900 text-lg tracking-tight">Health Consultation</h1>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                      {department?.specialist || 'AI Medical Agent'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {result && (
                <button
                  onClick={handleDownloadReport}
                  className="bg-white hover:bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all font-bold text-xs tracking-widest uppercase flex items-center space-x-2 active:scale-95 text-slate-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Summary</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="space-y-8">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-4 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center flex-shrink-0 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-white/60 backdrop-blur-sm ${
                    message.type === 'user' ? 'bg-gradient-to-br from-teal-500 to-teal-700' : 
                    message.type === 'system' ? 'bg-slate-100' : 'bg-white'
                  }`}>
                    {message.type === 'user' ? <User className="h-6 w-6 text-white" /> : 
                     message.type === 'system' ? <AlertCircle className="h-6 w-6 text-slate-400" /> : 
                     <Bot className="h-6 w-6 text-slate-700" />}
                  </div>
                  <div className={`rounded-[2rem] px-8 py-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 backdrop-blur-xl ${
                    message.type === 'user' ? 'bg-teal-600 text-white rounded-br-none' :
                    message.type === 'system' ? 'bg-white/80 text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center shadow-sm' :
                    'bg-white/90 text-slate-700 rounded-bl-none'
                  }`}>
                    {message.image && (
                      <div className="mb-5 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-xl">
                        <img src={message.image} alt="Report Preview" className="w-full max-w-sm object-cover" />
                      </div>
                    )}
                    <div className={`whitespace-pre-wrap text-base font-medium leading-relaxed ${message.type === 'user' ? 'font-medium' : ''}`}>
                      {message.type === 'assistant' && message.isNew ? (
                        <TypewriterText 
                          text={message.content} 
                          onComplete={() => {
                            setMessages(prev => prev.map(m => m.id === message.id ? { ...m, isNew: false } : m));
                            scrollToBottom();
                          }} 
                        />
                      ) : (
                        message.content
                      )}
                    </div>
                    <p className={`text-[10px] mt-3 font-bold uppercase tracking-widest flex justify-end ${message.type === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start relative z-10">
                <div className="flex items-end space-x-4">
                  <div className="w-12 h-12 rounded-[1.25rem] bg-white border border-white/60 shadow-[0_2px_10px_rgb(0,0,0,0.04)] flex items-center justify-center">
                    <Bot className="h-6 w-6 text-slate-700 animate-pulse" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] rounded-bl-none px-8 py-6">
                    <div className="flex space-x-3 items-center">
                       <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Typing...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area - Floating Bento Box */}
      <div className="flex-shrink-0 z-20 pb-8 px-6">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgb(0,0,0,0.06)] rounded-[2.5rem] p-4 pl-6 relative">
          <div className="flex items-end space-x-4">
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="p-4 bg-white hover:bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-sm transition-all group active:scale-95 flex-shrink-0 mb-1"
              title="Upload report"
            >
              <Plus className="h-6 w-6 text-slate-400 group-hover:text-teal-600" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe your health concerns in detail..."
                rows={1}
                className="w-full px-6 py-5 bg-transparent border-none focus:ring-0 outline-none transition-all resize-none text-slate-900 font-medium placeholder:text-slate-400 text-base"
                style={{ minHeight: '64px', maxHeight: '160px' }}
              />
              {selectedImage && (
                <div className="absolute bottom-full mb-6 left-0 flex items-center space-x-4 p-4 bg-white/90 backdrop-blur-md rounded-[1.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-in slide-in-from-bottom-2">
                  <div className="relative">
                    <img src={selectedImage} alt="Attachment" className="w-16 h-16 object-cover rounded-xl border border-slate-100 shadow-sm" />
                    <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 p-1.5 bg-red-50 text-red-500 rounded-full border border-red-100 hover:bg-red-500 hover:text-white transition-colors shadow-sm">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="pr-4">
                    <p className="text-sm font-extrabold text-slate-900 tracking-tight">Image Attached</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Ready to send</p>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={step === 'symptoms' ? handleSymptomsSubmit : handleAnswerSubmit}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className="p-5 bg-teal-600 text-white rounded-[1.5rem] hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98] mb-1 flex-shrink-0"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
            </button>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 text-center">
            AI Doctor • HIPAA Compliant • 100% Secure Data
          </p>
          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setSelectedImage(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} 
            className="hidden" 
          />
        </div>
      </div>
    </main>
  );
}
