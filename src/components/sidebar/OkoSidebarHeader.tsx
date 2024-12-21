import { ThemeToggle } from "@/components/theme/theme-toggle";

export function OkoSidebarHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">OKO Security</h2>
      <ThemeToggle />
    </div>
  );
}