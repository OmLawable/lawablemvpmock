# Lawable Legal OS — Complete Screen Inventory & Architecture Document

This document provides a comprehensive inventory of all **36 screens** implemented across the Lawable platform, organized into **9 core functional modules**.

> [!NOTE]
> Lawable is built as an integrated Single Page Application (SPA) using React, Vite, and custom CSS design tokens adhering to a strict 8px grid scale.

---

## 📊 Project Summary at a Glance

| Module Category | Screen Count | Primary File Location | Key Functionality |
| :--- | :---: | :--- | :--- |
| **1. Public Marketing & Directory** | 10 Screens | [PublicPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/public/PublicPages.jsx) | Landing, About, Pricing, Blog, Public Marketplace & Academy |
| **2. Authentication** | 4 Screens | [AuthPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/auth/AuthPages.jsx) | Login, Role Registration, Email Verification, Password Reset |
| **3. Lawable AI & Documents** | 3 Screens | [AIPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/ai/AIPages.jsx) | Conversational AI Legal Research, Guided Generator, Documents Vault |
| **4. Marketplace & Requests** | 3 Screens | [MarketplacePages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/marketplace/MarketplacePages.jsx) | Request Wizard, Requests List, Audit Timeline Detail |
| **5. Academy & Education** | 2 Screens | [AcademyPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/academy/AcademyPages.jsx) | Course Syllabus & Lesson Reader, Quiz Examination Interface |
| **6. Business & Compliance** | 5 Screens | [BusinessPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/business/BusinessPages.jsx) | Business Command Center, Compliance Checklist, Contracts Register |
| **7. Lawyer / Advocate Workspace** | 4 Screens | [LawyerPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/lawyer/LawyerPages.jsx) | Advocate Dashboard, Request Inbox Controller, Services Catalogue |
| **8. User Workspace & Dashboards** | 5 Screens | [AccountPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/account/AccountPages.jsx) | Role Dashboards (Client & Student), Profile, Settings, Notifications |
| **9. Admin Operations Panel** | 1 Screen (4 Tabs) | [AdminPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/admin/AdminPages.jsx) | Verification Approvals, Audit Logs, Content Management |
| **Total Platform Screens** | **36 Screens** | [App.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/App.jsx) | Central Routing & Route Disambiguation Engine |

---

## 🌐 Module 1: Public Marketing & Directory (10 Screens)
File: [PublicPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/public/PublicPages.jsx)

### Screen 1: Platform Landing Page (`/`)
- **Components**: Hero section, 4-module overview grid, interactive AI contract audit preview card.
- **Functionality**: Platform pitch, CTA launchers for signup and AI exploration.

### Screen 2: About Page (`/about`)
- **Components**: Product thesis card, verified advocate mission breakdown, enterprise CTA banner.
- **Functionality**: Explains Lawable's mission of unifying AI research with human advocate oversight.

### Screen 3: Support Contact Page (`/contact`)
- **Components**: Category dropdown selector, name/email input form, submission confirmation card.
- **Functionality**: General support & enterprise compliance enquiry intake.

### Screen 4: Transparent Pricing Page (`/pricing`)
- **Components**: 3-column pricing card grid (Individual Starter ₹0, Pro Advocate ₹1,499, Business Enterprise ₹4,999).
- **Functionality**: Feature comparison and trial signup launchers.

### Screen 5: Blog Insights Directory (`/blog`)
- **Components**: 2-column article card grid with category badges and read times.
- **Functionality**: Legal research and policy articles listing.

### Screen 6: Blog Article Detail (`/blog/[slug]`)
- **Components**: Article header, author credit, formatted markdown reader, legal implications callout.
- **Functionality**: Detailed analysis of Indian jurisprudence (e.g. DPDP Act 2023, Section 73 Indian Contract Act).

### Screen 7: Advocate Directory Grid (`/marketplace` & `/app/marketplace`)
- **Components**: Search input, practice area filter pills, auto-wrapping 10-advocate grid (`minmax(340px, 1fr)`).
- **Functionality**: Displays 10 Bar Council Verified Advocates across India with zero horizontal side-scroll.

### Screen 8: Advocate Profile & Services Catalogue (`/marketplace/lawyers/[id]` & `/app/marketplace/lawyers/[id]`)
- **Components**: Advocate bio header card, credentials info, direct consultation card, fixed-price legal services grid.
- **Functionality**: Dedicated profile page for each advocate with direct *"Submit Service Request →"* CTAs.

### Screen 9: Public Academy Overview (`/academy`)
- **Components**: 2-column course card grid, difficulty levels, duration indicators.
- **Functionality**: Public legal course catalogue.

### Screen 10: Digital Certificate Verification Page (`/verify/[id]` & `/certificates/[id]`)
- **Components**: Cryptographic verification card, learner name, course title, score percentage, issue date.
- **Functionality**: Public verification ledger lookup for earned Lawable academy certificates.

---

## 🔐 Module 2: Authentication & Onboarding (4 Screens)
File: [AuthPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/auth/AuthPages.jsx)

### Screen 11: Login Page (`/auth/login`)
- **Components**: Email/password form, password reset link, role-landing redirect trigger.
- **Functionality**: Authenticates user and routes directly to their active role workspace (`/app`).

### Screen 12: Signup & Role Selection (`/auth/signup`)
- **Components**: 4 workspace role cards (Client, Student, Lawyer, Business), password strength meter.
- **Functionality**: Registers user and sets initial workspace role.

### Screen 13: Verify Email Page (`/auth/verify-email`)
- **Components**: Email verification confirmation card, simulation trigger button.
- **Functionality**: Onboarding verification checkpoint.

### Screen 14: Password Reset Page (`/auth/reset-password`)
- **Components**: Email input form, password recovery dispatch notice.
- **Functionality**: Sends password reset instructions.

---

## 🤖 Module 3: Lawable AI & Documents (3 Screens)
File: [AIPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/ai/AIPages.jsx)

### Screen 15: Lawable AI Legal Assistant (`/app/ai`)
- **Components**: Conversations sidebar, rate limit meter (2/50), interactive prompt starters, source citations, red AI Escalation Hook banner (`#FEF2F2`, 12px rounded).
- **Functionality**: Conversational legal research under Indian Contract Act & DPDP Act with handoff to Advocate Marketplace.

### Screen 16: Guided Document Generator (`/app/ai/draft`)
- **Components**: Template selector, parameters form, rich editor text preview, unfilled placeholder warning modal.
- **Functionality**: Guided AI contract drafting for NDAs, Employment Agreements, and Founders Agreements.

### Screen 17: Documents Vault (`/app/documents`)
- **Components**: Documents table, risk level badges, source filters, DOCX download actions.
- **Functionality**: Storage repository for AI drafts and uploaded contract PDFs.

---

## 💼 Module 4: Marketplace & Service Requests (3 Screens)
File: [MarketplacePages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/marketplace/MarketplacePages.jsx)

### Screen 18: Service Request Wizard (`/app/marketplace/request/new`)
- **Components**: 68px avatar advocate header card, consultation fee box, matter scope textarea (min 30 chars), contact method & time window selectors.
- **Functionality**: Formally submits a legal review request to a Bar Council verified advocate.

### Screen 19: My Requests List (`/app/requests`)
- **Components**: Submitted request cards grid, status chips, assigned advocate badges, total fees.
- **Functionality**: Client overview of all submitted legal service requests.

### Screen 20: Request Audit Timeline (`/app/requests/[id]`)
- **Components**: Matter scope summary box, quoted fee callout, audit timeline event trail.
- **Functionality**: Step-by-step audit tracking of advocate actions and review delivery.

---

## 🎓 Module 5: Academy & Education (2 Screens)
File: [AcademyPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/academy/AcademyPages.jsx)

### Screen 21: Course Hub & Lesson Viewer (`/app/academy` & `/app/academy/[id]`)
- **Components**: Course module accordion navigation, lesson reader, Bare Act law notes, quiz launcher.
- **Functionality**: Practical legal education syllabus covering contract drafting and legal AI tools.

### Screen 22: Examination Quiz Interface (`/app/academy/[id]/quiz`)
- **Components**: Multiple-choice question card, option selection radio buttons, score calculation results modal.
- **Functionality**: Exam assessment leading to accredited certificate issuance.

---

## 🏢 Module 6: Business & Enterprise Compliance (5 Screens)
File: [BusinessPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/business/BusinessPages.jsx)

### Screen 23: Business Command Center (`/app/business`)
- **Components**: Compliance score meter (82%), metric cards, MCA/GST/DPDP quick launchers.
- **Functionality**: Enterprise dashboard for corporate legal operations.

### Screen 24: Compliance Checklist (`/app/business/compliance`)
- **Components**: Statutory item list (Form MGT-7A, GSTR-3B, DPDP Consent, POSH ICC), status chips, Bare Act reference modal.
- **Functionality**: Statutory compliance tracking for Indian Private Limited companies.

### Screen 25: Business Document Vault (`/app/business/documents`)
- **Components**: Document repository table, upload date filters, risk level tags.
- **Functionality**: Central repository for corporate governance files.

### Screen 26: Commercial Contract Register (`/app/business/contracts`)
- **Components**: Contract cards, annual value callout, expiry countdown indicators (e.g. 18 days to expiry).
- **Functionality**: Commercial contract renewal tracking.

### Screen 27: Business Profile (`/app/business/profile`)
- **Components**: CIN, GSTIN, employee count, entity type parameters form.
- **Functionality**: Corporate entity details management.

---

## ⚖️ Module 7: Lawyer / Advocate Workspace (4 Screens)
File: [LawyerPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/lawyer/LawyerPages.jsx)

### Screen 28: Lawyer Dashboard (`/app/lawyer`)
- **Components**: Advocate Verification Status Banner (`#ECFDF5` mint background, AAA `#065F46` text contrast), pending requests table, metrics.
- **Functionality**: Command center for Bar Council registered advocates.

### Screen 29: Request Inbox & Controller (`/app/lawyer/requests` & `/app/lawyer/requests/[id]`)
- **Components**: Split-pane inbox list, matter scope reader, state machine action buttons (*Accept*, *Reject*, *In Progress*, *Deliver*, *Complete*).
- **Functionality**: Advocate workflow management for client requests.

### Screen 30: Lawyer Profile Manager (`/app/lawyer/profile`)
- **Components**: Bar Council enrolment number field (read-only), consultation fee input, professional bio editor.
- **Functionality**: Marketplace profile management.

### Screen 31: Services Catalogue Manager (`/app/lawyer/services`)
- **Components**: Service cards grid, fixed price display, delivery SLA days, propose new service button.
- **Functionality**: Advocate fixed-price legal service offerings manager.

---

## 👤 Module 8: User Workspace & Role Dashboards (5 Screens)
File: [AccountPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/account/AccountPages.jsx)

### Screen 32: Client Dashboard (`/app` for Client Role)
- **Components**: Center-aligned welcome header banner, AI research meter, active advocate requests table, documents vault.
- **Functionality**: Personal legal workspace hub.

### Screen 33: Student Dashboard (`/app` for Student Role)
- **Components**: Center-aligned student welcome header banner, enrolled courses grid, exam certificates counter.
- **Functionality**: Law student learning hub.

### Screen 34: Profile Page (`/app/profile`)
- **Components**: Avatar image, email verification badge, name & phone update form.
- **Functionality**: Personal account profile management.

### Screen 35: Settings & Privacy Page (`/app/settings`)
- **Components**: Password update form, data JSON export trigger, local demo reset button, danger zone soft-delete dialog.
- **Functionality**: Account security and privacy management.

### Screen 36: Notifications Center (`/app/notifications`)
- **Components**: Platform notifications list, unread red badges, navigation links, empty state card.
- **Functionality**: Central notification inbox.

---

## 🛠️ Module 9: Admin Operations Panel (1 Screen, 4 Tabs)
File: [AdminPages.jsx](file:///c:/Users/justr/Desktop/lawable%20mocks/src/pages/admin/AdminPages.jsx)

### Admin Ops Dashboard (`/admin`)
- **Components**: 4-tab control panel:
  1. **Overview Tab**: Total platform users, active requests, verified lawyers count.
  2. **Lawyer Verification Tab**: Bar Council enrolment credential review, PDF view, *Verify Advocate* / *Request Info* action triggers.
  3. **Request Audit Logs Tab**: Platform service audit trail log.
  4. **Content Manager Tab**: Academy courses & blog editorial manager.
- **Functionality**: Administrative control panel for Lawable platform operators.
