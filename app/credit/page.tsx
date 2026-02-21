'use client';

import { Button } from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import PortOne from '@portone/browser-sdk/v2';
import { useEffect, useState } from 'react';
import CreditCard from './_components/CreditCard';
import { getCreditBalance, getCreditOptions } from '@/lib/api';
import { Options, Balance, Result } from '@/type/credit';
import ArrowRightIcon from '@/public/icon/arrow-right.svg';
import SuccessCheckIcon from '@/public/icon/success-check.svg';
import { useAuth } from '@/context/AuthContext';

const TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN;

export default function Credit() {
  const [paymentStatus, setPaymentStatus] = useState<{
    status: string;
    message?: string;
  }>({
    status: 'IDLE',
  });
  const [amount, setAmount] = useState('0');
  const [balance, setBalance] = useState<number>(0);
  const [options, setOptions] = useState<Options[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [result, setResult] = useState<Result>({} as Result);
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!accessToken) return;
    const fetchDatas = async () => {
      const options = await getCreditOptions();
      const balance = await getCreditBalance(accessToken);
      setOptions(options);
      setBalance(balance.currentCredit);
      console.log('balance', balance.currentCredit);
    };
    fetchDatas();
  }, [accessToken]);

  function getCreditBonus(inputAmount: number) {
    const matchedTarget = [...options].reverse().find((item) => inputAmount >= item.amount);
    if (!matchedTarget) {
      return 0;
    }
    const rate = parseInt(matchedTarget.bonusRateText) || 0;
    const bonus = Math.ceil((inputAmount * rate) / 10000);
    return bonus;
  }

  function moneyToCredits(inputAmount: number) {
    return inputAmount / 100;
  }

  function creditsToMoney(inputAmount: number) {
    return inputAmount * 100;
  }

  function randomId() {
    return [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, '0'))
      .join('');
  }

  const handlePayment = async () => {
    if (Number(amount) <= 0) {
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
      orderName: `${amount}원`,
      totalAmount: Number(amount),
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
    const completeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/credit/charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        paymentId: payment?.paymentId,
      }),
    });

    if (completeResponse.ok) {
      const paymentComplete = await completeResponse.json();

      setPaymentStatus({ status: paymentComplete.status });
      setResult(paymentComplete.data);
      setIsPurchased(true);

      window.dispatchEvent(new Event('credit:changed'));
    } else {
      setPaymentStatus({
        status: 'FAILED',
        message: await completeResponse.text(),
      });
    }
  };

  return (
    <main className="mt-35 mb-20 flex w-[1232px] items-center items-end gap-30">
      {isPurchased ? (
        <section className="inline-flex w-full flex-col items-end justify-start gap-6 rounded-[10px]">
          <div className="flex w-full gap-4">
            <SuccessCheckIcon className="h-15 w-15" />
            <div className="flex flex-col">
              <p className="typo-heading2-semibold text-gray-800">결제 금액</p>
              <p className="typo-heading3-regular text-gray-800">{amount} 원</p>
            </div>
          </div>
          <div className="flex w-full flex-col items-start justify-start gap-5">
            <h3 className="typo-heading2-semibold">충전 내역</h3>
            <div className="border-gray-450 inline-flex w-full justify-between border-b pb-3">
              <p className="typo-body1-medium text-gray-800">결제 금액</p>
              <p className="typo-body1-medium text-gray-800">{amount} 원</p>
            </div>
            <div className="border-gray-450 inline-flex w-full justify-between border-b pb-3">
              <p className="typo-body1-medium text-gray-800">충전 크레딧</p>
              <p className="typo-body1-medium text-gray-800">
                {result.addedCredit - getCreditBonus(Number(amount))} C
              </p>
            </div>
            <div className="border-gray-450 inline-flex w-full justify-between border-b pb-3">
              <p className="typo-body1-medium text-gray-800">보너스 크레딧</p>
              <p className="typo-body1-medium text-gray-800">{getCreditBonus(Number(amount))} C</p>
            </div>
            <div className="inline-flex w-full justify-between border-b border-gray-800 pb-4">
              <p className="typo-heading3-medium text-gray-800">총 충전 크레딧</p>
              <p className="typo-heading3-medium text-gray-800">{result.addedCredit} C</p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3">
            <div className="w-full rounded-[10px] bg-gray-900 px-7 py-6">
              <h3 className="typo-body1-semibold text-background">잔여 크레딧</h3>
              <div className="flex items-center gap-3">
                <p className="typo-heading1-semibold text-background">{result.totalBalance} C</p>
                <p className="typo-heading3-medium text-background">
                  = {creditsToMoney(result.totalBalance)}원
                </p>
              </div>
            </div>
            <div className="flex w-full items-center justify-between rounded-[10px] bg-gray-300 px-7 py-5">
              <p className="typo-heading2-medium">고객센터 문의</p>
              <ArrowRightIcon className="h-6 w-6" />
            </div>
          </div>
          <Button className="w-[20%]">결제</Button>
        </section>
      ) : (
        <>
          {' '}
          <section className="flex w-[57%] flex-col items-end gap-9">
            <div className="w-full rounded-[10px] bg-gray-900 px-7 py-6">
              <h3 className="typo-body1-semibold text-background">잔여 크레딧</h3>
              <div className="flex items-center gap-3">
                <p className="typo-heading1-semibold text-background">{balance} C</p>
                <p className="typo-heading3-medium text-background">
                  = {creditsToMoney(balance)}원
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="typo-body1-medium text-gray-700">원하는 충전 금액 선택</h2>
              <div className="flex flex-wrap gap-4">
                {options.map((option) => (
                  <CreditCard key={option.id} value={amount} setValue={setAmount} option={option} />
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="typo-heading3-semibold text-gray-600">원</p>
            </div>
          </section>
          <section className="inline-flex w-[32%] flex-col items-start justify-start gap-5 rounded-[10px] bg-white p-8 shadow-[0px_0px_7px_0px_rgba(112,112,112,0.25)]">
            <div className="flex w-full flex-col items-start justify-start gap-5">
              <div className="border-gray-450 inline-flex w-full justify-between border-b pb-3">
                <p className="typo-body1-medium text-gray-800">결제 금액</p>
                <p className="typo-body1-medium text-gray-800">{amount} 원</p>
              </div>
              <div className="border-gray-450 inline-flex w-full justify-between border-b pb-3">
                <p className="typo-body1-medium text-gray-800">충전 크레딧</p>
                <p className="typo-body1-medium text-gray-800">{moneyToCredits(Number(amount))}C</p>
              </div>
              <div className="border-gray-450 inline-flex w-full justify-between border-b pb-3">
                <p className="typo-body1-medium text-gray-800">보너스 크레딧</p>
                <p className="typo-body1-medium text-gray-800">{getCreditBonus(Number(amount))}C</p>
              </div>
              <div className="inline-flex w-full justify-between border-b border-gray-800 pb-4">
                <p className="typo-heading3-medium text-gray-800">총 충전 크레딧</p>
                <p className="typo-heading3-medium text-gray-800">
                  {moneyToCredits(Number(amount)) + getCreditBonus(Number(amount))}C
                </p>
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
        </>
      )}
    </main>
  );
}
