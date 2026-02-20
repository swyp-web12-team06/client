import Input from '@/components/commons/Input';
import { useEffect, useState } from 'react';

interface Props {
  tab: string;
  id: number;
  variableName: string;
  variableDescription: string;
  settedValue: string;
  changeVariable: (id: number, value: string) => void;
}

export function VariableTabContent({
  tab,
  id,
  variableName,
  variableDescription,
  settedValue,
  changeVariable,
}: Props) {
  const [localVariable, setLocalVariable] = useState(settedValue);

  useEffect(() => {
    setLocalVariable(settedValue);
  }, [tab, settedValue]);

  return (
    <div className="flex w-full flex-col gap-2">
      <h5 className="typo-body2-semibold">{variableName}</h5>
      <p className="typo-caption-regular text-gray-700">{variableDescription}</p>
      <Input
        variant="secondary"
        size="small"
        value={localVariable}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setLocalVariable(e.target.value);
          changeVariable(id, e.target.value);
        }}
        placeholder={`${variableName}의 내용을 입력하세요.`}
      />
    </div>
  );
}
