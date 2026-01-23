'use client';

import { Button } from '@/components/commons/Button';
import Image from 'next/image';
import Settings from './_components/Settings';
import GeneratedImage from './_components/GeneratedImage';

export default function Studio() {
  return (
    <main className="flex items-center gap-10">
      <div className="align-end mt-20 flex flex-col gap-6">
        <div className="flex justify-center gap-5">
          <div className="flex flex-col">
            <h4 className="typo-body1-bold">은하수 동물 프롬프트</h4>
            <p className="typo-body2-regular">
              해당 프롬프트는 별로 만들어진 동물이 밤하늘과 바다 위를 뛰어다니는 이미지를 생성하는
              프롬프트입니다. 해당 프롬프트는 별로 만들어진 동물이 밤하늘과 바다 위를 뛰어다니는
              이미지를 생성하는 프롬프트입니다.해당 프롬프트는 별로 만들어진 동물이 밤하늘과 바다
              위를 뛰어다니는 이미지를 생성하는 프롬프트입니다.
            </p>
          </div>
          <Image src="/icon/logo.svg" alt="Logo" width={240} height={174} className="bg-gray-400" />
        </div>
        <Settings />
      </div>
      <div>
        <GeneratedImage />
      </div>
    </main>
  );
}
