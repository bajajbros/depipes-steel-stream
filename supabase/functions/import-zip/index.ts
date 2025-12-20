import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import JSZip from "https://esm.sh/jszip@3.10.1";

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
    .replace(/\.[^/.]+$/, "") // Remove file extension
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const isImageFile = (filename: string): boolean => {
  const ext = filename.toLowerCase().split(".").pop();
  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const token = formData.get("token") as string;
    const parentCategoryId = formData.get("parentCategoryId") as string | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
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

    console.log("Processing ZIP file:", file.name);

    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Organize files by folder
    const folderContents: Record<string, { path: string; file: JSZip.JSZipObject }[]> = {};
    const rootImages: { path: string; file: JSZip.JSZipObject }[] = [];

    for (const [path, zipEntry] of Object.entries(zip.files)) {
      if (zipEntry.dir) continue;
      if (!isImageFile(path)) continue;

      const parts = path.split("/").filter(p => p);
      
      if (parts.length === 1) {
        // Root level image
        rootImages.push({ path, file: zipEntry });
      } else {
        // Image in a folder - use first folder as category
        const folderName = parts[0];
        if (!folderContents[folderName]) {
          folderContents[folderName] = [];
        }
        folderContents[folderName].push({ path, file: zipEntry });
      }
    }

    const results = {
      categoriesCreated: 0,
      productsCreated: 0,
      imagesUploaded: 0,
      errors: [] as string[],
    };

    // Process folders as categories
    for (const [folderName, images] of Object.entries(folderContents)) {
      try {
        // Create or find category
        const categorySlug = generateSlug(folderName);
        
        // Check if category exists
        const { data: existingCategory } = await supabase
          .from("product_categories")
          .select("id")
          .eq("slug", categorySlug)
          .maybeSingle();

        let categoryId: string;

        if (existingCategory) {
          categoryId = existingCategory.id;
          console.log(`Using existing category: ${folderName}`);
        } else {
          // Create new category
          const { data: newCategory, error: catError } = await supabase
            .from("product_categories")
            .insert({
              name: folderName,
              slug: categorySlug,
              parent_id: parentCategoryId || null,
            })
            .select("id")
            .single();

          if (catError) {
            results.errors.push(`Failed to create category ${folderName}: ${catError.message}`);
            continue;
          }

          categoryId = newCategory.id;
          results.categoriesCreated++;
          console.log(`Created category: ${folderName}`);
        }

        // Process images in this folder
        for (let i = 0; i < images.length; i++) {
          const { path, file: zipEntry } = images[i];
          const filename = path.split("/").pop()!;
          const productName = filename.replace(/\.[^/.]+$/, ""); // Remove extension

          try {
            // Upload image to storage
            const imageData = await zipEntry.async("uint8array");
            const storagePath = `${categorySlug}/${Date.now()}-${filename}`;
            
            const { error: uploadError } = await supabase.storage
              .from("product-images")
              .upload(storagePath, imageData, {
                contentType: `image/${filename.split(".").pop()?.toLowerCase() || "jpeg"}`,
              });

            if (uploadError) {
              results.errors.push(`Failed to upload ${filename}: ${uploadError.message}`);
              continue;
            }

            results.imagesUploaded++;

            // Get public URL
            const { data: urlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(storagePath);

            // Create product
            const { error: productError } = await supabase
              .from("products")
              .insert({
                name: productName,
                slug: generateSlug(productName) + "-" + Date.now().toString(36),
                category_id: categoryId,
                image_url: urlData.publicUrl,
                sort_order: i,
              });

            if (productError) {
              results.errors.push(`Failed to create product ${productName}: ${productError.message}`);
              continue;
            }

            results.productsCreated++;
            console.log(`Created product: ${productName}`);
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            results.errors.push(`Error processing ${filename}: ${msg}`);
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        results.errors.push(`Error processing folder ${folderName}: ${msg}`);
      }
    }

    // Process root level images (products without category)
    for (let i = 0; i < rootImages.length; i++) {
      const { path, file: zipEntry } = rootImages[i];
      const filename = path.split("/").pop()!;
      const productName = filename.replace(/\.[^/.]+$/, "");

      try {
        const imageData = await zipEntry.async("uint8array");
        const storagePath = `uncategorized/${Date.now()}-${filename}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(storagePath, imageData, {
            contentType: `image/${filename.split(".").pop()?.toLowerCase() || "jpeg"}`,
          });

        if (uploadError) {
          results.errors.push(`Failed to upload ${filename}: ${uploadError.message}`);
          continue;
        }

        results.imagesUploaded++;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(storagePath);

        const { error: productError } = await supabase
          .from("products")
          .insert({
            name: productName,
            slug: generateSlug(productName) + "-" + Date.now().toString(36),
            category_id: parentCategoryId || null,
            image_url: urlData.publicUrl,
            sort_order: i,
          });

        if (productError) {
          results.errors.push(`Failed to create product ${productName}: ${productError.message}`);
          continue;
        }

        results.productsCreated++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        results.errors.push(`Error processing ${filename}: ${msg}`);
      }
    }

    console.log("Import complete:", results);

    return new Response(
      JSON.stringify({ success: true, ...results }),
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
