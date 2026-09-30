import { Alert, Platform } from "react-native";

/**
 * Demande de confirmation avant une action destructive.
 * `Alert.alert` ne fait rien sur le web (react-native-web) : on y passe par window.confirm.
 */
export function confirmAction({
  title,
  message,
  confirmLabel,
  cancelLabel = "Annuler",
  onConfirm,
}: {
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
}) {
  if (Platform.OS === "web") {
    if (window.confirm(message ? `${title}\n\n${message}` : title)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelLabel, style: "cancel" },
    { text: confirmLabel, style: "destructive", onPress: onConfirm },
  ]);
}
