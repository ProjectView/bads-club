import { Nav } from "@/components/nav";
import { DemoBanner } from "@/components/demo-banner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grain min-h-screen">
      <DemoBanner />
      <Nav />
      <main>{children}</main>
    </div>
  );
}
