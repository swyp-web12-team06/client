'use client';

import { Button } from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import PortOne from '@portone/browser-sdk/v2';
import { useEffect, useState } from 'react';

// type PaymentStatusState =
//   | { status: 'IDLE' }
//   | { status: 'PAID' | 'READY' | 'FAILED' }
//   | { status: 'ERROR'; message: string };

export default function Credit() {
  const [paymentStatus, setPaymentStatus] = useState({
    status: 'IDLE',
  });

  //   useEffect(() => {
  //     async function loadItem() {
  //       const response = await fetch('/api/item');
  //       setItem(await response.json());
  //     }

  //     loadItem().catch((error) => console.error(error));
  //   }, []);

  //   if (item == null) {
  //     return (
  //       <dialog open>
  //         <article aria-busy>결제 정보를 불러오는 중입니다.</article>
  //       </dialog>
  //     );
  //   }

  //   function randomId() {
  //     return [...crypto.getRandomValues(new Uint32Array(2))]
  //       .map((word) => word.toString(16).padStart(8, '0'))
  //       .join('');
  //   }

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setPaymentStatus({ status: 'PENDING' });
  //     const paymentId = randomId();
  //     const payment = await PortOne.requestPayment({
  //       storeId: 'store-e4038486-8d83-41a5-acf1-844a009e0d94',
  //       channelKey: 'channel-key-ebe7daa6-4fe4-41bd-b17d-3495264399b5',
  //       paymentId,
  //       orderName: item.name,
  //       totalAmount: item.price,
  //       currency: item.currency,
  //       payMethod: 'CARD',
  //       customData: {
  //         item: item.id,
  //       },
  //     });
  //     if (payment.code !== undefined) {
  //       setPaymentStatus({
  //         status: 'FAILED',
  //         message: payment.message,
  //       });
  //       return;
  //     }
  //     const completeResponse = await fetch('/api/payment/complete', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         paymentId: payment.paymentId,
  //       }),
  //     });
  //     if (completeResponse.ok) {
  //       const paymentComplete = await completeResponse.json();
  //       setPaymentStatus({
  //         status: paymentComplete.status,
  //       });
  //     } else {
  //       setPaymentStatus({
  //         status: 'FAILED',
  //         message: await completeResponse.text(),
  //       });
  //     }
  //   };

  //   const isWaitingPayment = paymentStatus.status !== 'IDLE';

  //   const handleClose = () =>
  //     setPaymentStatus({
  //       status: 'IDLE',
  //     });

  const [credit, setCredit] = useState('0');

  function generateRandomId() {
    const randomValues = new Uint32Array(2);
    crypto.getRandomValues(randomValues);

    return Array.from(randomValues)
      .map((word) => word.toString(16).padStart(8, '0'))
      .join('');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 전송할 데이터 구성
    const formData = {
      storeId: 'store-e4038486-8d83-41a5-acf1-844a009e0d94',
      channelKey: 'channel-key-ebe7daa6-4fe4-41bd-b17d-3495264399b5',
      paymentId: generateRandomId(),
      orderName: `${credit}원 충전`,
      totalAmount: Number(credit),
      currency: 'KRW',
      payMethod: 'CARD',
    };

    console.log('전송 데이터:', formData);

    // setPaymentStatus({ status: 'PENDING' });
    // const paymentId = generateRandomId();
    // const payment = await PortOne.requestPayment({
    //   storeId: 'store-e4038486-8d83-41a5-acf1-844a009e0d94',
    //   channelKey: 'channel-key-ebe7daa6-4fe4-41bd-b17d-3495264399b5',
    //   paymentId,
    //   orderName: `${credit}원 충전`,
    //   totalAmount: Number(credit),
    //   currency: 'KRW',
    //   payMethod: 'CARD',
    // });
    // if (payment.code !== undefined) {
    //   setPaymentStatus({
    //     status: 'FAILED',
    //     message: payment.message,
    //   });
    //   return;
    // }
    // const completeResponse = await fetch('/api/payment/complete', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     paymentId: payment.paymentId,
    //   }),
    // });
    // if (completeResponse.ok) {
    //   const paymentComplete = await completeResponse.json();
    //   setPaymentStatus({
    //     status: paymentComplete.status,
    //   });
    // } else {
    //   setPaymentStatus({
    //     status: 'FAILED',
    //     message: await completeResponse.text(),
    //   });
    // }
  };

  return (
    <main className="mb-20 flex h-[80%] w-full flex-col items-center gap-10">
      <div></div>
      <div></div>
      <div>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold">충전 금액 선택 </h2>
          <div className="space-y-3">
            {/* 옵션 3000원 크레딧 */}
            <label className="flex cursor-pointer items-center rounded-lg border p-4 hover:bg-slate-50">
              <input
                type="radio"
                name="credit-choice"
                value="3000"
                checked={credit === '3000'}
                onChange={(e) => setCredit(e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-3 font-medium">3000원</span>
              <span className="ml-3 font-medium">30C</span>
            </label>

            {/* 옵션 5000원 크레딧 */}
            <label className="flex cursor-pointer items-center rounded-lg border p-4 hover:bg-slate-50">
              <input
                type="radio"
                name="credit-choice"
                value="5000"
                checked={credit === '5000'}
                onChange={(e) => setCredit(e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-3 font-medium">5000원</span>
              <span className="ml-3 font-medium">53C</span>
            </label>
          </div>
          <div>
            <Input placeholder="0" value={credit} onChange={(e) => setCredit(e.target.value)} />
            <p>원</p>
          </div>
          <div>
            <Button variant="gradientSolid">취소</Button>
            <Button variant="gradientSolid">결제하기</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
