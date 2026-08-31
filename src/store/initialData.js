// Seed data aligned 100% with Lawable PRD v1.0 specifications
export const INITIAL_DATA = {
  currentUser: null,

  roles: [
    { id: 'student', title: 'Student', desc: 'Legal education, syllabus & certificates.' },
    { id: 'client', title: 'Individual / Client', desc: 'Personal legal AI & verified advocate search.' },
    { id: 'lawyer', title: 'Advocate / Lawyer', desc: 'Client requests & legal service management.' },
    { id: 'business', title: 'Business / Enterprise', desc: 'Corporate compliance & contract vault.' }
  ],

  // Marketplace Lawyers — 10 Verified Advocates (PRD FR-3.1: Only verified lawyers appear in marketplace search)
  lawyers: [
    {
      id: 'lawyer-101',
      userId: 'user-lawyer-1',
      // 1. Basic Identity
      name: 'Adv. Priya Malhotra, Senior Counsel',
      designation: 'Senior Partner & Practice Head',
      experience: 11,
      firm: 'Malhotra & Associates Legal',
      city: 'Mumbai',
      state: 'Maharashtra',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      consultationFee: 2500,

      // 2. Professional Credentials
      practiceAreas: ['Corporate & Company Law', 'Contract Drafting', 'Compliance', 'Cyber & Data Protection'],
      barCouncilNo: 'MAH/4521/2014',
      enrolmentState: 'Maharashtra',
      courtsPracticedIn: ['Supreme Court of India', 'Bombay High Court', 'NCLT Mumbai Bench'],
      education: 'LL.M (Corporate Law, NLSIU Bangalore), LL.B (ILS Law College, Pune)',
      certifications: 'Certified Information Privacy Professional (CIPP/A), Accredited Bar Mediator',

      // 3. Experience & Track Record
      bio: 'Senior corporate counsel specializing in startup structuring, founders agreements, cross-border commercial contracts, and DPDP Act compliance.',
      notableCases: 'Lead legal advisor for $45M cross-border SaaS acquisition; Arbitrated multi-crore shareholder dispute before Bombay High Court.',
      achievements: 'Ranked Top 40 Under 40 Corporate Lawyers in India (2024), Bar Council Merit Award for Legal Innovation.',
      publications: 'Author of "Data Fiduciary Obligations & Penalties under DPDP Act 2023" (National Law Review, 2024).',
      languages: ['English', 'Hindi', 'Marathi'],

      rating: 4.9,
      reviewCount: 38,
      verificationStatus: 'verified',
      submissionAgeHours: 12,
      credentialsUrl: 'bar_council_certificate_priya.pdf'
    },
    {
      id: 'lawyer-102',
      userId: 'user-lawyer-2',
      // 1. Basic Identity
      name: 'Adv. Rajesh Iyer',
      designation: 'Managing Partner',
      experience: 15,
      firm: 'Iyer Legal Chambers',
      city: 'New Delhi',
      state: 'Delhi',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      consultationFee: 3000,

      // 2. Professional Credentials
      practiceAreas: ['Employment & HR', 'IP & Trademarks', 'Property & Real Estate'],
      barCouncilNo: 'D/1892/2010',
      enrolmentState: 'Delhi',
      courtsPracticedIn: ['Delhi High Court', 'Supreme Court of India', 'CAT Delhi'],
      education: 'B.A. LL.B (Hons, Campus Law Centre, Delhi University)',
      certifications: 'POSH External Committee Member Certification, Trademark Prosecution Specialist',

      // 3. Experience & Track Record
      bio: 'Advocate practicing at Delhi High Court with deep expertise in employment disputes, POSH guidelines, vendor contracts, and IP registration.',
      notableCases: 'Defended executive wrongful termination appeal in Delhi High Court; Secured injunction against counterfeit brand infringement.',
      achievements: 'Delhi Bar Association Outstanding Litigation Award (2022), Advisory Panelist on HR & Labor Compliance.',
      publications: 'Co-Author of "POSH Act 2013: Employer Compliance and Internal Complaints Committees Guide".',
      languages: ['English', 'Hindi', 'Tamil'],

      rating: 4.8,
      reviewCount: 64,
      verificationStatus: 'verified',
      submissionAgeHours: 8,
      credentialsUrl: 'delhi_bar_certificate_rajesh.pdf'
    },
    {
      id: 'lawyer-103',
      userId: 'user-lawyer-3',
      // 1. Basic Identity
      name: 'Adv. Vikramaditya Sen',
      designation: 'Founding Counsel',
      experience: 7,
      firm: 'Sen Tech Law Studio',
      city: 'Bengaluru',
      state: 'Karnataka',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      consultationFee: 2000,

      // 2. Professional Credentials
      practiceAreas: ['Cyber & Data Protection', 'Contract Review', 'Legal Notices'],
      barCouncilNo: 'KAR/3104/2018',
      enrolmentState: 'Karnataka',
      courtsPracticedIn: ['Karnataka High Court', 'Cyber Appellate Tribunal'],
      education: 'LL.M (IPR & Tech Law, NALSAR Hyderabad), B.A. LL.B (NLSIU)',
      certifications: 'Certified Cyber Law & Forensic Analyst, Open Source Software Licensing Fellow',

      // 3. Experience & Track Record
      bio: 'Tech lawyer advising SaaS companies on master service agreements, terms of service, API licenses, and fintech regulatory compliance.',
      notableCases: 'Drafted enterprise API SLAs for tier-1 unicorn startup; Negotiated cross-border SaaS vendor indemnities.',
      achievements: 'Recognized as Emerging Tech Lawyer of Karnataka (2023), Speaker at FinTech Legal Summit.',
      publications: 'Published paper "Section 73 Damages Limitation in Cloud Service Level Agreements" (2023).',
      languages: ['English', 'Kannada', 'Hindi'],

      rating: 4.7,
      reviewCount: 19,
      verificationStatus: 'verified',
      submissionAgeHours: 4,
      credentialsUrl: 'karnataka_bar_certificate_sen.pdf'
    },
    {
      id: 'lawyer-104',
      userId: 'user-lawyer-5',
      // 1. Basic Identity
      name: 'Adv. Ananya Deshmukh',
      designation: 'Senior Associate Partner',
      experience: 9,
      firm: 'Deshmukh Legal Partners',
      city: 'Pune',
      state: 'Maharashtra',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      consultationFee: 2200,

      // 2. Professional Credentials
      practiceAreas: ['Property & Real Estate', 'Contract Review', 'Corporate & Company Law'],
      barCouncilNo: 'MAH/7721/2016',
      enrolmentState: 'Maharashtra',
      courtsPracticedIn: ['Bombay High Court (Bench Pune)', 'MahaRERA Tribunal'],
      education: 'LL.M (Commercial Law, ILS Law College Pune)',
      certifications: 'MahaRERA Practice Practitioner Certification, Commercial Title Arbitrator',

      // 3. Experience & Track Record
      bio: 'Specializing in commercial leasing, property due diligence, startup joint ventures, and arbitration notice drafting.',
      notableCases: 'Conducted title due diligence for 50-acre IT park lease in Hinjewadi; Resolved multi-tenant commercial lease dispute.',
      achievements: 'Pune Bar Association Legal Excellence Honor, Women in Commercial Law Leadership Award.',
      publications: 'Guide on "MahaRERA Developer Compliance & Title Search Due Diligence".',
      languages: ['English', 'Marathi', 'Hindi'],

      rating: 4.9,
      reviewCount: 42,
      verificationStatus: 'verified',
      submissionAgeHours: 16,
      credentialsUrl: 'pune_bar_certificate_ananya.pdf'
    },
    {
      id: 'lawyer-105',
      userId: 'user-lawyer-6',
      // 1. Basic Identity
      name: 'Adv. Meera Nair',
      designation: 'Principal IP Counsel',
      experience: 12,
      firm: 'Nair IP & Legal Practice',
      city: 'Chennai',
      state: 'Tamil Nadu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      consultationFee: 2800,

      // 2. Professional Credentials
      practiceAreas: ['IP & Trademarks', 'Cyber & Data Protection', 'Consumer Protection'],
      barCouncilNo: 'TN/5512/2012',
      enrolmentState: 'Tamil Nadu',
      courtsPracticedIn: ['Madras High Court', 'Intellectual Property Appellate Board (IPAB)'],
      education: 'LL.M (IP & Cyber Law, TNDALU Chennai)',
      certifications: 'Registered Indian Patent & Trademark Attorney',

      // 3. Experience & Track Record
      bio: 'Intellectual property and data protection specialist advising brand owners on trademark prosecution, copyright enforcement, and DPDP compliance audits.',
      notableCases: 'Successfully opposed infringing trademark filing for international retail apparel brand in Chennai IP Registry.',
      achievements: 'Top IP Practitioner Award (Tamil Nadu Chapter 2023), Listed in Asia-Pacific IP Star Advocates.',
      publications: 'Author of "Trademarks Prosecution & Opposition Manual under Indian IP Law".',
      languages: ['English', 'Tamil', 'Hindi'],

      rating: 4.8,
      reviewCount: 29,
      verificationStatus: 'verified',
      submissionAgeHours: 24,
      credentialsUrl: 'chennai_bar_certificate_meera.pdf'
    },
    {
      id: 'lawyer-106',
      userId: 'user-lawyer-7',
      // 1. Basic Identity
      name: 'Adv. Kabir Reddy',
      designation: 'Partner — Corporate & M&A',
      experience: 10,
      firm: 'Reddy Corporate Legal',
      city: 'Hyderabad',
      state: 'Telangana',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      consultationFee: 2400,

      // 2. Professional Credentials
      practiceAreas: ['Corporate & Company Law', 'Contract Drafting', 'Compliance'],
      barCouncilNo: 'TS/3891/2015',
      enrolmentState: 'Telangana',
      courtsPracticedIn: ['Telangana High Court', 'NCLT Hyderabad Bench'],
      education: 'LL.B (Hons, NALSAR University of Law Hyderabad)',
      certifications: 'Corporate Governance & Secretarial Advisor Certificate',

      // 3. Experience & Track Record
      bio: 'Corporate advocate assisting tech startups with seed funding term sheets, shareholder agreements, board advisory, and MCA compliance filings.',
      notableCases: 'Structured $12M Series-A funding round term sheet & SHA for Hyderabad healthtech startup.',
      achievements: 'NALSAR Outstanding Alumnus Advocate Award, Corporate Counsel of the Year (Telangana 2023).',
      publications: 'Article "Shareholder Rights & Liquidation Preferences under Companies Act 2013".',
      languages: ['English', 'Telugu', 'Hindi'],

      rating: 4.9,
      reviewCount: 51,
      verificationStatus: 'verified',
      submissionAgeHours: 10,
      credentialsUrl: 'hyderabad_bar_certificate_kabir.pdf'
    },
    {
      id: 'lawyer-107',
      userId: 'user-lawyer-8',
      // 1. Basic Identity
      name: 'Adv. Sanya Banerjee',
      designation: 'Senior Advocate & Consultant',
      experience: 13,
      firm: 'Banerjee Legal Chambers',
      city: 'Kolkata',
      state: 'West Bengal',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      consultationFee: 2100,

      // 2. Professional Credentials
      practiceAreas: ['Legal Notices', 'Employment & HR', 'Consumer Protection'],
      barCouncilNo: 'WB/2910/2013',
      enrolmentState: 'West Bengal',
      courtsPracticedIn: ['Calcutta High Court', 'State Consumer Disputes Redressal Commission'],
      education: 'LL.M (WBNUJS Kolkata)',
      certifications: 'Labor Law & Industrial Disputes Practitioner',

      // 3. Experience & Track Record
      bio: 'High Court advocate handling labor disputes, breach of contract legal notices, consumer tribunal claims, and workplace policy compliance.',
      notableCases: 'Recovered statutory severance and wages for 120 logistics employees in breach of contract suit.',
      achievements: 'Calcutta High Court Bar Association Citation for Pro Bono Legal Aid Work.',
      publications: 'Commentary on "Sec 73 Contract Act Damages Notice Procedures in Indian Civil Courts".',
      languages: ['English', 'Bengali', 'Hindi'],

      rating: 4.8,
      reviewCount: 33,
      verificationStatus: 'verified',
      submissionAgeHours: 18,
      credentialsUrl: 'kolkata_bar_certificate_sanya.pdf'
    },
    {
      id: 'lawyer-108',
      userId: 'user-lawyer-9',
      // 1. Basic Identity
      name: 'Adv. Rohan Mehta',
      designation: 'Lead Real Estate & Commercial Counsel',
      experience: 8,
      firm: 'Mehta Law Associates',
      city: 'Ahmedabad',
      state: 'Gujarat',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      consultationFee: 1900,

      // 2. Professional Credentials
      practiceAreas: ['Contract Review', 'Property & Real Estate', 'Compliance'],
      barCouncilNo: 'GUJ/1124/2017',
      enrolmentState: 'Gujarat',
      courtsPracticedIn: ['Gujarat High Court', 'Gujarat Real Estate Regulatory Authority'],
      education: 'LL.B (GNLU Gandhinagar)',
      certifications: 'Certified Supply Chain Legal Consultant',

      // 3. Experience & Track Record
      bio: 'Commercial real estate lawyer advising developers and tenants on lease drafting, land due diligence, and vendor supply chain contracts.',
      notableCases: 'Drafted 5-year master vendor agreement for Gujarat manufacturing hub covering supply chain SLAs.',
      achievements: 'GNLU Young Achiever Advocate Award (2022).',
      publications: 'Paper "Vendor Contract SLA Enforcement under Indian Commercial Law".',
      languages: ['English', 'Gujarati', 'Hindi'],

      rating: 4.7,
      reviewCount: 22,
      verificationStatus: 'verified',
      submissionAgeHours: 14,
      credentialsUrl: 'ahmedabad_bar_certificate_rohan.pdf'
    },
    {
      id: 'lawyer-109',
      userId: 'user-lawyer-10',
      // 1. Basic Identity
      name: 'Adv. Divya Sharma',
      designation: 'Senior Partner — Corporate Governance',
      experience: 14,
      firm: 'Sharma Legal Advisory',
      city: 'Jaipur',
      state: 'Rajasthan',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
      consultationFee: 2600,

      // 2. Professional Credentials
      practiceAreas: ['Corporate & Company Law', 'Contract Review', 'Family Law'],
      barCouncilNo: 'RAJ/6012/2011',
      enrolmentState: 'Rajasthan',
      courtsPracticedIn: ['Rajasthan High Court (Jaipur Bench)', 'Commercial Courts Jaipur'],
      education: 'LL.M (Corporate Jurisprudence, NLU Jodhpur)',
      certifications: 'Family Business Succession Mediator, Corporate Secretarial Fellow',

      // 3. Experience & Track Record
      bio: 'Senior advocate advising family businesses on corporate governance, succession planning, partnership deeds, and commercial arbitration.',
      notableCases: 'Mediated dispute resolution and succession restructuring for 70-year-old family textile conglomerate.',
      achievements: 'Rajasthan State Bar Council Legal Icon Award, Chair of Jaipur Business Law Forum.',
      publications: 'Book Chapter "Family Settlement Deeds & Partnership Restructuring in India".',
      languages: ['English', 'Hindi'],

      rating: 4.9,
      reviewCount: 57,
      verificationStatus: 'verified',
      submissionAgeHours: 6,
      credentialsUrl: 'jaipur_bar_certificate_divya.pdf'
    },
    {
      id: 'lawyer-110',
      userId: 'user-lawyer-11',
      // 1. Basic Identity
      name: 'Adv. Arjun Kapoor',
      designation: 'Principal Cyber Tech Counsel',
      experience: 6,
      firm: 'Kapoor Cyber Law Practice',
      city: 'Chandigarh',
      state: 'Punjab',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      consultationFee: 1800,

      // 2. Professional Credentials
      practiceAreas: ['Legal Notices', 'Cyber & Data Protection', 'Consumer Protection'],
      barCouncilNo: 'PH/4410/2019',
      enrolmentState: 'Punjab & Haryana',
      courtsPracticedIn: ['Punjab & Haryana High Court', 'Consumer Disputes Redressal Forum'],
      education: 'B.A. LL.B (Panjab University Chandigarh)',
      certifications: 'Cyber Crime Litigation & IT Act Practitioner',

      // 3. Experience & Track Record
      bio: 'Cyber tech legal practitioner focused on online fraud notices, e-commerce compliance, terms of service auditing, and consumer grievance notices.',
      notableCases: 'Represented 40 e-commerce sellers in platform dispute for wrongful account suspensions.',
      achievements: 'Chandigarh Tech Lawyers Forum Innovator Award.',
      publications: 'Article "E-Commerce Consumer Rules 2020: Grievance Redressal Mechanisms".',
      languages: ['English', 'Punjabi', 'Hindi'],

      rating: 4.6,
      reviewCount: 16,
      verificationStatus: 'verified',
      submissionAgeHours: 20,
      credentialsUrl: 'chandigarh_bar_certificate_arjun.pdf'
    }
  ],

  // 11 Seed Categories
  categories: [
    { id: 'cat-1', name: 'Contract Drafting', slug: 'contract-drafting', icon: 'FileText', active: true, order: 1 },
    { id: 'cat-2', name: 'Contract Review', slug: 'contract-review', icon: 'ShieldCheck', active: true, order: 2 },
    { id: 'cat-3', name: 'Legal Notices', slug: 'legal-notices', icon: 'AlertTriangle', active: true, order: 3 },
    { id: 'cat-4', name: 'Corporate & Company Law', slug: 'corporate-law', icon: 'Building2', active: true, order: 4 },
    { id: 'cat-5', name: 'Compliance', slug: 'compliance', icon: 'CheckSquare', active: true, order: 5 },
    { id: 'cat-6', name: 'IP & Trademarks', slug: 'ip-trademarks', icon: 'Lock', active: true, order: 6 },
    { id: 'cat-7', name: 'Employment & HR', slug: 'employment-hr', icon: 'Users', active: true, order: 7 },
    { id: 'cat-8', name: 'Property & Real Estate', slug: 'property-real-estate', icon: 'Home', active: true, order: 8 },
    { id: 'cat-9', name: 'Family Law', slug: 'family-law', icon: 'Heart', active: true, order: 9 },
    { id: 'cat-10', name: 'Consumer Protection', slug: 'consumer-protection', icon: 'ShoppingBag', active: true, order: 10 },
    { id: 'cat-11', name: 'Cyber & Data Protection', slug: 'cyber-data-protection', icon: 'Shield', active: true, order: 11 }
  ],

  // Services — Rich Fixed-Price Services Assigned to Each Verified Lawyer
  services: [
    {
      id: 'srv-001',
      title: 'Founders Agreement Drafting & Structuring',
      slug: 'founders-agreement-drafting',
      categoryId: 'cat-1',
      lawyerId: 'lawyer-101',
      lawyerName: 'Adv. Priya Malhotra',
      serviceType: 'fixed_price',
      price: 9999,
      timelineDays: 3,
      description: 'Comprehensive founders agreement covering equity vesting, IP assignment, decision-making rights, exit clauses, and dispute resolution for Indian tech startups.',
      requiredDocuments: ['Cap table draft', 'Co-founders IDs', 'Business description document'],
      status: 'active'
    },
    {
      id: 'srv-002',
      title: 'DPDP Act 2023 Privacy Audit & Data Fiduciary Notice',
      slug: 'dpdp-privacy-audit',
      categoryId: 'cat-11',
      lawyerId: 'lawyer-101',
      lawyerName: 'Adv. Priya Malhotra',
      serviceType: 'fixed_price',
      price: 14999,
      timelineDays: 5,
      description: 'Full data privacy audit under Digital Personal Data Protection Act 2023, data principal consent notices, and vendor DPA redlines.',
      requiredDocuments: ['Current Privacy Policy', 'Data Inventory List'],
      status: 'active'
    },
    {
      id: 'srv-003',
      title: 'Employment Agreement & POSH Policy Package',
      slug: 'employment-posh-suite',
      categoryId: 'cat-7',
      lawyerId: 'lawyer-102',
      lawyerName: 'Adv. Rajesh Iyer',
      serviceType: 'fixed_price',
      price: 7999,
      timelineDays: 2,
      description: 'Standard employment agreement template with non-compete, IP assignment, notice period clauses, and compliant POSH Internal Complaints Committee policy.',
      requiredDocuments: ['Company HR Handbook draft', 'Employee roles overview'],
      status: 'active'
    },
    {
      id: 'srv-003b',
      title: 'Trademark Filing & IP Prosecution Strategy',
      slug: 'trademark-filing-strategy',
      categoryId: 'cat-6',
      lawyerId: 'lawyer-102',
      lawyerName: 'Adv. Rajesh Iyer',
      serviceType: 'fixed_price',
      price: 6500,
      timelineDays: 3,
      description: 'Comprehensive trademark search, TM class identification under Nice Classification, application filing, and objection response strategy.',
      requiredDocuments: ['Logo PNG file', 'Business usage date proof'],
      status: 'active'
    },
    {
      id: 'srv-004',
      title: 'SaaS Master Services Agreement (MSA) Redline',
      slug: 'saas-msa-redline',
      categoryId: 'cat-2',
      lawyerId: 'lawyer-103',
      lawyerName: 'Adv. Vikramaditya Sen',
      serviceType: 'fixed_price',
      price: 4999,
      timelineDays: 2,
      description: 'Detailed clause-by-clause legal review of vendor MSA, SLA guarantees, limitation of liability per Sec 73 Indian Contract Act, and uncapped indemnity caps.',
      requiredDocuments: ['Vendor MSA Draft PDF/DOCX'],
      status: 'active'
    },
    {
      id: 'srv-004b',
      title: 'API Licensing & Software Distribution Legal Audit',
      slug: 'api-licensing-audit',
      categoryId: 'cat-11',
      lawyerId: 'lawyer-103',
      lawyerName: 'Adv. Vikramaditya Sen',
      serviceType: 'fixed_price',
      price: 5999,
      timelineDays: 3,
      description: 'Developer license agreements, API rate-limit liability terms, data security compliance, and open-source license audit.',
      requiredDocuments: ['API documentation', 'Terms of Service draft'],
      status: 'active'
    },
    {
      id: 'srv-005',
      title: 'Commercial Lease Agreement Due Diligence',
      slug: 'commercial-lease-due-diligence',
      categoryId: 'cat-8',
      lawyerId: 'lawyer-104',
      lawyerName: 'Adv. Ananya Deshmukh',
      serviceType: 'fixed_price',
      price: 6499,
      timelineDays: 3,
      description: 'Title search report, lock-in period verification, security deposit refund terms, and RERA compliance check for office commercial property leases.',
      requiredDocuments: ['Draft Lease Agreement', 'Property Title Deed copy'],
      status: 'active'
    },
    {
      id: 'srv-006',
      title: 'Trademark Registration & Opposition Filing',
      slug: 'trademark-registration-filing',
      categoryId: 'cat-6',
      lawyerId: 'lawyer-105',
      lawyerName: 'Adv. Meera Nair',
      serviceType: 'fixed_price',
      price: 5999,
      timelineDays: 4,
      description: 'Trademark clearance search, TM-A application filing with IPO India, examination report response, and opposition notice drafting.',
      requiredDocuments: ['Brand Logo file', 'User Affidavit draft'],
      status: 'active'
    },
    {
      id: 'srv-007',
      title: 'Startup Term Sheet & Share Subscription Review',
      slug: 'startup-term-sheet-review',
      categoryId: 'cat-4',
      lawyerId: 'lawyer-106',
      lawyerName: 'Adv. Kabir Reddy',
      serviceType: 'fixed_price',
      price: 8999,
      timelineDays: 3,
      description: 'Detailed analysis of investor term sheets, liquidation preference, liquidation overhang, drag-along/tag-along rights, and SHA drafting.',
      requiredDocuments: ['Investor Term Sheet draft', 'Cap Table'],
      status: 'active'
    },
    {
      id: 'srv-008',
      title: 'Breach of Contract Legal Notice Drafting',
      slug: 'breach-contract-legal-notice',
      categoryId: 'cat-3',
      lawyerId: 'lawyer-107',
      lawyerName: 'Adv. Sanya Banerjee',
      serviceType: 'fixed_price',
      price: 3499,
      timelineDays: 2,
      description: 'Formal legal notice issuance under Sec 73 Indian Contract Act for unpaid vendor invoices, breach of confidentiality, or service default.',
      requiredDocuments: ['Invoices/Agreement proof', 'Communication logs'],
      status: 'active'
    },
    {
      id: 'srv-009',
      title: 'Vendor Master Agreement & Supply Chain Contract',
      slug: 'vendor-master-agreement',
      categoryId: 'cat-1',
      lawyerId: 'lawyer-108',
      lawyerName: 'Adv. Rohan Mehta',
      serviceType: 'fixed_price',
      price: 5499,
      timelineDays: 3,
      description: 'Standard B2B vendor supply agreement covering delivery SLAs, defect liability periods, price escalation, and dispute arbitration.',
      requiredDocuments: ['Vendor commercial terms sheet'],
      status: 'active'
    },
    {
      id: 'srv-010',
      title: 'Family Business Succession & Partnership Deed',
      slug: 'family-business-succession',
      categoryId: 'cat-4',
      lawyerId: 'lawyer-109',
      lawyerName: 'Adv. Divya Sharma',
      serviceType: 'fixed_price',
      price: 11999,
      timelineDays: 4,
      description: 'Partnership deed restructuring, family settlement agreement, profit distribution terms, and arbitration resolution framework.',
      requiredDocuments: ['Existing Partnership Deed', 'Asset schedule'],
      status: 'active'
    },
    {
      id: 'srv-011',
      title: 'E-Commerce Terms of Service & Privacy Notice',
      slug: 'ecommerce-terms-privacy',
      categoryId: 'cat-11',
      lawyerId: 'lawyer-110',
      lawyerName: 'Adv. Arjun Kapoor',
      serviceType: 'fixed_price',
      price: 3999,
      timelineDays: 2,
      description: 'Consumer protection compliant website terms of use, return/cancellation policy, and data principal privacy policy per Consumer Protection Rules 2020.',
      requiredDocuments: ['Website URL', 'Payment gateway details'],
      status: 'active'
    }
  ],

  // AI Conversations
  aiConversations: [],

  // Documents
  documents: [],

  // Requests
  requests: [],

  // Courses
  courses: [
    {
      id: 'crs-1',
      title: 'Practical Contract Drafting under Indian Jurisprudence',
      category: 'Contract Drafting',
      instructor: 'Adv. Priya Malhotra',
      duration: '4 Weeks',
      level: 'Intermediate',
      description: 'Master drafting commercial agreements, indemnities, liability caps per Sec 73 Indian Contract Act 1872, and dispute resolution clauses.',
      modules: [
        {
          title: 'Module 1: Essential Contract Structure',
          lessons: [
            { id: 'les-101', title: '1.1 Recitals, Consideration & Essential Clauses', content: 'Under Section 10 of the Indian Contract Act 1872, all agreements are contracts if made by free consent of parties competent to contract...', completed: false },
            { id: 'les-102', title: '1.2 Indemnity & Limitation of Liability per Sec 73', content: 'Section 73 governs compensation for breach of contract. Direct vs consequential damages...', completed: false }
          ]
        }
      ]
    },
    {
      id: 'crs-2',
      title: 'Legal Research & AI Tools for Advocates & Law Students',
      category: 'Legal Tech',
      instructor: 'Adv. Vikramaditya Sen',
      duration: '2 Weeks',
      level: 'Beginner',
      description: 'Learn to use conversational legal AI tools, verify Bare Act citations, and maintain professional ethics and guardrails.',
      modules: [
        {
          title: 'Module 1: AI Prompting for Legal Research',
          lessons: [
            { id: 'les-201', title: '1.1 Formulating Specific Legal Queries & Citations', content: 'Effective legal prompt engineering requires specifying jurisdiction, applicable Bare Act sections, and Supreme Court precedent requirements...', completed: false }
          ]
        }
      ]
    },
    {
      id: 'crs-3',
      title: 'Company Law & MCA Statutory Compliance Overview',
      category: 'Corporate Law',
      instructor: 'Adv. Ananya Deshmukh',
      duration: '3 Weeks',
      level: 'Advanced',
      description: 'In-depth breakdown of Companies Act 2013 filings, MGT-7, AOC-4, board resolutions, and statutory register maintenance.',
      modules: [
        {
          title: 'Module 1: MCA Filing Compliance',
          lessons: [
            { id: 'les-301', title: '1.1 Annual Returns & Financial Statement Filings', content: 'Private limited companies in India must file Form MGT-7A and AOC-4 within statutory deadlines following AGM...', completed: false }
          ]
        }
      ]
    }
  ],

  // Certificates
  certificates: [],

  // Business Profile
  businessProfile: null,

  // Compliance Items
  complianceChecklist: [],

  // Contracts Register
  contracts: [],

  // Admin Users
  adminUsers: [],

  // Editorial Blogs
  blogs: [
    {
      id: 'blog-1',
      title: 'DPDP Act 2023 Compliance Guide for Indian Startups',
      slug: 'dpdp-act-2023-guide-startups',
      category: 'Data Privacy',
      author: 'Adv. Priya Malhotra',
      publishDate: '2026-08-05',
      readTime: '6 min read',
      excerpt: 'Key obligations for Data Fiduciaries, penalty provisions under DPDP Act 2023, and practical consent notice templates.'
    },
    {
      id: 'blog-2',
      title: 'Uncapped Indemnity Clauses & Section 73 Indian Contract Act',
      slug: 'uncapped-indemnity-section-73-contract-act',
      category: 'Contract Law',
      author: 'Adv. Vikramaditya Sen',
      publishDate: '2026-08-08',
      readTime: '8 min read',
      excerpt: 'How uncapped indemnities override statutory damages limitations under Indian jurisprudence and how to negotiate liability caps.'
    }
  ],

  // Audit Logs
  auditLogs: []
};
