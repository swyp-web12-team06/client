import Input from '@/components/commons/Input';
import { useEffect, useState } from 'react';

interface Props {
  tab: string;
  index: number;
  variableName: string;
  variableDescription: string;
  handleVariablesChange: (value: string) => void;
}

export function VariableTabContent({
  tab,
  variableName,
  variableDescription,
  handleVariablesChange,
}: Props) {
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    setLocalValue('');
  }, [tab]);

  return (
    <div className="flex w-full flex-col gap-2">
      <h5 className="text-sm font-bold">{variableName}</h5>
      <p className="text-xs text-gray-500">{variableDescription}</p>
      <Input
        variant="secondary"
        size="small"
        value={localValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const v = e.target.value;
          setLocalValue(v);
          handleVariablesChange(v);
        }}
        placeholder={`${variableName}의 내용을 입력하세요.`}
      />
    </div>
  );
}
