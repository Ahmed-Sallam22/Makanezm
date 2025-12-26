import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import SEO from "../../components/SEO";
import { pageSEO } from "../../types/seo";
import coverFAQ from "../../assets/images/FAQ.png";
const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Get FAQs from translations
  const faqs = t("faq.questions", { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <>
      <SEO
        title={pageSEO.faq.title}
        description={pageSEO.faq.description}
        keywords={pageSEO.faq.keywords}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mx-auto px-4 py-12 w-[95%]"
      >
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
  

          {/* Right Side - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              {/* Placeholder for FAQ illustration */}
              <div className="w-full aspect-square flex items-center justify-center">
                <img src={coverFAQ} className="w-[60%] mx-auto" alt="" />
              </div>
            </div>
          </motion.div>

                  {/* Left Side - FAQ Questions */}
          <div className="space-y-4 order-2 lg:order-1">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-right hover:bg-gray-50 transition-colors rounded-2xl"
                >
                 
                  <span className="font-bold text-gray-800 text-lg pr-4">
                    {faq.question}
                  </span>
                   <ChevronLeft
                    className={`w-6 h-6 text-[#c4886a] transition-transform flex-shrink-0 ${
                      openIndex === index ? "-rotate-90" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openIndex === index ? "auto" : 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-gray-600 text-right leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FAQ;
