import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice";
import SEO from "../../components/SEO";
import { pageSEO } from "../../types/seo";
import test1 from "../../assets/images/test1.png";
import coverProduct from "../../assets/images/coverProduct.png";
const Products = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: {
    id: number;
    name: string;
    price: number;
    progress: number;
  }) => {
    dispatch(addToCart(product));
    toast.success(t("products.addedToCart", { name: product.name }), {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const products = [
    { id: 1, name: "وجبة سمك", price: 50, progress: 50 },
    { id: 2, name: "وجبة دجاج", price: 30, progress: 20 },
    { id: 3, name: "وجبة لحوم", price: 40, progress: 80 },
    { id: 4, name: "وجبة سمك", price: 50, progress: 50 },
    { id: 5, name: "وجبة دجاج", price: 30, progress: 25 },
    { id: 6, name: "وجبة لحوم", price: 40, progress: 50 },
    { id: 7, name: "وجبة لحوم", price: 40, progress: 50 },
    { id: 8, name: "وجبة لحوم", price: 40, progress: 50 },
    { id: 9, name: "وجبة لحوم", price: 40, progress: 50 },
  ];

  return (
    <>
      <SEO
        title={pageSEO.products.title}
        description={pageSEO.products.description}
        keywords={pageSEO.products.keywords}
      />

      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto px-4 py-12 w-[95%]"
      >
        {/* Cover Image with Animation */}
        <motion.img 
          src={coverProduct} 
          className="w-[75%] mx-auto pb-6" 
          alt="Products Cover"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />


        {/* Header with Title and Filter - Animated */}
        <motion.div 
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Title - Right Side */} 
          <motion.h1
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-4xl font-bold text-[#384B97]"
          >
            {t("products.title")}
          </motion.h1>
          
          {/* Filter Dropdown - Left Side */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <select className="px-6 py-3 rounded-lg border-2 border-gray-200 text-[#384B97] font-semibold bg-white cursor-pointer hover:border-[#F65331] transition-all appearance-none pr-12">
              <option value="">{t("products.filter.label")}</option>
              <option value="meat">{t("products.filter.meat")}</option>
              <option value="chicken">{t("products.filter.chicken")}</option>
              <option value="fish">{t("products.filter.fish")}</option>
              <option value="price-low">{t("products.filter.priceLow")}</option>
              <option value="price-high">{t("products.filter.priceHigh")}</option>
            </select>
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none"
            >
              <path d="M4 6L8 10L12 6" stroke="#F65331" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* Products Grid - Staggered Animation */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          {products.map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.7 + (index * 0.1),
                ease: "easeOut"
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100"
            >
              {/* Product Image */}
              <motion.div 
                className="h-56 flex items-center justify-center bg-white p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={test1} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
              </motion.div>
              
              {/* Product Info */}
              <div className="p-5">
                {/* Name and Price - RTL inline */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold text-gray-800">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-600">
                      <svg width="28" height="28" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0415 24.7917H18.9582V27.7084H16.0415V24.7917ZM20.4165 24.7917H23.3332V27.7084H20.4165V24.7917ZM13.1248 5.83337H16.0415V21.875C16.0415 23.4221 15.4269 24.9059 14.333 25.9998C13.239 27.0938 11.7553 27.7084 10.2082 27.7084H7.2915C6.13118 27.7084 5.01838 27.2474 4.19791 26.427C3.37744 25.6065 2.9165 24.4937 2.9165 23.3334V17.5H5.83317V23.3334C5.83317 23.7201 5.98682 24.0911 6.26031 24.3646C6.5338 24.6381 6.90473 24.7917 7.2915 24.7917H10.2082C11.8269 24.7917 13.1248 23.4938 13.1248 21.875V5.83337ZM17.4998 5.83337H20.4165V18.9584H24.7915V11.6667H27.7082V18.9584C27.7082 20.5771 26.4103 21.875 24.7915 21.875H20.4165C18.7978 21.875 17.4998 20.5771 17.4998 18.9584V5.83337ZM29.1665 14.5834H32.0832V24.7917C32.0832 25.952 31.6222 27.0648 30.8018 27.8853C29.9813 28.7058 28.8685 29.1667 27.7082 29.1667H24.7915V26.25H27.7082C28.0949 26.25 28.4659 26.0964 28.7394 25.8229C29.0129 25.5494 29.1665 25.1785 29.1665 24.7917V14.5834Z" fill="black"/>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#384B97]">
                      {product.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className="bg-[#384B97] h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${product.progress}%` }}
                      transition={{ duration: 1, delay: 0.8 + (index * 0.1), ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-[#F65331] text-white py-3 rounded-lg font-bold hover:bg-[#e54525] transition-all"
                >
                  {t("products.addToCart")}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
};

export default Products;
