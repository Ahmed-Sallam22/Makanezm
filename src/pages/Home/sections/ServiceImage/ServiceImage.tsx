import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import serviceImage from "../../../../assets/images/Service.png";

const ServiceImage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 50, scale: 0.95 }
      }
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      className="w-full my-8 md:my-12 lg:my-16"
    >
      <motion.img
        src={serviceImage}
        alt="Service Image"
        className="w-full h-auto object-cover"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default ServiceImage;
