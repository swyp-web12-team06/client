import { cn } from "@/utils/styles";
import { cva, VariantProps } from "class-variance-authority";
import Image from "next/image";
import React from "react";

// 1. Container (div) Variants
const containerVariants = cva(
    "w-full flex items-center border text-gray-800 has-[input:disabled]:bg-gray-300",
    {
        variants: {
            variant: {
                primary: "border-gray-450 hover:border-gray-500 focus-within:bg-gray-200 focus-within:border-gray-600 focus-within:border-[1.5px] rounded-4xl bg-gray-300 has-[input:disabled]:hover:border-gray-450",
                secondary: "border-gray-500 hover:border-gray-800 focus-within:border-primary-200 rounded-lg bg-gray-100 has-[input:disabled]:hover:border-gray-500",
            },
            size: {
                small: "h-10",
                medium: "h-11",
                large: "h-15",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "medium",
        },
    }
);

// 2. Input element Variants
const inputVariants = cva(
    "peer mx-4.75 w-full outline-none bg-transparent",
    {
        variants: {
            variant: {
                primary: "placeholder:text-gray-600",
                secondary: "placeholder:text-gray-500",
            },
            textAlign: {
                left: "text-left",
                right: "text-right",
            }
        },
        defaultVariants: {
            variant: "primary",
            textAlign: "left",
        }
    }
);

// 3. Combine props from both variants
type ContainerVariants = VariantProps<typeof containerVariants>;
type InputVariants = VariantProps<typeof inputVariants>;

interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    ContainerVariants,
    InputVariants {
    isSearching?: boolean;
    label?: string;
    bottomLabel?: string;
    sideLabel?: string;
    onClear?: () => void;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, isSearching, variant, size, textAlign, onClear, label, bottomLabel, sideLabel, ...props }, ref) => {
        const hasValue = props.value && String(props.value).length > 0;

        return (
            <div className={cn("relative w-full", className)}>
                {label && <span className="mb-1.5 text-gray-800 typo-body1-semibold">{label}</span>}
                <div className="flex items-center">
                    {/* Use containerVariants for the container div */}
                    <div className={cn(hasValue && "text-gray-800! border-gray-600!", containerVariants({ variant, size }))}>
                        {isSearching && <div className="ml-1.5 h-7.75 min-w-7.75 relative">
                            <Image src="/icon/magnifying-glass-icon.svg" alt="Search Icon" fill />
                        </div>}
                        {/* Use inputVariants for the input element */}
                        <input
                            ref={ref}
                            className={cn(inputVariants({ variant, textAlign }))}
                            {...props}
                        />
                        {hasValue && onClear && (
                            <button type="button" onClick={onClear} className="absolute cursor-pointer w-3 h-3 right-4.25 top-1/2 -translate-y-1/2 p-1">
                                <Image src="/icon/input-clear.svg" alt="Clear Input" fill />
                            </button>
                        )}
                    </div>
                    {sideLabel && <span className="ml-[16.05px] typo-heading3-medium text-gray-600">{sideLabel}</span>}
                </div>
                {bottomLabel && <span className="mt-2 typo-body2-regular text-gray-500">{bottomLabel}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
