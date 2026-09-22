import { RequireAuth } from "@/components/layout/RequireAuth";
import { PublishForm } from "@/components/PublishForm";

export default function PublishScreen() {
  return (
    <RequireAuth seller>
      <PublishForm />
    </RequireAuth>
  );
}
