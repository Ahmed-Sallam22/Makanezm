import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import defaultHeroImage from "../../../../assets/images/Home.png";
import { Link } from "react-router-dom";
import { getActiveHero, type HeroSetting } from "../../../../services/heroService";

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [heroData, setHeroData] = useState<HeroSetting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await getActiveHero();
        setHeroData(response.data.hero);
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  // Use API data if available, otherwise fall back to i18n translations
  const title = heroData
    ? (isArabic ? heroData.title_ar : heroData.title)
    : t("home.heroTitle");
  const description1 = heroData
    ? (isArabic ? heroData.description1_ar : heroData.description1)
    : t("home.heroDescription1");
  const description2 = heroData
    ? (isArabic ? heroData.description2_ar : heroData.description2)
    : t("home.heroDescription2");
  const heroImage = heroData?.image || defaultHeroImage;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center py-8 md:py-12 lg:py-16"
    >
      <div className="flex flex-col space-y-4 sm:space-y-6 w-full md:w-[90%] lg:w-[80%] mx-auto order-2 md:order-1 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3a4b95]">
          {loading ? (
            <span className="animate-pulse bg-gray-200 h-8 w-3/4 block rounded"></span>
          ) : (
            title
          )}
        </h2>
        <p className="text-justify sm:text-lg md:text-xl text-black">
          {loading ? (
            <span className="animate-pulse bg-gray-200 h-20 w-full block rounded"></span>
          ) : (
            description1
          )}
        </p>
        <p className="text-justify sm:text-lg md:text-xl text-black">
          {loading ? (
            <span className="animate-pulse bg-gray-200 h-6 w-2/3 block rounded"></span>
          ) : (
            description2
          )}
        </p>
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#3a4b95] text-base sm:text-lg md:text-xl text-white mt-6 sm:mt-8 md:mt-10 py-3 sm:py-4 md:py-5 w-full sm:w-[80%] md:w-[70%] lg:w-[60%] mx-auto rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg"
          >
            {t("home.registerButton")}
          </motion.button>
        </Link>
      </div>
      <div className="order-1 md:order-2">
        {loading ? (
          <div className="animate-pulse bg-gray-200 w-full h-64 md:h-80 rounded-lg"></div>
        ) : (
          <img
            src={heroImage}
            alt="Hero Image"
            className="w-full h-auto object-cover"
          />
        )}
      </div>
    </motion.div>
  );
};

export default Hero;
