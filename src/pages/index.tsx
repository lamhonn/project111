import { CategoryCard } from "@/components/CategoryCard";
import { SpecialCard } from "@/components/SpecialCard";
import { OrderSummary } from "@/components/OrderSummary";
import { useNavigate } from "react-router-dom";
import appetizers from "@/assets/appetizers.jpg";
import mains from "@/assets/mains.jpg";
import drinks from "@/assets/drinks.jpg";
import desserts from "@/assets/desserts.jpg";
import specialDish from "@/assets/special-dish.jpg";

const Index = () => {
  const navigate = useNavigate();
  
  const categories = [
    { title: "Starters", image: appetizers },
    { title: "Main Courses", image: mains },
    { title: "Drinks", image: drinks },
    { title: "Desserts", image: desserts },
  ];

  const handleCategoryClick = (category: string) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <OrderSummary />
      
      {/* Header */}
      <header className="bg-restaurant-surface border-b border-border/30 sticky top-0 z-40">
        <div className="container mx-auto px-8 py-6">
          <h1 className="font-logo text-3xl font-bold text-primary">
            Weitaa
          </h1>
          <p className="text-muted-foreground font-body mt-1">
            Table Service  •  Order from your table
          </p>
        </div>
      </header>

      <main className="container mx-auto px-8 py-8">
        {/* Today's Special */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
            Today's Special
          </h2>
          <div className="max-w-2xl">
            <SpecialCard
              id="special-1"
              title="Pan-Seared Halibut"
              description="Fresh Atlantic halibut with seasonal vegetables, lemon butter sauce, and herb-crusted potatoes. Caught fresh this morning from our local suppliers."
              price="32.00 €"
              image={specialDish}
              rating={5}
              isSpecial={true}
            />
          </div>
        </section>

        {/* Menu Categories */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
            Menu Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.title}
                title={category.title}
                image={category.image}
                onClick={() => handleCategoryClick(category.title)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;