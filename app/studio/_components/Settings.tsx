'use client';

import { Button } from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import Select, { SelectItemType } from '@/components/commons/Select';
import Image from 'next/image';
import { useState } from 'react';
import RemoveIcon from '@/public/icon/remove.svg';
import CreditIcon from '@/public/icon/credit.svg';

export default function Settings() {
  const [resolution, setResolution] = useState('2k');
  const [ratio, setRatio] = useState('1:1');

  const ratioItems: SelectItemType[] = [
    {
      type: 'group',
      label: 'Ratio',
      items: [
        { value: '', label: 'default' },
        { value: '1:1', label: 'Squre 1:1' },
        { type: 'separator' },
        { value: '9:16', label: 'Portrait 9:16' },
        { value: '3:4', label: 'Portrait 3:4' },
        { type: 'separator' },
        { value: '16:9', label: 'Landscape 16:9' },
        { value: '4:3', label: 'Landscape 4:3' },
      ],
    },
  ];

  const resolutionItems: SelectItemType[] = [
    {
      type: 'group',
      label: 'Resolution',
      items: [
        { value: '1K', label: 'default 1K' },
        { value: '2K', label: '2K' },
        { value: '4k', label: '4K' },
      ],
    },
  ];

  return (
    <div className="flex w-full flex-col gap-17">
      <div className="flex flex-col gap-5">
        <div className="flex w-full flex-col gap-2">
          <h4 className="typo-body1-semibold">변수입력</h4>
          <div className="flex w-full flex-col gap-6 rounded-[10px] p-5 shadow-[0px_0px_7px_0px_rgba(112,112,112,0.25)]">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                생성하기
              </Button>
              <Button variant="outline" size="sm">
                생성하기
              </Button>
              <Button variant="outline" size="sm">
                생성하기
              </Button>
              <Button variant="outline" size="sm">
                생성하기
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h5>주제</h5>
                <p className="typo-body2-regular">
                  해당 변수는 이미지의 메인 주제를 정하는 중요한 변수입니다. 자세한 사용은 예시
                  이미지를 통해 확인할수있습니다.
                </p>
              </div>
              <div>
                <Input
                  variant="secondary"
                  size="small"
                  label="변수를 설정해 주세요"
                  placeholder="성인 남성"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="inline-flex w-full justify-between">
          <div className="inline-flex gap-3">
            <Select
              value={resolution}
              onValueChange={() => setResolution(resolution)}
              items={resolutionItems}
            />
            <Select value={ratio} onValueChange={() => setRatio(ratio)} items={ratioItems} />
          </div>
          <span className="inline-flex items-center justify-start gap-1.5 rounded-full px-2.5 py-1.5 outline outline-1 outline-offset-[-1px] outline-gray-500">
            <div className="flex items-center justify-start gap-0.5">
              <RemoveIcon width={10} height={10} />
              <p className="flex items-center justify-center gap-2.5">600</p>
            </div>
            <CreditIcon />
          </span>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button variant="solid" size="md">
          생성하기
        </Button>
      </div>
    </div>
  );
}
