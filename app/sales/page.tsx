'use client';

import { Button } from '@/components/commons/Button';
import { cn } from '@/utils/styles';
import { SalesFormContext } from './SalesFormContext';
import { useSalesFormLogic } from './useSalesFormLogic';
import PromptInfoStep from './PromptInfoStep';
import VariableStep from './VariableStep';
import ThumbnailStep from './ThumbnailStep';

export default function SalesPage() {

    const salesForm = useSalesFormLogic();
    const { handleSubmit, loading, error, successMessage, step, setStep, setError } = salesForm;
    const isLoadingOrError = error !== null || loading
    return (
        <SalesFormContext.Provider value={salesForm}>
            <div className='w-308 flex flex-wrap justify-between gap-20 mx-auto pt-43.5'>
                <div>
                    <h2 className='typo-heading1-semibold text-gray-800 mb-9'>
                        프롬프트 등록
                    </h2>
                    <p>
                        {'Step ' + step + ' of 3'}
                    </p>
                    <div className='relative w-52 h-1.5 bg-gray-900 rounded overflow-hidden'>
                        <div className={cn(
                            'z-10 w-full absolute transition h-1.5 top-0 left-0 bg-primary-200 rounded',
                            step === 1 ? '-translate-x-2/3' : step === 2 ? '-translate-x-1/3' : 'translate-x-0',
                        )} />
                    </div>
                </div>

                <form
                    className='flex flex-col justify-between w-178 min-h-177.5'
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div>
                        <h3 className='text-gray-600 typo-heading1-semibold mb-9'>
                            {step === 1 ? '프롬프트 정보' : step === 2 ? '변수값 설정' : '이미지 업로드'}
                        </h3>
                        {step === 1 && <PromptInfoStep />}
                        {step === 2 && <VariableStep />}
                        {step === 3 && <ThumbnailStep />}
                    </div>

                    <div>
                        <div className='mb-5 h-5'>
                            {error && <p className="text-red-500">{error}</p>}
                            {successMessage && <p className="text-green-500">{successMessage}</p>}
                        </div>
                        <div className="flex justify-between gap-4">
                            <Button
                                className={cn('w-32.5', step === 1 && 'opacity-0 cursor-default')}
                                type="button"
                                onClick={() => {
                                    if (step === 1) return;
                                    setError(null);
                                    setStep(Math.max(1, step - 1));
                                }}
                                variant="graySolid"
                                disabled={step === 1}
                            >
                                이전
                            </Button>
                            {step < 3 ? (
                                <Button
                                    className='w-32.5'
                                    type="button"
                                    onClick={() => {
                                        if (step >= 3) return;
                                        setError(null);
                                        setStep(step + 1);
                                    }}
                                >
                                    다음
                                </Button>
                            ) : (
                                <Button className='w-32.5' type="submit" disabled={isLoadingOrError}>
                                    {loading ? '등록 중...' : '등록'}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </SalesFormContext.Provider>
    );
}