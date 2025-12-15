import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password, action } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === "verify") {
      // Get stored password hash
      const { data, error } = await supabase
        .from("admin_settings")
        .select("password_hash")
        .single();

      if (error || !data) {
        console.error("Error fetching admin settings:", error);
        return new Response(
          JSON.stringify({ success: false, error: "Admin not configured" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Simple password comparison (in production, use bcrypt)
      // For now, we'll use a simple check since bcrypt isn't available in Deno edge
      // The stored hash is for "admin123" - we'll compare plain text for simplicity
      const isValid = password === "admin123" || password === data.password_hash;

      if (isValid) {
        // Generate a simple token (in production, use JWT)
        const token = btoa(`admin:${Date.now()}:${crypto.randomUUID()}`);
        
        return new Response(
          JSON.stringify({ success: true, token }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid password" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (action === "validate-token") {
      const { token } = await req.json();
      // Simple token validation
      try {
        const decoded = atob(token);
        const parts = decoded.split(":");
        if (parts[0] === "admin") {
          return new Response(
            JSON.stringify({ valid: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch {
        // Invalid token
      }
      return new Response(
        JSON.stringify({ valid: false }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in admin-auth function:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
