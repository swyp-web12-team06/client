import { Select, TextField } from "@radix-ui/themes";
import Image from "next/image";

export default function Searching() {
    return (
        <div className="flex px-4 gap-2">
            <TextField.Root className="min-h-10 w-full" placeholder="Search the gallery…">
                <TextField.Slot>
                    <Image className="ml-3" src="icon/magnifying-glass-icon.svg" alt="Search Icon" width={16} height={16} />
                </TextField.Slot>
            </TextField.Root>
            <Select.Root defaultValue="new">
                <Select.Trigger className="min-h-10!"/>
                <Select.Content>
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
                        <Select.Label>Sort by price</Select.Label>
                        <Select.Item value="low">Lowest price first</Select.Item>
                        <Select.Item value="high">Highest price first</Select.Item>
                    </Select.Group>
                </Select.Content>
            </Select.Root>
            <Select.Root defaultValue="Portraits">
                <Select.Trigger className="min-h-10!"/>
                <Select.Content>
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
        </div>
    );
}
