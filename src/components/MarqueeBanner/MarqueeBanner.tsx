import { useEffect, useRef, useState } from "react";
import "./MarqueeBanner.css";
import { getActiveMarquees, type Marquee } from "../../services/marqueeService";

interface MarqueeItem {
  id: number;
  text: string;
  position: number;
}

const MarqueeBanner = () => {
  const [marqueeTexts, setMarqueeTexts] = useState<Marquee[]>([]);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [itemWidth, setItemWidth] = useState(0);
  const animationRef = useRef<number | null>(null);
  const speedRef = useRef(1); // pixels per frame

  // Fetch marquees from API
  useEffect(() => {
    const fetchMarquees = async () => {
      try {
        const response = await getActiveMarquees();
        const activeMarquees = response.data.marquees || [];
        setMarqueeTexts(activeMarquees);
      } catch {
        // Fallback to default text if API fails
        setMarqueeTexts([{ id: 1, text: "subscribe & save 15%", is_active: true, order: 0, created_at: "", updated_at: "" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarquees();
  }, []);

  // Measure item width and initialize positions when texts are loaded
  useEffect(() => {
    if (marqueeTexts.length === 0) return;

    // Calculate total text for measurement
    const combinedText = marqueeTexts.map(m => m.text).join(" • ");
    
    const measureElement = document.createElement('span');
    measureElement.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:14px;font-weight:600;';
    measureElement.textContent = combinedText;
    document.body.appendChild(measureElement);
    const textWidth = measureElement.offsetWidth;
    document.body.removeChild(measureElement);
    
    // Total width = text width + bullet margins (72px * 2) + bullet width (~8px)
    const width = textWidth + 144 + 8;
    setItemWidth(width);

    // Create initial items positioned across the screen
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const repetitions = Math.ceil(containerWidth / width) + 3;
    
    const initialItems: MarqueeItem[] = [];
    for (let i = 0; i < repetitions; i++) {
      initialItems.push({
        id: i,
        text: combinedText,
        position: i * width,
      });
    }
    setItems(initialItems);
  }, [marqueeTexts]);

  // Animation loop - circular buffer logic
  useEffect(() => {
    if (itemWidth === 0 || items.length === 0) return;

    const animate = () => {
      setItems(prevItems => {
        return prevItems.map(item => {
          let newPosition = item.position - speedRef.current;
          
          // If item moves completely off the left edge, wrap it to the right
          if (newPosition < -itemWidth) {
            // Find the rightmost item position and place this item after it
            const maxPosition = Math.max(...prevItems.map(i => i.position));
            newPosition = maxPosition + itemWidth;
          }
          
          return {
            ...item,
            position: newPosition,
          };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [itemWidth, items.length]);

  // Don't render until data is loaded
  if (loading || marqueeTexts.length === 0) {
    return (
      <div 
        className="marquee-wrapper py-2" 
        style={{ backgroundColor: '#F65331' }}
      >
        <div className="h-6"></div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="marquee-wrapper py-2" 
      style={{ backgroundColor: '#F65331' }}
    >
      <div className="marquee-track-js">
        {items.map((item) => (
          <div
            key={item.id}
            className="marquee-item"
            style={{
              transform: `translateX(${item.position}px) translateY(-50%)`,
            }}
          >
            {marqueeTexts.map((marquee, idx) => (
              <span key={marquee.id} className="inline-flex items-center">
                <span className="text-sm md:text-base font-semibold text-white" style={{ whiteSpace: 'nowrap' }}>
                  {marquee.text}
                </span>
                {idx < marqueeTexts.length - 1 && (
                  <span className="text-white/80" style={{ margin: '0 72px', whiteSpace: 'nowrap' }}>•</span>
                )}
              </span>
            ))}
            <span className="text-white/80" style={{ margin: '0 72px', whiteSpace: 'nowrap' }}>•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBanner;
