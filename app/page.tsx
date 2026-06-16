import { LangProvider } from "@/components/LangProvider";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <LangProvider>
      <HomeContent />
    </LangProvider>
  );
}
