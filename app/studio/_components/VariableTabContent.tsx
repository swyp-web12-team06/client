import Input from '@/components/commons/Input';
import { useEffect, useState } from 'react';

interface props {
  tab: string;
  index: number;
  variableName: string;
  variableDescription: string;
  handleVariablesChange: (value: string) => void;
  value?: string;
}

export function VariableTabContent({
  tab,
  index,
  variableName,
  variableDescription,
  handleVariablesChange,
  value,
}: props) {
  useEffect(() => {}, [tab]);
  return (
    <div className="flex w-full flex-col gap-2">
      <h5 className="text-sm font-bold">{variableName}</h5>
      <p className="text-xs text-gray-500">{variableDescription}</p>
      <Input
        variant="secondary"
        size="small"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVariablesChange(e.target.value)}
        placeholder={`${variableName}의 내용을 입력하세요.`}
      />
    </div>
  );
}
