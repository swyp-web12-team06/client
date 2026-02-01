import Input from '@/components/commons/Input';

export function TabContent({ setVariable }: { setVariable: (value: string) => void }) {
  return (
    <div className="w-full">
      <h5>테스트</h5>
      인풋에 따라 탭 버튼 바뀌는지 테스트
      <Input variant="secondary" size="small" onChange={(e) => setVariable(e.target.value)} />
    </div>
  );
}
