import { cn } from "@/utils/styles";
import { cva, VariantProps } from "class-variance-authority";
import Image from "next/image";
import React, { useState } from "react";

type InputVariants = VariantProps<typeof inputVariants>;

const inputVariants = cva(
    "h-11 w-full flex items-center rounded-4xl border text-body1-medium bg-(--st-gray-300) hover:bg-(--st-gray-400) focus:bg-gray-50 focus:border-[1.5px] focus:border-(--color-main) active:text-gray-900 text-(--st-gray-600)",
    {
        variants: {
            border: {
                primary: "border-(--st-gray-450) hover:border-(--st-gray-500) focus:border-(--st-gray-600) rounded-4xl",
                secondary: "border-(--st-gray-600) rounded-2xl",
            },
            isSearching: {
                true: "text-(--st-gray-600)",
            },
        },
        defaultVariants: {
            border: "primary",
            isSearching: false,
        },
    }
);

interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
    InputVariants {
    isSearching?: boolean;
    onClear?: () => void;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, isSearching = false, border = "primary", onClear, ...props }, ref) => {
        const hasValue = props.value && String(props.value).length > 0;

        return (
            <div className={cn("relative w-full", className)}>
                <div className={cn(hasValue && "text-(--st-gray-800)! border-(--st-gray-600)! bg-(--st-gray-200)!", inputVariants({ border, isSearching }))}>
                    {isSearching && <div className="ml-1.5 h-7.75 min-w-7.75 relative">
                        <Image src="/icon/magnifying-glass-icon.svg" alt="Search Icon" fill />
                    </div>}
                    <input
                        ref={ref}
                        className="mx-4.75 w-full outline-none placeholder:text-gray-600 bg-transparent"
                        {...props}
                    />
                    {hasValue && onClear && isSearching && (
                        <button type="button" onClick={onClear} className="absolute cursor-pointer w-3 h-3 right-4.25 top-1/2 -translate-y-1/2 p-1">
                            <Image src="/icon/input-clear.svg" alt="Clear Input" fill />
                        </button>
                    )}
                </div>
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
