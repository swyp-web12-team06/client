import { Radio } from '@/components/commons/Radio';

interface IProps {
  setValue: (value: string) => void;
  value: string;
}

export default function CreditCard({ setValue, value }: IProps) {
  return (
    <div className="h-[118px] w-[220px] rounded-[10px] px-3 py-4 outline outline-1 outline-offset-[-1px] outline-gray-700">
      <div className="flex w-fit flex-col items-end gap-1">
        <div className="inline-flex gap-1">
          <Radio
            name="option"
            value="5000"
            checked={value === '5000'}
            onChange={() => setValue('5000')}
          />
          <p className="typo-body1-medium w-28 text-gray-800">5,000원</p>
        </div>
        <div className="flex w-28 flex-col">
          <p className="typo-body1-medium text-gray-800">53 C</p>
          <p className="typo-caption-regular text-gray-600">+ 5% 보너스 (+3 C )</p>
        </div>
      </div>
    </div>
  );
}
