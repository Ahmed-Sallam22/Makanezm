import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import heroImage from "../../../../assets/images/Home.png";
import { Link } from "react-router-dom";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center py-8 md:py-12 lg:py-16"
    >
      <div className="flex flex-col space-y-4 sm:space-y-6 w-full md:w-[90%] lg:w-[80%] mx-auto order-2 md:order-1 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#384B97]">
          {t("home.heroTitle")}
        </h2>
        <p className="text-justify sm:text-lg md:text-xl text-black">
          {t("home.heroDescription1")}
        </p>
        <p className="text-justify sm:text-lg md:text-xl text-black">
          {t("home.heroDescription2")}
        </p>
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-secondary text-base sm:text-lg md:text-xl text-white mt-6 sm:mt-8 md:mt-10 py-3 sm:py-4 md:py-5 w-full sm:w-[80%] md:w-[70%] lg:w-[60%] mx-auto rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg"
          >
            {t("home.registerButton")}
          </motion.button>
        </Link>
      </div>
      <div className="order-1 md:order-2">
        <img
          src={heroImage}
          alt="Hero Image"
          className="w-full h-auto object-cover"
        />
      </div>
    </motion.div>
  );
};

export default Hero;
