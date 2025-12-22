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
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const [totalWidth, setTotalWidth] = useState(0);
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

  // Measure item widths and initialize positions when texts are loaded
  useEffect(() => {
    if (marqueeTexts.length === 0) return;

    // Sort marquees by order
    const sortedMarquees = [...marqueeTexts].sort((a, b) => a.order - b.order);
    
    // Measure width of each individual marquee text + bullet
    const widths: number[] = [];
    let total = 0;
    
    sortedMarquees.forEach((marquee) => {
      const measureElement = document.createElement('span');
      measureElement.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:14px;font-weight:600;';
      measureElement.innerHTML = `${marquee.text}<span style="margin:0 48px">•</span>`;
      document.body.appendChild(measureElement);
      const width = measureElement.offsetWidth;
      document.body.removeChild(measureElement);
      widths.push(width);
      total += width;
    });
    
    setItemWidths(widths);
    setTotalWidth(total);

    // Create initial items - position each marquee text sequentially
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const setsNeeded = Math.ceil(containerWidth / total) + 2;
    
    const initialItems: MarqueeItem[] = [];
    let currentPosition = 0;
    let itemId = 0;
    
    for (let set = 0; set < setsNeeded; set++) {
      sortedMarquees.forEach((marquee, idx) => {
        initialItems.push({
          id: itemId++,
          text: marquee.text,
          position: currentPosition,
        });
        currentPosition += widths[idx];
      });
    }
    
    setItems(initialItems);
  }, [marqueeTexts]);

  // Animation loop - circular buffer logic
  useEffect(() => {
    if (totalWidth === 0 || items.length === 0 || itemWidths.length === 0) return;

    const sortedMarquees = [...marqueeTexts].sort((a, b) => a.order - b.order);
    const numTexts = sortedMarquees.length;

    const animate = () => {
      setItems(prevItems => {
        return prevItems.map((item, index) => {
          const textIndex = index % numTexts;
          const width = itemWidths[textIndex];
          let newPosition = item.position - speedRef.current;
          
          // If item moves completely off the left edge, wrap it to the right
          if (newPosition < -width) {
            const maxPosition = Math.max(...prevItems.map(i => i.position));
            newPosition = maxPosition + itemWidths[(prevItems.findIndex(i => i.position === maxPosition) % numTexts)];
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
  }, [totalWidth, items.length, itemWidths, marqueeTexts]);

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
            <span className="text-sm md:text-base font-semibold text-white whitespace-nowrap">
              {item.text}
            </span>
            <span className="text-white/80 whitespace-nowrap" style={{ margin: '0 48px' }}>•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBanner;
