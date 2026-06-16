import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LangProvider } from "@/components/LangProvider";
import PortalContent from "@/components/PortalContent";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  const { data: dashboard } = await supabase.rpc("auravera_clinic_dashboard");
  const { data: assignments } = await supabase.rpc("auravera_clinic_assignments");

  return (
    <LangProvider>
      <PortalContent
        dashboard={(dashboard as Record<string, unknown>) || {}}
        assignments={(assignments as unknown[]) || []}
      />
    </LangProvider>
  );
}
