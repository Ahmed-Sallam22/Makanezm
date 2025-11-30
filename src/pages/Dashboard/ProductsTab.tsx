import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  DollarSign,
  Image as ImageIcon,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../store/slices/productsSlice";
import type { Product } from "../../types/product";
import { toast } from "react-toastify";

const ProductsTab = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    price: 0,
    category: "meat",
    stock: 0,
    image: "",
    allowInstallment: false,
    installmentOptions: [],
  });

  // Installment tier state
  const [installment3, setInstallment3] = useState({
    enabled: false,
    percentage: 10,
  });
  const [installment6, setInstallment6] = useState({
    enabled: false,
    percentage: 15,
  });
  const [installment12, setInstallment12] = useState({
    enabled: false,
    percentage: 20,
  });

  // Filter products - admin sees all, merchants see only their products
  const filteredProducts = isAdmin
    ? products
    : products.filter((p) => p.userId === user?.id || !p.userId);

  // Build installment options from the tier states
  const buildInstallmentOptions = () => {
    const options: { months: 3 | 6 | 12; percentage: number }[] = [];
    if (installment3.enabled) {
      options.push({ months: 3, percentage: installment3.percentage });
    }
    if (installment6.enabled) {
      options.push({ months: 6, percentage: installment6.percentage });
    }
    if (installment12.enabled) {
      options.push({ months: 12, percentage: installment12.percentage });
    }
    return options;
  };

  const handleAdd = () => {
    if (!formData.name || !formData.nameAr || !formData.price) {
      toast.error(t("dashboard.products.fillRequired"));
      return;
    }

    const installmentOptions = buildInstallmentOptions();
    const allowInstallment = installmentOptions.length > 0;
    const timestamp = new Date().toISOString();
    const productId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct: Product = {
      id: productId,
      name: formData.name || "",
      nameAr: formData.nameAr || "",
      description: formData.description || "",
      descriptionAr: formData.descriptionAr || "",
      price: formData.price || 0,
      category: formData.category || "meat",
      stock: formData.stock || 0,
      image: formData.image || "/src/assets/images/test1.png",
      userId: user?.id,
      installmentOptions,
      allowInstallment,
      approvalStatus: "pending", // New products start as pending
      isVisible: false, // Not visible until admin approves
      isFeatured: false,
      displayOrder: products.length + 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    dispatch(addProduct(newProduct));
    toast.success(t("dashboard.products.addSuccess"));
    resetForm();
  };

  const handleUpdate = () => {
    if (editingId === null) return;

    const installmentOptions = buildInstallmentOptions();
    const allowInstallment = installmentOptions.length > 0;

    dispatch(
      updateProduct({
        id: editingId,
        updates: {
          ...formData,
          installmentOptions,
          allowInstallment,
          // When merchant updates, reset to pending for re-approval
          approvalStatus: "pending",
          isVisible: false,
        },
      })
    );
    toast.success(t("dashboard.products.updateSuccess"));
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t("dashboard.products.deleteConfirm"))) {
      dispatch(deleteProduct(id));
      toast.success(t("dashboard.products.deleteSuccess"));
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setIsAdding(true);

    // Populate installment tiers from product
    const tier3 = product.installmentOptions?.find((t) => t.months === 3);
    const tier6 = product.installmentOptions?.find((t) => t.months === 6);
    const tier12 = product.installmentOptions?.find((t) => t.months === 12);

    setInstallment3({
      enabled: !!tier3,
      percentage: tier3?.percentage || 10,
    });
    setInstallment6({
      enabled: !!tier6,
      percentage: tier6?.percentage || 15,
    });
    setInstallment12({
      enabled: !!tier12,
      percentage: tier12?.percentage || 20,
    });
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      price: 0,
      category: "meat",
      stock: 0,
      image: "",
      allowInstallment: false,
      installmentOptions: [],
    });
    setInstallment3({ enabled: false, percentage: 10 });
    setInstallment6({ enabled: false, percentage: 15 });
    setInstallment12({ enabled: false, percentage: 20 });
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("dashboard.products.title")}
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all"
        >
          <Plus className="w-5 h-5" />
          {t("dashboard.products.addNew")}
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {editingId
                ? t("dashboard.products.editProduct")
                : t("dashboard.products.addProduct")}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-red-600 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("dashboard.products.nameEn")}*
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Product Name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("dashboard.products.nameAr")}*
              </label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) =>
                  setFormData({ ...formData, nameAr: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                placeholder="اسم المنتج"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("dashboard.products.descEn")}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Product Description"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("dashboard.products.descAr")}
              </label>
              <textarea
                value={formData.descriptionAr}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionAr: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-right"
                placeholder="وصف المنتج"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <DollarSign className="w-4 h-4 inline" />
                {t("dashboard.products.price")}*
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <Package className="w-4 h-4 inline" />
                {t("dashboard.products.stock")}
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("dashboard.products.category")}
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Product["category"],
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="meat">{t("products.filter.meat")}</option>
                <option value="chicken">{t("products.filter.chicken")}</option>
                <option value="fish">{t("products.filter.fish")}</option>
                <option value="other">{t("dashboard.products.other")}</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <ImageIcon className="w-4 h-4 inline" />
                {t("dashboard.products.image")}
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="/path/to/image.png"
              />
            </div>
          </div>

          {/* Installment Options Section */}
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-bold text-gray-800">
                {t("dashboard.products.installmentOptions")}
              </h4>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              {/* 3 Months */}
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer min-w-[120px]">
                  <input
                    type="checkbox"
                    checked={installment3.enabled}
                    onChange={(e) =>
                      setInstallment3({
                        ...installment3,
                        enabled: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">
                    {t("dashboard.products.months3")}
                  </span>
                </label>
                {installment3.enabled && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={installment3.percentage}
                      onChange={(e) =>
                        setInstallment3({
                          ...installment3,
                          percentage: Number(e.target.value),
                        })
                      }
                      className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                      min="0"
                      max="100"
                    />
                    <span className="text-gray-600">%</span>
                    <span className="text-sm text-gray-500">
                      ={" "}
                      {formData.price
                        ? (
                            formData.price *
                            (1 + installment3.percentage / 100)
                          ).toFixed(2)
                        : 0}{" "}
                      {t("common.currency")}
                    </span>
                  </div>
                )}
              </div>

              {/* 6 Months */}
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer min-w-[120px]">
                  <input
                    type="checkbox"
                    checked={installment6.enabled}
                    onChange={(e) =>
                      setInstallment6({
                        ...installment6,
                        enabled: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">
                    {t("dashboard.products.months6")}
                  </span>
                </label>
                {installment6.enabled && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={installment6.percentage}
                      onChange={(e) =>
                        setInstallment6({
                          ...installment6,
                          percentage: Number(e.target.value),
                        })
                      }
                      className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                      min="0"
                      max="100"
                    />
                    <span className="text-gray-600">%</span>
                    <span className="text-sm text-gray-500">
                      ={" "}
                      {formData.price
                        ? (
                            formData.price *
                            (1 + installment6.percentage / 100)
                          ).toFixed(2)
                        : 0}{" "}
                      {t("common.currency")}
                    </span>
                  </div>
                )}
              </div>

              {/* 12 Months */}
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer min-w-[120px]">
                  <input
                    type="checkbox"
                    checked={installment12.enabled}
                    onChange={(e) =>
                      setInstallment12({
                        ...installment12,
                        enabled: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">
                    {t("dashboard.products.months12")}
                  </span>
                </label>
                {installment12.enabled && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={installment12.percentage}
                      onChange={(e) =>
                        setInstallment12({
                          ...installment12,
                          percentage: Number(e.target.value),
                        })
                      }
                      className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                      min="0"
                      max="100"
                    />
                    <span className="text-gray-600">%</span>
                    <span className="text-sm text-gray-500">
                      ={" "}
                      {formData.price
                        ? (
                            formData.price *
                            (1 + installment12.percentage / 100)
                          ).toFixed(2)
                        : 0}{" "}
                      {t("common.currency")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {t("dashboard.products.installmentNote")}
            </p>
          </div>

          {/* Status Info for editing */}
          {editingId && formData.approvalStatus && (
            <div
              className="mt-6 p-4 rounded-lg border flex items-center gap-3"
              style={{
                backgroundColor:
                  formData.approvalStatus === "approved"
                    ? "#dcfce7"
                    : formData.approvalStatus === "rejected"
                      ? "#fee2e2"
                      : "#fef9c3",
                borderColor:
                  formData.approvalStatus === "approved"
                    ? "#86efac"
                    : formData.approvalStatus === "rejected"
                      ? "#fca5a5"
                      : "#fde047",
              }}
            >
              {formData.approvalStatus === "approved" && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {formData.approvalStatus === "rejected" && (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              {formData.approvalStatus === "pending" && (
                <Clock className="w-5 h-5 text-yellow-600" />
              )}
              <div>
                <span className="font-medium">
                  {formData.approvalStatus === "approved" &&
                    t("dashboard.products.statusApproved")}
                  {formData.approvalStatus === "rejected" &&
                    t("dashboard.products.statusRejected")}
                  {formData.approvalStatus === "pending" &&
                    t("dashboard.products.statusPending")}
                </span>
                {formData.approvalStatus === "rejected" &&
                  formData.rejectionReason && (
                    <p className="text-sm text-red-600 mt-1">
                      {formData.rejectionReason}
                    </p>
                  )}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              <Save className="w-4 h-4" />
              {editingId ? t("common.save") : t("dashboard.products.add")}
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              {t("common.cancel")}
            </button>
          </div>
        </motion.div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                  {t("dashboard.products.image")}
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                  {t("dashboard.products.name")}
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                  {t("dashboard.products.price")}
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                  {t("dashboard.products.installment")}
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                  {t("dashboard.products.status")}
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                  {t("dashboard.products.stock")}
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                  {t("dashboard.products.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {t("dashboard.products.noProducts")}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50 transition-all ${
                      product.approvalStatus === "rejected" ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <img
                        src={product.image}
                        alt={
                          i18n.language === "ar" ? product.nameAr : product.name
                        }
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-semibold text-gray-800">
                        {i18n.language === "ar" ? product.nameAr : product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {product.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-primary">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {product.allowInstallment &&
                      product.installmentOptions?.length > 0 ? (
                        <div className="space-y-1">
                          {product.installmentOptions.map((tier) => (
                            <div key={tier.months} className="text-xs">
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                {tier.months}{" "}
                                {t("dashboard.products.monthsShort")} (+
                                {tier.percentage}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          {t("dashboard.products.cashOnly")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          product.approvalStatus === "approved"
                            ? "bg-green-100 text-green-800"
                            : product.approvalStatus === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
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
                          t("dashboard.products.approved")}
                        {product.approvalStatus === "rejected" &&
                          t("dashboard.products.rejected")}
                        {product.approvalStatus === "pending" &&
                          t("dashboard.products.pending")}
                      </span>
                      {product.approvalStatus === "rejected" &&
                        product.rejectionReason && (
                          <p
                            className="text-xs text-red-600 mt-1 max-w-[150px] truncate"
                            title={product.rejectionReason}
                          >
                            {product.rejectionReason}
                          </p>
                        )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 20
                            ? "bg-green-100 text-green-800"
                            : product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title={t("common.edit")}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title={t("common.delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products Count */}
      <div className="text-right text-sm text-gray-600">
        {t("dashboard.products.total")}: {filteredProducts.length}
      </div>
    </div>
  );
};

export default ProductsTab;
