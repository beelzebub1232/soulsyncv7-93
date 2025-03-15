
import { cn } from "@/lib/utils";
import { MindfulStat } from "../../types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";

interface MindfulSummaryCardProps {
  stat: MindfulStat;
}

export default function MindfulSummaryCard({ stat }: MindfulSummaryCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center justify-between w-full p-4 h-auto text-left rounded-lg border shadow-sm transition-all hover:shadow-md",
            stat.color === "blue" && "border-blue-200 hover:border-blue-300",
            stat.color === "green" && "border-green-200 hover:border-green-300",
            stat.color === "purple" && "border-purple-200 hover:border-purple-300",
            stat.color === "orange" && "border-orange-200 hover:border-orange-300"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              stat.color === "blue" && "bg-blue-100 text-blue-600",
              stat.color === "green" && "bg-green-100 text-green-600",
              stat.color === "purple" && "bg-purple-100 text-purple-600",
              stat.color === "orange" && "bg-orange-100 text-orange-600"
            )}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{stat.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{stat.description}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <span className={cn(
              "p-2 rounded-full",
              stat.color === "blue" && "bg-blue-100 text-blue-600",
              stat.color === "green" && "bg-green-100 text-green-600",
              stat.color === "purple" && "bg-purple-100 text-purple-600",
              stat.color === "orange" && "bg-orange-100 text-orange-600"
            )}>
              <stat.icon className="h-5 w-5" />
            </span>
            {stat.title}
          </SheetTitle>
          <SheetDescription>{stat.description}</SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">How It Works</h4>
            <p className="text-sm text-muted-foreground">{stat.howItWorks}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Benefits</h4>
            <ul className="space-y-2">
              {stat.benefits.map((benefit, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <div className={cn(
                    "mt-1 h-2 w-2 rounded-full flex-shrink-0",
                    stat.color === "blue" && "bg-blue-500",
                    stat.color === "green" && "bg-green-500",
                    stat.color === "purple" && "bg-purple-500",
                    stat.color === "orange" && "bg-orange-500"
                  )} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
