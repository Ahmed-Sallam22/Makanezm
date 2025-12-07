import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Check,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../../store/hooks";
import { addToCart } from "../../../../store/slices/cartSlice";
import test1 from "../../../../assets/images/test1.png";

// Currency SVG Component
const CurrencyIcon = ({
  color = "black",
  size = 30,
}: {
  color?: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 35 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.0417 24.7916H18.9584V27.7083H16.0417V24.7916ZM20.4167 24.7916H23.3334V27.7083H20.4167V24.7916ZM13.125 5.83325H16.0417V21.8749C16.0417 23.422 15.4271 24.9057 14.3331 25.9997C13.2392 27.0937 11.7554 27.7083 10.2084 27.7083H7.29169C6.13136 27.7083 5.01857 27.2473 4.19809 26.4268C3.37762 25.6064 2.91669 24.4936 2.91669 23.3333V17.4999H5.83335V23.3333C5.83335 23.72 5.987 24.091 6.26049 24.3645C6.53398 24.6379 6.90491 24.7916 7.29169 24.7916H10.2084C11.8271 24.7916 13.125 23.4937 13.125 21.8749V5.83325ZM17.5 5.83325H20.4167V18.9583H24.7917V11.6666H27.7084V18.9583C27.7084 20.577 26.4104 21.8749 24.7917 21.8749H20.4167C18.7979 21.8749 17.5 20.577 17.5 18.9583V5.83325ZM29.1667 14.5833H32.0834V24.7916C32.0834 25.9519 31.6224 27.0647 30.8019 27.8852C29.9815 28.7057 28.8687 29.1666 27.7084 29.1666H24.7917V26.2499H27.7084C28.0951 26.2499 28.4661 26.0963 28.7396 25.8228C29.013 25.5493 29.1667 25.1784 29.1667 24.7916V14.5833Z"
      fill={color}
    />
  </svg>
);

interface Product {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  installmentPrice: number;
  expectedProfit: number;
  savingsPercentage: number;
  image: string;
}

const ProductsHome = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addedProducts, setAddedProducts] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      addToCart({ id: product.id, name: product.name, price: product.price })
    );
    setAddedProducts((prev) => [...prev, product.id]);

    setTimeout(() => {
      setAddedProducts((prev) => prev.filter((id) => id !== product.id));
    }, 2000);

    toast.success(
      t("products.addedToCart", {
        name: isRTL ? product.name : product.nameEn,
      }),
      {
        position: "top-right",
        autoClose: 2000,
      }
    );
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  // Sample products data - replace with actual data
  const products: Product[] = [
    {
      id: 1,
      name: "وجبة سمك",
      nameEn: "Fish Meal",
      description: "وجبة سمك طازجة مع الأرز والسلطة",
      descriptionEn: "Fresh fish meal with rice and salad",
      price: 50,
      installmentPrice: 70,
      expectedProfit: 20,
      savingsPercentage: 35,
      image: test1,
    },
    {
      id: 2,
      name: "وجبة دجاج",
      nameEn: "Chicken Meal",
      description: "دجاج مشوي طري مع البطاطس",
      descriptionEn: "Tender grilled chicken with potatoes",
      price: 30,
      installmentPrice: 40,
      expectedProfit: 10,
      savingsPercentage: 25,
      image: test1,
    },
    {
      id: 3,
      name: "وجبة لحوم",
      nameEn: "Meat Meal",
      description: "لحم بقري فاخر مع صوص خاص",
      descriptionEn: "Premium beef with special sauce",
      price: 50,
      installmentPrice: 70,
      expectedProfit: 20,
      savingsPercentage: 35,
      image: test1,
    },
    {
      id: 4,
      name: "وجبة سمك",
      nameEn: "Fish Meal",
      description: "وجبة سمك طازجة مع الأرز والسلطة",
      descriptionEn: "Fresh fish meal with rice and salad",
      price: 50,
      installmentPrice: 70,
      expectedProfit: 20,
      savingsPercentage: 35,
      image: test1,
    },
    {
      id: 5,
      name: "وجبة مشوية",
      nameEn: "Grilled Meal",
      description: "تشكيلة مشويات متنوعة شهية",
      descriptionEn: "Delicious assorted grilled items",
      price: 50,
      installmentPrice: 70,
      expectedProfit: 20,
      savingsPercentage: 35,
      image: test1,
    },
  ];

  // Calculate how many slides we need (3 products per slide on desktop)
  const productsPerSlide = 3;
  const totalSlides = Math.ceil(products.length / productsPerSlide);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  // Get products for current slide
  const getCurrentSlideProducts = () => {
    const start = currentIndex * productsPerSlide;
    return products.slice(start, start + productsPerSlide);
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
      className="my-12 md:my-16 lg:my-20"
    >
      <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#384B97] text-center mb-8 md:mb-12"
        >
          {t("home.productsHome.title")}
        </motion.h2>

        {/* Swiper Container */}
        <div className="relative">
          {/* Left Arrow */}
          {totalSlides > 1 && (
            <motion.button
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute ${
                isRTL ? "-right-12" : "-left-12"
              } top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentIndex === 0}
              aria-label="Previous"
            >
              <ChevronRight className="w-6 h-6 text-[#384B97]" />
            </motion.button>
          )}

          {/* Products Grid Container */}
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 "
            >
              {getCurrentSlideProducts().map((product, index) => {
                const originalIndex = currentIndex * productsPerSlide + index;
                const isFlipped = flippedCards.includes(product.id);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.9 }
                    }
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + index * 0.1,
                    }}
                    className="col-span-1 md:col-span-1 lg:col-span-4 perspective-1000"
                    onMouseEnter={() =>
                      setFlippedCards((prev) => [...prev, product.id])
                    }
                    onMouseLeave={() =>
                      setFlippedCards((prev) =>
                        prev.filter((id) => id !== product.id)
                      )
                    }
                  >
                    {/* Flip Card Container */}
                    <div
                      className="relative w-full h-[450px] transition-transform duration-700 cursor-pointer"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      }}
                    >
                      {/* Front Side */}
                      <div
                        className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-lg overflow-hidden"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        {/* Product Image */}
                        <div className="w-full h-48 flex items-center justify-center bg-gray-50">
                          <img
                            src={product.image}
                            alt={isRTL ? product.name : product.nameEn}
                            className="w-[60%] h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-black">
                              {isRTL ? product.name : product.nameEn}
                            </h3>
                            <p className="text-xl font-bold text-black flex items-center gap-1">
                              {product.price}
                              <CurrencyIcon size={25} />
                            </p>
                          </div>

                          {/* Price Buttons */}
                          <div className="flex gap-3 mb-3">
                            <div className="bg-secondary text-white p-2 rounded-lg flex-1 text-center">
                              <p className="text-xs font-semibold mb-1">
                                {t("home.productsHome.installmentSale")}
                              </p>
                              <p className="text-sm font-bold flex items-center justify-center gap-1">
                                {product.installmentPrice}
                                <CurrencyIcon color="white" size={20} />
                              </p>
                            </div>
                            <div className="bg-secondary text-white p-2 rounded-lg flex-1 text-center">
                              <p className="text-xs font-semibold mb-1">
                                {t("home.productsHome.expectedProfit")}
                              </p>
                              <p className="text-sm font-bold flex items-center justify-center gap-1">
                                {product.expectedProfit}
                                <CurrencyIcon color="white" size={20} />
                              </p>
                            </div>
                          </div>

                          {/* Savings Indicator */}
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                              {t("home.productsHome.savingsIndicator")}
                            </p>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={
                                  isInView
                                    ? { width: `${product.savingsPercentage}%` }
                                    : { width: 0 }
                                }
                                transition={{
                                  duration: 1,
                                  delay: 0.5 + originalIndex * 0.1,
                                }}
                                className="h-full bg-[#384B97] rounded-full"
                              />
                            </div>
                          </div>

                          {/* Flip Hint */}
                          <div className="mt-3 text-center">
                            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                              <Eye className="w-3 h-3" />
                              {isRTL ? "مرر للمزيد" : "Hover for more"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Back Side */}
                      <div
                        className="absolute inset-0 w-full h-full bg-linear-to-br from-[#384B97] to-[#2a3a75] rounded-xl shadow-lg overflow-hidden flex flex-col items-center justify-center p-6"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        {/* Product Name */}
                        <h3 className="text-2xl font-bold text-white mb-4 text-center">
                          {isRTL ? product.name : product.nameEn}
                        </h3>

                        {/* Description */}
                        <p className="text-white/90 text-center text-sm mb-6 leading-relaxed">
                          {isRTL ? product.description : product.descriptionEn}
                        </p>

                        {/* Price */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6 w-full">
                          <div className="flex items-center justify-center gap-2 text-white">
                            <span className="text-3xl font-bold">
                              {product.price}
                            </span>
                            <CurrencyIcon color="white" size={30} />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 w-full">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product.id);
                            }}
                            className="flex items-center justify-center gap-2 bg-white text-[#384B97] px-5 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-all"
                          >
                            <Eye className="w-5 h-5" />
                            {isRTL ? "عرض التفاصيل" : "View Details"}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handleAddToCart(product, e)}
                            className="flex items-center justify-center gap-2 bg-[#F65331] text-white px-5 py-3 rounded-full font-bold shadow-lg hover:bg-[#e54525] transition-all"
                          >
                            <AnimatePresence mode="wait">
                              {addedProducts.includes(product.id) ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  className="flex items-center gap-2"
                                >
                                  <Check className="w-5 h-5" />
                                  <span>
                                    {isRTL ? "تمت الإضافة!" : "Added!"}
                                  </span>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="cart"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="flex items-center gap-2"
                                >
                                  <ShoppingCart className="w-5 h-5" />
                                  <span>
                                    {isRTL ? "أضف للسلة" : "Add to Cart"}
                                  </span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Arrow */}
          {totalSlides > 1 && (
            <motion.button
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute ${
                isRTL ? "-left-12" : "-right-12"
              } top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all ${
                currentIndex === totalSlides - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentIndex === totalSlides - 1}
              aria-label="Next"
            >
              <ChevronLeft className="w-6 h-6 text-[#384B97]" />
            </motion.button>
          )}

          {/* Pagination Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentIndex === index ? "bg-[#384B97] w-8" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default ProductsHome;
