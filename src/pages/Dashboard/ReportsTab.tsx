import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { useAppSelector } from "../../store/hooks";

const ReportsTab = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const orders = useAppSelector((state) => state.orders.orders);
  const products = useAppSelector((state) => state.products.products);

  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("month");
  const [selectedChart, setSelectedChart] = useState<"revenue" | "orders" | "products">("revenue");

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthOrders = orders.filter(
      (o) => new Date(o.createdAt) >= startOfMonth
    );
    const lastMonthOrders = orders.filter(
      (o) =>
        new Date(o.createdAt) >= startOfLastMonth &&
        new Date(o.createdAt) <= endOfLastMonth
    );

    const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + o.finalTotal, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.finalTotal, 0);

    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 100;

    const ordersGrowth =
      lastMonthOrders.length > 0
        ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
        : 100;

    const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const processingOrders = orders.filter((o) => o.status === "processing").length;

    const cashOrders = orders.filter((o) => o.paymentType === "cash");
    const installmentOrders = orders.filter((o) => o.paymentType === "installment");

    const avgOrderValue = orders.length > 0
      ? orders.reduce((sum, o) => sum + o.finalTotal, 0) / orders.length
      : 0;

    return {
      totalRevenue: orders.reduce((sum, o) => sum + o.finalTotal, 0),
      thisMonthRevenue,
      lastMonthRevenue,
      revenueGrowth,
      totalOrders: orders.length,
      thisMonthOrders: thisMonthOrders.length,
      ordersGrowth,
      deliveredOrders,
      pendingOrders,
      processingOrders,
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.isVisible && p.approvalStatus === "approved").length,
      cashOrders: cashOrders.length,
      installmentOrders: installmentOrders.length,
      cashRevenue: cashOrders.reduce((sum, o) => sum + o.finalTotal, 0),
      installmentRevenue: installmentOrders.reduce((sum, o) => sum + o.finalTotal, 0),
      avgOrderValue,
    };
  }, [orders, products]);

  // Mock weekly data for charts
  const weeklyData = [
    { day: isRTL ? "سبت" : "Sat", revenue: 1200, orders: 8 },
    { day: isRTL ? "أحد" : "Sun", revenue: 1800, orders: 12 },
    { day: isRTL ? "إثنين" : "Mon", revenue: 2200, orders: 15 },
    { day: isRTL ? "ثلاثاء" : "Tue", revenue: 1900, orders: 11 },
    { day: isRTL ? "أربعاء" : "Wed", revenue: 2800, orders: 18 },
    { day: isRTL ? "خميس" : "Thu", revenue: 3200, orders: 22 },
    { day: isRTL ? "جمعة" : "Fri", revenue: 2500, orders: 16 },
  ];

  const maxRevenue = Math.max(...weeklyData.map((d) => d.revenue));

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("dashboard.reports.title")}
        </h2>
        <div className="flex items-center gap-3">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
            {(["week", "month", "year"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  dateRange === range
                    ? "bg-[#384B97] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t(`dashboard.reports.${range}`)}
              </button>
            ))}
          </div>
          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#F65331] text-white rounded-lg hover:bg-[#e54525] transition-all"
          >
            <Download className="w-4 h-4" />
            {t("dashboard.reports.export")}
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${
                stats.revenueGrowth >= 0 ? "text-green-200" : "text-red-200"
              }`}
            >
              {stats.revenueGrowth >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(stats.revenueGrowth).toFixed(1)}%
            </div>
          </div>
          <p className="text-blue-100 text-sm mb-1">
            {t("dashboard.reports.totalRevenue")}
          </p>
          <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
        </motion.div>

        {/* Total Orders */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${
                stats.ordersGrowth >= 0 ? "text-green-200" : "text-red-200"
              }`}
            >
              {stats.ordersGrowth >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(stats.ordersGrowth).toFixed(1)}%
            </div>
          </div>
          <p className="text-green-100 text-sm mb-1">
            {t("dashboard.reports.totalOrders")}
          </p>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </motion.div>

        {/* Average Order Value */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <p className="text-purple-100 text-sm mb-1">
            {t("dashboard.reports.avgOrderValue")}
          </p>
          <p className="text-3xl font-bold">${stats.avgOrderValue.toFixed(0)}</p>
        </motion.div>

        {/* Active Products */}
        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <p className="text-orange-100 text-sm mb-1">
            {t("dashboard.reports.activeProducts")}
          </p>
          <p className="text-3xl font-bold">
            {stats.activeProducts}/{stats.totalProducts}
          </p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          custom={4}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                {t("dashboard.reports.revenueChart")}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {(["revenue", "orders"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedChart(type)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    selectedChart === type
                      ? "bg-[#384B97] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {t(`dashboard.reports.${type}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-64 gap-4 px-4">
            {weeklyData.map((data, index) => {
              const value = selectedChart === "revenue" ? data.revenue : data.orders * 100;
              const maxValue = selectedChart === "revenue" ? maxRevenue : 22 * 100;
              const height = (value / maxValue) * 100;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`w-full rounded-t-lg ${
                      selectedChart === "revenue"
                        ? "bg-gradient-to-t from-blue-500 to-blue-400"
                        : "bg-gradient-to-t from-green-500 to-green-400"
                    }`}
                  />
                  <span className="text-xs text-gray-500 font-medium">{data.day}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm text-gray-600">{t("dashboard.reports.revenue")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">{t("dashboard.reports.orders")}</span>
            </div>
          </div>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          custom={5}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              {t("dashboard.reports.orderStatus")}
            </h3>
          </div>

          {/* Pie Chart Simulation */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Delivered */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#22c55e"
                strokeWidth="20"
                strokeDasharray={`${(stats.deliveredOrders / Math.max(stats.totalOrders, 1)) * 251} 251`}
              />
              {/* Processing */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="20"
                strokeDasharray={`${(stats.processingOrders / Math.max(stats.totalOrders, 1)) * 251} 251`}
                strokeDashoffset={`-${(stats.deliveredOrders / Math.max(stats.totalOrders, 1)) * 251}`}
              />
              {/* Pending */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="20"
                strokeDasharray={`${(stats.pendingOrders / Math.max(stats.totalOrders, 1)) * 251} 251`}
                strokeDashoffset={`-${((stats.deliveredOrders + stats.processingOrders) / Math.max(stats.totalOrders, 1)) * 251}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
                <p className="text-sm text-gray-500">{t("dashboard.reports.orders")}</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600">{t("dashboard.status.delivered")}</span>
              </div>
              <span className="font-semibold">{stats.deliveredOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-600">{t("dashboard.status.processing")}</span>
              </div>
              <span className="font-semibold">{stats.processingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-sm text-gray-600">{t("dashboard.status.pending")}</span>
              </div>
              <span className="font-semibold">{stats.pendingOrders}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Methods & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <motion.div
          custom={6}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            {t("dashboard.reports.paymentMethods")}
          </h3>

          <div className="space-y-4">
            {/* Cash */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">{t("dashboard.reports.cash")}</span>
                <span className="font-semibold">
                  ${stats.cashRevenue.toLocaleString()} ({stats.cashOrders} {t("dashboard.reports.orders")})
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(stats.cashRevenue / Math.max(stats.totalRevenue, 1)) * 100}%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
            </div>

            {/* Installment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">{t("dashboard.reports.installment")}</span>
                <span className="font-semibold">
                  ${stats.installmentRevenue.toLocaleString()} ({stats.installmentOrders} {t("dashboard.reports.orders")})
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(stats.installmentRevenue / Math.max(stats.totalRevenue, 1)) * 100}%`,
                  }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-orange-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          custom={7}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            {t("dashboard.reports.quickSummary")}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{t("dashboard.reports.thisMonth")}</p>
              <p className="text-2xl font-bold text-blue-600">
                ${stats.thisMonthRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{t("dashboard.reports.lastMonth")}</p>
              <p className="text-2xl font-bold text-gray-600">
                ${stats.lastMonthRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{t("dashboard.reports.monthlyOrders")}</p>
              <p className="text-2xl font-bold text-green-600">{stats.thisMonthOrders}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{t("dashboard.reports.growth")}</p>
              <p
                className={`text-2xl font-bold ${
                  stats.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.revenueGrowth >= 0 ? "+" : ""}
                {stats.revenueGrowth.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsTab;
