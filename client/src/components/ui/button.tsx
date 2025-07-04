import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import LoadingSpinner from "../loading-spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:pointer-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-white bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary:
          "font-funnel bg-black text-[14px] leading-[14px] tracking-[0%] text-white hover:bg-gray-900 md:text-[16px] md:leading-[16px]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        mainButton:
          "font-funnel bg-[#C58BFF] text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#E49048] md:text-[16px] md:leading-[16px]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 md:!py-7",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  useSpinner?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, useSpinner = false, ...props },
    ref,
  ) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const Comp = asChild ? Slot : "button";

    const onClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!props.onClick) return;

      if (!useSpinner) {
        props.onClick(e);
        return;
      }

      setIsLoading(true);

      try {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await props.onClick(e);

        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        throw e;
      }
    };

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- this is required for this button to be disabled
    const isDisabled = props.disabled || isLoading;

    return (
      <Comp
        {...props}
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
          }),
          isDisabled && "!bg-gray-500",
        )}
        onClick={onClickHandler}
        ref={ref}
        disabled={isDisabled}
      >
        {isLoading ? <LoadingSpinner /> : props.children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
