'use client';

import { Button } from '@/components/commons/Button';
import Image from 'next/image';

export default function Settings() {
  return (
    <div>
      <Image src="/icon/logo.svg" alt="Logo" width={133} height={22} />
      <Button variant="gradientSolid">Click Me</Button>
    </div>
  );
}
