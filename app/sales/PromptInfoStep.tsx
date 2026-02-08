'use client';

import Input from '@/components/commons/Input';
import Select from '@/components/commons/Select';
import TagInput from '@/app/sales/TagInput';
import { useSalesForm } from '../../context/SalesFormContext';

export default function PromptInfoStep() {
  const {
    promptName,
    setPromptName,
    promptDescription,
    setPromptDescription,
    bestModel,
    setBestModel,
    modelItems,
    categoryId,
    setCategoryId,
    categoryItems,
    credit,
    setCredit,
    tags,
    setTags,
  } = useSalesForm();

  return (
    <div className="space-y-4">
      <div>
        <Input
          id="sales-prompt-name"
          label="이미지 프롬프트 이름"
          variant="secondary"
          size="small"
          placeholder="예: 은하수 동물 프롬프트"
          value={promptName}
          onChange={(e) => setPromptName(e.target.value)}
          required
        />
      </div>

      <div>
        <span className="typo-body1-semibold mb-1.5 text-gray-800">프롬프트 설명</span>
        <textarea
          id="sales-prompt-description"
          className="focus-within:border-primary-200 min-h-30 w-full rounded-lg border border-gray-500 bg-gray-100 px-4.75 py-2.5 text-gray-800 outline-none placeholder:text-gray-500 hover:border-gray-800 disabled:bg-gray-300 has-[input:disabled]:hover:border-gray-500"
          placeholder="예: 해당 프롬프트는 별로 만들어진 동물이 밤하늘과 바다 위를 뛰어다니는 이미지를 생성한 프롬프트입니다."
          value={promptDescription}
          onChange={(e) => setPromptDescription(e.target.value)}
          required
        />
        <span className="typo-body2-regular mt-2 text-gray-500">
          프롬프트 특징과 사용 방법을 설명해 주세요.
        </span>
      </div>

      <div className="flex gap-6.5">
        <div className="w-full">
          <span className="typo-body1-semibold mb-1.5 text-gray-800">이미지 생성 모델 선택</span>
          <Select
            value={String(bestModel)}
            onValueChange={(value) => setBestModel(Number(value))}
            items={modelItems.map((item) => ({ ...item, value: String(item.value) }))}
          />
        </div>
        <div className="w-full">
          <span className="typo-body1-semibold mb-1.5 text-gray-800">카테고리 선택</span>
          <Select
            value={String(categoryId)}
            onValueChange={(value) => setCategoryId(Number(value))}
            items={categoryItems.map((item) => ({ ...item, value: String(item.value) }))}
          />
        </div>
        <Input
          id="sales-prompt-credit"
          type="number"
          label="가격"
          size="small"
          placeholder="500"
          value={credit === 0 ? '' : credit}
          onChange={(e) => setCredit(Number(e.target.value))}
          className="w-full"
          variant="secondary"
          sideLabel="C"
          min={500}
          max={1000}
          step={100}
        />
      </div>

      <div>
        <label htmlFor="sales-prompt-tag" className="typo-body1-semibold mb-1.5 text-gray-800">
          태그 추가
        </label>
        <TagInput
          id="sales-prompt-tag"
          tags={tags}
          onTagsChange={setTags}
          placeholder="태그 입력 후 Enter (예: 판타지)"
        />
        <span className="typo-body2-regular mt-2 text-gray-500">
          최소 2~ 최대 5개까지 등록이 가능해요. 태그는 띄어쓰기로 구분하며 최소 2자~ 최대 12자까지
          입력할 수 있어요.
        </span>
      </div>
    </div>
  );
}
