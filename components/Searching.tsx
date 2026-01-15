import { Select, TextField } from "@radix-ui/themes";
import Image from "next/image";

export default function Searching() {
    return (
        <div className="flex px-4 gap-2">
            <Select.Root defaultValue="new">
                <Select.Trigger className="min-h-10! min-w-48! px-8! cursor-pointer!" radius="full" />
                <Select.Content className="rounded-2xl! p-1! mt-2! bg-(--color-bg-content-2)!" position="popper">
                    <Select.Group>
                        <Select.Item value="new">Newest first</Select.Item>
                        <Select.Item value="old">Oldest first</Select.Item>
                        <Select.Separator />
                        <Select.Item value="popular">Most popular</Select.Item>
                        <Select.Item value="liked">Most liked</Select.Item>
                        <Select.Item value="bookmarked">Most bookmarked</Select.Item>
                    </Select.Group>
                    <Select.Separator />
                    <Select.Group>
                        <Select.Item value="low">Lowest price first</Select.Item>
                        <Select.Item value="high">Highest price first</Select.Item>
                    </Select.Group>
                </Select.Content>
            </Select.Root>
            <Select.Root defaultValue="Portraits">
                <Select.Trigger className="min-h-10! min-w-48! px-8! cursor-pointer!" radius="full" />
                <Select.Content className="rounded-2xl! p-1! mt-2! bg-(--color-bg-content-2)!" position="popper">
                    <Select.Group>
                        <Select.Item value="Portraits">Portraits</Select.Item>
                        <Select.Item value="Landscapes">Landscapes</Select.Item>
                        <Select.Item value="Architecture">Architecture</Select.Item>
                        <Select.Item value="Animals">Animals</Select.Item>
                        <Select.Item value="Food">Food</Select.Item>
                        <Select.Item value="Interior">Interior</Select.Item>
                        <Select.Item value="Fashion">Fashion</Select.Item>
                        <Select.Item value="Sci-Fi">Sci-Fi</Select.Item>
                        <Select.Item value="Abstract">Abstract</Select.Item>
                        <Select.Item value="Logos/Icons">Logos/Icons</Select.Item>
                    </Select.Group>
                </Select.Content>
            </Select.Root>
            <TextField.Root radius="full" className="min-h-10 w-full lg:ml-44 bg-(--color-bg-content-2)!" placeholder="search by model, category and more..">
                <TextField.Slot>
                    <Image src="icon/magnifying-glass-icon.svg" alt="Search Icon" width={30} height={30} />
                </TextField.Slot>
            </TextField.Root>
        </div>
    );
}
