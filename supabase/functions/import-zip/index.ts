import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const validateToken = (token: string): boolean => {
  try {
    const decoded = atob(token);
    const parts = decoded.split(":");
    return parts[0] === "admin";
  } catch {
    return false;
  }
};

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const token = formData.get("token") as string;
    const productName = formData.get("productName") as string;
    const categoryId = formData.get("categoryId") as string | null;
    const categoryName = formData.get("categoryName") as string | null;
    const parentCategoryId = formData.get("parentCategoryId") as string | null;

    if (!file || !token) {
      return new Response(
        JSON.stringify({ error: "File and token are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!validateToken(token)) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let actualCategoryId = categoryId;

    // If we have a category name but no ID, create or find the category
    if (categoryName && !categoryId) {
      const categorySlug = generateSlug(categoryName);
      
      const { data: existingCategory } = await supabase
        .from("product_categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (existingCategory) {
        actualCategoryId = existingCategory.id;
      } else {
        const { data: newCategory, error: catError } = await supabase
          .from("product_categories")
          .insert({
            name: categoryName,
            slug: categorySlug,
            parent_id: parentCategoryId || null,
          })
          .select("id")
          .single();

        if (catError) {
          console.error("Failed to create category:", catError);
        } else {
          actualCategoryId = newCategory.id;
        }
      }
    }

    // Upload image to storage
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const storagePath = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(storagePath, arrayBuffer, {
        contentType: file.type || `image/${fileExt}`,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: `Upload failed: ${uploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(storagePath);

    // Create product
    const slug = generateSlug(productName) + "-" + Date.now().toString(36);
    const { error: productError, data: product } = await supabase
      .from("products")
      .insert({
        name: productName,
        slug,
        category_id: actualCategoryId || null,
        image_url: urlData.publicUrl,
      })
      .select()
      .single();

    if (productError) {
      console.error("Product creation error:", productError);
      return new Response(
        JSON.stringify({ error: `Product creation failed: ${productError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        product,
        categoryCreated: categoryName && !categoryId && actualCategoryId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in import-zip:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
