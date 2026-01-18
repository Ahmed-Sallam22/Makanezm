import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getActiveSliders, type Slider } from "../../services/sliderService";

const HeroSlider = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [activeSlider, setActiveSlider] = useState<Slider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await getActiveSliders();
        const sliders = response.data.sliders || [];
        // Get only the first active slider (already sorted by order from backend)
        if (sliders.length > 0) {
          setActiveSlider(sliders[0]);
        }
      } catch (error) {
        console.error("Failed to fetch sliders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-r from-[#3a4b95] to-[#c4886a] animate-pulse" />
    );
  }

  if (!activeSlider) {
    return null;
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute inset-0"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${activeSlider.image})` }}
        >
          {/* Gradient Overlay - Blue and Orange theme */}
          {/* <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(56, 75, 151, 0.9) 0%, rgba(100, 120, 180, 0.85) 40%, rgba(246, 83, 49, 0.85) 100%)",
            }}
          /> */}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm sm:text-base md:text-lg font-bold text-white/90 uppercase tracking-wider mb-2 sm:mb-4"
          >
            {isRTL ? activeSlider.title_ar : activeSlider.title}
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 sm:mb-6"
            style={{
              textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
              fontFamily: "'Impact', 'Arial Black', sans-serif",
            }}
          >
            {isRTL ? activeSlider.title_ar : activeSlider.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 font-medium italic max-w-2xl px-4"
          >
            {isRTL ? activeSlider.description_ar : activeSlider.description}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSlider;
