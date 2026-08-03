import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FIELD_BASE =
  "w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 " +
  "focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition disabled:bg-zinc-50";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("font-semibold text-sm text-zinc-800", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(FIELD_BASE, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(FIELD_BASE, "py-3 min-h-24 resize-none", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(FIELD_BASE, "h-11 appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="size-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
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
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <Label>
          {label}
          {required ? <span className="text-brand"> *</span> : null}
        </Label>
      ) : null}
      {children}
      {error ? (
        <span className="text-xs text-rose-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-zinc-500">{hint}</span>
      ) : null}
    </div>
  );
}

/** Champ téléphone avec indicatif guinéen figé. */
export function PhoneInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-stretch">
      <span className="inline-flex items-center rounded-l-xl border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-sm font-medium text-zinc-600">
        🇬🇳 +224
      </span>
      <input
        type="tel"
        inputMode="numeric"
        placeholder="620 00 00 00"
        className={cn(FIELD_BASE, "h-11 rounded-l-none", className)}
        {...props}
      />
    </div>
  );
}

export function Checkbox({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  return (
    <label className={cn("flex items-start gap-2.5 cursor-pointer", className)}>
      <input
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 accent-[#00c950]"
        {...props}
      />
      <span className="text-sm text-zinc-700 leading-5">{label}</span>
    </label>
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
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition",
        checked ? "border-brand bg-brand/5 ring-2 ring-brand/15" : "border-zinc-200 bg-white hover:border-brand/40",
      )}
    >
      {icon ? (
        <span className="size-10 shrink-0 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          {icon}
        </span>
      ) : null}
      <span className="flex-1 flex flex-col">
        <span className="text-sm font-semibold text-zinc-900">{title}</span>
        {subtitle ? <span className="text-xs text-zinc-500">{subtitle}</span> : null}
      </span>
      <span
        className={cn(
          "size-5 shrink-0 rounded-full border-2 flex items-center justify-center",
          checked ? "border-brand bg-brand" : "border-zinc-300",
        )}
      >
        {checked ? <span className="size-1.5 rounded-full bg-white" /> : null}
      </span>
    </button>
  );
}
