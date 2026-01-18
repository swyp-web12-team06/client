import { TextField } from "@radix-ui/themes";
import Image from "next/image";

export default function Input({
    isSearching = false,
    value,
    placeholder,
    className,
    radius,
    onChange }: {
        isSearching?: boolean,
        value?: string | number | undefined,
        placeholder?: string | undefined,
        className?: string | undefined,
        radius?: "small" | "full" | "none" | "medium" | "large" | undefined,
        onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    }) {
    return (
        <TextField.Root
            className={`min-h-10 w-full text-body1-medium! bg-gray-50! hover:bg-gray-100! focus:bg-gray-50! focus:border-[1.5px]! focus:border-(--color-main)! active:text-gray-900! text-gray-900! ${className} ${isSearching && "text-gray-600!"}`}
            radius={radius || "full"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        >
            <TextField.Slot className={`px-1.25! ${isSearching && "mr-3.5!"}`}>
                {isSearching && <Image src="/icon/magnifying-glass-icon.svg" alt="Search Icon" width={30} height={30} />}
            </TextField.Slot>
        </TextField.Root>
    );
}