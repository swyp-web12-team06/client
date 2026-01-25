'use client';

import { Button } from '@/components/commons/Button';

export default function GeneratedImage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between border-b-2 border-gray-400 pb-3">
        <h4 className="typo-heading2-medium">Preview</h4>
        <Button variant="solid" size="sm">
          Download
        </Button>
      </div>
      <div className="h-[588px] self-stretch bg-gray-400" />
    </div>
  );
}
