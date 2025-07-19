import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';

interface SwipeButtonProps {
  onComplete: () => void;
  disabled?: boolean;
  text?: string;
  icon?: React.ReactNode;
}

export default function SwipeButton({ 
  onComplete, 
  disabled = false, 
  text = "Swipe to Validate",
  icon 
}: SwipeButtonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const threshold = 0.8; // 80% of container width

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    if (!containerRef.current || disabled) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const buttonWidth = 56; // 3.5rem = 56px
    const maxDistance = containerWidth - buttonWidth - 8; // 8px for padding
    const dragDistance = info.point.x - info.offset.x;
    
    if (dragDistance >= maxDistance * threshold) {
      setIsCompleted(true);
      onComplete();
    }
  };

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        setIsCompleted(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  return (
    <div className="w-full">
      <p className="text-center text-gray-600 mb-4">{text}</p>
      
      <div 
        ref={containerRef}
        className="swipe-track relative h-16 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full overflow-hidden"
      >
        {/* Background text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold transition-opacity duration-300 ${
            isDragging || isCompleted ? 'opacity-30' : 'opacity-100'
          } ${isCompleted ? 'text-green-600' : 'text-primary'}`}>
            {isCompleted ? 'Validating...' : 'Swipe to Validate'}
          </span>
        </div>
        
        {/* Draggable button */}
        <motion.div
          className={`swipe-button absolute left-1 top-1 w-14 h-14 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg ${
            isCompleted ? 'bg-green-600' : 'construction-primary'
          }`}
          drag={disabled || isCompleted ? false : "x"}
          dragConstraints={{ left: 0, right: containerRef.current ? containerRef.current.offsetWidth - 60 : 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          animate={isCompleted ? { x: containerRef.current ? containerRef.current.offsetWidth - 60 : 0 } : { x: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          whileDrag={{ scale: 1.05 }}
        >
          {icon || (
            <svg 
              className="w-6 h-6 text-white" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </motion.div>
      </div>
      
      <p className="text-center text-xs text-gray-500 mt-2">
        Drag to the right to confirm
      </p>
    </div>
  );
}
