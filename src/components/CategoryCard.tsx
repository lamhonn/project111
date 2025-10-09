import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
  image: string;
  onClick: () => void;
}

export const CategoryCard = ({ title, image, onClick }: CategoryCardProps) => {
  return (
    <Card 
      className="restaurant-card cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-elevated)] overflow-hidden group"
      onClick={onClick}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground text-center">
          {title}
        </h3>
      </div>
    </Card>
  );
};