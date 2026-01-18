import { cn } from "@/utils/styles";
import { cva, VariantProps } from "class-variance-authority";
import Image from "next/image";
import React from "react";

type InputVariants = VariantProps<typeof inputVariants>;

const inputVariants = cva(
    "min-h-10 w-full flex items-center rounded-4xl border-1 text-body1-medium bg-gray-50 hover:bg-gray-100 focus:bg-gray-50 focus:border-[1.5px] focus:border-(--color-main) active:text-gray-900 text-gray-900",
    {
        variants: {
            border: {
                default: "border-gray-200",
                primary: "border-blue-500",
                secondary: "border-gray-500",
            },
            radius: {
                sm: "rounded-lg",
                md: "rounded-2xl",
                lg: "rounded-4xl",
            },
        },
        defaultVariants: {
            radius: "lg",
            border: "default",
        },
    }
);

interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
    InputVariants {
    isSearching?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, isSearching = false, border, radius, ...props }, ref) => {
        return (
            <div className={cn(inputVariants({ border, radius }), className, { "text-gray-600": isSearching })}>
                {isSearching && <div className="px-1.25 mr-3.5">
                    <Image src="/icon/magnifying-glass-icon.svg" alt="Search Icon" width={30} height={30} />
                </div>}
                <input
                    ref={ref}
                    className={`${isSearching ? "mr-4.5" : "mx-4.5"} w-full outline-none placeholder:text-gray-600`}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;