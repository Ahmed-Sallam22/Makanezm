import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { UserPlus, ChevronDown, LogIn, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/hooks";
import { login } from "../../store/slices/authSlice";
import SEO from "../../components/SEO";
import { pageSEO } from "../../types/seo";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    city: "",
    email: "",
    password: "",
    businessType: "",
  });

  const cities = [
    "الرياض",
    "جدة",
    "مكة المكرمة",
    "المدينة المنورة",
    "الدمام",
    "الخبر",
    "الطائف",
    "تبوك",
    "أبها",
    "القصيم",
    "حائل",
    "نجران",
    "جازان",
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error(
        t("loginPage.errors.fillAllFields") || "يرجى ملء جميع الحقول"
      );
      return;
    }

    // Admin login
    if (
      loginData.email === "admin@gmail.com" &&
      loginData.password === "admin123"
    ) {
      dispatch(
        login({
          id: "admin",
          email: "admin@gmail.com",
          name: "Administrator",
          role: "admin",
        })
      );
      toast.success("مرحباً أدمن!");
      setTimeout(() => navigate("/dashboard"), 1000);
      return;
    }

    // Regular user login (simulate - in real app, verify against backend)
    toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.city ||
      !formData.email ||
      !formData.businessType
    ) {
      toast.error(
        t("loginPage.errors.fillAllFields") || "يرجى ملء جميع الحقول"
      );
      return;
    }

    // Simulate registration/login with full user data
    dispatch(
      login({
        id: `user-${Date.now()}`,
        email: formData.email,
        name: formData.fullName,
        phone: formData.phoneNumber,
        city: formData.city,
        businessType: formData.businessType as
          | "credit"
          | "selfPickup"
          | "onlineStore"
          | "mixed",
        role: "merchant",
      })
    );
    toast.success(t("loginPage.success") || "تم التسجيل بنجاح!");

    // Redirect to dashboard after 1 second
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <>
      <SEO
        title={pageSEO.login.title}
        description={pageSEO.login.description}
        keywords={pageSEO.login.keywords}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mx-auto px-4 py-12 min-h-screen bg-linear-to-br from-gray-50 to-gray-100"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Toggle Buttons */}
          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-8 py-3 rounded-lg font-bold transition-all ${
                isLogin
                  ? "bg-[#384B97] text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <LogIn className="w-5 h-5 inline ml-2" />
              {t("loginPage.loginTab")}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-8 py-3 rounded-lg font-bold transition-all ${
                !isLogin
                  ? "bg-[#384B97] text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <UserPlus className="w-5 h-5 inline ml-2" />
              {t("loginPage.registerTab")}
            </button>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleLogin}
              className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
            >
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-[#384B97] mb-2">
                  {t("loginPage.loginTitle")}
                </h1>
                <p className="text-gray-600">{t("loginPage.loginSubtitle")}</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-right">
                  <Mail className="w-4 h-4 inline ml-2" />
                  {t("loginPage.email")}*
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:border-secondary focus:bg-white focus:outline-none transition-all text-right"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-right">
                  <Lock className="w-4 h-4 inline ml-2" />
                  {t("loginPage.password")}*
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:border-secondary focus:bg-white focus:outline-none transition-all text-right"
                  placeholder="••••••••"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#F65331] text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all"
              >
                {t("loginPage.loginButton")}
              </motion.button>

              <p className="text-center text-sm text-gray-600">
                {t("loginPage.adminHint")}: admin@gmail.com / admin123
              </p>
            </motion.form>
          ) : (
            // Register Form
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
            >
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-[#384B97] mb-2">
                  {t("loginPage.registerTitle")}
                </h1>
                <p className="text-gray-600">
                  {t("loginPage.registerSubtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-right">
                    {t("loginPage.phoneNumber")}*
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:border-secondary focus:bg-white focus:outline-none transition-all text-right"
                    placeholder="05XXXXXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-right">
                    {t("loginPage.fullName")}*
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:border-secondary focus:bg-white focus:outline-none transition-all text-right"
                    placeholder={t("loginPage.fullName")}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-right">
                    {t("loginPage.email")}*
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:border-secondary focus:bg-white focus:outline-none transition-all text-right"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-right">
                    <Lock className="w-4 h-4 inline ml-2" />
                    {t("loginPage.password")}*
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:border-secondary focus:bg-white focus:outline-none transition-all text-right"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-right">
                  {t("loginPage.city")}*
                </label>
                <div className="relative">
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:border-secondary focus:bg-white focus:outline-none transition-all appearance-none text-right cursor-pointer"
                    required
                  >
                    <option value="">{t("loginPage.selectCity")}</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-4 text-right">
                  {t("loginPage.businessType")}*
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      value: "credit",
                      label: t("loginPage.businessTypes.credit"),
                    },
                    {
                      value: "selfPickup",
                      label: t("loginPage.businessTypes.selfPickup"),
                    },
                    {
                      value: "onlineStore",
                      label: t("loginPage.businessTypes.onlineStore"),
                    },
                    {
                      value: "mixed",
                      label: t("loginPage.businessTypes.mixed"),
                    },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center justify-end gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="businessType"
                        value={type.value}
                        checked={formData.businessType === type.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessType: e.target.value,
                          })
                        }
                        className="w-5 h-5 text-secondary cursor-pointer"
                      />
                      <span className="text-gray-700 font-medium group-hover:text-secondary transition-colors">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#F65331] text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all"
              >
                {t("loginPage.registerButton")}
              </motion.button>
            </motion.form>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default Login;
