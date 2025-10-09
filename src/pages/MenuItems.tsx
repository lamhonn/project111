import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Star } from "lucide-react";
import { OrderSummary } from "@/components/OrderSummary";
import { useOrder } from "@/contexts/OrderContext";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  rating: number;
  isPopular?: boolean;
}

const MenuItems = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addItem } = useOrder();
  const { toast } = useToast();

  // Sample menu items - in real app this would come from API
  const menuItems: Record<string, MenuItem[]> = {
    "Starters": [
      {
        id: "1",
        name: "Truffle Arancini",
        description: "Crispy risotto balls filled with wild mushrooms and truffle oil, served with parmesan aioli",
        price: "14.00",
        image: "/api/placeholder/300/200",
        rating: 5,
        isPopular: true
      },
      {
        id: "2", 
        name: "Pan-Seared Scallops",
        description: "Fresh diver scallops with cauliflower purée and pancetta crisps",
        price: "18.00",
        image: "/api/placeholder/300/200",
        rating: 5
      },
      {
        id: "3",
        name: "Burrata Caprese",
        description: "Creamy burrata with heirloom tomatoes, basil oil, and aged balsamic",
        price: "16.00", 
        image: "/api/placeholder/300/200",
        rating: 4
      },
      {
        id: "4",
        name: "Tuna Tartare",
        description: "Fresh yellowfin tuna with avocado, sesame, and ponzu dressing",
        price: "20.00",
        image: "/api/placeholder/300/200", 
        rating: 5
      }
    ],
    "Main Courses": [
      {
        id: "5",
        name: "Dry-Aged Ribeye",
        description: "28-day aged ribeye steak with roasted vegetables and red wine jus",
        price: "48.00",
        image: "/api/placeholder/300/200",
        rating: 5,
        isPopular: true
      }
    ],
    "Drinks": [
      {
        id: "6", 
        name: "House Sangria",
        description: "Red wine sangria with seasonal fruits and herbs",
        price: "12.00",
        image: "/api/placeholder/300/200",
        rating: 4
      }
    ],
    "Desserts": [
      {
        id: "7",
        name: "Chocolate Lava Cake", 
        description: "Warm chocolate cake with molten center, vanilla ice cream",
        price: "12.00",
        image: "/api/placeholder/300/200",
        rating: 5
      }
    ]
  };

  const items = menuItems[category || ""] || [];

  const handleAddToOrder = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image
    });
    
    toast({
      title: "Added to order!",
      description: `${item.name} has been added to your order.`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <OrderSummary />
      
      {/* Header */}
      <header className="bg-restaurant-surface border-b border-border/30 sticky top-0 z-40">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-logo text-3xl font-bold text-primary">
                Saveur
              </h1>
              <p className="text-muted-foreground font-body mt-1">
                {category} Menu
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-8">
        <div className="mb-8">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
            {category}
          </h2>
          <p className="text-muted-foreground font-body">
            Choose from our carefully crafted selection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="restaurant-card overflow-hidden group hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item.isPopular && (
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                    Popular
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading font-semibold text-lg text-foreground">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < item.rating ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-muted-foreground font-body text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xl text-primary">
                    {item.price} €
                  </span>
                  <Button 
                    onClick={() => handleAddToOrder(item)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body text-lg">
              No items found for {category}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuItems;