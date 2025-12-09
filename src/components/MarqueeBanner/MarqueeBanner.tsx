import { useAppSelector } from "../../store/hooks";
import "./MarqueeBanner.css";

const MarqueeBanner = () => {
  const marquees = useAppSelector((state) => state.marquee.marquees);
  const activeMarquees = marquees.filter((m) => m.isActive);

  if (activeMarquees.length === 0) {
    return null;
  }

  return (
    <div className="marquee-wrapper py-2" style={{ backgroundColor: '#F65331' }}>
      <div className="marquee-track">
        {/* Render multiple copies to ensure seamless infinite loop */}
        {[...Array(10)].map((_, copyIndex) => (
          <div key={`copy-${copyIndex}`} className="marquee-content">
            {activeMarquees.map((marquee, index) => (
              <div
                key={`${copyIndex}-${marquee.id}-${index}`}
                className="inline-flex items-center px-8"
              >
                <span className="text-sm md:text-base font-semibold text-white">
                  {marquee.text}
                </span>
                <span className="mx-6 text-white/80">•</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBanner;
