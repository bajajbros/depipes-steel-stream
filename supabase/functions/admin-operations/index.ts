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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, token, data } = await req.json();

    // Validate admin token
    if (!validateToken(token)) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Admin operation: ${action}`, data);

    switch (action) {
      // Site Settings
      case "update-setting": {
        const { key, value } = data;
        const { error } = await supabase
          .from("site_settings")
          .update({ value })
          .eq("key", key);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Categories
      case "create-category": {
        const { error, data: newCategory } = await supabase
          .from("product_categories")
          .insert(data)
          .select()
          .single();
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true, data: newCategory }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "update-category": {
        const { id, ...updateData } = data;
        const { error } = await supabase
          .from("product_categories")
          .update(updateData)
          .eq("id", id);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "delete-category": {
        const { id } = data;
        const { error } = await supabase
          .from("product_categories")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Products
      case "create-product": {
        const { error, data: newProduct } = await supabase
          .from("products")
          .insert(data)
          .select()
          .single();
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true, data: newProduct }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "update-product": {
        const { id, ...updateData } = data;
        const { error } = await supabase
          .from("products")
          .update(updateData)
          .eq("id", id);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "delete-product": {
        const { id } = data;
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error: unknown) {
    console.error("Error in admin-operations:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
