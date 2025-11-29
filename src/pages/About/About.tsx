import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SEO from "../../components/SEO";
import { pageSEO } from "../../types/seo";

const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={pageSEO.about.title}
        description={pageSEO.about.description}
        keywords={pageSEO.about.keywords}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mx-auto px-4 py-12"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-primary mb-8 text-center"
        >
          {t("nav.about")}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto space-y-6 text-gray-600 text-lg"
        >
          <p>
            Welcome to MeKanizm, your trusted partner in mechanical solutions
            and innovation.
          </p>
          <p>
            With years of experience in the industry, we provide top-quality
            products and services to meet all your mechanical needs.
          </p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default About;
