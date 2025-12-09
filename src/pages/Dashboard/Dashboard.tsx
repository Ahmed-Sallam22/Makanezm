import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  Package,
  Handshake,
  Calendar,
  DollarSign,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Edit,
  Save,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Send,
  AlertCircle,
  Users,
  Image,
  Shield,
  Settings,
  BarChart3,
  Type,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { updateUser } from "../../store/slices/authSlice";
import SEO from "../../components/SEO";
import { toast } from "react-toastify";
import ProductsTab from "./ProductsTab";
import SliderTab from "./SliderTab";
import AdminProductsTab from "./AdminProductsTab";
import MerchantOrdersTab from "./MerchantOrdersTab";
import SettingsTab from "./SettingsTab";
import ReportsTab from "./ReportsTab";
import MarqueeTab from "./MarqueeTab";

type TabType =
  | "overview"
  | "orders"
  | "profile"
  | "merchant"
  | "partnerships"
  | "seasonal"
  | "deferred"
  | "products"
  | "users"
  | "sliders"
  | "adminProducts"
  | "merchantOrders"
  | "settings"
  | "reports"
  | "marquee";

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const user = useAppSelector((state) => state.auth.user);
  const orders = useAppSelector((state) => state.orders.orders);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    address: user?.address || "",
    companyName: user?.companyName || "",
  });

  // Partnership form state
  const [partnershipForm, setPartnershipForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    partnershipType: "distribution" as
      | "distribution"
      | "reseller"
      | "collaboration"
      | "other",
    message: "",
  });

  // Calculate stats
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    completedOrders: orders.filter((o) => o.status === "delivered").length,
    totalRevenue: orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.finalTotal, 0),
    totalProfit: orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.finalTotal * 0.2, 0), // Assuming 20% profit
    monthlyGrowth: 15.5, // Mock data
  };

  const tabs = [
    {
      id: "overview",
      icon: LayoutDashboard,
      label: t("dashboard.tabs.overview"),
    },
    { id: "orders", icon: ShoppingBag, label: t("dashboard.tabs.orders") },
    { id: "products", icon: Package, label: t("dashboard.tabs.products") },
    {
      id: "merchantOrders",
      icon: DollarSign,
      label: t("dashboard.tabs.merchantOrders"),
    },
    { id: "reports", icon: BarChart3, label: t("dashboard.tabs.reports") },
    { id: "profile", icon: User, label: t("dashboard.tabs.profile") },
    { id: "merchant", icon: Building2, label: t("dashboard.tabs.merchant") },
    {
      id: "partnerships",
      icon: Handshake,
      label: t("dashboard.tabs.partnerships"),
    },
    { id: "seasonal", icon: Calendar, label: t("dashboard.tabs.seasonal") },
    { id: "deferred", icon: DollarSign, label: t("dashboard.tabs.deferred") },
    { id: "settings", icon: Settings, label: t("dashboard.tabs.settings") },
  ];

  // Admin-only tabs
  if (user?.role === "admin") {
    tabs.push({
      id: "adminProducts",
      icon: Shield,
      label: t("dashboard.tabs.adminProducts"),
    });
    tabs.push({
      id: "users",
      icon: Users,
      label: t("dashboard.tabs.users"),
    });
    tabs.push({
      id: "sliders",
      icon: Image,
      label: t("dashboard.tabs.sliders"),
    });
    tabs.push({
      id: "marquee",
      icon: Type,
      label: t("dashboard.tabs.marquee"),
    });
  }

  const handleSaveProfile = () => {
    dispatch(updateUser(profileData));
    setIsEditingProfile(false);
    toast.success(t("dashboard.profile.updateSuccess"));
  };

  const handleSubmitPartnership = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API
    toast.success(t("dashboard.partnerships.requestSent"));
    setPartnershipForm({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      partnershipType: "distribution",
      message: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <>
      <SEO
        title={t("dashboard.seo.title")}
        description={t("dashboard.seo.description")}
        keywords={t("dashboard.seo.keywords")}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="w-[95%] max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {t("dashboard.title")}
            </h1>
            <p className="text-gray-600">
              {t("dashboard.welcome", { name: user?.name })}
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 border-b border-gray-200 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-600 hover:text-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-md p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-semibold">
                        {t("dashboard.stats.totalOrders")}
                      </h3>
                      <ShoppingBag className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">
                      {stats.totalOrders}
                    </p>
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stats.monthlyGrowth}% {t("dashboard.stats.thisMonth")}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-md p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-semibold">
                        {t("dashboard.stats.revenue")}
                      </h3>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">
                      ${stats.totalRevenue.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {t("dashboard.stats.profit")}: $
                      {stats.totalProfit.toFixed(2)}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-md p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-semibold">
                        {t("dashboard.stats.pending")}
                      </h3>
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">
                      {stats.pendingOrders}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {t("dashboard.stats.completed")}: {stats.completedOrders}
                    </p>
                  </motion.div>
                </div>

                {/* Smart Alerts */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold text-gray-800">
                      {t("dashboard.alerts.title")}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {stats.pendingOrders > 0 && (
                      <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {t("dashboard.alerts.pendingOrders")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t("dashboard.alerts.pendingOrdersDesc", {
                              count: stats.pendingOrders,
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {t("dashboard.alerts.newProducts")}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t("dashboard.alerts.newProductsDesc")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Summary */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {t("dashboard.recentOrders")}
                  </h2>
                  {orders.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">
                      {t("dashboard.noOrders")}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-gray-800">
                              ${order.finalTotal.toFixed(2)}
                            </p>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              {t(`dashboard.status.${order.status}`)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Sliders Tab (Admin Only) */}
            {activeTab === "sliders" && user?.role === "admin" && <SliderTab />}

            {/* Marquee Tab (Admin Only) */}
            {activeTab === "marquee" && user?.role === "admin" && (
              <MarqueeTab />
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    {t("dashboard.orders.title")}
                  </h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600">
                        {t("dashboard.orders.noOrders")}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">
                                {order.orderNumber}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 w-fit mt-2 md:mt-0 ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              {t(`dashboard.status.${order.status}`)}
                            </span>
                          </div>

                          <div className="border-t border-gray-200 pt-4 mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2">
                              {t("dashboard.orders.items")}
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-gray-600">
                                    {item.productName} x {item.quantity}
                                  </span>
                                  <span className="font-semibold text-gray-800">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                {t("dashboard.orders.paymentType")}:{" "}
                                <span className="font-semibold capitalize">
                                  {order.paymentType}
                                </span>
                              </p>
                              {order.trackingNumber && (
                                <p className="text-sm text-gray-600">
                                  {t("dashboard.orders.tracking")}:{" "}
                                  <span className="font-semibold">
                                    {order.trackingNumber}
                                  </span>
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {t("dashboard.orders.total")}
                              </p>
                              <p className="text-2xl font-bold text-primary">
                                ${order.finalTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      {t("dashboard.profile.title")}
                    </h2>
                    <button
                      onClick={() =>
                        isEditingProfile
                          ? handleSaveProfile()
                          : setIsEditingProfile(true)
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all"
                    >
                      {isEditingProfile ? (
                        <>
                          <Save className="w-4 h-4" />
                          {t("dashboard.profile.save")}
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4" />
                          {t("dashboard.profile.edit")}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4" />
                        {t("dashboard.profile.name")}
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4" />
                        {t("dashboard.profile.email")}
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4" />
                        {t("dashboard.profile.phone")}
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4" />
                        {t("dashboard.profile.city")}
                      </label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            city: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Building2 className="w-4 h-4" />
                        {t("dashboard.profile.company")}
                      </label>
                      <input
                        type="text"
                        value={profileData.companyName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            companyName: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4" />
                        {t("dashboard.profile.address")}
                      </label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Merchant Tab */}
            {activeTab === "merchant" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    {t("dashboard.merchant.title")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {t("dashboard.merchant.accountType")}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {user?.businessType || "Not Set"}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {t("dashboard.merchant.memberSince")}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-6 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
                    <h3 className="text-lg font-bold mb-2">
                      {t("dashboard.merchant.upgradeTitle")}
                    </h3>
                    <p className="text-sm mb-4">
                      {t("dashboard.merchant.upgradeDesc")}
                    </p>
                    <button className="px-6 py-2 bg-white text-primary rounded-lg font-semibold hover:bg-opacity-90 transition-all">
                      {t("dashboard.merchant.upgradeCta")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Partnerships Tab */}
            {activeTab === "partnerships" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Handshake className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold text-gray-800">
                      {t("dashboard.partnerships.title")}
                    </h2>
                  </div>

                  <form
                    onSubmit={handleSubmitPartnership}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <Building2 className="w-4 h-4" />
                          {t("dashboard.partnerships.companyName")}
                        </label>
                        <input
                          type="text"
                          value={partnershipForm.companyName}
                          onChange={(e) =>
                            setPartnershipForm({
                              ...partnershipForm,
                              companyName: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <User className="w-4 h-4" />
                          {t("dashboard.partnerships.contactName")}
                        </label>
                        <input
                          type="text"
                          value={partnershipForm.contactName}
                          onChange={(e) =>
                            setPartnershipForm({
                              ...partnershipForm,
                              contactName: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <Mail className="w-4 h-4" />
                          {t("dashboard.partnerships.email")}
                        </label>
                        <input
                          type="email"
                          value={partnershipForm.email}
                          onChange={(e) =>
                            setPartnershipForm({
                              ...partnershipForm,
                              email: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <Phone className="w-4 h-4" />
                          {t("dashboard.partnerships.phone")}
                        </label>
                        <input
                          type="tel"
                          value={partnershipForm.phone}
                          onChange={(e) =>
                            setPartnershipForm({
                              ...partnershipForm,
                              phone: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <FileText className="w-4 h-4" />
                          {t("dashboard.partnerships.type")}
                        </label>
                        <select
                          value={partnershipForm.partnershipType}
                          onChange={(e) =>
                            setPartnershipForm({
                              ...partnershipForm,
                              partnershipType: e.target.value as
                                | "distribution"
                                | "reseller"
                                | "collaboration"
                                | "other",
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="distribution">
                            {t("dashboard.partnerships.types.distribution")}
                          </option>
                          <option value="reseller">
                            {t("dashboard.partnerships.types.reseller")}
                          </option>
                          <option value="collaboration">
                            {t("dashboard.partnerships.types.collaboration")}
                          </option>
                          <option value="other">
                            {t("dashboard.partnerships.types.other")}
                          </option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <FileText className="w-4 h-4" />
                          {t("dashboard.partnerships.message")}
                        </label>
                        <textarea
                          value={partnershipForm.message}
                          onChange={(e) =>
                            setPartnershipForm({
                              ...partnershipForm,
                              message: e.target.value,
                            })
                          }
                          rows={4}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold"
                    >
                      <Send className="w-4 h-4" />
                      {t("dashboard.partnerships.submit")}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Seasonal Tab */}
            {activeTab === "seasonal" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold text-gray-800">
                      {t("dashboard.seasonal.title")}
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 text-white mb-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {t("dashboard.seasonal.comingSoon")}
                    </h3>
                    <p className="text-lg mb-4">
                      {t("dashboard.seasonal.desc")}
                    </p>
                    <div className="flex items-center gap-4 text-xl font-bold">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <div className="text-3xl">15</div>
                        <div className="text-xs">
                          {t("dashboard.seasonal.days")}
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <div className="text-3xl">08</div>
                        <div className="text-xs">
                          {t("dashboard.seasonal.hours")}
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <div className="text-3xl">42</div>
                        <div className="text-xs">
                          {t("dashboard.seasonal.minutes")}
                        </div>
                      </div>
                    </div>
                    <button className="mt-6 px-8 py-3 bg-white text-orange-600 rounded-lg font-bold hover:bg-opacity-90 transition-all">
                      {t("dashboard.seasonal.register")}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t("dashboard.seasonal.blackFriday")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("dashboard.seasonal.blackFridayDesc")}
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t("dashboard.seasonal.newYear")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("dashboard.seasonal.newYearDesc")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Deferred Payment Tab */}
            {activeTab === "deferred" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <DollarSign className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold text-gray-800">
                      {t("dashboard.deferred.title")}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Mock deferred sale request */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {t("dashboard.deferred.sampleProduct")}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {t("dashboard.deferred.requestDate")}:{" "}
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold w-fit mt-2 md:mt-0">
                          {t("dashboard.status.pending")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            {t("dashboard.deferred.originalPrice")}
                          </p>
                          <p className="text-lg font-bold text-gray-800">
                            $150.00
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            {t("dashboard.deferred.requestedPrice")}
                          </p>
                          <p className="text-lg font-bold text-primary">
                            $120.00
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            {t("dashboard.deferred.profit")}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            $30.00
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            {t("dashboard.deferred.profitPercent")}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            25%
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold">
                          {t("dashboard.deferred.approve")}
                        </button>
                        <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold">
                          {t("dashboard.deferred.reject")}
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">
                            {t("dashboard.deferred.infoTitle")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t("dashboard.deferred.infoDesc")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && <ProductsTab />}

            {/* Merchant Orders Tab */}
            {activeTab === "merchantOrders" && <MerchantOrdersTab />}

            {/* Admin Products Tab (Admin Only) */}
            {activeTab === "adminProducts" && user?.role === "admin" && (
              <AdminProductsTab />
            )}

            {/* Users Tab (Admin Only) */}
            {activeTab === "users" && user?.role === "admin" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    {t("dashboard.users.title")}
                  </h2>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">
                        {t("dashboard.users.totalUsers")}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">5</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">
                        {t("dashboard.users.merchants")}
                      </p>
                      <p className="text-2xl font-bold text-green-600">3</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">
                        {t("dashboard.users.customers")}
                      </p>
                      <p className="text-2xl font-bold text-purple-600">2</p>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                            {t("dashboard.users.name")}
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                            {t("dashboard.users.email")}
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                            {t("dashboard.users.role")}
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                            {t("dashboard.users.orders")}
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                            {t("dashboard.users.joined")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {/* Sample users */}
                        <tr className="hover:bg-gray-50 transition-all">
                          <td className="px-6 py-4 text-right font-semibold text-gray-800">
                            محمد أحمد
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600">
                            mohammed@example.com
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                              Merchant
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600">
                            12
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">
                            {new Date().toLocaleDateString()}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-all">
                          <td className="px-6 py-4 text-right font-semibold text-gray-800">
                            فاطمة علي
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600">
                            fatima@example.com
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                              Customer
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600">
                            5
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">
                            {new Date().toLocaleDateString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && <SettingsTab />}

            {/* Reports Tab */}
            {activeTab === "reports" && <ReportsTab />}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
