"use client";

import { Button, IconButton, SegmentedControl } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface props {
    isLoggedIn: boolean;
    creditAmount: number;
    userName: string;
    userAvatar?: string;
}

export default function Header({ isLoggedIn, creditAmount, userName, userAvatar }: props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view") || "lookbook";

    const handleViewChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("view", value);
        router.push(`/?${params.toString()}`);
    };

    return (
        <header className="w-full h-20 p-4 flex justify-between items-center">
            <div className="flex items-center gap-14">
                <Link href="/">
                    <Image src="/logo.svg" alt="Logo" width={133} height={22} />
                </Link>
                <SegmentedControl.Root value={currentView} onValueChange={handleViewChange}>
                    <SegmentedControl.Item value="lookbook">LOOK BOOK</SegmentedControl.Item>
                    <SegmentedControl.Item value="gallery">GALLERY</SegmentedControl.Item>
                </SegmentedControl.Root>
            </div>
            {!isLoggedIn ? (
                <Button variant="solid" className="bg-(--color-main)!">
                    LOGIN
                </Button>
            ) : (
                <div className="flex items-center gap-6">
                    <Button variant="solid" className="bg-(--color-main)!">
                        Submit Prompt <Image src="/submit-star.svg" alt="Submit Prompt" width={15} height={15} />
                    </Button>
                    <div className="flex items-center gap-1">
                        <div className="min-w-24 min-h-8 leading-8 text-center border border-gray-200 rounded-sm">
                            {creditAmount} C
                        </div>
                        <IconButton className="bg-(--color-main)!">
                            <Image src='/plus.svg' alt='Add Credit' width={18} height={18} />
                        </IconButton>
                    </div>
                    <div className="flex items-center gap-2 font-bold">
                        {!userAvatar ?(
                            <Image src="/user.svg" alt="User Avatar" width={32} height={32} />
                        ):(
                            <Image className="rounded-full" src={userAvatar} alt="User Avatar" width={32} height={32} />
                        )}
                        {userName}
                    </div>
                </div>
            )}
        </header>
    );
}