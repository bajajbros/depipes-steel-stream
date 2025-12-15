import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useProducts";
import { ChevronRight, ChevronDown } from "lucide-react";

interface ProductsMegaMenuProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export const ProductsMegaMenu = ({ onClose, isMobile = false }: ProductsMegaMenuProps) => {
  const { data: categories, isLoading } = useCategories();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  if (isLoading || !categories || categories.length === 0) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="space-y-2 pl-4">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center justify-between">
              <Link
                to={`/products/${category.slug}`}
                onClick={onClose}
                className="text-foreground hover:text-primary transition-colors py-2 block flex-1"
              >
                {category.name}
              </Link>
              {category.subcategories && category.subcategories.length > 0 && (
                <button
                  onClick={() =>
                    setExpandedMobile(
                      expandedMobile === category.id ? null : category.id
                    )
                  }
                  className="p-2"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedMobile === category.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>
            {expandedMobile === category.id && category.subcategories && (
              <div className="pl-4 space-y-2 border-l-2 border-primary/20 ml-2">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/products/${sub.slug}`}
                    onClick={onClose}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors py-1 block"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <Link
          to="/products"
          onClick={onClose}
          className="text-primary font-medium py-2 block"
        >
          View All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 w-[600px] bg-background border border-border rounded-lg shadow-xl p-6 z-50">
      <div className="grid grid-cols-2 gap-6">
        {/* Categories List */}
        <div className="space-y-1">
          <h3 className="font-semibold text-sm text-muted-foreground mb-3">
            Categories
          </h3>
          {categories.map((category) => (
            <div
              key={category.id}
              onMouseEnter={() => setHoveredCategory(category.id)}
              className="relative"
            >
              <Link
                to={`/products/${category.slug}`}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                  hoveredCategory === category.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                <span>{category.name}</span>
                {category.subcategories && category.subcategories.length > 0 && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Link>
            </div>
          ))}
        </div>

        {/* Subcategories / Details */}
        <div className="border-l border-border pl-6">
          {hoveredCategory ? (
            <>
              {categories.find((c) => c.id === hoveredCategory)?.subcategories
                ?.length ? (
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                    Subcategories
                  </h3>
                  {categories
                    .find((c) => c.id === hoveredCategory)
                    ?.subcategories?.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/products/${sub.slug}`}
                        onClick={onClose}
                        className="block px-3 py-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  <p>
                    {categories.find((c) => c.id === hoveredCategory)?.description ||
                      "Browse products in this category"}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-muted-foreground text-sm h-full flex items-center justify-center">
              <p>Hover over a category to see subcategories</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <Link
          to="/products"
          onClick={onClose}
          className="text-primary font-medium hover:underline"
        >
          View All Products →
        </Link>
      </div>
    </div>
  );
};
