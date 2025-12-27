import { motion } from "framer-motion";
import SEO from "../../components/SEO";
import { pageSEO } from "../../types/seo";
import HeroSlider from "../../components/HeroSlider";
import Hero from "./sections/Hero";
import OverviewStats from "./sections/OverviewStats";
import ServiceImage from "./sections/ServiceImage";
import ProductsHome from "./sections/ProductsHome";
import SalesReport from "./sections/SalesReport";

const Home = () => {
  return (
    <>
      <SEO
        title={pageSEO.home.title}
        description={pageSEO.home.description}
        keywords={pageSEO.home.keywords}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mx-auto"
      >
        <HeroSlider />
        <Hero />
        <OverviewStats />
        <ServiceImage />
        <ProductsHome />
        <SalesReport />
      </motion.div>
    </>
  );
};

export default Home;
