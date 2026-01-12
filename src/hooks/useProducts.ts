import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  subcategories?: ProductCategory[];
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;

      // Build hierarchical structure
      const categories = data as ProductCategory[];
      const parentCategories = categories.filter((c) => !c.parent_id);
      
      return parentCategories.map((parent) => ({
        ...parent,
        subcategories: categories.filter((c) => c.parent_id === parent.id),
      }));
    },
  });
};

export const useAllCategories = () => {
  return useQuery({
    queryKey: ["all-product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as ProductCategory[];
    },
  });
};

// Get all products (subcategories with parent_id)
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .not("parent_id", "is", null)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as ProductCategory[];
    },
  });
};

// Get products by parent category slug
export const useProductsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ["products-by-category", categorySlug],
    queryFn: async () => {
      // First get the parent category
      const { data: category, error: categoryError } = await supabase
        .from("product_categories")
        .select("id")
        .eq("slug", categorySlug)
        .is("parent_id", null)
        .maybeSingle();

      if (categoryError) throw categoryError;
      if (!category) return [];

      // Get subcategories (products) for this parent
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("parent_id", category.id)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as ProductCategory[];
    },
    enabled: !!categorySlug,
  });
};
