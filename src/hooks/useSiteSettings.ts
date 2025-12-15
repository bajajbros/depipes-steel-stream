import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      // Convert to key-value object for easier access
      const settings: Record<string, string> = {};
      (data as SiteSetting[]).forEach((item) => {
        settings[item.key] = item.value || "";
      });

      return settings;
    },
  });
};
