import { Wifi, Signal, Battery } from "lucide-react";

interface StatusBarProps {
  bgColor?: string;
  textColor?: string;
}

export default function StatusBar({ 
  bgColor = "bg-primary", 
  textColor = "text-white" 
}: StatusBarProps) {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className={`${bgColor} ${textColor} px-4 py-2 text-xs flex justify-between items-center`}>
      <span>{currentTime}</span>
      <div className="flex items-center space-x-1">
        <Signal className="w-3 h-3" />
        <Wifi className="w-3 h-3" />
        <Battery className="w-3 h-3" />
      </div>
    </div>
  );
}
