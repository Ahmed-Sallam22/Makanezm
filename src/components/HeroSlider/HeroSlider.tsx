import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/hooks";

const HeroSlider = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const sliders = useAppSelector((state) => state.sliders.sliders);

  // Filter only active sliders and sort by order
  const activeSliders = sliders
    .filter((s) => s.isActive)
    .sort((a, b) => a.order - b.order);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    if (activeSliders.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeSliders.length);
  }, [activeSliders.length]);

  const prevSlide = useCallback(() => {
    if (activeSliders.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + activeSliders.length) % activeSliders.length
    );
  }, [activeSliders.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || activeSliders.length <= 1) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, activeSliders.length]);

  // Reset index if sliders change
  useEffect(() => {
    if (currentIndex >= activeSliders.length && activeSliders.length > 0) {
      const timer = setTimeout(() => setCurrentIndex(0), 0);
      return () => clearTimeout(timer);
    }
  }, [activeSliders.length, currentIndex]);

  if (activeSliders.length === 0) {
    return null;
  }

  const currentSlider = activeSliders[currentIndex];

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlider.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSlider.image})` }}
          >
            {/* Gradient Overlay - Blue and Orange theme */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(56, 75, 151, 0.9) 0%, rgba(100, 120, 180, 0.85) 40%, rgba(246, 83, 49, 0.85) 100%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-8">
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm sm:text-base md:text-lg font-bold text-white/90 uppercase tracking-wider mb-2 sm:mb-4"
            >
              {isRTL ? currentSlider.titleAr : currentSlider.title}
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
              {isRTL ? currentSlider.titleAr : currentSlider.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 font-medium italic max-w-2xl px-4"
            >
              {isRTL ? currentSlider.descriptionAr : currentSlider.description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {activeSliders.length > 1 && (
        <>
          <button
            onClick={() => {
              if (isRTL) {
                nextSlide();
              } else {
                prevSlide();
              }
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-[#384B97]/30 hover:bg-[#F65331]/80 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => {
              if (isRTL) {
                prevSlide();
              } else {
                nextSlide();
              }
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-[#384B97]/30 hover:bg-[#F65331]/80 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {activeSliders.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
          {activeSliders.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[#F65331] w-6 sm:w-8"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isAutoPlaying && activeSliders.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#384B97]/30 z-20">
          <motion.div
            key={currentIndex}
            className="h-full bg-[#F65331]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
