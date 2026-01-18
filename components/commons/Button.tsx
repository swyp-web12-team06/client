import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/styles";

export type ButtonVariants = VariantProps<typeof buttonVariants>;

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-full cursor-pointer",
    {
        variants: {
            variant: {
                primary:
                    "bg-brand-300 text-background hover:bg-brand-600",
                tertiary:
                    "bg-gray-200 border border-gray-400 text-background hover:bg-gray-300 hover:bg-gray-500",
            },
            size: {
                sm: "h-8 px-3 typo-body2-bold",
                md: "h-10 px-4 typo-body1-bold",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, type, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size }), className)}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";


