'use client';

import { Button } from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import PortOne from '@portone/browser-sdk/v2';
import { useState } from 'react';
import CreditCard from './_components/CreditCard';

export default function Credit() {
  const [paymentStatus, setPaymentStatus] = useState<{
    status: string;
    message?: string;
  }>({
    status: 'IDLE',
  });
  const [credit, setCredit] = useState('0');

  function randomId() {
    return [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, '0'))
      .join('');
  }

  const handlePayment = async () => {
    if (Number(credit) <= 0) {
      setPaymentStatus({ status: 'FAILED', message: '충전 금액은 0원 이상이어야 합니다.' });
      console.log(paymentStatus.message);
      return;
    }

    setPaymentStatus({ status: 'PENDING' });
    const paymentId = randomId();
    const payment = await PortOne.requestPayment({
      storeId: 'store-38dddffa-1b53-4ade-ae69-6af853b3934c',
      channelKey: 'channel-key-eadc0e01-f43a-416e-9120-bc0d2d207ad8',
      paymentId,
      orderName: `${credit}원`,
      totalAmount: Number(credit),
      currency: 'KRW',
      payMethod: 'CARD',
    });

    if (payment?.code !== undefined) {
      setPaymentStatus({
        status: 'FAILED',
        message: payment.message,
      });
      return;
    }
    const completeResponse = await fetch('/credit/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId: payment?.paymentId,
      }),
    });

    if (completeResponse.ok) {
      const paymentComplete = await completeResponse.json();
      setPaymentStatus({
        status: paymentComplete.status,
      });
    } else {
      setPaymentStatus({
        status: 'FAILED',
        message: await completeResponse.text(),
      });
    }
  };

  return (
    <main className="mt-20 mb-20 flex w-[1232px] items-center items-end gap-30">
      <section className="flex w-[57%] flex-col items-end gap-9">
        <div className="w-full rounded-[10px] bg-gray-900 px-7 py-6">
          <h3 className="typo-body1-semibold text-background">잔여 크레딧</h3>
          <div className="flex items-center gap-3">
            <p className="typo-heading1-semibold text-background">50 C</p>
            <p className="typo-heading3-medium text-background">= 5,000원</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="typo-body1-medium text-gray-700">원하는 충전 금액 선택</h2>
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <CreditCard key={item} value={credit} setValue={setCredit} />
            ))}
          </div>
        </div>
        <div className="flex w-[60%] items-center gap-3">
          <Input
            size="small"
            variant="secondary"
            placeholder="0"
            label="직접입력"
            bottomLabel="3,000원 이상 50,000원 이하로 입력해 주세요."
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
          />
          <p className="typo-heading3-semibold text-gray-600">원</p>
        </div>
      </section>
      <section className="inline-flex w-[32%] flex-col items-start justify-start gap-5 rounded-[10px] bg-white p-8 shadow-[0px_0px_7px_0px_rgba(112,112,112,0.25)]">
        <div className="flex w-full flex-col items-start justify-start gap-5">
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
        <div className="inline-flex w-full gap-3">
          <Button variant="lightOutline" className="w-full">
            취소
          </Button>
          <Button className="w-full" onClick={handlePayment}>
            결제
          </Button>
        </div>
      </section>
    </main>
  );
}
