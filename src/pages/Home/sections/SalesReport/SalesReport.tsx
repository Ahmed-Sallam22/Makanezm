import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesData {
  day: string;
  storeSales: number;
  merchantSales: number;
}

// Format currency for tooltip
const formatCurrency = (value: number) => {
  return `${(value / 1000).toFixed(0)}K ر.س`;
};

// Tooltip payload type
interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

// Custom tooltip component - defined outside to avoid recreation on each render
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SalesReport = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Sample sales data for the week
  const salesData: SalesData[] = [
    {
      day: t("home.salesReport.days.saturday"),
      storeSales: 250000,
      merchantSales: 0,
    },
    {
      day: t("home.salesReport.days.sunday"),
      storeSales: 50000,
      merchantSales: 400000,
    },
    {
      day: t("home.salesReport.days.monday"),
      storeSales: 466000,
      merchantSales: 450000,
    },
    {
      day: t("home.salesReport.days.tuesday"),
      storeSales: 50000,
      merchantSales: 350000,
    },
    {
      day: t("home.salesReport.days.wednesday"),
      storeSales: 300000,
      merchantSales: 480000,
    },
    {
      day: t("home.salesReport.days.thursday"),
      storeSales: 450000,
      merchantSales: 200000,
    },
    {
      day: t("home.salesReport.days.friday"),
      storeSales: 150000,
      merchantSales: 250000,
    },
  ];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
      className="my-12 md:my-16 lg:my-20"
    >
      <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12  ">
          {/* Text Description Section */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={
              isInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: isRTL ? -50 : 50 }
            }
            transition={{ duration: 0.6, delay: 0.4 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#384B97] mb-6 text-center lg:text-right">
              {t("home.salesReport.title")}
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
              {t("home.salesReport.description")}
            </p>
          </motion.div>

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={
              isInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: isRTL ? 50 : -50 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#384B97] mb-6 text-center lg:text-right">
              {t("home.salesReport.chartTitle")}
            </h3>
            <div className="rounded-xl shadow-xl mx-auto p-3">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={salesData}
                  //   margin={{ top: 20, right: 30, left: 50, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#666", fontSize: 12 }}
                    angle={45}
                    textAnchor="end"
                    // height={80}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    tick={{ fill: "#666", fontSize: 12 }}
                    label={{
                      value: "ر.س",
                      style: { textAnchor: "middle", fill: "#666" },
                    }}
                    domain={[0, 500000]}
                    ticks={[0, 100000, 200000, 300000, 400000, 500000]}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  <Bar
                    dataKey="storeSales"
                    fill="#F65331"
                    radius={[4, 4, 0, 0]}
                    name={t("home.salesReport.storeSales")}
                  />
                  <Bar
                    dataKey="merchantSales"
                    fill="#384B97"
                    radius={[4, 4, 0, 0]}
                    name={t("home.salesReport.merchantSales")}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default SalesReport;
