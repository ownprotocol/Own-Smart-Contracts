import { type ParentComponent } from "@/types/components";
import { cn } from "@/lib/utils";

export const TableHeader = ({ children, className }: ParentComponent) => (
  <th
    scope="col"
    className={cn(
      "px-3 py-3.5 text-left font-dm_mono text-sm font-semibold text-gray-400 sm:pl-0",
      className,
    )}
  >
    {children}
  </th>
);

export const TableRow = ({ children, className }: ParentComponent) => (
  <td
    className={cn(
      "whitespace-nowrap py-3.5 pl-4 pr-3 text-left font-dm_sans text-sm font-semibold text-white sm:pl-0",
      className,
    )}
  >
    {children}
  </td>
);
