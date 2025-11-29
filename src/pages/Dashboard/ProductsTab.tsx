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
  });

  // Filter products - admin sees all, merchants see only their products
  const filteredProducts = isAdmin
    ? products
    : products.filter((p) => p.userId === user?.id || !p.userId);

  const handleAdd = () => {
    if (!formData.name || !formData.nameAr || !formData.price) {
      toast.error(t("dashboard.products.fillRequired"));
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: formData.name || "",
      nameAr: formData.nameAr || "",
      description: formData.description || "",
      descriptionAr: formData.descriptionAr || "",
      price: formData.price || 0,
      category: formData.category || "meat",
      stock: formData.stock || 0,
      image: formData.image || "/src/assets/images/test1.png",
      userId: user?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addProduct(newProduct));
    toast.success(t("dashboard.products.addSuccess"));
    resetForm();
  };

  const handleUpdate = () => {
    if (editingId === null) return;

    dispatch(
      updateProduct({
        id: editingId,
        updates: formData,
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
    });
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
                  {t("dashboard.products.description")}
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                  {t("dashboard.products.price")}
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                  {t("dashboard.products.stock")}
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                  {t("dashboard.products.category")}
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
                    className="hover:bg-gray-50 transition-all"
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
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      {i18n.language === "ar" ? product.nameAr : product.name}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600 max-w-xs truncate">
                      {i18n.language === "ar"
                        ? product.descriptionAr
                        : product.description}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-primary">
                      ${product.price}
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
                    <td className="px-6 py-4 text-right text-sm text-gray-600 capitalize">
                      {product.category}
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
