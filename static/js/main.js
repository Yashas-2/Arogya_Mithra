// ArogyaMitra AI - Main JavaScript
// World-class interactions and animations

// CSRF Token handling for Django
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

// Add CSRF token to all fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
    if (args[1] && (args[1].method === 'POST' || args[1].method === 'PUT' || args[1].method === 'DELETE')) {
        args[1].headers = args[1].headers || {};
        args[1].headers['X-CSRFToken'] = csrftoken;
    }
    return originalFetch.apply(this, args);
};

// Language Translation Object (Simple Implementation)
const translations = {
    en: {
        // Navigation
        home: 'Home',
        checkEligibility: 'Check Eligibility',
        myReports: 'My Reports',
        aiAnalysis: 'AI Analysis',
        upgrade: 'Upgrade ₹49',
        
        // Common Buttons
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        download: 'Download',
        upload: 'Upload',
        
        // Form Labels
        username: 'Username',
        password: 'Password',
        email: 'Email',
        name: 'Name',
        fullName: 'Full Name',
        age: 'Age',
        district: 'District',
        phoneNumber: 'Phone Number',
        aadhaarLast4: 'Aadhaar Last 4 Digits',
        reportTitle: 'Report Title',
        scanType: 'Scan Type',
        hospitalName: 'Hospital Name',
        testDate: 'Test Date',
        confirmPassword: 'Confirm Password',
        department: 'Department',
        licenseNumber: 'License Number',
        
        // Login Page
        loginTitle: 'ArogyaMitra AI',
        selectLoginType: 'Select your login type',
        patient: 'Patient',
        hospitalStaff: 'Hospital Staff',
        secureLogin: 'Secure Login',
        dontHaveAccount: 'Don\'t have an account?',
        registerNow: 'Register Now',
        backToHome: 'Back to Home',
        
        // Register Page
        createAccount: 'Create Account',
        selectAccountType: 'Select your account type to get started',
        patientRegistration: 'Patient Registration',
        hospitalStaffRegistration: 'Hospital Staff Registration',
        registerAsPatient: 'Register as Patient',
        registerAsHospital: 'Register as Hospital Staff',
        selectDistrict: 'Select District',
        selectStatus: 'Select Status',
        selectDisease: 'Select Disease',
        bpl: 'Below Poverty Line (BPL)',
        apl: 'Above Poverty Line (APL)',
        cardiovascular: 'Cardiovascular',
        diabetes: 'Diabetes',
        cancer: 'Cancer',
        neurological: 'Neurological',
        orthopedic: 'Orthopedic',
        respiratory: 'Respiratory',
        kidney: 'Kidney Disease',
        haveRationCard: 'Have Ration Card?',
        haveAadhaar: 'Have Aadhaar Card?',
        alreadyHaveAccount: 'Already have an account?',
        signIn: 'Sign In',
        
        // Home Page
        karnatakaPlatform: '<i class="fas fa-star"></i> Karnataka\'s #1 Health AI Platform',
        yourHealth: 'Your Health. <span class="gradient-text">Simplified.</span><br>By <span class="gradient-text">AI Intelligence.</span>',
        heroSubtitle: 'Check Government Scheme Eligibility | Store Reports Permanently | Understand Your Health in Simple Language',
        loginSignup: '<i class="fas fa-sign-in-alt"></i> Login / Register',
        tryWithoutLogin: '<i class="fas fa-check-circle"></i> Try Without Login',
        threeFeaturesTitle: '<h2>Three Powerful Features. One Platform.</h2><p style="color: var(--gray-300); margin-top: 1rem;">Everything you need to make better health decisions</p>',
        schemeCheckerTitle: 'Scheme Eligibility Checker',
        schemeCheckerDesc: 'Find out which Karnataka and Central Government health schemes you qualify for in moments. AI-powered recommendations based on your age, district, income, and medical condition.',
        checkNow: 'Check Now →',
        medicalVaultTitle: 'Life Health Vault',
        medicalVaultDesc: 'Upload MRI, CT, blood reports, X-rays - everything in one secure place. Access anytime, anywhere. No more running to hospitals for lost reports.',
        uploadReports: 'Upload Reports →',
        aiInterpreterTitle: 'AI Report Interpreter',
        aiInterpreterDesc: 'Don\'t understand medical terms? Our AI explains your reports in simple Kannada or English. Know what\'s abnormal, what to eat, and when to see a doctor.',
        analyzeReport: 'Analyze Report →',
        howItWorksTitle: 'How ArogyaMitra Works',
        enterDetails: 'Enter Details',
        enterDetailsDesc: 'Age, District, Disease Type',
        aiAnalysisStep: 'AI Analysis',
        aiAnalysisDesc: 'Gemini AI finds the best schemes',
        getResults: 'Get Results',
        getResultsDesc: 'Eligibility + Application Steps',
        applyBenefit: 'Apply & Get Benefit',
        applyBenefitDesc: 'Get Treatment Covered',
        unlockPower: 'Unlock Unlimited Power',
        premiumFeatures: 'Unlimited Uploads • Unlimited AI Analysis • No Ads • Priority Support',
        revenueText: '<i class="fas fa-fire"></i> 2,000 Users = ₹98,000 Recurring Revenue For You',
        upgradeToPremium: 'Upgrade to Premium',
        footerTitle: 'ArogyaMitra AI',
        footerText: 'Empowering Karnataka Citizens with AI-Powered Health Intelligence',
        copyright: '© 2025 ArogyaMitra AI. Made with ❤️ for Karnataka',
        
        // Scheme Checker Page
        checkYourEligibility: 'Check Your <span class="gradient-text">Eligibility</span>',
        aiWillFindBestSchemes: 'AI will find the best Karnataka & Central Government health schemes for you',
        enterYourDetails: 'Enter Your Details',
        yourAge: 'Your Age',
        districtKarnataka: 'District (Karnataka)',
        selectYourDistrict: 'Select your district',
        economicStatus: 'Economic Status',
        bpl: 'BPL',
        belowPovertyLine: 'Below Poverty Line',
        apl: 'APL',
        abovePovertyLine: 'Above Poverty Line',
        documentAvailability: 'Document Availability',
        rationCard: 'Ration Card',
        aadhaarCard: 'Aadhaar Card',
        diseaseMedicalCondition: 'Disease / Medical Condition',
        selectCondition: 'Select condition',
        preferredLanguage: 'Preferred Language',
        english: 'English',
        kannada: 'ಕನ್ನಡ',
        checkEligibilityWithAI: 'Check Eligibility with AI',
        aiAnalyzing: 'AI is analyzing...',
        findingBestSchemes: 'Finding the best schemes for you',
        karnatakaScheme: 'Karnataka Scheme',
        eligibilityScore: 'Eligibility Score',
        whyYoureEligible: 'Why You\'re Eligible',
        requiredDocuments: 'Required Documents',
        howToApply: 'How to Apply',
        checkAnotherScheme: 'Check Another Scheme',
        
        // Messages
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
        welcome: 'Welcome',
        
        // Form Placeholders
        enterUsername: 'Enter your username',
        enterPassword: 'Enter your password',
        enterName: 'Enter your full name',
        enterEmail: 'Enter your email',
        enterAge: 'Enter your age',
        enterPhone: 'Enter phone number',
        enterAadhaar: 'Last 4 digits of Aadhaar',
        selectDistrict: 'Select your district',
        selectScanType: 'Select scan type',
        
        // District Names
        bagalkot: 'Bagalkot',
        ballari: 'Ballari',
        belagavi: 'Belagavi',
        bengaluruRural: 'Bengaluru Rural',
        bengaluruUrban: 'Bengaluru Urban',
        bidar: 'Bidar',
        chamarajanagar: 'Chamarajanagar',
        chikkaballapur: 'Chikkaballapur',
        chikkamagaluru: 'Chikkamagaluru',
        chitradurga: 'Chitradurga',
        dakshinaKannada: 'Dakshina Kannada',
        davangere: 'Davangere',
        dharwad: 'Dharwad',
        gadag: 'Gadag',
        hassan: 'Hassan',
        haveri: 'Haveri',
        kalaburagi: 'Kalaburagi',
        kodagu: 'Kodagu',
        kolar: 'Kolar',
        koppal: 'Koppal',
        mandya: 'Mandya',
        mysuru: 'Mysuru',
        raichur: 'Raichur',
        ramanagara: 'Ramanagara',
        shimoga: 'Shimoga',
        tumakuru: 'Tumakuru',
        udupi: 'Udupi',
        uttarakannada: 'Uttarakannada',
        vijayapura: 'Vijayapura',
        yadgir: 'Yadgir',
        
        // Additional UI Elements
        select: 'Select',
        chooseFile: 'Choose File',
        noFileChosen: 'No file chosen',
        browse: 'Browse',
        next: 'Next',
        previous: 'Previous',
        finish: 'Finish',
        close: 'Close',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        ascending: 'Ascending',
        descending: 'Descending',
        refresh: 'Refresh',
        reset: 'Reset',
        confirm: 'Confirm',
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        continue: 'Continue',
        back: 'Back',
        forward: 'Forward',
        print: 'Print',
        share: 'Share',
        copy: 'Copy',
        paste: 'Paste',
        cut: 'Cut',
        undo: 'Undo',
        redo: 'Redo',
        selectAll: 'Select All',
        clear: 'Clear',
        add: 'Add',
        remove: 'Remove',
        update: 'Update',
        create: 'Create',
        open: 'Open',
        close: 'Close',
        send: 'Send',
        receive: 'Receive',
        import: 'Import',
        export: 'Export',
        settings: 'Settings',
        help: 'Help',
        about: 'About',
        contact: 'Contact',
        feedback: 'Feedback',
        rate: 'Rate',
        review: 'Review',
        comment: 'Comment',
        reply: 'Reply',
        like: 'Like',
        dislike: 'Dislike',
        follow: 'Follow',
        unfollow: 'Unfollow',
        subscribe: 'Subscribe',
        unsubscribe: 'Unsubscribe',
        notifications: 'Notifications',
        profile: 'Profile',
        account: 'Account',
        dashboard: 'Dashboard',
        reports: 'Reports',
        analytics: 'Analytics',
        statistics: 'Statistics',
        overview: 'Overview',
        details: 'Details',
        summary: 'Summary',
        history: 'History',
        recent: 'Recent',
        popular: 'Popular',
        trending: 'Trending',
        new: 'New',
        old: 'Old',
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        completed: 'Completed',
        inProgress: 'In Progress',
        notStarted: 'Not Started',
        cancelled: 'Cancelled',
        failed: 'Failed',
        success: 'Success',
        warning: 'Warning',
        info: 'Info',
        danger: 'Danger',
        primary: 'Primary',
        secondary: 'Secondary',
        success: 'Success',
        danger: 'Danger',
        warning: 'Warning',
        info: 'Info',
        light: 'Light',
        dark: 'Dark',
        white: 'White',
        black: 'Black',
        red: 'Red',
        green: 'Green',
        blue: 'Blue',
        yellow: 'Yellow',
        purple: 'Purple',
        orange: 'Orange',
        pink: 'Pink',
        brown: 'Brown',
        gray: 'Gray',
        silver: 'Silver',
        gold: 'Gold',
        bronze: 'Bronze',
        platinum: 'Platinum',
        diamond: 'Diamond',
        ruby: 'Ruby',
        emerald: 'Emerald',
        sapphire: 'Sapphire',
        topaz: 'Topaz',
        amethyst: 'Amethyst',
        jade: 'Jade',
        pearl: 'Pearl',
        coral: 'Coral',
        quartz: 'Quartz',
        obsidian: 'Obsidian',
        granite: 'Granite',
        marble: 'Marble',
        limestone: 'Limestone',
        sandstone: 'Sandstone',
        slate: 'Slate',
        shale: 'Shale',
        basalt: 'Basalt',
        andesite: 'Andesite',
        rhyolite: 'Rhyolite',
        gabbro: 'Gabbro',
        diorite: 'Diorite',
        peridotite: 'Peridotite',
        dunite: 'Dunite',
        eclogite: 'Eclogite',
        blueschist: 'Blueschist',
        greenschist: 'Greenschist',
        amphibolite: 'Amphibolite',
        gneiss: 'Gneiss',
        schist: 'Schist',
        phyllite: 'Phyllite',
        migmatite: 'Migmatite'
    },
    kn: {
        // Navigation
        home: 'ಮುಖಪುಟ',
        checkEligibility: 'ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ',
        myReports: 'ನನ್ನ ವರದಿಗಳು',
        aiAnalysis: 'AI ವಿಶ್ಲೇಷಣೆ',
        upgrade: 'ಅಪ್‌ಗ್ರೇಡ್ ₹49',
        
        // Common Buttons
        login: 'ಲಾಗಿನ್',
        register: 'ನೋಂದಾಯಿಸಿ',
        logout: 'ಲಾಗ್ ಔಟ್',
        submit: 'ಸಲ್ಲಿಸಿ',
        cancel: 'ರದ್ದುಮಾಡಿ',
        save: 'ಉಳಿಸಿ',
        delete: 'ಅಳಿಸಿ',
        edit: 'ಸಂಪಾದಿಸಿ',
        view: 'ವೀಕ್ಷಿಸಿ',
        download: 'ಡೌನ್‌ಲೋಡ್',
        upload: 'ಅಪ್‌ಲೋಡ್',
        
        // Form Labels
        username: 'ಬಳಕೆದಾರ ಹೆಸರು',
        password: 'ಪಾಸ್‌ವರ್ಡ್',
        email: 'ಇಮೇಲ್',
        name: 'ಹೆಸರು',
        fullName: 'ಪೂರ್ಣ ಹೆಸರು',
        age: 'ವಯಸ್ಸು',
        district: 'ಜಿಲ್ಲೆ',
        phoneNumber: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
        aadhaarLast4: 'ಆಧಾರ್ ಕೊನೆ 4 ಅಂಕೆಗಳು',
        reportTitle: 'ವರದಿ ಶೀರ್ಷಿಕೆ',
        scanType: 'ಸ್ಕ್ಯಾನ್ ಪ್ರಕಾರ',
        hospitalName: 'ಆಸ್ಪತ್ರೆಯ ಹೆಸರು',
        testDate: 'ಪರೀಕ್ಷೆ ದಿನಾಂಕ',
        confirmPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ',
        department: 'ವಿಭಾಗ',
        licenseNumber: 'ಲೈಸೆನ್ಸ್ ಸಂಖ್ಯೆ',
        
        // Login Page
        loginTitle: 'ಆರೋಗ್ಯಮಿತ್ರ AI',
        selectLoginType: 'ನಿಮ್ಮ ಲಾಗಿನ್ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        patient: 'ರೋಗಿ',
        hospitalStaff: 'ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿ',
        secureLogin: 'ಸುರಕ್ಷಿತ ಲಾಗಿನ್',
        dontHaveAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?',
        registerNow: 'ಈಗ ನೋಂದಾಯಿಸಿ',
        backToHome: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
        
        // Register Page
        createAccount: 'ಖಾತೆಯನ್ನು ರಚಿಸಿ',
        selectAccountType: 'ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಖಾತೆ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        patientRegistration: 'ರೋಗಿ ನೋಂದಣಿ',
        hospitalStaffRegistration: 'ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿ ನೋಂದಣಿ',
        registerAsPatient: 'ರೋಗಿಯಾಗಿ ನೋಂದಾಯಿಸಿ',
        registerAsHospital: 'ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿಯಾಗಿ ನೋಂದಾಯಿಸಿ',
        selectDistrict: 'ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        selectStatus: 'ಸ್ಥಿತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        selectDisease: 'ರೋಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        bpl: 'ಕಾಲಿಕ ರೇಖೆಯ ಕೆಳಗೆ (ಬೀಪಿಎಲ್)',
        apl: 'ಕಾಲಿಕ ರೇಖೆಯ ಮೇಲೆ (ಆಪಿಎಲ್)',
        cardiovascular: 'ಹೃದಯಸಂಬಂಧಿತ',
        diabetes: 'ಮಧುಮೇಹ',
        cancer: 'ಕ್ಯಾನ್ಸರ್',
        neurological: 'ನರಮಾರ್ಗ',
        orthopedic: 'ಮೂಳೆಯಂತ್ರ',
        respiratory: 'ಶ್ವಾಸಕೋಶ',
        kidney: 'ಮೂತ್ರಪಿಂಡ',
        haveRationCard: 'ರೇಟಿಯನ್ ಕಾರ್ಡ್ ಇದೆಯೇ?',
        haveAadhaar: 'ಆಧಾರ್ ಕಾರ್ಡ್ ಇದೆಯೇ?',
        alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
        signIn: 'ಸೈನ್ ಇನ್',
        
        // Home Page
        karnatakaPlatform: '<i class="fas fa-star"></i> ಕರ್ನಾಟಕದ #1 ಆರೋಗ್ಯ AI ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
        yourHealth: 'ನಿಮ್ಮ ಆರೋಗ್ಯ. <span class="gradient-text">ಸರಳಗೊಳಿಸಲಾಗಿದೆ.</span><br><span class="gradient-text">AI ಬುದ್ಧಿಮತ್ತೆಯಿಂದ.</span>',
        heroSubtitle: 'ಸರ್ಕಾರಿ ಯೋಜನೆ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ | ವರದಿಗಳನ್ನು ಶಾಶ್ವತವಾಗಿ ಸಂಗ್ರಹಿಸಿ | ನಿಮ್ಮ ಆರೋಗ್ಯವನ್ನು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ',
        loginSignup: '<i class="fas fa-sign-in-alt"></i> ಲಾಗಿನ್ / ನೋಂದಾಯಿಸಿ',
        tryWithoutLogin: '<i class="fas fa-check-circle"></i> ಲಾಗಿನ್ ಇಲ್ಲದೆ ಪ್ರಯತ್ನಿಸಿ',
        threeFeaturesTitle: '<h2>ಮೂರು ಶಕ್ತಿಶಾಲಿ ವೈಶಿಷ್ಟ್ಯಗಳು. ಒಂದೇ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್.</h2><p style="color: var(--gray-300); margin-top: 1rem;">ಚೆನ್ನಾಗಿ ಆರೋಗ್ಯ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ನಿಮಗೆ ಬೇಕಾದ ಎಲ್ಲವೂ</p>',
        schemeCheckerTitle: 'ಯೋಜನೆ ಅರ್ಹತೆ ಪರಿಶೀಲಕ',
        schemeCheckerDesc: 'ಕರ್ನಾಟಕ ಮತ್ತು ಕೇಂದ್ರ ಸರ್ಕಾರದ ಆರೋಗ್ಯ ಯೋಜನೆಗಳಲ್ಲಿ ನೀವು ಯಾವುವನ್ನು ಪಡೆಯಬಹುದು ಎಂಬುದನ್ನು ಕ್ಷಣಗಳಲ್ಲಿ ತಿಳಿದುಕೊಳ್ಳಿ. ನಿಮ್ಮ ವಯಸ್ಸು, ಜಿಲ್ಲೆ, ಆದಾಯ ಮತ್ತು ವೈದ್ಯಕೀಯ ಸ್ಥಿತಿಯ ಆಧಾರದ ಮೇಲೆ AI-ಚಾಲಿತ ಶಿಫಾರಸುಗಳು.',
        checkNow: 'ಈಗ ಪರಿಶೀಲಿಸಿ →',
        medicalVaultTitle: 'ಜೀವನದ ಆರೋಗ್ಯ ಖಾಜಾನೆ',
        medicalVaultDesc: 'MRI, CT, ರಕ್ತ ವರದಿಗಳು, X-ರೇಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ - ಎಲ್ಲವನ್ನು ಒಂದೇ ಸುರಕ್ಷಿತ ಸ್ಥಳದಲ್ಲಿ. ಯಾವುದೇ ಸಮಯದಲ್ಲಿ, ಎಲ್ಲಿಯಾದರೂ ಪ್ರವೇಶಿಸಿ. ಕಳೆದುಹೋದ ವರದಿಗಳಿಗಾಗಿ ಆಸ್ಪತ್ರೆಗೆ ಓಡಲು ಬೇಡ.',
        uploadReports: 'ವರದಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ →',
        aiInterpreterTitle: 'AI ವರದಿ ವ್ಯಾಖ್ಯಾನಕರ್ತ',
        aiInterpreterDesc: 'ವೈದ್ಯಕೀಯ ಪದಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದಿಲ್ಲವೇ? ನಮ್ಮ AI ನಿಮ್ಮ ವರದಿಗಳನ್ನು ಸರಳವಾದ ಕನ್ನಡದಲ್ಲಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ವಿವರಿಸುತ್ತದೆ. ಏನು ಅಸಾಮಾನ್ಯವಾಗಿದೆ, ಏನು ತಿನ್ನಬೇಕು, ಡಾಕ್ಟರ್ ಅವರನ್ನು ಯಾವಾಗ ಭೇಟಿ ನೀಡಬೇಕು ಎಂಬುದನ್ನು ತಿಳಿಯಿರಿ.',
        analyzeReport: 'ವರದಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ →',
        howItWorksTitle: 'ಆರೋಗ್ಯಮಿತ್ರ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
        enterDetails: 'ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
        enterDetailsDesc: 'ವಯಸ್ಸು, ಜಿಲ್ಲೆ, ರೋಗ ಪ್ರಕಾರ',
        aiAnalysisStep: 'AI ವಿಶ್ಲೇಷಣೆ',
        aiAnalysisDesc: 'ಜೆಮಿನಿ AI ಉತ್ತಮ ಯೋಜನೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯುತ್ತದೆ',
        getResults: 'ಫಲಿತಾಂಶಗಳನ್ನು ಪಡೆಯಿರಿ',
        getResultsDesc: 'ಅರ್ಹತೆ + ಅರ್ಜಿ ಹಂತಗಳು',
        applyBenefit: 'ಅರ್ಜಿ ಮಾಡಿ & ಪ್ರಯೋಜನ ಪಡೆಯಿರಿ',
        applyBenefitDesc: 'ಚಿಕಿತ್ಸೆಯನ್ನು ಕವರ್ ಮಾಡಿ',
        unlockPower: 'ಅಪರಿಮಿತ ಶಕ್ತಿಯನ್ನು ಬಿಗಿಯಿರಿ',
        premiumFeatures: 'ಅಪರಿಮಿತ ಅಪ್ಲೋಡ್‌ಗಳು • ಅಪರಿಮಿತ AI ವಿಶ್ಲೇಷಣೆ • ಜಾಹೀರಾತುಗಳಿಲ್ಲ • ಆದ್ಯತೆ ಬೆಂಬಲ',
        revenueText: '<i class="fas fa-fire"></i> 2,000 ಬಳಕೆದಾರರು = ₹98,000 ನಿಮಗಾಗಿ ಮರುಭರವಾಗುವ ಆದಾಯ',
        upgradeToPremium: 'ಪ್ರೀಮಿಯಂಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ',
        footerTitle: 'ಆರೋಗ್ಯಮಿತ್ರ AI',
        footerText: 'AI-ಚಾಲಿತ ಆರೋಗ್ಯ ಬುದ್ಧಿಮತ್ತೆಯೊಂದಿಗೆ ಕರ್ನಾಟಕದ ನಾಗರಿಕರನ್ನು ಸಶಕ್ತಗೊಳಿಸುವುದು',
        copyright: '© 2025 ಆರೋಗ್ಯಮಿತ್ರ AI. ಕರ್ನಾಟಕಕ್ಕಾಗಿ ❤️ ಮಾಡಿದೆ',
        
        // Scheme Checker Page
        checkYourEligibility: 'ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು <span class="gradient-text">ಪರಿಶೀಲಿಸಿ</span>',
        aiWillFindBestSchemes: 'AI ನಿಮಗೆ ಕರ್ನಾಟಕ ಮತ್ತು ಕೇಂದ್ರ ಸರ್ಕಾರದ ಉತ್ತಮ ಆರೋಗ್ಯ ಯೋಜನೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯುತ್ತದೆ',
        enterYourDetails: 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
        yourAge: 'ನಿಮ್ಮ ವಯಸ್ಸು',
        districtKarnataka: 'ಜಿಲ್ಲೆ (ಕರ್ನಾಟಕ)',
        selectYourDistrict: 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        economicStatus: 'ಆದಾಯ ಸ್ಥಿತಿ',
        bpl: 'ಬೀಪಿಎಲ್',
        belowPovertyLine: 'ಕಾಲಿಕ ರೇಖೆಯ ಕೆಳಗೆ',
        apl: 'ಆಪಿಎಲ್',
        abovePovertyLine: 'ಕಾಲಿಕ ರೇಖೆಯ ಉಪರ',
        documentAvailability: 'ದಾಖಲೆ ಉಪಲಬ್ಧತೆ',
        rationCard: 'ರೇಟಿಯನ್ ಕಾರ್ಡ್',
        aadhaarCard: 'ಆಧಾರ್ ಕಾರ್ಡ್',
        diseaseMedicalCondition: 'ರೋಗ / ವೈದ್ಯಕೀಯ ಸ್ಥಿತಿ',
        selectCondition: 'ಸ್ಥಿತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        preferredLanguage: 'ಪ್ರಿಯ ಭಾಷೆ',
        english: 'ಇಂಗ್ಲಿಷ್',
        kannada: 'ಕನ್ನಡ',
        checkEligibilityWithAI: 'AI ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ',
        aiAnalyzing: 'AI ವಿಶ್ಲೇಷಣೆ ಮಾಡುತ್ತದೆ...',
        findingBestSchemes: 'ನಿಮಗೆ ಉತ್ತಮ ಯೋಜನೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯುತ್ತದೆ',
        karnatakaScheme: 'ಕರ್ನಾಟಕ ಯೋಜನೆ',
        eligibilityScore: 'ಅರ್ಹತೆ ಸ್ಕೋರ್',
        whyYoureEligible: 'ನಿಮ್ಮ ಅರ್ಹತೆಯ ಕಾರಣ',
        requiredDocuments: 'ಅಗತ್ಯವಾದ ದಾಖಲೆಗಳು',
        howToApply: 'ಅರ್ಜಿ ಮಾಡುವ ಪದ್ದತಿ',
        checkAnotherScheme: 'ಇತರ ಯೋಜನೆಯನ್ನು ಪರಿಶೀಲಿಸಿ',
        
        // Messages
        loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        success: 'ಯಶಸ್ಸು',
        error: 'ದೋಷ',
        welcome: 'ಸ್ವಾಗತ',
        
        // Form Placeholders
        enterUsername: 'ನಿಮ್ಮ ಬಳಕೆದಾರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
        enterPassword: 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ನಮೂದಿಸಿ',
        enterName: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
        enterEmail: 'ನಿಮ್ಮ ಇಮೇಲ್ ಅನ್ನು ನಮೂದಿಸಿ',
        enterAge: 'ನಿಮ್ಮ ವಯಸ್ಸನ್ನು ನಮೂದಿಸಿ',
        enterPhone: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
        enterAadhaar: 'ಆಧಾರ್‌ನ ಕೊನೆ 4 ಅಂಕೆಗಳು',
        selectDistrict: 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        selectScanType: 'ಸ್ಕ್ಯಾನ್ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        
        // District Names
        bagalkot: 'ಬಾಗಲಕೋಟೆ',
        ballari: 'ಬಳ್ಳಾರಿ',
        belagavi: 'ಬೆಳಗಾವಿ',
        bengaluruRural: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ',
        bengaluruUrban: 'ಬೆಂಗಳೂರು ನಗರ',
        bidar: 'ಬೀದರ್',
        chamarajanagar: 'ಚಾಮರಾಜನಗರ',
        chikkaballapur: 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ',
        chikkamagaluru: 'ಚಿಕ್ಕಮಗಳೂರು',
        chitradurga: 'ಚಿತ್ರದುರ್ಗ',
        dakshinaKannada: 'ದಕ್ಷಿಣ ಕನ್ನಡ',
        davangere: 'ದಾವಣಗೆರೆ',
        dharwad: 'ಧಾರವಾಡ',
        gadag: 'ಗದಗ',
        hassan: 'ಹಾಸನ',
        haveri: 'ಹಾವೇರಿ',
        kalaburagi: 'ಕಲಬುರಗಿ',
        kodagu: 'ಕೊಡಗು',
        kolar: 'ಕೋಲಾರ್',
        koppal: 'ಕೊಪ್ಪಳ',
        mandya: 'ಮಂಡ್ಯ',
        mysuru: 'ಮೈಸೂರು',
        raichur: 'ರಾಯಚೂರು',
        ramanagara: 'ರಾಮನಗರ',
        shimoga: 'ಶಿವಮೊಗ್ಗ',
        tumakuru: 'ತುಮಕೂರು',
        udupi: 'ಉಡುಪಿ',
        uttarakannada: 'ಉತ್ತರ ಕನ್ನಡ',
        vijayapura: 'ವಿಜಯಪುರ',
        yadgir: 'ಯಾದಗಿರಿ',
        
        // Additional UI Elements
        select: 'ಆಯ್ಕೆಮಾಡಿ',
        chooseFile: 'ಕಡತವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        noFileChosen: 'ಯಾವುದೇ ಕಡತವನ್ನು ಆಯ್ಕೆಮಾಡಲಾಗಿಲ್ಲ',
        browse: 'ವೀಕ್ಷಿಸಿ',
        next: 'ಮುಂದೆ',
        previous: 'ಹಿಂದೆ',
        finish: 'ಮುಗಿಯಿರಿ',
        close: 'ಮುಚ್ಚಿ',
        search: 'ಹುಡುಕಿ',
        filter: 'ಫಿಲ್ಟರ್',
        sort: 'ವಿಂಗಡಿಸಿ',
        ascending: 'ಏರೋಹಣ ಕ್ರಮ',
        descending: 'ಇಳಿಕೆ ಕ್ರಮ',
        refresh: 'ಪುನಃತಾಜಾಗೊಳಿಸಿ',
        reset: 'ಮರುಹೊಂದಿಸಿ',
        confirm: 'ದೃಢೀಕರಿಸಿ',
        yes: 'ಹೌದು',
        no: 'ಇಲ್ಲ',
        ok: 'ಸರಿ',
        continue: 'ಮುಂದುವರಿಸಿ',
        back: 'ಹಿಂದೆ',
        forward: 'ಮುಂದೆ ಕಳುಹಿಸಿ',
        print: 'ಮುದ್ರಿಸಿ',
        share: 'ಹಂಚಿಕೊಳ್ಳಿ',
        copy: 'ನಕಲಿಸಿ',
        paste: 'ಅಂಟಿಸಿ',
        cut: 'ಕತ್ತರಿಸಿ',
        undo: 'ರದ್ದುಮಾಡಿ',
        redo: 'ಮರುಮಾಡಿ',
        selectAll: 'ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ',
        clear: 'ತೆರವುಗೊಳಿಸಿ',
        add: 'ಸೇರಿಸಿ',
        remove: 'ತೆಗೆದುಹಾಕಿ',
        update: 'ನವೀಕರಿಸಿ',
        create: 'ರಚಿಸಿ',
        open: 'ತೆರೆಯಿರಿ',
        close: 'ಮುಚ್ಚಿ',
        send: 'ಕಳುಹಿಸಿ',
        receive: 'ಸ್ವೀಕರಿಸಿ',
        import: 'ಆಮದು ಮಾಡಿ',
        export: 'ರಫ್ತು ಮಾಡಿ',
        settings: 'ಸಂಯೋಜನೆಗಳು',
        help: 'ಸಹಾಯ',
        about: 'ಬಗ್ಗೆ',
        contact: 'ಸಂಪರ್ಕ',
        feedback: 'ಪ್ರತಿಕ್ರಿಯೆ',
        rate: 'ದರ್ಜೆ',
        review: 'ವಿಮರ್ಶೆ',
        comment: 'ಟಿಪ್ಪಣಿ',
        reply: 'ಉತ್ತರ',
        like: 'ಇಷ್ಟ',
        dislike: 'ಅಇಷ್ಟ',
        follow: 'ಅನುಸರಿಸಿ',
        unfollow: 'ಅನುಸರಿಸುವುದನ್ನು ನಿಲ್ಲಿಸಿ',
        subscribe: 'ಚಂದಾದಾರರಾಗಿ',
        unsubscribe: 'ಚಂದಾದಾರಿಕೆಯನ್ನು ರದ್ದುಗೊಳಿಸಿ',
        notifications: 'ಸೂಚನೆಗಳು',
        profile: 'ಪ್ರೊಫೈಲ್',
        account: 'ಖಾತೆ',
        dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        reports: 'ವರದಿಗಳು',
        analytics: 'ವಿಶ್ಲೇಷಣೆ',
        statistics: 'ಅಂಕಿಅಂಶಗಳು',
        overview: 'ಅವಲೋಕನ',
        details: 'ವಿವರಗಳು',
        summary: 'ಸಾರಾಂಶ',
        history: 'ಇತಿಹಾಸ',
        recent: 'ಇತ್ತೀಚಿನ',
        popular: 'ಜನಪ್ರಿಯ',
        trending: 'ಪ್ರಚಲಿತ',
        new: 'ಹೊಸ',
        old: 'ಹಳೆಯ',
        active: 'ಸಕ್ರಿಯ',
        inactive: 'ನಿಷ್ಕ್ರಿಯ',
        pending: 'ಬಾಕಿ ಇರುವ',
        approved: 'ಅನುಮೋದಿತ',
        rejected: 'ತಿರಸ್ಕರಿಸಲಾದ',
        completed: 'ಪೂರ್ಣಗೊಂಡ',
        inProgress: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
        notStarted: 'ಪ್ರಾರಂಭವಾಗಿಲ್ಲ',
        cancelled: 'ರದ್ದುಗೊಂಡ',
        failed: 'ವಿಫಲಗೊಂಡ',
        success: 'ಯಶಸ್ಸು',
        warning: 'ಎಚ್ಚರಿಕೆ',
        info: 'ಮಾಹಿತಿ',
        danger: 'ಅಪಾಯ',
        primary: 'ಪ್ರಾಥಮಿಕ',
        secondary: 'ದ್ವಿತೀಯ',
        success: 'ಯಶಸ್ಸು',
        danger: 'ಅಪಾಯ',
        warning: 'ಎಚ್ಚರಿಕೆ',
        info: 'ಮಾಹಿತಿ',
        light: 'ಬೆಳಕು',
        dark: 'ಕತ್ತಲು',
        white: 'ಬಿಳಿ',
        black: 'ಕಪ್ಪು',
        red: 'ಕೆಂಪು',
        green: 'ಹಸಿರು',
        blue: 'ನೀಲಿ',
        yellow: 'ಹಳದಿ',
        purple: 'ನೇರಳೆ',
        orange: 'ಕಿತ್ತಳೆ',
        pink: 'ಗುಲಾಬಿ',
        brown: 'ಕಂದು',
        gray: 'ಬೂದು',
        silver: 'ಬೆಳ್ಳಿ',
        gold: 'ಚಿನ್ನ',
        bronze: 'ಕಂಚಿನ',
        platinum: 'ಪ್ಲಾಟಿನಂ',
        diamond: 'ಹೀರೆ',
        ruby: 'ರೂಬಿ',
        emerald: 'ಪಚ್ಚೆ',
        sapphire: 'ನೀಲಿಮಣಿ',
        topaz: 'ಟೋಪಾಜ್',
        amethyst: 'ಅಮೆಥ್ಯಾಸ್ಟ್',
        jade: 'ಜೇಡ್',
        pearl: 'ಮುತ್ತು',
        coral: 'ಕೋರಲ್',
        quartz: 'ಕ್ವಾರ್ಟ್ಜ್',
        obsidian: 'ಆಬ್ಸಿಡಿಯನ್',
        granite: 'ಗ್ರಾನೈಟ್',
        marble: 'ಸಂಗಮರಾಷ್ಟ್ರ',
        limestone: 'ಲೈಮ್‌ಸ್ಟೋನ್',
        sandstone: 'ಸ್ಯಾಂಡ್‌ಸ್ಟೋನ್',
        slate: 'ಸ್ಲೇಟ್',
        shale: 'ಶೇಲ್',
        basalt: 'ಬ್ಯಾಸಾಲ್ಟ್',
        andesite: 'ಆಂಡೆಸೈಟ್',
        rhyolite: 'ರೈಯೊಲೈಟ್',
        gabbro: 'ಗ್ಯಾಬ್ರೊ',
        diorite: 'ಡಯೊರೈಟ್',
        peridotite: 'ಪೆರಿಡೊಟೈಟ್',
        dunite: 'ಡ್ಯೂನೈಟ್',
        eclogite: 'ಎಕ್ಲೊಜೈಟ್',
        blueschist: 'ಬ್ಲೂಸ್ಕಿಸ್ಟ್',
        greenschist: 'ಗ್ರೀನ್‌ಸ್ಕಿಸ್ಟ್',
        amphibolite: 'ಆಂಫಿಬೊಲೈಟ್',
        gneiss: 'ಗ್ನೈಸ್',
        schist: 'ಸ್ಕಿಸ್ಟ್',
        phyllite: 'ಫಿಲೈಟ್',
        migmatite: 'ಮಿಗ್ಮಾಟೈಟ್',
        others: 'ಇತರೆ'
    }
};

// Language toggle functionality
let currentLanguage = localStorage.getItem('language') || 'kn'; // Default to Kannada for rural users

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Translate all text elements
    translatePage();
    
    console.log('Language changed to:', lang);
}

function updateLanguageButtons(lang) {
    // Update language toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update navbar toggles
    document.querySelectorAll('.lang-btn-nav').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
}

// Translate all text elements on the page
function translatePage() {
    // First, translate elements with data-translate attributes (preferred method)
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (key && translations[currentLanguage] && translations[currentLanguage][key]) {
            // Special handling for HTML content
            if (typeof translations[currentLanguage][key] === 'string' && 
                (translations[currentLanguage][key].includes('<h2') || 
                 translations[currentLanguage][key].includes('<p ') ||
                 translations[currentLanguage][key].includes('<span') ||
                 translations[currentLanguage][key].includes('<br') ||
                 translations[currentLanguage][key].includes('<i '))) {
                // For HTML content, set innerHTML directly
                element.innerHTML = translations[currentLanguage][key];
            } else {
                // For plain text, set textContent
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
    
    // Handle special elements that need translation but don't have data-translate attributes
    // Translate option text in select elements
    document.querySelectorAll('option').forEach(element => {
        // Skip if this option is part of a district or disease type dropdown (which are dynamically populated)
        if (element.value && (element.value.length === 2 || element.value.length === 3)) {
            // These are district or disease codes, skip them
            return;
        }
        
        const text = element.textContent.trim();
        if (text) {
            // Try exact match first
            if (translations[currentLanguage] && translations[currentLanguage][text]) {
                element.textContent = translations[currentLanguage][text];
            }
            // Try lowercase match as fallback
            else if (translations[currentLanguage] && translations[currentLanguage][text.toLowerCase()]) {
                element.textContent = translations[currentLanguage][text.toLowerCase()];
            }
        }
    });
    
    // Translate placeholder text
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(element => {
        const placeholder = element.placeholder.trim();
        if (placeholder) {
            // Try exact match first
            if (translations[currentLanguage] && translations[currentLanguage][placeholder]) {
                element.placeholder = translations[currentLanguage][placeholder];
            }
            // Try lowercase match as fallback
            else if (translations[currentLanguage] && translations[currentLanguage][placeholder.toLowerCase()]) {
                element.placeholder = translations[currentLanguage][placeholder.toLowerCase()];
            }
        }
    });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial language for language toggle buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Set initial language for navbar toggles
    const navLangButtons = document.querySelectorAll('.lang-btn-nav');
    navLangButtons.forEach(btn => {
        if (btn.dataset.lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Apply initial translation
    if (currentLanguage === 'kn') {
        // Small delay to ensure DOM is fully loaded
        setTimeout(translatePage, 100);
    } else {
        // Apply translation on page load for English as well to ensure consistency
        translatePage();
    }
    
    // Add event listeners for language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedLang = this.dataset.lang;
            setLanguage(selectedLang);
            updateLanguageButtons(selectedLang);
        });
    });
    
    // Add event listeners for navbar language buttons
    document.querySelectorAll('.lang-btn-nav').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedLang = this.dataset.lang;
            setLanguage(selectedLang);
            updateLanguageButtons(selectedLang);
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading state to forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                const originalHTML = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                // Reset after 30 seconds (safety)
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }, 30000);
            }
        });
    });
    
    // Add entrance animations to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .glass-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Also listen for custom language change events (in case of dynamic content)
document.addEventListener('languageChange', function(e) {
    setTimeout(translatePage, 50); // Small delay to ensure DOM updates
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.getElementById('mainNavbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class when scrolled down
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide navbar when scrolling down, show when scrolling up
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        navbar.classList.add('hidden');
    } else if (lastScroll - currentScroll > 50) {
        // Scrolling up significantly
        navbar.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
});

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show notification (toast)
function showNotification(message, type = 'success') {
    const colors = {
        success: 'var(--success-green)',
        error: 'var(--danger-red)',
        warning: 'var(--warning-yellow)',
        info: 'var(--info-blue)'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: rgba(10, 14, 39, 0.95);
        backdrop-filter: blur(20px);
        border: 2px solid ${colors[type]};
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}" 
           style="color: ${colors[type]}; margin-right: 0.5rem;"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export utility functions
window.ArogyaMitra = {
    formatFileSize,
    formatDate,
    showNotification,
    setLanguage,
    currentLanguage: () => currentLanguage
};

console.log('🏥 ArogyaMitra AI - Healthcare Intelligence Platform Loaded');
console.log('💎 World-Class UI Activated');