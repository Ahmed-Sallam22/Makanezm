import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Check,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { addToCart, addToCartAsync } from "../../../../store/slices/cartSlice";
import { getFeaturedProducts, type PublicProduct } from "../../../../services/productService";
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

const ProductsHome = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [addedProducts, setAddedProducts] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // API state
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products from API (max 3 products)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getFeaturedProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error(isRTL ? "فشل في تحميل المنتجات" : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isRTL]);

  const handleAddToCart = async (product: PublicProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const productName = isRTL ? product.nameAr : product.name;

    if (isAuthenticated) {
      try {
        await dispatch(addToCartAsync({ productId: product.id, quantity: 1 })).unwrap();
        setAddedProducts((prev) => [...prev, product.id]);
        toast.success(t("products.addedToCart", { name: productName }), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(String(error));
      }
    } else {
      dispatch(
        addToCart({
          id: product.id,
          name: productName,
          price: product.price,
          image: product.main_image_base64 || product.image || undefined,
          allowInstallment: product.allowInstallment,
          installmentOptions: product.installmentOptions,
        })
      );
      setAddedProducts((prev) => [...prev, product.id]);
      toast.success(t("products.addedToCart", { name: productName }), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 2000,
      });
    }

    setTimeout(() => {
      setAddedProducts((prev) => prev.filter((id) => id !== product.id));
    }, 2000);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-[#384B97]" />
            </motion.div>
          </div>
        )}

        {/* No Products State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {isRTL ? "لا توجد منتجات متاحة حالياً" : "No products available"}
            </p>
          </div>
        )}

        {/* Products Display */}
        {!loading && products.length > 0 && (
          <>
            {/* Products Grid Container */}
            <div className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product, index) => {
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
                      className="perspective-1000"
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
                              src={product.main_image_base64 || product.image || test1}
                              alt={isRTL ? product.nameAr : product.name}
                              className="w-[60%] h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = test1;
                              }}
                            />
                          </div>

                          {/* Product Info */}
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-bold text-black">
                                {isRTL ? product.nameAr : product.name}
                              </h3>
                              <p className="text-xl font-bold text-black flex items-center gap-1">
                                {product.price}
                                <CurrencyIcon size={25} />
                              </p>
                            </div>

                            {/* Price Buttons */}
                            <div className="flex gap-3 mb-3">
                              {product.installmentOptions && product.installmentOptions.length > 0 ? (
                                <>
                                  <div className="bg-secondary text-white p-2 rounded-lg flex-1 text-center">
                                    <p className="text-xs font-semibold mb-1">
                                      {t("home.productsHome.installmentSale")}
                                    </p>
                                    <p className="text-sm font-bold flex items-center justify-center gap-1">
                                      {Math.round(product.price * (1 + product.installmentOptions[0].percentage / 100))}
                                      <CurrencyIcon color="white" size={20} />
                                    </p>
                                    <p className="text-[10px] opacity-80">
                                      {product.installmentOptions[0].months} {isRTL ? "شهر" : "months"}
                                    </p>
                                  </div>
                                  <div className="bg-secondary text-white p-2 rounded-lg flex-1 text-center">
                                    <p className="text-xs font-semibold mb-1">
                                      {t("home.productsHome.expectedProfit")}
                                    </p>
                                    <p className="text-sm font-bold flex items-center justify-center gap-1">
                                      {Math.round(product.price * (product.installmentOptions[0].percentage / 100))}
                                      <CurrencyIcon color="white" size={20} />
                                    </p>
                                    <p className="text-[10px] opacity-80">
                                      +{product.installmentOptions[0].percentage}%
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <div className="bg-gray-200 text-gray-600 p-2 rounded-lg flex-1 text-center">
                                  <p className="text-xs font-semibold">
                                    {isRTL ? "السعر الثابت" : "Fixed Price"}
                                  </p>
                                  <p className="text-sm font-bold flex items-center justify-center gap-1">
                                    {product.price}
                                    <CurrencyIcon color="#374151" size={20} />
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Stock/Availability Indicator */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <p className="text-xs font-semibold text-gray-700">
                                  {isRTL ? "الحالة" : "Status"}
                                </p>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.stock_status === 'high'
                                    ? 'bg-green-100 text-green-700'
                                    : product.stock_status === 'medium'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : product.stock_status === 'low'
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-red-100 text-red-700'
                                  }`}>
                                  {product.stock_status === 'high'
                                    ? (isRTL ? 'متوفر' : 'In Stock')
                                    : product.stock_status === 'medium'
                                      ? (isRTL ? 'متاح' : 'Available')
                                      : product.stock_status === 'low'
                                        ? (isRTL ? 'محدود' : 'Limited')
                                        : (isRTL ? 'نفذ' : 'Out')}
                                </span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={
                                    isInView
                                      ? { width: `${product.stock_percentage}%` }
                                      : { width: 0 }
                                  }
                                  transition={{
                                    duration: 1,
                                    delay: 0.5 + index * 0.1,
                                  }}
                                  className={`h-full rounded-full ${product.stock_status === 'high'
                                      ? "bg-green-500"
                                      : product.stock_status === 'medium'
                                        ? "bg-yellow-500"
                                        : product.stock_status === 'low'
                                          ? "bg-orange-500"
                                          : "bg-red-500"
                                    }`}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {product.in_stock ? (
                                  isRTL ? `${product.stock} من ${product.max_stock}` : `${product.stock} of ${product.max_stock}`
                                ) : (
                                  isRTL ? "غير متوفر" : "Out of stock"
                                )}
                              </p>
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
                            {isRTL ? product.nameAr : product.name}
                          </h3>

                          {/* Description */}
                          <p className="text-white/90 text-center text-sm mb-6 leading-relaxed">
                            {isRTL ? product.descriptionAr : product.description}
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
          </>
        )}
      </div>
    </motion.section>
  );
};

export default ProductsHome;

