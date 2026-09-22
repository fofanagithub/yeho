import { useState, type ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextProps,
} from "react-native";
import { Check, ChevronDown } from "lucide-react-native";
import { cn } from "@/lib/utils";

const FIELD_BASE =
  "w-full rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark px-3.5 text-sm text-fg dark:text-fg-dark";

export function Label({ className, children, ...props }: TextProps & { children?: ReactNode }) {
  return (
    <Text className={cn("font-semibold text-sm text-fg-soft dark:text-fg-soft-dark", className)} {...props}>
      {children}
    </Text>
  );
}

export function Input({ className, ...props }: TextInputProps) {
  return (
    <TextInput
      className={cn(FIELD_BASE, "h-11", className)}
      placeholderTextColor="#8e8e98"
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextInputProps) {
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      className={cn(FIELD_BASE, "py-3 min-h-24", className)}
      placeholderTextColor="#8e8e98"
      {...props}
    />
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Sélectionner",
  className,
}: {
  value?: string | null;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className={cn(FIELD_BASE, "h-11 flex-row items-center justify-between", className)}
      >
        <Text className={cn("text-sm", selected ? "text-fg dark:text-fg-dark" : "text-faint dark:text-faint-dark")}>
          {selected?.label ?? placeholder}
        </Text>
        <ChevronDown size={16} color="#8e8e98" />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setOpen(false)}>
          <Pressable className="bg-surface dark:bg-surface-dark rounded-t-2xl max-h-[70%] pb-8" onPress={(e) => e.stopPropagation()}>
            <View className="items-center py-3">
              <View className="h-1 w-10 rounded-full bg-subtle-strong dark:bg-subtle-strong-dark" />
            </View>
            <ScrollView className="px-2">
              {options.map((o) => {
                const active = o.value === value;
                return (
                  <Pressable
                    key={o.value}
                    onPress={() => {
                      onValueChange(o.value);
                      setOpen(false);
                    }}
                    className={cn("flex-row items-center justify-between px-4 py-3.5 rounded-xl", active && "bg-brand/10")}
                  >
                    <Text className={cn("text-sm", active ? "text-brand font-semibold" : "text-fg dark:text-fg-dark")}>
                      {o.label}
                    </Text>
                    {active ? <Check size={16} color="#00c950" /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <View className={cn("flex-col gap-1.5", className)}>
      {label ? (
        <Label>
          {label}
          {required ? <Text className="text-brand"> *</Text> : null}
        </Label>
      ) : null}
      {children}
      {error ? (
        <Text className="text-xs text-rose-600 dark:text-rose-400">{error}</Text>
      ) : hint ? (
        <Text className="text-xs text-muted dark:text-muted-dark">{hint}</Text>
      ) : null}
    </View>
  );
}

/** Champ téléphone avec indicatif guinéen figé. */
export function PhoneInput({ className, ...props }: TextInputProps) {
  return (
    <View className="flex-row items-stretch">
      <View className="flex-row items-center rounded-l-xl border border-r-0 border-line dark:border-line-dark bg-subtle-soft dark:bg-subtle-soft-dark px-3">
        <Text className="text-sm font-medium text-muted dark:text-muted-dark">🇬🇳 +224</Text>
      </View>
      <TextInput
        keyboardType="phone-pad"
        placeholder="620 00 00 00"
        placeholderTextColor="#8e8e98"
        className={cn(FIELD_BASE, "h-11 rounded-l-none flex-1", className)}
        {...props}
      />
    </View>
  );
}

export function Checkbox({
  label,
  checked,
  onToggle,
  className,
}: {
  label: ReactNode;
  checked: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <Pressable onPress={onToggle} className={cn("flex-row items-start gap-2.5", className)}>
      <View
        className={cn(
          "mt-0.5 size-4 shrink-0 rounded border items-center justify-center",
          checked ? "bg-brand border-brand" : "border-line dark:border-line-dark",
        )}
      >
        {checked ? <Check size={12} color="#ffffff" /> : null}
      </View>
      <Text className="flex-1 text-sm text-fg-soft dark:text-fg-soft-dark leading-5">{label}</Text>
    </Pressable>
  );
}

export function RadioRow({
  checked,
  onSelect,
  title,
  subtitle,
  icon,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <Pressable
      onPress={onSelect}
      className={cn(
        "flex-row items-center gap-3 rounded-xl border p-3.5",
        checked
          ? "border-brand bg-brand/5"
          : "border-line dark:border-line-dark bg-surface dark:bg-surface-dark",
      )}
    >
      {icon ? (
        <View className="size-10 shrink-0 rounded-xl bg-brand/10 items-center justify-center">{icon}</View>
      ) : null}
      <View className="flex-1 flex-col">
        <Text className="text-sm font-semibold text-fg dark:text-fg-dark">{title}</Text>
        {subtitle ? <Text className="text-xs text-muted dark:text-muted-dark">{subtitle}</Text> : null}
      </View>
      <View
        className={cn(
          "size-5 shrink-0 rounded-full border-2 items-center justify-center",
          checked ? "border-brand bg-brand" : "border-line dark:border-line-dark",
        )}
      >
        {checked ? <View className="size-1.5 rounded-full bg-surface dark:bg-surface-dark" /> : null}
      </View>
    </Pressable>
  );
}
