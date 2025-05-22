import { cn } from "@/lib/utils";

interface FooterHeaderWrapperProps {
  className?: string;
  children: React.ReactNode;
}

export const FooterHeaderWrapper = ({
  children,
  className,
}: FooterHeaderWrapperProps) => (
  <div
    className={cn(
      "fixed z-50 flex w-full max-w-7xl justify-between bg-background px-8 text-sm text-gray-400",
      className,
    )}
  >
    {children}
  </div>
);
