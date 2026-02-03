import { Radio } from '@/components/commons/Radio';
import { Options } from '@/type/credit';

interface IProps {
  setValue: (value: string) => void;
  value: string;
  option: Options;
}

export default function CreditCard({ setValue, value, option }: IProps) {
  return (
    <div className="h-[118px] w-[220px] rounded-[10px] px-3 py-4 outline outline-1 outline-offset-[-1px] outline-gray-700">
      <div className="flex w-fit flex-col items-end gap-1">
        <div className="inline-flex gap-1">
          <Radio
            name="option"
            value={option.amount.toString()}
            checked={value === option.amount.toString()}
            onChange={() => setValue(option.amount.toString())}
          />
          <p className="typo-body1-medium w-28 text-gray-800">{option.amount.toString()}원</p>
        </div>
        <div className="flex w-28 flex-col">
          <>
            <p className="typo-body1-medium text-gray-800">{option.totalCredit} C</p>
            {option.bonusCredit > 0 && (
              <p className="typo-caption-regular text-gray-600">
                + {option.bonusRateText}보너스 (+{option.bonusCredit}C)
              </p>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
