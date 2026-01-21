'use client';

import { Button } from '@/components/commons/Button';
import Image from 'next/image';

export default function Studio() {
  return (
    <main className="mb-20 flex h-[80%] w-full flex-col items-center gap-10">
      <div>
        <div>
          <h1>Studio</h1>
          <p>Welcome to the Studio page!</p>
        </div>
        <Image src="/icon/logo.svg" alt="Logo" width={133} height={22} />
      </div>
    </main>
  );
}
