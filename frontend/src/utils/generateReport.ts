/**
 * Generate PDF Report for Consultation
 * Professional Medical Report Design
 */

export interface ConsultationReport {
  patientName: string;
  patientEmail?: string;
  patientAge?: number;
  patientGender?: string;
  department: string;
  specialist: string;
  symptoms: string;
  diagnosis: string;
  medicines: string[];
  summary: string;
  recommendations?: string[];
  reportAnalysis?: string;
  consultationDate: string;
  consultationId: string;
}

export function generateReportHTML(report: ConsultationReport): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medical Consultation Report - Obvis</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --secondary: #0891b2;
      --success: #16a34a;
      --warning: #f59e0b;
      --danger: #dc2626;
      --gray-50: #f9fafb;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-300: #d1d5db;
      --gray-600: #4b5563;
      --gray-700: #374151;
      --gray-900: #111827;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.7;
      color: var(--gray-700);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      min-height: 100vh;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    /* Header Banner */
    .header-banner {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      padding: 48px 48px 40px;
      position: relative;
      overflow: hidden;
    }
    
    .header-banner::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }
    
    .header-banner::after {
      content: '';
      position: absolute;
      bottom: -30%;
      left: -5%;
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
    }
    
    .header-content {
      position: relative;
      z-index: 1;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .logo-icon {
      width: 72px;
      height: 72px;
      background: white;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
    
    .logo-icon svg {
      width: 44px;
      height: 44px;
      color: var(--primary);
    }
    
    .logo-text {
      font-size: 48px;
      font-weight: 800;
      color: white;
      letter-spacing: -2px;
      line-height: 1;
    }
    
    .report-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 12px 24px;
      border-radius: 50px;
      color: white;
      font-weight: 600;
      font-size: 14px;
      margin-top: 16px;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .report-title {
      font-size: 28px;
      font-weight: 700;
      color: white;
      margin-top: 20px;
      opacity: 0.95;
    }
    
    /* Content */
    .content {
      padding: 48px;
    }
    
    /* Patient Card */
    .patient-card {
      background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
      border-radius: 20px;
      padding: 32px;
      margin-bottom: 40px;
      border: 2px solid var(--gray-200);
      position: relative;
      overflow: hidden;
    }
    
    .patient-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
    }
    
    .patient-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .patient-avatar {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: 700;
    }
    
    .patient-title {
      font-size: 22px;
      font-weight: 700;
      color: var(--gray-900);
    }
    
    .patient-subtitle {
      font-size: 14px;
      color: var(--gray-600);
    }
    
    .patient-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    
    .patient-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .field-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--gray-600);
    }
    
    .field-value {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-900);
    }
    
    /* Sections */
    .section {
      margin-bottom: 40px;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 3px solid var(--gray-200);
    }
    
    .section-icon {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 20px;
    }
    
    .section-icon.blue { 
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); 
      color: var(--primary); 
    }
    .section-icon.green { 
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); 
      color: var(--success); 
    }
    .section-icon.purple { 
      background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); 
      color: #9333ea; 
    }
    .section-icon.orange { 
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); 
      color: var(--warning); 
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 800;
      color: var(--gray-900);
      letter-spacing: -0.5px;
    }
    
    .section-content {
      font-size: 15px;
      color: var(--gray-700);
      line-height: 1.8;
      background: var(--gray-50);
      padding: 24px;
      border-radius: 16px;
      border: 1px solid var(--gray-200);
    }
    
    /* Medicines */
    .medicines-list {
      list-style: none;
      display: grid;
      gap: 14px;
    }
    
    .medicine-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;
      background: white;
      border-radius: 14px;
      border: 2px solid var(--gray-200);
      transition: all 0.3s ease;
    }
    
    .medicine-item:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
      transform: translateX(4px);
    }
    
    .medicine-number {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 800;
      flex-shrink: 0;
    }
    
    .medicine-content {
      flex: 1;
      font-weight: 500;
      color: var(--gray-900);
    }
    
    /* Recommendations */
    .recommendations-list {
      list-style: none;
      display: grid;
      gap: 12px;
    }
    
    .recommendation-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 18px 20px;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      border-radius: 14px;
      border: 2px solid #fcd34d;
      font-weight: 500;
      color: var(--gray-900);
    }
    
    .recommendation-icon {
      width: 28px;
      height: 28px;
      background: var(--warning);
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
    
    /* Meta Info */
    .meta-section {
      background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
      border-radius: 20px;
      padding: 28px 32px;
      margin-top: 40px;
      border: 2px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      color: var(--gray-600);
    }
    
    .meta-item strong {
      color: var(--gray-900);
      font-weight: 700;
    }
    
    .meta-id {
      background: white;
      padding: 10px 20px;
      border-radius: 12px;
      font-family: 'Courier New', monospace;
      font-weight: 800;
      color: var(--primary);
      border: 2px solid var(--primary);
      font-size: 13px;
      letter-spacing: 1px;
    }
    
    /* Footer */
    .footer {
      background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-700) 100%);
      padding: 48px 48px 40px;
      text-align: center;
      color: white;
    }
    
    .footer-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-bottom: 20px;
    }
    
    .footer-logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .footer-logo-icon svg {
      width: 28px;
      height: 28px;
      color: white;
    }
    
    .footer-logo-text {
      font-size: 32px;
      font-weight: 800;
      color: white;
      letter-spacing: -1px;
    }
    
    .footer-tagline {
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 24px;
      font-weight: 500;
    }
    
    .footer-features {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 32px;
      padding: 24px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      margin-bottom: 24px;
    }
    
    .footer-feature {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 600;
    }
    
    .footer-feature-icon {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 13px;
      font-weight: 800;
    }
    
    .footer-disclaimer {
      font-size: 12px;
      opacity: 0.7;
      line-height: 1.8;
      max-width: 700px;
      margin: 0 auto;
    }
    
    /* Print Styles */
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
        border-radius: 0;
      }
      
      .header-banner,
      .section-icon,
      .medicine-item,
      .recommendation-item,
      .footer {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
    
    @media (max-width: 768px) {
      body {
        padding: 20px 12px;
      }
      
      .header-banner {
        padding: 32px 24px;
      }
      
      .logo-icon {
        width: 56px;
        height: 56px;
      }
      
      .logo-icon svg {
        width: 32px;
        height: 32px;
      }
      
      .logo-text {
        font-size: 36px;
      }
      
      .content {
        padding: 32px 24px;
      }
      
      .patient-grid {
        grid-template-columns: 1fr;
      }
      
      .meta-section {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .footer-features {
        flex-direction: column;
        gap: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Banner -->
    <div class="header-banner">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
              <circle cx="12" cy="10" r="3"/>
              <circle cx="12" cy="17" r="1"/>
            </svg>
          </div>
          <div class="logo-text">Obvis</div>
        </div>
        <div class="report-title">Medical Consultation Report</div>
        <div class="report-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>AI-Powered Diagnosis</span>
        </div>
      </div>
    </div>
    
    <!-- Content -->
    <div class="content">
      <!-- Patient Card -->
      <div class="patient-card">
        <div class="patient-header">
          <div class="patient-avatar">
            ${report.patientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="patient-title">Patient Information</div>
            <div class="patient-subtitle">Personal & consultation details</div>
          </div>
        </div>
        <div class="patient-grid">
          <div class="patient-field">
            <span class="field-label">Patient Name</span>
            <span class="field-value">${report.patientName || 'N/A'}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Email Address</span>
            <span class="field-value">${report.patientEmail || 'N/A'}</span>
          </div>
          ${report.patientAge ? `
          <div class="patient-field">
            <span class="field-label">Age</span>
            <span class="field-value">${report.patientAge} years</span>
          </div>
          ` : ''}
          ${report.patientGender ? `
          <div class="patient-field">
            <span class="field-label">Gender</span>
            <span class="field-value">${report.patientGender}</span>
          </div>
          ` : ''}
          <div class="patient-field">
            <span class="field-label">Department</span>
            <span class="field-value">${report.department}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Consultation Date</span>
            <span class="field-value">${report.consultationDate}</span>
          </div>
        </div>
      </div>
      
      <!-- Symptoms -->
      <div class="section">
        <div class="section-header">
          <span class="section-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
          </span>
          <span class="section-title">Symptoms Reported</span>
        </div>
        <div class="section-content">
          ${report.symptoms}
        </div>
      </div>
      
      <!-- Report Analysis -->
      ${report.reportAnalysis ? `
      <div class="section">
        <div class="section-header">
          <span class="section-icon purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="12" y1="2" x2="12" y2="6"/>
            </svg>
          </span>
          <span class="section-title">Medical Report Analysis</span>
        </div>
        <div class="section-content">
          ${report.reportAnalysis}
        </div>
      </div>
      ` : ''}
      
      <!-- Diagnosis -->
      <div class="section">
        <div class="section-header">
          <span class="section-icon green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </span>
          <span class="section-title">AI Diagnosis</span>
        </div>
        <div class="section-content">
          ${report.diagnosis}
        </div>
      </div>
      
      <!-- Medicines -->
      <div class="section">
        <div class="section-header">
          <span class="section-icon purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="6" width="18" height="12" rx="2"/>
              <circle cx="8.5" cy="12" r="1.5"/>
              <circle cx="15.5" cy="12" r="1.5"/>
              <line x1="12" y1="6" x2="12" y2="18"/>
            </svg>
          </span>
          <span class="section-title">Prescribed Medications</span>
        </div>
        <ul class="medicines-list">
          ${report.medicines.map((med, i) => `
            <li class="medicine-item">
              <span class="medicine-number">${i + 1}</span>
              <span class="medicine-content">${med}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      
      <!-- Summary -->
      <div class="section">
        <div class="section-header">
          <span class="section-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </span>
          <span class="section-title">Consultation Summary</span>
        </div>
        <div class="section-content">
          ${report.summary}
        </div>
      </div>
      
      <!-- Recommendations -->
      ${report.recommendations && report.recommendations.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <span class="section-icon orange">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </span>
          <span class="section-title">Important Recommendations</span>
        </div>
        <ul class="recommendations-list">
          ${report.recommendations.map((rec, i) => `
            <li class="recommendation-item">
              <span class="recommendation-icon">!</span>
              <span>${rec}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      ` : ''}
      
      <!-- Meta Section -->
      <div class="meta-section">
        <div class="meta-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <strong>Specialist:</strong>
          <span>${report.specialist}</span>
        </div>
        <div class="meta-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <strong>Consultation ID:</strong>
          <span class="meta-id">${report.consultationId}</span>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">
        <div class="footer-logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
            <circle cx="12" cy="10" r="3"/>
            <circle cx="12" cy="17" r="1"/>
          </svg>
        </div>
        <div class="footer-logo-text">Obvis</div>
      </div>
      <div class="footer-tagline">AI-Powered Healthcare at Your Fingertips</div>
      <div class="footer-features">
        <div class="footer-feature">
          <span class="footer-feature-icon">✓</span>
          <span>Available 24/7</span>
        </div>
        <div class="footer-feature">
          <span class="footer-feature-icon">✓</span>
          <span>13+ Specialists</span>
        </div>
        <div class="footer-feature">
          <span class="footer-feature-icon">✓</span>
          <span>95% Accuracy</span>
        </div>
        <div class="footer-feature">
          <span class="footer-feature-icon">✓</span>
          <span>HIPAA Compliant</span>
        </div>
      </div>
      <div class="footer-disclaimer">
        ⚠️ <strong>Medical Disclaimer:</strong> This report is generated by an AI-powered medical system and is for informational purposes only. 
        Always consult a licensed healthcare professional for medical advice, diagnosis, or treatment. This report should not 
        replace professional medical consultation. In case of emergency, call your local emergency services immediately.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function downloadReport(report: ConsultationReport, filename?: string) {
  const html = generateReportHTML(report);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `obvis-report-${report.consultationId}-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printReport(report: ConsultationReport) {
  const html = generateReportHTML(report);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
