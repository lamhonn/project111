import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { useState } from "react";
import { useOrder } from "@/contexts/OrderContext";

export const OrderSummary = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateQuantity, removeItem, total, itemCount } = useOrder();

  if (!isOpen) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="restaurant-card p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:scale-105"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-primary" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground min-w-[1.5rem] h-6 rounded-full flex items-center justify-center text-xs">
                {itemCount}
              </Badge>
            )}
          </div>
          <div className="text-left">
            <p className="font-heading font-medium text-sm">Your Order</p>
            <p className="text-primary font-semibold">{total.toFixed(2)} €</p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-6 right-6 z-50 w-96">
      <Card className="restaurant-card-elevated">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Order
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Your order is empty
            </p>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-primary font-semibold">{item.price.toFixed(2)} €</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-heading font-semibold">Total:</span>
                  <span className="font-heading font-bold text-xl text-primary">
                    {total.toFixed(2)} €
                  </span>
                </div>
                
                <button className="restaurant-button-primary w-full">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};