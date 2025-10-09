import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useOrder } from "@/contexts/OrderContext";
import { useToast } from "@/hooks/use-toast";

interface SpecialCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  rating: number;
  isSpecial?: boolean;
}

export const SpecialCard = ({ 
  id,
  title, 
  description, 
  price, 
  image, 
  rating,
  isSpecial = false 
}: SpecialCardProps) => {
  const { addItem } = useOrder();
  const { toast } = useToast();

  const handleAddToOrder = () => {
    addItem({
      id,
      name: title,
      price: parseFloat(price.replace(/[^0-9.]/g, '')),
      image
    });
    
    toast({
      title: "Added to order!",
      description: `${title} has been added to your order.`,
      duration: 2000,
    });
  };
  return (
    <Card className="restaurant-card-elevated overflow-hidden relative group cursor-pointer transition-all duration-300 hover:scale-[1.01]">
      {isSpecial && (
        <Badge className="absolute top-4 left-4 z-10 bg-restaurant-warning text-foreground font-medium">
          Today's Special
        </Badge>
      )}
      
      <div className="aspect-[16/10] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading font-semibold text-xl text-foreground">
            {title}
          </h3>
          <span className="font-heading font-bold text-lg text-primary">
            {price}
          </span>
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating 
                  ? "fill-restaurant-warning text-restaurant-warning" 
                  : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-2">
            ({rating}.0)
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {description}
        </p>
        
        <button 
          onClick={handleAddToOrder}
          className="restaurant-button-primary w-full"
        >
          Add to Order
        </button>
      </div>
    </Card>
  );
};