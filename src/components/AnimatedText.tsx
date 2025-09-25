import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  phrases: string[];
  className?: string;
  interval?: number; // Metin değişim süresi (ms)
  animationDuration?: number; // Geçiş animasyon süresi (ms)
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  phrases,
  className,
  interval = 1000, // Varsayılan 3 saniye
  animationDuration = 500, // Varsayılan 0.5 saniye
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const cycleText = setInterval(() => {
      setIsVisible(false); // Metni gizle (fade out)

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setIsVisible(true); // Yeni metni göster (fade in)
      }, animationDuration); // Fade out süresi kadar bekle
    }, interval);

    return () => clearInterval(cycleText);
  }, [phrases, interval, animationDuration]);

  return (
    <h1
      className={cn(
        "text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-240 p-4",
        "transition-opacity ease-in-out", // Opaklık geçişi için Tailwind sınıfı
        isVisible ? "opacity-100" : "opacity-0", // Görünürlük kontrolü
        className
      )}
      style={{ transitionDuration: `${animationDuration}ms` }} // Geçiş süresini ayarla
    >
      {phrases[currentIndex]}
    </h1>
  );
};

export default AnimatedText;