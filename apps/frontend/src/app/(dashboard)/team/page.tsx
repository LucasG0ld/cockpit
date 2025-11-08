import { Button } from "@/components/ui/button";
import TeamTable from "./components/team-table";

export default function TeamPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Équipe</h1>
        <Button>Inviter un membre</Button>
      </div>
      <TeamTable />
    </div>
  );
}
