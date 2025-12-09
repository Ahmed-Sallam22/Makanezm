import { useEffect, useRef, useState } from "react";
import "./MarqueeBanner.css";

interface MarqueeItem {
  id: number;
  text: string;
  position: number;
}

const MarqueeBanner = () => {
  const bannerText = "subscribe & save 15%";
  const repetitions = 7;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [itemWidth, setItemWidth] = useState(0);
  const animationRef = useRef<number | null>(null);
  const speedRef = useRef(1); // pixels per frame

  // Measure item width and initialize positions
  useEffect(() => {
    const measureElement = document.createElement('span');
    measureElement.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:14px;font-weight:600;';
    measureElement.textContent = bannerText;
    document.body.appendChild(measureElement);
    const textWidth = measureElement.offsetWidth;
    document.body.removeChild(measureElement);
    
    // Total width = text width + bullet margins (72px * 2) + bullet width (~8px)
    const width = textWidth + 144 + 8;
    setItemWidth(width);

    // Create initial items positioned across the screen
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const totalItems = Math.ceil(containerWidth / width) + repetitions + 2;
    
    const initialItems: MarqueeItem[] = [];
    for (let i = 0; i < totalItems; i++) {
      initialItems.push({
        id: i,
        text: bannerText,
        position: i * width,
      });
    }
    setItems(initialItems);
  }, []);

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
            <span className="text-sm md:text-base font-semibold text-white" style={{ whiteSpace: 'nowrap' }}>
              {item.text}
            </span>
            <span className="text-white/80" style={{ margin: '0 72px', whiteSpace: 'nowrap' }}>•</span>
          </div>
        ))}
      </div>
      </div>
  );
};

export default MarqueeBanner;
