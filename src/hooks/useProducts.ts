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

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  specifications: string | null;
  image_url: string | null;
  category_id: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
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

export const useProducts = (categoryId?: string) => {
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProductsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ["products-by-category", categorySlug],
    queryFn: async () => {
      // First get the category
      const { data: category, error: categoryError } = await supabase
        .from("product_categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (categoryError) throw categoryError;
      if (!category) return [];

      // Get products for this category
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", category.id)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!categorySlug,
  });
};
