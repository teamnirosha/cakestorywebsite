import React, { createContext, useContext, useState } from "react";

export type Language = "en" | "mr";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.story": "Our Story",
    "nav.franchise": "Franchise",
    "nav.faq": "FAQ",
    "nav.outlets": "Outlets",
    "nav.contact": "Contact",
    "nav.enquiry": "Franchise Enquiry",
    "nav.langSwitch": "मराठी",

    // Hero
    "hero.badge": "Now Accepting Franchise Partners Across Pune",
    "hero.titlePrefix": "Pune's Growing Celebration Cake Franchise —",
    "hero.titleHighlight": "Built on Quality, Not Hype",
    "hero.desc": "CakeStory Desserts brings pharmaceutical-grade central production and 100% vegetarian handcrafted bakes to high-growth neighborhood franchise outlets. Zero in-store baking complexity with daily cold-chain deliveries.",
    "hero.trust1": "100% Pure Vegetarian",
    "hero.trust2": "100% Operational Support",
    "hero.trust3": "Zero In-Store Baking",
    "hero.ctaPrimary": "Start Your Franchise Journey",
    "hero.ctaSecondary": "Explore Our Story",

    // Story
    "story.tag": "Our Journey",
    "story.title": "The CakeStory Story",
    "story.subtitle": "From a single dream to 12+ thriving outlets across Pune & Maharashtra",
    "story.t1Year": "2020",
    "story.t1Title": "The Beginning",
    "story.t1Desc": "Founded in Pune with a dedicated central kitchen and 100% pure vegetarian recipe formulations.",
    "story.t2Year": "2021",
    "story.t2Title": "First Smiles",
    "story.t2Desc": "Overwhelming customer love and word-of-mouth recommendations across neighborhoods.",
    "story.t3Year": "2023",
    "story.t3Title": "Growing Family",
    "story.t3Desc": "Franchise partners joined the ecosystem with turnkey store setup and daily dispatch.",
    "story.t4Year": "2026",
    "story.t4Title": "Pune & Beyond",
    "story.t4Desc": "12+ operational outlets spanning West Pune, South Pune, East Pune, PCMC & Satara.",

    // Founder
    "founder.tag": "The Visionary",
    "founder.title": "Meet the Founder",
    "founder.desc": "CakeStory Desserts was never about opening outlets fast, it was about doing things right. Every cake we bake carries our promise of hygiene, fresh ingredients, and authentic taste. Every franchise we open is a partnership built on trust.",
    "founder.quote": "“Quality is not an act, it's a habit.”",
    "founder.name": "Operations & Leadership Team",
    "founder.role": "Founder & Managing Director, CakeStory Desserts",

    // Numbers
    "numbers.tag": "100% Organic Growth",
    "numbers.title": "Our Numbers Speak Volumes",
    "numbers.subtitle": "Growth driven by customer love, repeat celebrations, and trusted partners",
    "numbers.stat1Val": "12+",
    "numbers.stat1Label": "Operational Outlets",
    "numbers.stat1Sub": "Pune, PCMC & Satara",
    "numbers.stat2Val": "5,00,000+",
    "numbers.stat2Label": "Celebrations Served",
    "numbers.stat2Sub": "Happy Pune families",
    "numbers.stat3Val": "100%",
    "numbers.stat3Label": "Franchise Retention",
    "numbers.stat3Sub": "Partner loyalty & growth",
    "numbers.stat4Val": "6+",
    "numbers.stat4Label": "Years of Excellence",
    "numbers.stat4Sub": "Proven operational model",
    "numbers.banner1": "No Hidden Royalties / No Fake Marketing Fees",
    "numbers.banner1Sub": "Zero advertising expense charged to franchisees",
    "numbers.banner2": "High Repeat Customer Demand & Daily Cold Chain",
    "numbers.banner2Sub": "Consistent fresh stock every morning",

    // Franchise Pillars
    "franchise.tag": "Business Model",
    "franchise.title": "Why Partner With CakeStory Desserts?",
    "franchise.subtitle": "A streamlined retail business model engineered for steady monthly returns and low operating stress",
    "franchise.p1Title": "Zero In-Store Baking",
    "franchise.p1Desc": "All sponge baking, piping, and packaging are handled at our central cleanroom kitchen. No baking staff required at the store.",
    "franchise.p2Title": "Compact 300–400 sq.ft. Store",
    "franchise.p2Desc": "Optimized retail footprint for prime high-footfall commercial streets, keeping rent and interior overheads low.",
    "franchise.p3Title": "Daily Cold-Chain Delivery",
    "franchise.p3Desc": "Refrigerated transport vehicles supply fresh cakes to your store every morning, eliminating dead stock risk.",
    "franchise.p4Title": "Turnkey Setup & Staff Training",
    "franchise.p4Desc": "Comprehensive interior design, signage specs, billing software, and hands-on counter staff training provided.",

    // Steps
    "steps.tag": "Quick Onboarding",
    "steps.title": "Simple 4-Step Partnership Journey",
    "steps.s1": "Enquire Online",
    "steps.s2": "Territory Evaluation",
    "steps.s3": "Store Fit-Out",
    "steps.s4": "Grand Launch",
    "steps.cta": "Apply for Your Territory",

    // Outlets Map
    "outlets.tag": "Our Presence",
    "outlets.title": "Explore Outlet Locations",
    "outlets.subtitle": "Find a CakeStory Desserts outlet near you across Pune Metropolitan Region",
    "outlets.allZones": "All Zones",
    "outlets.search": "Search by outlet name or area...",
    "outlets.listTitle": "Our Outlets",
    "outlets.clickToView": "Click to view on map",
    "outlets.viewDetails": "View Details",
    "outlets.tapExplore": "Interactive Pune Map",

    // FAQ
    "faq.tag": "Clear Answers",
    "faq.title": "Frequently Asked Questions",
    "faq.subtitle": "Everything you need to know about starting your CakeStory Desserts franchise",

    // Contact
    "contact.tag": "Get in Touch",
    "contact.title": "Ready to Start Your CakeStory Journey?",
    "contact.subtitle": "Fill out the simple form below. Our Pune franchise development team will contact you within 24 hours.",
    "contact.name": "Full Name",
    "contact.phone": "Mobile Number (WhatsApp)",
    "contact.city": "Preferred Pune Area / Location",
    "contact.readiness": "Investment Readiness",
    "contact.readiness1": "Ready to invest immediately",
    "contact.readiness2": "Within 3 months",
    "contact.readiness3": "Within 6 months",
    "contact.readiness4": "Just exploring",
    "contact.submit": "Submit Franchise Application",
    "contact.submitting": "Submitting Application...",
    "contact.successTitle": "Application Received!",
    "contact.successDesc": "Thank you! Our franchise operations team will call you within 24 hours to discuss territory availability.",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.tagline": "Every Flavour Has A Story • Pune Franchise Network",
    "footer.devBy": "Designed & developed by",
    "footer.opsLogin": "Operations Login",
  },
  mr: {
    // Nav
    "nav.home": "मुख्यपृष्ठ",
    "nav.story": "आमची गोष्ट",
    "nav.franchise": "फ्रँचायझी",
    "nav.faq": "प्रश्नोत्तरे",
    "nav.outlets": "आऊटलेट्स",
    "nav.contact": "संपर्क",
    "nav.enquiry": "फ्रँचायझी चौकशी",
    "nav.langSwitch": "English",

    // Hero
    "hero.badge": "पुणे आणि परिसरात नवीन फ्रँचायझी पार्टनर्सचे स्वागत",
    "hero.titlePrefix": "पुण्यातील वेगाने वाढणारी सेलिब्रेशन केक फ्रँचायझी —",
    "hero.titleHighlight": "उत्कृष्ट दर्जा, दिखावा नाही",
    "hero.desc": "केकस्टोरी डेझर्ट्स आपल्या सेंट्रलाइज्ड किचनमधून १००% शुद्ध शाकाहारी, उच्च दर्जाचे केक्स थेट आउटलेटपर्यंत पोहोचवते. दुकानात बेकिंगची कोणतीही झंझट नाही; दररोज ताज्या केक्सची कोल्ड-चेन डिलिव्हरी.",
    "hero.trust1": "१००% शुद्ध शाकाहारी",
    "hero.trust2": "१००% व्यवसाय व ट्रेनिंग सपोर्ट",
    "hero.trust3": "दुकानात बेकिंगची गरज नाही",
    "hero.ctaPrimary": "फ्रँचायझी अर्ज करा",
    "hero.ctaSecondary": "आमचा प्रवास पहा",

    // Story
    "story.tag": "आमचा प्रवास",
    "story.title": "केकस्टोरीची यशोगाथा",
    "story.subtitle": "एका स्वप्नापासून सुरू झालेला १२+ यशस्वी आऊटलेट्सचा प्रवास",
    "story.t1Year": "२०२०",
    "story.t1Title": "सुरुवात",
    "story.t1Desc": "पुण्यात मध्यवर्ती आधुनिक किचन आणि १००% शुद्ध शाकाहारी रेसिपीजसह ब्रँडची स्थापना.",
    "story.t2Year": "२०२१",
    "story.t2Title": "ग्राहकांचे प्रेम",
    "story.t2Desc": "उत्कृष्ट चव आणि शुद्धतेमुळे पुणेकरांचा उत्स्फूर्त प्रतिसाद व ग्राहक निष्ठा.",
    "story.t3Year": "२०२३",
    "story.t3Title": "विस्तार",
    "story.t3Desc": "विश्वसनीय फ्रँचायझी पार्टनर्ससह सुलभ टर्नकी मॉडेलचा विस्तार सुरू.",
    "story.t4Year": "२०२६",
    "story.t4Title": "पुणे आणि महाराष्ट्र",
    "story.t4Desc": "पश्चिम पुणे, दक्षिण पुणे, पूर्व पुणे, पिंपरी-चिंचवड आणि साताऱ्यात १२+ कार्यरत आऊटलेट्स.",

    // Founder
    "founder.tag": "संस्थापक दृष्टिकोन",
    "founder.title": "संस्थापकांचे मनोगत",
    "founder.desc": "केकस्टोरीचा उद्देश फक्त आऊटलेट्स वाढवणे हा कधीच नव्हता, तर प्रत्येक गोष्ट दर्जेदार करणे हा होता. आम्ही बनवलेला प्रत्येक केक शुद्धता, ताजे साहित्य आणि अस्सल चवीची हमी देतो. आमची प्रत्येक फ्रँचायझी ही विश्वासाची भागीदारी आहे.",
    "founder.quote": "“दर्जा हा अचानक मिळत नाही, तो आमच्या सवयीचा भाग आहे.”",
    "founder.name": "ऑपरेशन्स व लीडरशिप टीम",
    "founder.role": "संस्थापक व व्यवस्थापकीय संचालक, केकस्टोरी डेझर्ट्स",

    // Numbers
    "numbers.tag": "१००% सेंद्रिय प्रगती",
    "numbers.title": "आमची आकडेवारीच सर्व काही सांगते",
    "numbers.subtitle": "ग्राहकांचे प्रेम, पुन्हा पुन्हा होणारी सेलिब्रेशन्स आणि पार्टनर्सचा विश्वास",
    "numbers.stat1Val": "१२+",
    "numbers.stat1Label": "कार्यरत आऊटलेट्स",
    "numbers.stat1Sub": "पुणे, पिंपरी-चिंचवड व सातारा",
    "numbers.stat2Val": "५,००,०००+",
    "numbers.stat2Label": "आनंदी ग्राहक",
    "numbers.stat2Sub": "सेलिब्रेशन्सचे भागीदार",
    "numbers.stat3Val": "१००%",
    "numbers.stat3Label": "फ्रँचायझी समाधान",
    "numbers.stat3Sub": "दीर्घकालीन भागीदारी",
    "numbers.stat4Val": "६+",
    "numbers.stat4Label": "वर्षांचा अनुभव",
    "numbers.stat4Sub": "सिद्ध झालेली व्यवसाय पद्धत",
    "numbers.banner1": "कोणतीही छुपी रॉयल्टी किंवा जाहिरात फी नाही",
    "numbers.banner1Sub": "फ्रँचायझीवर अनावश्यक खर्चाचा कोणताही भार नाही",
    "numbers.banner2": "सतत वाढणारी मागणी व दररोज कोल्ड चेन पुरवठा",
    "numbers.banner2Sub": "दररोज सकाळी ताजा व उत्कृष्ट स्टॉक उपलब्ध",

    // Franchise Pillars
    "franchise.tag": "बिझनेस मॉडेल",
    "franchise.title": "केकस्टोरी फ्रँचायझी का निवडावी?",
    "franchise.subtitle": "कमी ताण, स्थिर मासिक नफा आणि सुलभ व्यवसाय व्यवस्थापन",
    "franchise.p1Title": "दुकानात बेकिंगची गरज नाही",
    "franchise.p1Desc": "सर्व बेकिंग, आयसिंग व पॅकिंग आमच्या मुख्य किचनमध्ये होते. दुकानात बेकर्स ठेवण्याची अजिबात गरज नाही.",
    "franchise.p2Title": "कमी जागेत ३००–४०० चौ.फूट दुकान",
    "franchise.p2Desc": "कमी भाडे आणि कमी इंटिरिअर खर्चात जास्त ग्राहक असलेल्या ठिकाणी चालणारे उत्तम मॉडेल.",
    "franchise.p3Title": "दररोज सकाळी कोल्ड-चेन डिलिव्हरी",
    "franchise.p3Desc": "रेफ्रिजरेटेड वाहनांतून दररोज सकाळी ताजा केक पुरवठा, त्यामुळे वेस्टेज किंवा शिळेपणाची भीती नाही.",
    "franchise.p4Title": "टर्नकी सेटअप व संपूर्ण स्टाफ ट्रेनिंग",
    "franchise.p4Desc": "दुकान डिझाइन, ब्रँडिंग, बिलिंग सॉफ्टवेअर आणि काउंटर कर्मचाऱ्यांना संपूर्ण ट्रेनिंग आम्ही देतो.",

    // Steps
    "steps.tag": "सुलभ प्रक्रिया",
    "steps.title": "सोप्या ४ पायऱ्यांत फ्रँचायझी सुरू करा",
    "steps.s1": "ऑनलाइन अर्ज करा",
    "steps.s2": "जागेची पाहणी व निवड",
    "steps.s3": "दुकान सेटअप व ट्रेनिंग",
    "steps.s4": "ग्रँड ओपनिंग",
    "steps.cta": "आपल्या भागासाठी आजच अर्ज करा",

    // Outlets Map
    "outlets.tag": "आमचे जाळे",
    "outlets.title": "आमची आऊटलेट्स शोधा",
    "outlets.subtitle": "पुणे, पिंपरी-चिंचवड आणि साताऱ्यातील केकस्टोरी डेझर्ट्स आऊटलेट्स",
    "outlets.allZones": "सर्व भाग",
    "outlets.search": "आऊटलेटचे नाव किंवा परिसर शोधा...",
    "outlets.listTitle": "आमची आऊटलेट्स",
    "outlets.clickToView": "नकाशावर पाहण्यासाठी क्लिक करा",
    "outlets.viewDetails": "तपशील पहा",
    "outlets.tapExplore": "परस्परसंवादी पुणे नकाशा",

    // FAQ
    "faq.tag": "स्पष्ट उत्तरे",
    "faq.title": "वारंवार विचारले जाणारे प्रश्न",
    "faq.subtitle": "केकस्टोरी डेझर्ट्स फ्रँचायझीबद्दलची संपूर्ण आणि पारदर्शक माहिती",

    // Contact
    "contact.tag": "संपर्क साधा",
    "contact.title": "आपला केकस्टोरी व्यवसाय सुरू करण्यास तयार आहात?",
    "contact.subtitle": "खालील साधा अर्ज भरा. आमची पुणे फ्रँचायझी टीम २४ तासांत आपल्याशी थेट संपर्क साधेल.",
    "contact.name": "पूर्ण नाव",
    "contact.phone": "मोबाईल नंबर (WhatsApp)",
    "contact.city": "पसंतीचा पुणे परिसर / गाव",
    "contact.readiness": "गुंतवणुकीची तयारी",
    "contact.readiness1": "त्वरित गुंतवणूक करण्यास तयार",
    "contact.readiness2": "३ महिन्यांच्या आत",
    "contact.readiness3": "६ महिन्यांच्या आत",
    "contact.readiness4": "फक्त प्राथमिक माहिती हवी आहे",
    "contact.submit": "फ्रँचायझी अर्ज पाठवा",
    "contact.submitting": "अर्ज पाठवत आहे...",
    "contact.successTitle": "अर्ज यशस्वीरित्या मिळाला!",
    "contact.successDesc": "धन्यवाद! जागेची उपलब्धता आणि पुढील प्रक्रियेसाठी आमची टीम २४ तासांच्या आत आपल्याशी संपर्क करेल.",

    // Footer
    "footer.rights": "सर्व हक्क राखीव.",
    "footer.tagline": "प्रत्येक चवीची एक सुंदर गोष्ट • पुणे फ्रँचायझी नेटवर्क",
    "footer.devBy": "डिझाईन व डेव्हलपमेंट",
    "footer.opsLogin": "ऑपरेशन्स लॉगिन",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("cakestory_lang");
    return saved === "mr" || saved === "en" ? saved : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("cakestory_lang", lang);
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "mr" : "en";
    setLanguage(next);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  return useContext(LanguageContext);
}
