import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../store/slices/cartSlice";
import { addOrder } from "../../store/slices/ordersSlice";
import type { Order } from "../../types/order";
import SEO from "../../components/SEO";
import { pageSEO } from "../../types/seo";
import test1 from "../../assets/images/test1.png";

const Cart = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);
  const total = useAppSelector((state) => state.cart.total);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleRemoveItem = (id: number, name: string) => {
    dispatch(removeFromCart(id));
    toast.info(t("cart.removedFromCart", { name }));
  };

  const handleUpdateQuantity = (
    id: number,
    currentQuantity: number,
    delta: number
  ) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    } else {
      // Remove item if quantity becomes 0
      const item = cartItems.find((item) => item.id === id);
      if (item) {
        handleRemoveItem(id, item.name);
      }
    }
  };

  const handleApplyDiscount = () => {
    const validCodes: { [key: string]: number } = {
      AH10: 10,
      AH30: 30,
      AH50: 50,
    };

    const code = discountCode.trim().toUpperCase();

    if (validCodes[code]) {
      setDiscountPercent(validCodes[code]);
      toast.success(t("cart.discountApplied", { percent: validCodes[code] }));
    } else if (code) {
      toast.error(t("cart.invalidCode"));
    }
  };

  const discountAmount = (total * discountPercent) / 100;
  const finalTotal = total - discountAmount;

  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOrderStatusModal, setShowOrderStatusModal] = useState(false);
  const [showDeliveryLinkModal, setShowDeliveryLinkModal] = useState(false);
  const [paymentType, setPaymentType] = useState<"credit" | "cash">("cash");
  const [orderNumber, setOrderNumber] = useState("");

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning(t("cart.cartEmpty"));
      return;
    }
    // Open payment modal first
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    setShowPaymentModal(false);
    // Generate order number
    setOrderNumber(`ORD-${Date.now()}`);
    // Show order status modal
    setShowOrderStatusModal(true);
  };

  const handleOrderStatusNext = () => {
    setShowOrderStatusModal(false);
    // Show delivery link modal
    setShowDeliveryLinkModal(true);
  };

  const handleConfirmDeliveryLink = () => {
    // Create order from cart
    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      items: cartItems.map((item) => ({
        id: item.id,
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      discountAmount,
      finalTotal,
      status: "pending",
      paymentType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add order to store
    dispatch(addOrder(order));

    toast.success(t("checkout.deliveryLink.linkSuccess"));
    setShowDeliveryLinkModal(false);
    // Clear cart
    dispatch(clearCart());
    // Navigate to dashboard/orders
    navigate("/dashboard");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <>
      <SEO
        title={pageSEO.cart.title}
        description={pageSEO.cart.description}
        keywords={pageSEO.cart.keywords}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mx-auto px-4 py-12 w-[95%] max-w-4xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-gray-800">
              {t("cart.title")}
            </h1>
            <ShoppingCart className="w-10 h-10 text-[#F65331]" />
          </div>
          <p className="text-gray-600 text-lg">{t("cart.subtitle")}</p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              {t("cart.emptyCart")}
            </h2>
            <p className="text-gray-500 mb-6">{t("cart.emptyMessage")}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinueShopping}
              className="px-8 py-3 bg-[#F65331] text-white rounded-lg font-bold hover:bg-[#e54525] transition-all"
            >
              {t("cart.continueShopping")}
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-md p-6"
                >
                  <div className="flex items-center gap-6">
                    {/* Product Image - Right Side */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={test1}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Info - Center */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 text-right">
                        {item.name}
                      </h3>
                      {/* Progress Bar */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-[#384B97]">
                          {item.progress || 50}%
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-[#384B97] h-2.5 rounded-full"
                            style={{ width: `${item.progress || 50}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Price and Quantity - Left Side */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-center">
                        <span className="text-2xl font-bold text-gray-800">
                          {item.price}
                        </span>
                        <span className="text-gray-600 mr-1">
                          {t("cart.riyal")}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity, 1)
                          }
                          className="w-8 h-8 bg-white rounded-md flex items-center justify-center hover:bg-gray-200 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                        <span className="text-lg font-bold w-8 text-center">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity, -1)
                          }
                          className="w-8 h-8 bg-white rounded-md flex items-center justify-center hover:bg-gray-200 transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              {/* Discount Code */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder={t("cart.discountCode")}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-right focus:border-[#F65331] focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApplyDiscount}
                  className="px-8 py-3 border-2 border-[#F65331] text-[#F65331] rounded-lg font-bold hover:bg-[#F65331] hover:text-white transition-all"
                >
                  {t("cart.applyDiscount")}
                </motion.button>
              </div>

              <div className="border-t-2 border-gray-200 pt-4 mb-4">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-700 mb-3">
                  <span className="font-semibold">
                    {total} {t("cart.riyal")}
                  </span>
                  <span className="font-semibold">{t("cart.subtotal")}</span>
                </div>

                {/* Discount */}
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600 mb-3">
                    <span className="font-semibold">
                      -{discountAmount.toFixed(0)} {t("cart.riyal")}
                    </span>
                    <span className="font-semibold">
                      خصم {discountPercent}%
                    </span>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between text-gray-700 mb-4">
                  <span className="font-semibold">0 {t("cart.riyal")}</span>
                  <span className="font-semibold">{t("cart.shipping")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="flex-1 py-3 bg-[#F65331] text-white rounded-lg font-bold hover:bg-[#e54525] transition-all"
                >
                  {t("cart.checkout")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinueShopping}
                  className="flex-1 py-3 border-2 border-[#F65331] text-[#F65331] rounded-lg font-bold hover:bg-gray-50 transition-all"
                >
                  {t("cart.continueShopping")}
                </motion.button>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-200 pt-4 flex justify-between text-2xl font-bold">
                <span className="text-gray-800">{t("cart.total")}</span>
                <span className="text-gray-800">
                  {finalTotal.toFixed(0)} {t("cart.riyal")}
                </span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Payment & Invoice Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-[#384B97] mb-6 text-right">
                {t("checkout.paymentInvoice.title")}
              </h2>

              {/* Payment Type Selection */}
              <div className="mb-6">
                <label className="block text-gray-800 font-bold mb-3 text-right">
                  {t("checkout.paymentInvoice.paymentType")}
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-end gap-3 cursor-pointer p-4 border-2 rounded-lg hover:border-[#F65331] transition-all">
                    <span className="font-semibold">
                      {t("checkout.paymentInvoice.creditSale")}
                    </span>
                    <input
                      type="radio"
                      name="paymentType"
                      value="credit"
                      checked={paymentType === "credit"}
                      onChange={(e) =>
                        setPaymentType(e.target.value as "credit" | "cash")
                      }
                      className="w-5 h-5"
                    />
                  </label>
                  <label className="flex items-center justify-end gap-3 cursor-pointer p-4 border-2 rounded-lg hover:border-[#F65331] transition-all">
                    <span className="font-semibold">
                      {t("checkout.paymentInvoice.cashSale")}
                    </span>
                    <input
                      type="radio"
                      name="paymentType"
                      value="cash"
                      checked={paymentType === "cash"}
                      onChange={(e) =>
                        setPaymentType(e.target.value as "credit" | "cash")
                      }
                      className="w-5 h-5"
                    />
                  </label>
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-gray-800 mb-3 text-right">
                  {t("checkout.paymentInvoice.invoiceSummary")}
                </h3>
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {finalTotal.toFixed(0)} {t("cart.riyal")}
                    </span>
                    <span>{t("cart.total")}</span>
                  </div>
                  {paymentType === "credit" && (
                    <div className="flex justify-between text-green-600">
                      <span className="font-semibold">
                        {(finalTotal * 0.15).toFixed(0)} {t("cart.riyal")}
                      </span>
                      <span>{t("checkout.paymentInvoice.expectedProfit")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50"
                >
                  {t("checkout.paymentInvoice.cancel")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmPayment}
                  className="flex-1 py-3 bg-[#F65331] text-white rounded-lg font-bold hover:bg-[#e54525]"
                >
                  {t("checkout.paymentInvoice.confirmPayment")}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Order Status Verification Modal */}
        {showOrderStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-[#384B97] mb-6 text-right">
                {t("checkout.orderStatus.title")}
              </h2>

              {/* Order Information */}
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm text-gray-600 mb-1 text-right">
                    {t("checkout.orderStatus.orderNumber")}
                  </label>
                  <p className="text-lg font-bold text-gray-800 text-right">
                    {orderNumber}
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2 text-right">
                    {t("checkout.orderStatus.customerName")}
                  </label>
                  <input
                    type="text"
                    placeholder="أدخل اسم العميل"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-right focus:border-[#F65331] focus:outline-none"
                  />
                </div>

                {/* Status Badge */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <label className="block text-sm text-gray-600 mb-2 text-right">
                    {t("checkout.orderStatus.status")}
                  </label>
                  <div className="flex items-center justify-end gap-2">
                    <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold">
                      {t("checkout.orderStatus.processing")}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-3 text-right">
                    المنتجات
                  </h4>
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.quantity}x {item.price} ريال
                        </span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowOrderStatusModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50"
                >
                  {t("checkout.orderStatus.close")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOrderStatusNext}
                  className="flex-1 py-3 bg-[#F65331] text-white rounded-lg font-bold hover:bg-[#e54525]"
                >
                  متابعة
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delivery Link Modal */}
        {showDeliveryLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-[#384B97] mb-6 text-right">
                {t("checkout.deliveryLink.title")}
              </h2>

              {/* Product Selection */}
              <div className="mb-6">
                <label className="block text-gray-800 font-bold mb-3 text-right">
                  {t("checkout.deliveryLink.selectProduct")}
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#F65331] transition-all"
                    >
                      <img
                        src={test1}
                        alt={item.name}
                        className="w-16 h-16 object-contain"
                      />
                      <div className="flex-1 text-right">
                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.quantity}x {item.price} ريال
                        </p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery App Selection */}
              <div className="mb-6">
                <label className="block text-gray-800 font-bold mb-3 text-right">
                  {t("checkout.deliveryLink.deliveryApp")}
                </label>
                <select className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-right focus:border-[#F65331] focus:outline-none">
                  <option>مرسول</option>
                  <option>هنقرستيشن</option>
                  <option>جاهز</option>
                  <option>طلبات</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeliveryLinkModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50"
                >
                  إلغاء
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmDeliveryLink}
                  className="flex-1 py-3 bg-[#F65331] text-white rounded-lg font-bold hover:bg-[#e54525]"
                >
                  {t("checkout.deliveryLink.confirmLink")}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Cart;
