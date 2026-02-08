'use client';

import { Button } from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import Select, { SelectItemType } from '@/components/commons/Select';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PromptVariables } from '@/type/product';
import { generateImage, getPriceEstimate } from '@/lib/api';
import { Tabs } from '@/components/commons/Tabs';
import { VariableTabContent } from './VariableTabContent';
import { useAuth } from '@/context/AuthContext';
import { pollImageUntilCompleted } from '@/lib/polling';

interface props {
  promptId: number;
  aspectRatios: string[];
  resolutions: string[] | null;
  promptVariables: PromptVariables[];
  modelId: number;
  setGeneratedImageUrl: Dispatch<SetStateAction<string>>;
  setImageId: Dispatch<SetStateAction<number>>;
  setIsGenerated: Dispatch<SetStateAction<boolean>>;
}

export default function Settings({
  promptId,
  aspectRatios,
  resolutions,
  promptVariables,
  modelId,
  setGeneratedImageUrl,
  setImageId,
  setIsGenerated,
}: props) {
  const promptVariablesList: PromptVariables[] = promptVariables;
  const [ratio, setRatio] = useState(aspectRatios[0]);
  const [resolution, setResolution] = useState(resolutions ? resolutions[0] : '');
  const [estimate, setEstimate] = useState<number>(0);
  const [tab, setTab] = useState('0');
  const [variableValues, setVariableValues] = useState<Record<string | number, string>>({});
  const { accessToken, isLoading, isLoggedIn, login } = useAuth();
  const ratioItems: SelectItemType[] = [
    {
      type: 'group',
      label: 'Ratio',
      items: aspectRatios.map((ratio) => ({ value: ratio, label: ratio })),
    },
  ];

  const resolutionItems: SelectItemType[] = [
    {
      type: 'group',
      label: 'Resolution',
      items:
        resolutions?.map((resolution: string) => ({ value: resolution, label: resolution })) || [],
    },
  ];

  const handleVariablesChange = (key: number, newValue: string) => {
    setVariableValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const transformData = (obj: Record<number, string>) => {
    return Object.entries(obj).map(([key, value]) => ({
      value: value,
      variable_id: Number(key),
    }));
  };

  const items =
    promptVariablesList.length > 0
      ? promptVariablesList.map((variable) => ({
          value: String(variable.id),
          label: variableValues[variable.id] ? variableValues[variable.id] : variable.keyName,
          content: (
            <VariableTabContent
              tab={tab}
              index={variable.id}
              variableName={variable.keyName}
              variableDescription={variable.description}
              handleVariablesChange={(value: string) => handleVariablesChange(variable.id, value)}
            />
          ),
        }))
      : [];

  useEffect(() => {
    if (!accessToken) return;
    console.log('VVV', promptVariablesList);
    const fetchData = async () => {
      const data = await getPriceEstimate(
        promptId,
        {
          modelId,
          aspectRatio: ratio,
          resolution,
        },
        accessToken,
      );
      setEstimate(data);
    };

    fetchData();
  }, [ratio, resolution]);

  async function handleGenerateImage() {
    if (!accessToken || !promptId) return;

    const variable_values = transformData(variableValues);
    const imageData = await generateImage(
      promptId,
      { resolution, aspect_ratio: ratio, variable_values },
      accessToken,
    );

    if (!imageData || !imageData.image_id) {
      alert('이미지 생성 요청에 실패했습니다. 로그를 확인하세요.');
      return;
    }

    console.log('성공 - 이미지 ID:', imageData.image_id);
    setImageId(imageData.image_id);

    const status = await pollImageUntilCompleted(imageData.image_id, accessToken, {
      intervalMs: 1500,
      timeoutMs: 300_000,
    });
    if (status) {
      console.log(status);
      setGeneratedImageUrl(status.downloadUrl ?? '');
      setIsGenerated(true);
    }
  }

  return (
    <div className="flex w-full flex-col gap-17">
      <div className="flex flex-col gap-5">
        <div className="flex w-full flex-col gap-2">
          <h4 className="typo-body1-semibold">변수입력</h4>
          <div className="flex w-full flex-col gap-6 rounded-[10px] p-5 shadow-[0px_0px_7px_0px_rgba(112,112,112,0.25)]">
            <Tabs items={items} value={tab} onValueChange={setTab} />
          </div>
        </div>
        <div className="inline-flex w-full justify-between">
          <div className="inline-flex gap-3">
            {resolutions && (
              <Select
                value={resolution}
                onValueChange={(value) => setResolution(value)}
                items={resolutionItems}
              />
            )}
            <Select value={ratio} onValueChange={(value) => setRatio(value)} items={ratioItems} />
          </div>
          <span className="inline-flex w-20 items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 outline outline-1 outline-offset-[-1px] outline-gray-500">
            <div className="flex items-center justify-start gap-0.5">
              <p className="flex items-center justify-center gap-2.5">{estimate} C</p>
            </div>
          </span>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button
          variant="solid"
          size="md"
          onClick={() => handleGenerateImage()}
          disabled={promptVariablesList.length != Object.keys(variableValues).length}
        >
          생성하기
        </Button>
      </div>
    </div>
  );
}
