import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Check,
  ArrowLeft,
  ArrowRight,
  Star,
  CreditCard,
  Banknote,
  Package,
  Truck,
  Shield,
  Clock,
  Heart,
  Share2,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice";
import type { InstallmentTier } from "../../types/product";
import SEO from "../../components/SEO";
import test1 from "../../assets/images/test1.png";

const ProductDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isRTL = i18n.language === "ar";

  const products = useAppSelector((state) => state.products.products);
  const product = useMemo(() => {
    return products.find((p) => p.id === Number(id));
  }, [products, id]);

  const [quantity, setQuantity] = useState(1);
  const [selectedInstallment, setSelectedInstallment] =
    useState<InstallmentTier | null>(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Calculate prices
  const baseTotal = product ? product.price * quantity : 0;
  const installmentTotal = selectedInstallment
    ? baseTotal * (1 + selectedInstallment.percentage / 100)
    : baseTotal;
  const monthlyPayment = selectedInstallment
    ? installmentTotal / selectedInstallment.months
    : 0;

  // Get related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          p.category === product.category &&
          p.approvalStatus === "approved" &&
          p.isVisible
      )
      .slice(0, 4);
  }, [products, product]);

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        id: product.id,
        name: isRTL ? product.nameAr : product.name,
        price: product.price,
        progress:
          product.stock > 0 ? Math.min(100, (product.stock / 100) * 100) : 0,
        image: product.image,
        allowInstallment: product.allowInstallment,
        installmentOptions: product.installmentOptions,
      })
    );

    // Add multiple times based on quantity
    for (let i = 1; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product.id,
          name: isRTL ? product.nameAr : product.name,
          price: product.price,
          progress:
            product.stock > 0 ? Math.min(100, (product.stock / 100) * 100) : 0,
          image: product.image,
          allowInstallment: product.allowInstallment,
          installmentOptions: product.installmentOptions,
        })
      );
    }

    setIsAddedToCart(true);
    toast.success(
      t("products.addedToCart", {
        name: isRTL ? product.nameAr : product.name,
      }),
      {
        position: "top-right",
        autoClose: 2000,
      }
    );

    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: isRTL ? product.nameAr : product.name,
      text: isRTL ? product.descriptionAr : product.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t("productDetails.linkCopied"));
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            {t("productDetails.productNotFound")}
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-[#F65331] text-white rounded-lg font-bold"
          >
            {t("productDetails.backToProducts")}
          </motion.button>
        </div>
      </div>
    );
  }

  // Mock images for gallery (in real app, product would have multiple images)
  const productImages = [product.image || test1, test1, test1];

  return (
    <>
      <SEO
        title={isRTL ? product.nameAr : product.name}
        description={isRTL ? product.descriptionAr : product.description}
        keywords={`${product.name}, ${product.category}, makanizm`}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-gray-600 mb-6"
          >
            <button
              onClick={() => navigate("/")}
              className="hover:text-[#384B97] transition-colors"
            >
              {t("nav.home")}
            </button>
            <span>/</span>
            <button
              onClick={() => navigate("/products")}
              className="hover:text-[#384B97] transition-colors"
            >
              {t("nav.products")}
            </button>
            <span>/</span>
            <span className="text-[#384B97] font-semibold">
              {isRTL ? product.nameAr : product.name}
            </span>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Left Side - Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.isFeatured && (
                    <span className="bg-[#F65331] text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3" />
                      {t("productDetails.featured")}
                    </span>
                  )}
                  {product.allowInstallment && (
                    <span className="bg-[#384B97] text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                      <CreditCard className="w-3 h-3" />
                      {t("productDetails.installmentAvailable")}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2.5 rounded-full shadow-md transition-all ${
                      isWishlisted
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="p-2.5 bg-white text-gray-600 rounded-full shadow-md hover:bg-gray-100 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Image */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={productImages[activeImageIndex]}
                    alt={isRTL ? product.nameAr : product.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-contain p-8"
                  />
                </AnimatePresence>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3 justify-center">
                {productImages.map((img, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === index
                        ? "border-[#384B97] shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-contain p-2"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Category */}
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                {product.category === "meat" &&
                  t("productDetails.categories.meat")}
                {product.category === "chicken" &&
                  t("productDetails.categories.chicken")}
                {product.category === "fish" &&
                  t("productDetails.categories.fish")}
                {product.category === "other" &&
                  t("productDetails.categories.other")}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {isRTL ? product.nameAr : product.name}
              </h1>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-[#384B97]">
                    {selectedInstallment
                      ? Math.round(installmentTotal)
                      : baseTotal}
                  </span>
                  <span className="text-xl text-gray-500">
                    {t("common.currency")}
                  </span>
                  {selectedInstallment && (
                    <span className="text-lg text-gray-400 line-through">
                      {baseTotal} {t("common.currency")}
                    </span>
                  )}
                </div>
                {selectedInstallment && (
                  <p className="text-[#F65331] font-semibold">
                    {Math.round(monthlyPayment)} {t("common.currency")} /{" "}
                    {t("productDetails.month")} × {selectedInstallment.months}{" "}
                    {t("productDetails.months")}
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-lg">
                {isRTL ? product.descriptionAr : product.description}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.stock > 10
                      ? "bg-green-500"
                      : product.stock > 0
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    product.stock > 10
                      ? "text-green-600"
                      : product.stock > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {product.stock > 10
                    ? `${t("productDetails.inStock")} (${product.stock} ${t("productDetails.items")})`
                    : product.stock > 0
                      ? `${t("productDetails.limitedStock")} (${product.stock} ${t("productDetails.items")})`
                      : t("productDetails.outOfStock")}
                </span>
              </div>

              {/* Payment Options */}
              {product.allowInstallment &&
                product.installmentOptions.length > 0 && (
                  <div className="bg-white rounded-xl p-5 shadow-md space-y-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#384B97]" />
                      {t("productDetails.paymentOptions")}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {/* Cash Option */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedInstallment(null)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                          !selectedInstallment
                            ? "bg-[#384B97] text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Banknote className="w-5 h-5" />
                        {t("productDetails.cash")}
                      </motion.button>

                      {/* Installment Options */}
                      {product.installmentOptions.map((tier) => (
                        <motion.button
                          key={tier.months}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedInstallment(tier)}
                          className={`flex flex-col items-center px-4 py-3 rounded-lg font-semibold transition-all ${
                            selectedInstallment?.months === tier.months
                              ? "bg-[#F65331] text-white shadow-md"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            {tier.months} {t("productDetails.months")}
                          </span>
                          <span className="text-xs opacity-80">
                            +{tier.percentage}%
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700">
                  {t("productDetails.quantity")}
                </span>
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 bg-white rounded-md flex items-center justify-center hover:bg-gray-200 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="text-xl font-bold w-12 text-center">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="w-8 h-8 bg-white rounded-md flex items-center justify-center hover:bg-gray-200 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                    product.stock === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#F65331] text-white hover:bg-[#e54525] shadow-lg hover:shadow-xl"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isAddedToCart ? (
                      <motion.div
                        key="added"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-6 h-6" />
                        {t("productDetails.added")}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="add"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="w-6 h-6" />
                        {t("productDetails.addToCart")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/cart")}
                  className="px-6 py-4 border-2 border-[#384B97] text-[#384B97] rounded-xl font-bold hover:bg-[#384B97] hover:text-white transition-all"
                >
                  {t("productDetails.viewCart")}
                </motion.button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-[#384B97]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {t("productDetails.features.fastShipping")}
                    </p>
                    <p className="text-xs">
                      {t("productDetails.features.shippingDays")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {t("productDetails.features.qualityGuarantee")}
                    </p>
                    <p className="text-xs">
                      {t("productDetails.features.authentic")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#F65331]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {t("productDetails.features.support")}
                    </p>
                    <p className="text-xs">
                      {t("productDetails.features.alwaysAvailable")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {t("productDetails.features.securePayment")}
                    </p>
                    <p className="text-xs">
                      {t("productDetails.features.multipleMethods")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                {t("productDetails.relatedProducts")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <motion.div
                    key={relatedProduct.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => navigate(`/products/${relatedProduct.id}`)}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="aspect-square bg-gray-50 p-4">
                      <img
                        src={relatedProduct.image || test1}
                        alt={
                          isRTL ? relatedProduct.nameAr : relatedProduct.name
                        }
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                        {isRTL ? relatedProduct.nameAr : relatedProduct.name}
                      </h3>
                      <p className="text-[#384B97] font-bold">
                        {relatedProduct.price} {t("common.currency")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate(-1)}
            className="fixed bottom-8 left-8 z-50 flex items-center gap-2 px-5 py-3 bg-white shadow-lg rounded-full text-gray-700 hover:bg-gray-50 transition-all"
          >
            {isRTL ? (
              <>
                <span className="font-semibold">{t("common.back")}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">{t("common.back")}</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
