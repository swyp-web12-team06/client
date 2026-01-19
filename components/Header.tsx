'use client';

import { Button, IconButton, SegmentedControl, Dialog } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'lookbook';

  const handleViewChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', value);
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="fixed z-15 flex h-20 w-full max-w-7xl items-center justify-between bg-(--color-bg-lightest) p-4">
      <div className="flex items-center gap-14">
        <Link href="/">
          <Image src="/icon/logo.svg" alt="Logo" width={133} height={22} />
        </Link>
        <SegmentedControl.Root radius="full" value={currentView} onValueChange={handleViewChange}>
          <SegmentedControl.Item value="lookbook" className="cursor-pointer!">
            {currentView !== 'lookbook' ? (
              <Image
                className="mr-1 inline-block"
                src="/icon/lookbook-inactive.svg"
                alt="Lookbook Inactive"
                width={18}
                height={18}
              />
            ) : (
              <Image
                className="mr-1 inline-block"
                src="/icon/lookbook-active.svg"
                alt="Lookbook Active"
                width={18}
                height={18}
              />
            )}{' '}
            LOOK BOOK
          </SegmentedControl.Item>
          <SegmentedControl.Item value="gallery" className="cursor-pointer!">
            {currentView !== 'gallery' ? (
              <Image
                className="mr-1 inline-block"
                src="/icon/gallery-inactive.svg"
                alt="Gallery Inactive"
                width={18}
                height={18}
              />
            ) : (
              <Image
                className="mr-1 inline-block"
                src="/icon/gallery-active.svg"
                alt="Gallery Active"
                width={18}
                height={18}
              />
            )}{' '}
            GALLERY
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      {isLoading ? (
        <Button variant="solid" className="cursor-not-allowed bg-gray-400">
          Loading...
        </Button>
      ) : !isLoggedIn ? (
        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="solid" className="cursor-pointer! bg-(--color-main)!">
              LOGIN
            </Button>
          </Dialog.Trigger>
          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>Login</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Login with your social account.
            </Dialog.Description>

            <div className="flex flex-col gap-3">
              <Button
                asChild
                size="3"
                variant="soft"
                className="w-full cursor-pointer justify-center"
              >
                <Link href="http://localhost:8080/oauth2/authorization/google">
                  Login with Google
                </Link>
              </Button>
              <Button
                asChild
                size="3"
                variant="soft"
                color="yellow"
                className="w-full cursor-pointer justify-center"
              >
                <Link href="http://localhost:8080/oauth2/authorization/kakao">
                  Login with Kakao
                </Link>
              </Button>
              <Button
                asChild
                size="3"
                variant="soft"
                color="green"
                className="w-full cursor-pointer justify-center"
              >
                <Link href="http://localhost:8080/oauth2/authorization/naver">
                  Login with Naver
                </Link>
              </Button>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      ) : (
        <div className="flex items-center gap-6">
          <Button variant="solid" className="cursor-pointer! rounded-4xl! bg-(--color-main)!">
            Submit Prompt{' '}
            <Image src="/icon/submit-star.svg" alt="Submit Prompt" width={15} height={15} />
          </Button>
          <div className="flex items-center gap-1 overflow-hidden rounded-4xl border border-gray-200">
            <div className="flex min-h-8 min-w-24 justify-between text-center leading-8">
              {/* creditAmount는 user 객체에 포함되어야 함. 일단 100으로 고정 */}
              <div className="mr-2 ml-4 flex justify-center gap-1">
                {100} <Image src="/icon/credit.svg" alt="Credit" width={18} height={18} />
              </div>
              <IconButton className="cursor-pointer! rounded-4xl! bg-(--color-main)!">
                <Image
                  className="inline-block"
                  src="/icon/plus.svg"
                  alt="Add Credit"
                  width={18}
                  height={18}
                />
              </IconButton>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/profile" className="flex items-center gap-2 font-bold">
              {user?.profileImageUrl ? (
                <Image
                  className="rounded-full"
                  src={user.profileImageUrl}
                  alt="User Avatar"
                  width={32}
                  height={32}
                />
              ) : (
                <Image src="/icon/user.svg" alt="User Avatar" width={32} height={32} />
              )}
              {user?.nickname}
            </Link>
            <Button onClick={logout} variant="soft" color="gray" className="cursor-pointer">
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
