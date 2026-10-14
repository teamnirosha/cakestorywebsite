import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function FranchiseFaqSection() {
  const { language, t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      qEn: "What is the store size required for a CakeStory Desserts outlet?",
      qMr: "केकस्टोरी डेझर्ट्स आऊटलेट सुरू करण्यासाठी किती जागेची आवश्यकता असते?",
      aEn: "CakeStory operates on a compact, highly optimized format of 300 to 400 sq.ft. on a prominent commercial street with good frontage and customer visibility.",
      aMr: "केकस्टोरीचे आऊटलेट हे ३०० ते ४०० चौरस फुटांच्या कॉम्पॅक्ट जागेत चालते. मुख्य बाजारपेठेत किंवा गर्दीच्या रस्त्यावर चांगली फ्रंट साईझ असलेले दुकान उत्तम ठरते.",
    },
    {
      qEn: "Do I need prior baking experience or skilled bakery chefs?",
      qMr: "मला आधीच्या बेकिंग अनुभवाची किंवा बेकर्सची गरज आहे का?",
      aEn: "No. CakeStory operates on 100% Zero In-Store Baking. All cake baking, sponge formulations, and finishing are completed at our centralized Pune cleanroom facility. Your store only handles retail display, billing, and customer service.",
      aMr: "अजिबात नाही. केकस्टोरीमध्ये दुकानात बेकिंग करण्याची शून्य गरज असते. सर्व बेकिंग व फिनिशिंग आमच्या मुख्य किचनमध्ये होते. दुकानात फक्त काउंटर विक्री आणि सेवा दिली जाते.",
    },
    {
      qEn: "How does the daily stock replenishment work?",
      qMr: "दररोज ताज्या मालाचा पुरवठा कसा होतो?",
      aEn: "Our temperature-controlled refrigerated dispatch vans deliver fresh cakes and baked goods to your store every morning across Pune, minimizing stockouts and eliminating shrinkage.",
      aMr: "आमच्या रेफ्रिजरेटेड कोल्ड-चेन व्हॅन्स दररोज सकाळी पुण्यात सर्व आउटलेट्सना ताजा आणि दर्जेदार स्टॉक थेट पोहोचवतात, त्यामुळे माल खराब होण्याचा कोणताही धोका नसतो.",
    },
    {
      qEn: "What training and operational support does CakeStory provide?",
      qMr: "कंपनीकडून काय सहकार्य आणि ट्रेनिंग दिले जाते?",
      aEn: "We provide end-to-end turnkey support including architectural layouts, interior fit-out guidelines, counter POS billing software, packaging inventory, and comprehensive customer handling training.",
      aMr: "आम्ही दुकानाचे इंटिरिअर डिझाइन, बिलिंग सॉफ्टवेअर, पॅकेजिंग मटेरिअल, उद्घाटन मार्केटिंग आणि कर्मचाऱ्यांना परिपूर्ण ग्राहक सेवेचे प्रशिक्षण देतो.",
    },
    {
      qEn: "Are there any hidden royalties or surprise marketing charges?",
      qMr: "कोणतीही छुपी रॉयल्टी किंवा जाहिरात खर्च आहे का?",
      aEn: "No. CakeStory Desserts believes in transparent, mutually profitable partnerships with clean margins and zero hidden advertising levies.",
      aMr: "नाही. केकस्टोरी पूर्णपणे पारदर्शक पद्धतीवर काम करते. कोणतेही छुपे चार्जेस किंवा जाहिरातीचे अतिरिक्त शुल्क आकारले जात नाही.",
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-wider mb-3 border border-pink-100">
            {t("faq.tag")}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {t("faq.title")}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const q = language === "mr" ? faq.qMr : faq.qEn;
            const a = language === "mr" ? faq.aMr : faq.aEn;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/50 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-display font-bold text-sm sm:text-base text-slate-900 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  <span>{q}</span>
                  <span className={`w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs shrink-0 transition-transform ${isOpen ? "rotate-180 bg-pink-50 text-pink-600 border-pink-200" : ""}`}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/40 bg-white">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
