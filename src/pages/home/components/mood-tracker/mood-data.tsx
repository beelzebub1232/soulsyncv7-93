
import { 
  SunMedium, 
  HeartHandshake, 
  CircleEqual, 
  Cloud,
  CloudRain
} from "lucide-react";
import { Mood } from "./types";

export const moods: Mood[] = [
  { 
    value: "amazing", 
    label: "Amazing", 
    icon: <SunMedium className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200"
  },
  { 
    value: "good", 
    label: "Good", 
    icon: <HeartHandshake className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200" 
  },
  { 
    value: "okay", 
    label: "Okay", 
    icon: <CircleEqual className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200" 
  },
  { 
    value: "sad", 
    label: "Sad", 
    icon: <Cloud className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200" 
  },
  { 
    value: "awful", 
    label: "Awful", 
    icon: <CloudRain className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200" 
  },
];
