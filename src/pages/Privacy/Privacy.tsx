import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FileText, Shield, Settings, Copyright } from "lucide-react";
import SEO from "../../components/SEO";
import { pageSEO } from "../../types/seo";
import privacy from "../../assets/images/privacy.png";
const Privacy = () => {
  const { t } = useTranslation();
  const intro = t("privacy.intro", { returnObjects: true }) as string[];

  return (
    <>
      <SEO
        title={pageSEO.privacy.title}
        description={pageSEO.privacy.description}
        keywords={pageSEO.privacy.keywords}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mx-auto py-4 w-[95%]"
      >
        {/* Page Title */}

        <div className="flex  items-center justify-center gap-3 pb-10">
              {/* Right Side - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center w-1/2"
          >
            <div className="w-full max-w-md">
              {/* SVG Illustration Placeholder */}
          <img src={privacy} alt="" />
            </div>
          </motion.div>
          <div className="flex flex-col justify-start gap-5  w-1/2">
            <div className="flex items-center gap-3">

                    <FileText className="w-10 h-10 text-[#F65331]" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#384B97]">
            {t("privacy.title")}
          </h1>
            </div>
             {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-right space-y-4"
            >
              <ul className="space-y-3 text-gray-700 text-lg text-justify leading-relaxed">
                {intro.map((text, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#F65331] mt-2">•</span>
                    <span className="w-[70%]">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
        </div>
    
     
        </div>
      
          

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-1 gap-12 max-w-7xl mx-auto">
          {/* Left Side - Content */}
          <div className="space-y-12 order-2 lg:order-1">
            {/* Terms of Use */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-start gap-3 mb-4">
                <FileText className="w-6 h-6 text-[#384B97]" />
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("privacy.sections.termsOfUse.title")}
                </h2>
              </div>
              <div className="border-r-4 border-[#F65331] p-4 rounded-lg bg-[#384B970A] ">
                <p className="text-gray-700 text-lg text-right leading-relaxed">
                  {t("privacy.sections.termsOfUse.content")}
                </p>
              </div>
            </motion.section>

            {/* Privacy Policy */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-start gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#F65331]" />
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("privacy.sections.privacyPolicy.title")}
                </h2>
              </div>
              <div className="border-r-4 border-[#F65331] p-4 rounded-lg bg-[#384B970A] ">
                <p className="text-gray-700 text-lg text-right leading-relaxed">
                  {t("privacy.sections.privacyPolicy.content")}
                </p>
              </div>
            </motion.section>

            {/* Operation Terms */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-start gap-3 mb-4">
                <Settings className="w-6 h-6 text-[#F65331]" />
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("privacy.sections.operationTerms.title")}
                </h2>
              </div>
              <div className="border-r-4 border-[#F65331] p-4 rounded-lg bg-[#384B970A] ">
                <p className="text-gray-700 text-lg text-right leading-relaxed">
                  {t("privacy.sections.operationTerms.content")}
                </p>
              </div>
            </motion.section>

            {/* Copyright */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-start gap-3 mb-4">
                <Copyright className="w-6 h-6 text-[#F65331]" />
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("privacy.sections.copyright.title")}
                </h2>
              </div>
              <div className="border-r-4 border-[#F65331] p-4 rounded-lg bg-[#384B970A] ">
                <p className="text-gray-700 text-lg text-right leading-relaxed">
                  {t("privacy.sections.copyright.content")}
                </p>
              </div>
            </motion.section>
          </div>

        </div>
      </motion.div>
    </>
  );
};

export default Privacy;
