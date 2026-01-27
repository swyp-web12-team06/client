import { Button } from '@/components/commons/Button';

export default function Success() {
  return (
    <main className="mt-20 mb-20 flex w-[816px] items-center items-end gap-30">
      <section className="inline-flex w-full flex-col items-end justify-start gap-6 rounded-[10px]">
        <div className="flex w-full gap-4">
          <div className="bg-primary-100 h-15 w-15 rounded-full"></div>
          <div className="flex flex-col">
            <p className="typo-heading2-semibold text-gray-800">결제 금액</p>
            <p className="typo-heading3-regular text-gray-800">10,000 원</p>
          </div>
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-5">
          <h3 className="typo-heading2-semibold">충전 내역</h3>
          <div className="border-gray-450 inline-flex w-full justify-between border-b pb-3">
            <p className="typo-body1-medium text-gray-800">결제 금액</p>
            <p className="typo-body1-medium text-gray-800">10,000 원</p>
          </div>
          <div className="border-gray-450 inline-flex w-full justify-between border-b pb-3">
            <p className="typo-body1-medium text-gray-800">결제 금액</p>
            <p className="typo-body1-medium text-gray-800">10,000 원</p>
          </div>
          <div className="border-gray-450 inline-flex w-full justify-between border-b pb-3">
            <p className="typo-body1-medium text-gray-800">결제 금액</p>
            <p className="typo-body1-medium text-gray-800">10,000 원</p>
          </div>
          <div className="inline-flex w-full justify-between border-b border-gray-800 pb-4">
            <p className="typo-heading3-medium text-gray-800">결제 금액</p>
            <p className="typo-heading3-medium text-gray-800">10,000 원</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <div className="w-full rounded-[10px] bg-gray-900 px-7 py-6">
            <h3 className="typo-body1-semibold text-background">잔여 크레딧</h3>
            <div className="flex items-center gap-3">
              <p className="typo-heading1-semibold text-background">50 C</p>
              <p className="typo-heading3-medium text-background">= 5,000원</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-between rounded-[10px] bg-gray-300 px-7 py-5">
            <p className="typo-heading2-medium">고객센터 문의</p>
            <div className="bg-primary-100 h-4 w-4 rounded-full"></div>
          </div>
        </div>
        <Button className="w-[20%]">결제</Button>
      </section>
    </main>
  );
}
