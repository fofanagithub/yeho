import { useLocalSearchParams } from "expo-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PublishForm } from "@/components/PublishForm";

export default function PublishEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <RequireAuth seller>
      <PublishForm id={id} />
    </RequireAuth>
  );
}
