import { Project, Application, StudentRecord, CompanyRecord, SystemAlert, Message, UserProfile } from '../types';

export const initialCurrentUser: UserProfile = {
  id: 'usr-fatih-01',
  name: 'Fatih Alfaluza',
  email: 'fatih@email.com',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  title: 'Digital Business Student',
  university: 'Universitas Logistik dan Bisnis Internasional (ULBI)',
  nim: '183240019',
  major: 'S1 Bisnis Digital',
  phone: '+62 812-3456-7890',
  bio: 'Mahasiswa Bisnis Digital semester akhir dengan ketertarikan tinggi pada Product Management, UI/UX Research, dan Digital Marketing.',
  skills: ['UI/UX Design', 'Market Analysis', 'Figma', 'Digital Marketing', 'Data Analysis'],
  isPremium: false,
  portfolioUrl: 'https://internspace.id/portfolio/fatih-alfaluza',
  resumeFileName: 'Resume_Fatih_Alfaluza_ULBI_2026.pdf'
};

export const sampleProjects: Project[] = [
  {
    id: 'proj-01',
    title: 'Market Research & Analysis Intern',
    company: 'TechNova Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    category: 'Digital Marketing',
    duration: '4 weeks',
    durationCategory: '2-4 weeks',
    location: 'Remote / Bandung',
    stipend: 'Rp 1.500.000',
    type: 'Micro Internship',
    status: 'Open',
    isFeatured: true,
    postedDate: 'Oct 10, 2026',
    deadline: 'Nov 05, 2026',
    description: 'Kami mencari mahasiswa yang antusias untuk membantu tim riset bisnis TechNova Solutions dalam memetakan lanskap kompetitor SaaS di Asia Tenggara. Anda akan menganalisis tren pasar, segmentasi pelanggan, serta menyusun rekomendasi strategi penetrasi produk baru.',
    responsibilities: [
      'Melakukan riset kompetitor sekunder pada 5 platform SaaS B2B terkemuka.',
      'Menyusun spreadsheet analisis komparasi fitur, pricing model, dan keunggulan kompetitif.',
      'Mengolah hasil survei pelanggan ke dalam visualisasi diagram dan slide presentasi.',
      'Menyajikan insight temuan riset mingguan kepada tim Product & Marketing.'
    ],
    requirements: [
      'Mahasiswa aktif minimal semester 4 jurusan Bisnis Digital, Manajemen, Ilmu Komunikasi, atau serumpun.',
      'Memiliki kemampuan analitis yang tajam dan familiar dengan Google Workspace / Excel.',
      'Mampu berkomunikasi dengan baik dan bekerja secara mandiri dengan bimbingan mentor.',
      'Memiliki komitmen waktu 15-20 jam per minggu selama 4 minggu.'
    ],
    skillsRequired: ['Market Research', 'Competitor Analysis', 'Data Visualization', 'Slide Deck', 'Business Model'],
    aboutCompany: {
      description: 'TechNova Solutions adalah software house dan konsultan transformasi digital yang membantu UMKM dan korporasi mengadopsi solusi komputasi awan dan sistem otomasi terintegrasi.',
      industry: 'Software & Technology',
      employees: '50-100 karyawan',
      website: 'https://technova.example.com',
      verified: true
    }
  },
  {
    id: 'proj-02',
    title: 'Frontend UI Development for Landing Page',
    company: 'TechNova Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    category: 'Tech & Programming',
    duration: '3 weeks',
    durationCategory: '2-4 weeks',
    location: 'Remote',
    stipend: 'Rp 1.800.000',
    type: 'Micro Internship',
    status: 'Open',
    isFeatured: true,
    postedDate: 'Oct 08, 2026',
    deadline: 'Oct 30, 2026',
    description: 'Membangun komponen antarmuka landing page responsif menggunakan React dan Tailwind CSS berdasarkan wireframe Figma yang telah disediakan.',
    responsibilities: [
      'Mengonversi mockup Figma ke komponen React yang modular dan bersih.',
      'Menjamin performa antarmuka cepat, responsif di mobile dan desktop.',
      'Melakukan integrasi form validation dan micro-interactions.'
    ],
    requirements: [
      'Mahasiswa Informatika, Sistem Informasi, atau Bisnis Digital peminatan Tech.',
      'Menguasai React, Tailwind CSS, dan Git.'
    ],
    skillsRequired: ['React JS', 'Tailwind CSS', 'Figma to Code', 'TypeScript'],
    aboutCompany: {
      description: 'TechNova Solutions adalah inovator digital terkemuka penyedia solusi enterprise.',
      industry: 'Software Development',
      employees: '50-100 karyawan',
      website: 'https://technova.example.com',
      verified: true
    }
  },
  {
    id: 'proj-03',
    title: 'Social Media Campaign & Content Design',
    company: 'Creative Spark Studio',
    companyLogo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=120&auto=format&fit=crop&q=80',
    category: 'Graphic & Design',
    duration: '4 weeks',
    durationCategory: '2-4 weeks',
    location: 'Remote',
    stipend: 'Rp 1.400.000',
    type: 'Micro Internship',
    status: 'Open',
    postedDate: 'Oct 11, 2026',
    deadline: 'Nov 02, 2026',
    description: 'Merancang aset visual campaign peluncuran produk fashion berkelanjutan untuk Instagram Carousel dan TikTok carousel.',
    responsibilities: [
      'Membuat 12 desain feed/carousel dan 6 visual story di Figma/Canva.',
      'Menjaga konsistensi tone of voice dan brand guidelines.',
      'Bekerjasama dengan copywriter dalam penulisan headline visual.'
    ],
    requirements: [
      'Portofolio desain grafis atau media sosial.',
      'Familiar dengan Figma, Photoshop, atau Illustrator.'
    ],
    skillsRequired: ['Figma', 'Visual Design', 'Social Media Branding', 'Canva'],
    aboutCompany: {
      description: 'Creative Spark Studio adalah creative boutique agency di bidang digital branding.',
      industry: 'Creative & Advertising',
      employees: '20-40 karyawan',
      website: 'https://creativespark.example.com',
      verified: true
    }
  },
  {
    id: 'proj-04',
    title: 'AI Research Assistant (NLP Benchmarking)',
    company: 'DataSphere Labs',
    companyLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
    category: 'Tech & Programming',
    duration: '6 weeks',
    durationCategory: '1-2 months',
    location: 'Hybrid / Jakarta',
    stipend: 'Rp 2.500.000',
    type: 'Micro Internship',
    status: 'Open',
    postedDate: 'Oct 05, 2026',
    deadline: 'Oct 28, 2026',
    description: 'Membantu pengujian performa model LLM bahasa Indonesia pada dataset industri e-commerce dan logistik.',
    responsibilities: [
      'Menjalankan pipeline testing prompt & evaluasi akurasi jawaban model.',
      'Melakukan anotasi 500 sampel teks percakapan pelanggan.',
      'Menyusun laporan error analysis mingguan.'
    ],
    requirements: [
      'Mahasiswa Teknik Informatika, Sains Data, atau Bisnis Digital peminatan AI.',
      'Familiar dengan dasar Python atau prompt engineering.'
    ],
    skillsRequired: ['Python', 'Prompt Engineering', 'Data Annotation', 'LLM Evaluation'],
    aboutCompany: {
      description: 'DataSphere Labs berfokus pada riset terapan kecerdasan buatan untuk transformasi industri.',
      industry: 'Artificial Intelligence & Analytics',
      employees: '30-50 karyawan',
      website: 'https://datasphere.example.com',
      verified: true
    }
  },
  {
    id: 'proj-05',
    title: 'Sustainability Tracker (ESG UI Design)',
    company: 'EcoSolutions Inc.',
    companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&auto=format&fit=crop&q=80',
    category: 'Graphic & Design',
    duration: '4 weeks',
    durationCategory: '2-4 weeks',
    location: 'Remote',
    stipend: 'Rp 1.600.000',
    type: 'Micro Internship',
    status: 'Open',
    postedDate: 'Oct 12, 2026',
    deadline: 'Nov 10, 2026',
    description: 'Membuat rancangan dashboard analitik emisi karbon untuk klien B2B industri logistik.',
    responsibilities: [
      'Merancang user journey dan wireframe dashboard ESG.',
      'Menyiapkan komponen design system di Figma berstandar enterprise.'
    ],
    requirements: [
      'Mahasiswa Desain Komunikasi Visual atau Sistem Informasi.',
      'Portofolio UI dashboard.'
    ],
    skillsRequired: ['UI/UX', 'Figma', 'Dashboard Design', 'Design System'],
    aboutCompany: {
      description: 'EcoSolutions Inc. berfokus pada teknologi hijau dan pelaporan jejak karbon logistik.',
      industry: 'Environmental Technology',
      employees: '45 karyawan',
      website: 'https://ecosolutions.example.com',
      verified: true
    }
  },
  {
    id: 'proj-06',
    title: 'Short Video Production & Motion Graphic',
    company: 'Synapse Media Group',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
    category: 'Video & Animation',
    duration: '3 weeks',
    durationCategory: '2-4 weeks',
    location: 'Remote',
    stipend: 'Rp 1.500.000',
    type: 'Micro Internship',
    status: 'Open',
    postedDate: 'Oct 09, 2026',
    deadline: 'Nov 01, 2026',
    description: 'Editing dan animasi motion graphic untuk 4 video promosi edukasi finansial mahasiswa.',
    responsibilities: [
      'Membuat storyboard dan motion graphic typography.',
      'Editing footage video berformat vertikal 9:16 untuk Reels & TikTok.'
    ],
    requirements: [
      'Mahasiswa aktif dengan skill CapCut Pro, Premiere Pro, atau After Effects.',
      'Kreatif dan memahami tren video pendek saat ini.'
    ],
    skillsRequired: ['Video Editing', 'Motion Graphics', 'CapCut Pro', 'Storyboarding'],
    aboutCompany: {
      description: 'Synapse Media Group adalah digital content publisher terkemuka generasi muda.',
      industry: 'Media & Entertainment',
      employees: '60 karyawan',
      website: 'https://synapsemedia.example.com',
      verified: true
    }
  }
];

export const sampleApplications: Application[] = [
  {
    id: 'app-01',
    projectId: 'proj-02',
    projectTitle: 'Frontend Development for Landing Page',
    companyName: 'TechNova Solutions',
    studentId: 'usr-fatih-01',
    studentName: 'Fatih Alfaluza',
    studentUniversity: 'Universitas Logistik dan Bisnis Internasional (ULBI)',
    studentMajor: 'S1 Bisnis Digital',
    appliedDate: 'Oct 12, 2026',
    status: 'In Progress',
    progress: 65,
    dueDate: 'Oct 26, 2026',
    answers: {
      whyInterested: 'TechNova adalah pionir dalam transformasi digital. Saya ingin mengaplikasikan keahlian frontend React dan UI/UX yang saya kembangkan di kampus ke proyek nyata.',
      challengeSolved: 'Saya pernah merancang prototype interaktif di Figma dan mengimplementasikannya ke dalam React dengan sistem navigasi responsif dan styling Tailwind CSS.',
      availability: 'Tersedia 15-20 jam/minggu (Senin - Jumat sore dan akhir pekan).'
    },
    deliverables: [
      {
        title: 'Draft Wireframe & Hero Component Implementation',
        submittedAt: 'Oct 15, 2026',
        fileUrl: 'https://github.com/fatih-ulbi/landing-page-component',
        status: 'Approved'
      },
      {
        title: 'Responsive Grid Layout & Navbar Integration',
        submittedAt: 'Oct 18, 2026',
        fileUrl: 'https://internspace-preview.dev/fatih-work-v1',
        status: 'Pending Review'
      }
    ]
  },
  {
    id: 'app-02',
    projectId: 'proj-01',
    projectTitle: 'Market Research Data Analysis',
    companyName: 'Global Insights Inc.',
    studentId: 'usr-fatih-01',
    studentName: 'Fatih Alfaluza',
    studentUniversity: 'Universitas Logistik dan Bisnis Internasional (ULBI)',
    studentMajor: 'S1 Bisnis Digital',
    appliedDate: 'Oct 09, 2026',
    status: 'Revision Pending',
    progress: 90,
    dueDate: 'Oct 20, 2026',
    answers: {
      whyInterested: 'Saya memiliki minat mendalam pada riset pasar dan analisis kuantitatif bisnis digital.',
      challengeSolved: 'Berhasil mengolah data survei 100+ responden pada riset proyek integrasi menggunakan pivot table dan visualisasi statistik.',
      availability: 'Tersedia segera hingga proyek selesai.'
    },
    deliverables: [
      {
        title: 'Final Competitor Benchmark Deck (v2)',
        submittedAt: 'Oct 16, 2026',
        fileUrl: 'https://internspace-storage.com/files/fatih_market_deck_v2.pdf',
        status: 'Pending Review'
      }
    ]
  },
  {
    id: 'app-03',
    projectId: 'proj-completed-01',
    projectTitle: 'Q3 Social Media Content Calendar Creation',
    companyName: 'TechNova Inc.',
    studentId: 'usr-fatih-01',
    studentName: 'Fatih Alfaluza',
    studentUniversity: 'Universitas Logistik dan Bisnis Internasional (ULBI)',
    studentMajor: 'S1 Bisnis Digital',
    appliedDate: 'Sep 01, 2026',
    status: 'Completed',
    progress: 100,
    dueDate: 'Sep 25, 2026',
    answers: {
      whyInterested: 'Ingin mengasah kemampuan social media planning di industri B2B tech.',
      challengeSolved: 'Menyusun 30 konten tematik dengan engagement rate meningkat 15%.',
      availability: 'Full commitment.'
    },
    rating: {
      quality: 5,
      communication: 5,
      punctuality: 5,
      feedbackText: 'Fatih menunjukkan pemahaman riset pasar yang luar biasa tajam, ketepatan waktu pengiriman deliverable yang sangat disiplin, dan etos kerja profesional setara konsultan muda!',
      isPublic: true,
      ratedAt: 'Sep 27, 2026'
    },
    certificateId: '001-001/HIMABIG-ULBI/Str/04/2026'
  }
];

export const sampleStudentsDirectory: StudentRecord[] = [
  {
    id: 'std-01',
    name: 'Fatih Alfaluza',
    email: 'fatih@email.com',
    university: 'Universitas Logistik dan Bisnis Internasional (ULBI)',
    major: 'S1 Bisnis Digital',
    status: 'Active',
    registeredDate: 'Oct 01, 2026',
    completedProjects: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-02',
    name: 'Anisa Aulia Rita Putri',
    email: 'anisa@email.com',
    university: 'Universitas Logistik dan Bisnis Internasional (ULBI)',
    major: 'S1 Bisnis Digital',
    status: 'Active',
    registeredDate: 'Oct 01, 2026',
    completedProjects: 4,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-03',
    name: 'Alex Chen',
    email: 'alex.chen@stanford.edu',
    university: 'Stanford University',
    major: 'Computer Science',
    status: 'Active',
    registeredDate: 'Oct 03, 2026',
    completedProjects: 3,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-04',
    name: 'Samantha Miller',
    email: 'samantha.m@rice.edu',
    university: 'Rice University',
    major: 'Marketing & Media',
    status: 'Active',
    registeredDate: 'Oct 06, 2026',
    completedProjects: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-05',
    name: 'David Kim',
    email: 'david.k@techinstitute.edu',
    university: 'Tech Institute',
    major: 'Software Engineering',
    status: 'In Review',
    registeredDate: 'Oct 11, 2026',
    completedProjects: 1,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-06',
    name: 'Elena Jones',
    email: 'elena.j@collegeofarts.edu',
    university: 'College of Arts',
    major: 'Graphic Design',
    status: 'Active',
    registeredDate: 'Oct 12, 2026',
    completedProjects: 4,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80'
  }
];

export const samplePartnerCompanies: CompanyRecord[] = [
  {
    id: 'comp-01',
    name: 'TechNova Solutions',
    email: 'hr@technovasolutions.com',
    industry: 'Software & Technology',
    activeProjects: 4,
    totalHired: 18,
    rating: 4.9,
    verified: true,
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    joinedDate: 'Jan 2026'
  },
  {
    id: 'comp-02',
    name: 'Acme Corp',
    email: 'contact@acmecorp.com',
    industry: 'Industrial & Manufacturing',
    activeProjects: 3,
    totalHired: 14,
    rating: 4.8,
    verified: true,
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
    joinedDate: 'Feb 2026'
  },
  {
    id: 'comp-03',
    name: 'Global Finance LLC',
    email: 'partners@globalfinance.com',
    industry: 'Financial Technology',
    activeProjects: 5,
    totalHired: 22,
    rating: 4.7,
    verified: true,
    logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=120&auto=format&fit=crop&q=80',
    joinedDate: 'Mar 2026'
  },
  {
    id: 'comp-04',
    name: 'EcoSolutions Inc.',
    email: 'info@ecosolutions.org',
    industry: 'CleanTech & ESG',
    activeProjects: 2,
    totalHired: 8,
    rating: 4.9,
    verified: true,
    logo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&auto=format&fit=crop&q=80',
    joinedDate: 'Apr 2026'
  }
];

export const sampleSystemAlerts: SystemAlert[] = [
  {
    id: 'alert-01',
    title: 'New company registration: Solaris Tech',
    detail: 'Menunggu review profil dan verifikasi kelayakan dokumen legalitas usaha.',
    timeAgo: '10 minutes ago',
    type: 'info'
  },
  {
    id: 'alert-02',
    title: 'Project reported: Crypto Miner v2',
    detail: 'Laporan dugaan pelanggaran pedoman proyek micro-internship oleh mahasiswa.',
    timeAgo: '2 hours ago',
    type: 'warning'
  },
  {
    id: 'alert-03',
    title: 'System Backup completed successfully',
    detail: 'Database snapshot harian dan file portfolio cloud tersinkronisasi tanpa error.',
    timeAgo: '5 hours ago',
    type: 'success'
  }
];

export const sampleMessages: Message[] = [
  {
    id: 'msg-01',
    senderId: 'sarah-jenkins',
    senderName: 'Sarah Jenkins',
    senderRole: 'TechNova Solutions - Senior Product Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    text: 'Halo Fatih! Kami sudah meninjau draft landing page-mu. Komposisinya rapi sekali, silakan lanjutkan ke integrasi responsive mobile ya!',
    timestamp: '10:42 AM',
    isUnread: true
  },
  {
    id: 'msg-02',
    senderId: 'mark-davies',
    senderName: 'Mark Davies',
    senderRole: 'Global Insights Inc. - Data Analyst Mentor',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    text: 'Thanks for submitting the revision table. Hanya perlu penyesuaian sedikit di kolom CAGR.',
    timestamp: 'Yesterday',
    isUnread: false
  },
  {
    id: 'msg-03',
    senderId: 'system-notif',
    senderName: 'InternSpace Team',
    senderRole: 'System Notification',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    text: 'Selamat! Sertifikat Digital untuk proyek Q3 Content Calendar telah diterbitkan.',
    timestamp: 'Oct 10',
    isUnread: false
  }
];
