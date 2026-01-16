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
        <header className="fixed w-full max-w-7xl z-15 bg-(--color-bg-lightest) h-20 p-4 flex justify-between items-center">
            <div className="flex items-center gap-14">
                <Link href="/">
                    <Image src="icon/logo.svg" alt="Logo" width={133} height={22} />
                </Link>
                <SegmentedControl.Root radius="full" value={currentView} onValueChange={handleViewChange}>
                    <SegmentedControl.Item value="lookbook" className="cursor-pointer!">
                        {currentView !== "lookbook" ?
                            <Image className="inline-block mr-1" src='icon/lookbook-inactive.svg' alt='Lookbook Inactive' width={18} height={18} /> :
                            <Image className="inline-block mr-1" src='icon/lookbook-active.svg' alt='Lookbook Active' width={18} height={18} />} LOOK BOOK
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="gallery" className="cursor-pointer!">
                        {currentView !== "gallery" ?
                            <Image className="inline-block mr-1" src='icon/gallery-inactive.svg' alt='Gallery Inactive' width={18} height={18} /> :
                            <Image className="inline-block mr-1" src='icon/gallery-active.svg' alt='Gallery Active' width={18} height={18} />} GALLERY
                    </SegmentedControl.Item>
                </SegmentedControl.Root>
            </div>
            {!isLoggedIn ? (
                <Button variant="solid" className="bg-(--color-main)! cursor-pointer!">
                    LOGIN
                </Button>
            ) : (
                <div className="flex items-center gap-6">
                    <Button variant="solid" className="rounded-4xl! bg-(--color-main)! cursor-pointer!">
                        Submit Prompt <Image src="icon/submit-star.svg" alt="Submit Prompt" width={15} height={15} />
                    </Button>
                    <div className="flex items-center gap-1 border border-gray-200 rounded-4xl overflow-hidden">
                        <div className="flex justify-between min-w-24 min-h-8 leading-8 text-center">
                            <div className="flex justify-center gap-1 ml-4 mr-2">{creditAmount} <Image src="icon/credit.svg" alt="Credit" width={18} height={18} /></div>
                            <IconButton className="bg-(--color-main)! rounded-4xl! cursor-pointer!">
                                <Image className="inline-block" src='icon/plus.svg' alt='Add Credit' width={18} height={18} />
                            </IconButton>
                        </div>
                    </div>
                    <Link href="/profile" className="flex items-center gap-2 font-bold">
                        {!userAvatar ? (
                            <Image src="icon/user.svg" alt="User Avatar" width={32} height={32} />
                        ) : (
                            <Image className="rounded-full" src={userAvatar} alt="User Avatar" width={32} height={32} />
                        )}
                        {userName}
                    </Link>
                </div>
            )}
        </header>
    );
}