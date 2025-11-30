import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Star,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  X,
  CreditCard,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  approveProduct,
  rejectProduct,
  toggleProductVisibility,
  toggleProductFeatured,
  reorderProducts,
} from "../../store/slices/productsSlice";
import { toast } from "react-toastify";

const AdminProductsTab = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);

  const [activeTab, setActiveTab] = useState<
    "pending" | "approved" | "rejected" | "all"
  >("pending");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");

  // Sort products by displayOrder
  const sortedProducts = [...products].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  // Filter products based on active tab
  const filteredProducts = sortedProducts.filter((product) => {
    if (activeTab === "all") return true;
    return product.approvalStatus === activeTab;
  });

  // Count products by status
  const pendingCount = products.filter(
    (p) => p.approvalStatus === "pending"
  ).length;
  const approvedCount = products.filter(
    (p) => p.approvalStatus === "approved"
  ).length;
  const rejectedCount = products.filter(
    (p) => p.approvalStatus === "rejected"
  ).length;

  const handleApprove = (id: number) => {
    dispatch(approveProduct(id));
    toast.success(t("dashboard.adminProducts.approveSuccess"));
  };

  const openRejectModal = (id: number) => {
    setSelectedProductId(id);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleReject = () => {
    if (!selectedProductId) return;
    if (!rejectionReason.trim()) {
      toast.error(t("dashboard.adminProducts.rejectReasonRequired"));
      return;
    }

    dispatch(rejectProduct({ id: selectedProductId, reason: rejectionReason }));
    toast.success(t("dashboard.adminProducts.rejectSuccess"));
    setRejectModalOpen(false);
    setSelectedProductId(null);
    setRejectionReason("");
  };

  const handleToggleVisibility = (id: number) => {
    dispatch(toggleProductVisibility(id));
  };

  const handleToggleFeatured = (id: number) => {
    dispatch(toggleProductFeatured(id));
  };

  const handleReorder = (id: number, direction: "up" | "down") => {
    dispatch(reorderProducts({ id, direction }));
  };

  const tabs = [
    {
      key: "pending" as const,
      label: t("dashboard.adminProducts.pending"),
      count: pendingCount,
      color: "yellow",
    },
    {
      key: "approved" as const,
      label: t("dashboard.adminProducts.approved"),
      count: approvedCount,
      color: "green",
    },
    {
      key: "rejected" as const,
      label: t("dashboard.adminProducts.rejected"),
      count: rejectedCount,
      color: "red",
    },
    {
      key: "all" as const,
      label: t("dashboard.adminProducts.all"),
      count: products.length,
      color: "gray",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("dashboard.adminProducts.title")}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.key
                ? tab.color === "yellow"
                  ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-400"
                  : tab.color === "green"
                    ? "bg-green-100 text-green-800 border-2 border-green-400"
                    : tab.color === "red"
                      ? "bg-red-100 text-red-800 border-2 border-red-400"
                      : "bg-gray-100 text-gray-800 border-2 border-gray-400"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                tab.color === "yellow"
                  ? "bg-yellow-200 text-yellow-800"
                  : tab.color === "green"
                    ? "bg-green-200 text-green-800"
                    : tab.color === "red"
                      ? "bg-red-200 text-red-800"
                      : "bg-gray-200 text-gray-800"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12 text-gray-500"
            >
              {t("dashboard.adminProducts.noProducts")}
            </motion.div>
          ) : (
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${
                  product.approvalStatus === "approved"
                    ? "border-green-200"
                    : product.approvalStatus === "rejected"
                      ? "border-red-200"
                      : "border-yellow-200"
                }`}
              >
                {/* Product Image */}
                <div className="relative h-48">
                  <img
                    src={product.image}
                    alt={i18n.language === "ar" ? product.nameAr : product.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Status Badge */}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      product.approvalStatus === "approved"
                        ? "bg-green-500 text-white"
                        : product.approvalStatus === "rejected"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-white"
                    }`}
                  >
                    {product.approvalStatus === "approved" && (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    {product.approvalStatus === "rejected" && (
                      <XCircle className="w-3 h-3" />
                    )}
                    {product.approvalStatus === "pending" && (
                      <Clock className="w-3 h-3" />
                    )}
                    {product.approvalStatus === "approved" &&
                      t("dashboard.adminProducts.approved")}
                    {product.approvalStatus === "rejected" &&
                      t("dashboard.adminProducts.rejected")}
                    {product.approvalStatus === "pending" &&
                      t("dashboard.adminProducts.pending")}
                  </div>
                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {t("dashboard.adminProducts.featured")}
                    </div>
                  )}
                  {/* Visibility Badge */}
                  {!product.isVisible &&
                    product.approvalStatus === "approved" && (
                      <div className="absolute bottom-3 right-3 bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                        {t("dashboard.adminProducts.hidden")}
                      </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {i18n.language === "ar" ? product.nameAr : product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {i18n.language === "ar"
                      ? product.descriptionAr
                      : product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-primary">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {t("dashboard.products.stock")}: {product.stock}
                    </span>
                  </div>

                  {/* Installment Options */}
                  {product.allowInstallment &&
                    product.installmentOptions?.length > 0 && (
                      <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-1 text-blue-800 text-xs font-medium mb-1">
                          <CreditCard className="w-3 h-3" />
                          {t("dashboard.adminProducts.installmentAvailable")}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.installmentOptions.map((tier) => (
                            <span
                              key={tier.months}
                              className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                            >
                              {tier.months}{" "}
                              {t("dashboard.products.monthsShort")} (+
                              {tier.percentage}%)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Rejection Reason */}
                  {product.approvalStatus === "rejected" &&
                    product.rejectionReason && (
                      <div className="mb-3 p-2 bg-red-50 rounded-lg">
                        <p className="text-xs text-red-700">
                          <strong>
                            {t("dashboard.adminProducts.reason")}:
                          </strong>{" "}
                          {product.rejectionReason}
                        </p>
                      </div>
                    )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.approvalStatus === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(product.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {t("dashboard.adminProducts.approve")}
                        </button>
                        <button
                          onClick={() => openRejectModal(product.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          {t("dashboard.adminProducts.reject")}
                        </button>
                      </>
                    )}

                    {product.approvalStatus === "approved" && (
                      <>
                        <button
                          onClick={() => handleToggleVisibility(product.id)}
                          className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                            product.isVisible
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          {product.isVisible ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              {t("dashboard.adminProducts.hide")}
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              {t("dashboard.adminProducts.show")}
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(product.id)}
                          className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                            product.isFeatured
                              ? "bg-orange-500 text-white hover:bg-orange-600"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <Star
                            className={`w-4 h-4 ${product.isFeatured ? "fill-current" : ""}`}
                          />
                          {product.isFeatured
                            ? t("dashboard.adminProducts.unfeature")
                            : t("dashboard.adminProducts.feature")}
                        </button>
                      </>
                    )}

                    {product.approvalStatus === "rejected" && (
                      <button
                        onClick={() => handleApprove(product.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {t("dashboard.adminProducts.reapprove")}
                      </button>
                    )}
                  </div>

                  {/* Reorder Buttons (only for approved) */}
                  {product.approvalStatus === "approved" &&
                    activeTab === "approved" && (
                      <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t">
                        <button
                          onClick={() => handleReorder(product.id, "up")}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          title={t("dashboard.adminProducts.moveUp")}
                        >
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-sm text-gray-500">
                          #{product.displayOrder}
                        </span>
                        <button
                          onClick={() => handleReorder(product.id, "down")}
                          disabled={index === filteredProducts.length - 1}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          title={t("dashboard.adminProducts.moveDown")}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setRejectModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-red-500" />
                  {t("dashboard.adminProducts.rejectProduct")}
                </h3>
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                {t("dashboard.adminProducts.rejectMessage")}
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={t("dashboard.adminProducts.rejectPlaceholder")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={4}
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleReject}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  {t("dashboard.adminProducts.confirmReject")}
                </button>
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductsTab;
