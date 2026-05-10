import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function StatsCard({
  label,
  value,
}) {
  return (
    <Card className="bg-neutral-800 border-neutral-700 text-center">
      <CardContent className="pt-6">
        <p className="text-sm text-neutral-400">
          {label}
        </p>

        <p className="text-2xl font-bold">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}