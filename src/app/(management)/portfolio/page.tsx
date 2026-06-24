import { AssignedClients } from "@/ui/management/assigned-clients";

export default function PortfolioPage() {
  return (
    <main className="grid gap-6">
      <h1 className="text-2xl font-semibold">عملائي</h1>
      <AssignedClients clients={[{ id: "client_a", name: "Client A" }]} />
    </main>
  );
}
