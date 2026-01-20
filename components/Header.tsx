'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from './commons/Button';

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
        <div >
          <Button onClick={() => handleViewChange('lookbook')}>
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
          </Button>
          <Button onClick={() => handleViewChange('gallery')}>
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
          </Button>
        </div>
      </div>
      {isLoading ? (
        <Button >
          Loading...
        </Button>
      ) : !isLoggedIn ? (
        <div className='fixed bottom-10 right-10'>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full cursor-pointer justify-center"
            >
              <Link href="http://localhost:8080/oauth2/authorization/google">
                Login with Google
              </Link>
            </Button>
            <Button
              className="w-full cursor-pointer justify-center"
            >
              <Link href="http://localhost:8080/oauth2/authorization/kakao">
                Login with Kakao
              </Link>
            </Button>
            <Button
              color="green"
              className="w-full cursor-pointer justify-center"
            >
              <Link href="http://localhost:8080/oauth2/authorization/naver">
                Login with Naver
              </Link>
            </Button>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <Button>
            Submit Prompt{' '}
            <Image src="/icon/submit-star.svg" alt="Submit Prompt" width={15} height={15} />
          </Button>
          <div className="flex items-center gap-1 overflow-hidden rounded-4xl border border-gray-200">
            <div className="flex min-h-8 min-w-24 justify-between text-center leading-8">
              {/* creditAmount는 user 객체에 포함되어야 함. 일단 100으로 고정 */}
              <div className="mr-2 ml-4 flex justify-center gap-1">
                {100} <Image src="/icon/credit.svg" alt="Credit" width={18} height={18} />
              </div>
              <Button>
                <Image
                  className="inline-block"
                  src="/icon/plus.svg"
                  alt="Add Credit"
                  width={18}
                  height={18}
                />
              </Button>
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
            <Button onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
