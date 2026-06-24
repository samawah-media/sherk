import { AssignedClients } from "@/ui/management/assigned-clients";

export default function PortfolioPage() {
  return (
    <main className="grid gap-6">
      <h1 className="text-2xl font-semibold">Ø¹Ù…Ù„Ø§Ø¦ÙŠ</h1>
      <AssignedClients clients={[{ id: "client_a", name: "Client A" }]} />
    </main>
  );
}
