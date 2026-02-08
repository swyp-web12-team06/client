import Input from '@/components/commons/Input';

interface props {
  index: number;
  variableName: string;
  variableDescription: string;

  handleVariablesChange: (value: string) => void;

  value?: string;
}

export function VariableTabContent({
  index,
  variableName,
  variableDescription,
  handleVariablesChange,
  value,
}: props) {
  return (
    <div className="flex w-full flex-col gap-2">
      {/* 간격 조절을 위한 클래스 추가 */}
      <h5 className="text-sm font-bold">{variableName}</h5>
      <p className="text-xs text-gray-500">{variableDescription}</p>
      <Input
        variant="secondary"
        size="small"
        value={value} // 부모의 상태를 반영
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVariablesChange(e.target.value)}
        placeholder={`${variableName}의 내용을 입력하세요.`}
      />
    </div>
  );
}
