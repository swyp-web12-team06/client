'use client';

import { Button } from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import Select, { SelectItemType } from '@/components/commons/Select';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import RemoveIcon from '@/public/icon/remove.svg';
import CreditIcon from '@/public/icon/credit.svg';
import { PromptVariables } from '@/type/product';
import { getPriceEstimate } from '@/lib/api';
import { Tabs } from '@/components/commons/Tabs';
import { VariableTabContent } from './VariableTabContent';

interface props {
  promptId: string;
  aspectRatios: string[];
  resolutions: string[] | null;
  promptVariables: PromptVariables[];
  modelId: number;
}

export default function Settings({
  promptId,
  aspectRatios,
  resolutions,
  promptVariables,
  modelId,
}: props) {
  const promptVariablesList: PromptVariables[] = promptVariables;
  const [ratio, setRatio] = useState(aspectRatios[0]);
  const [resolution, setResolution] = useState(resolutions ? resolutions[0] : '');
  const [estimate, setEstimate] = useState<number>(0);
  const [tab, setTab] = useState('0');
  const [variableValues, setVariableValues] = useState<Record<string | number, string>>({});

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

  const items =
    promptVariablesList.length > 0
      ? promptVariablesList.map((variable) => ({
          value: String(variable.orderIndex),
          label: variableValues[variable.orderIndex]
            ? variableValues[variable.orderIndex]
            : variable.keyName,
          content: (
            <VariableTabContent
              index={variable.orderIndex}
              variableName={variable.keyName}
              variableDescription={variable.description}
              handleVariablesChange={(value: string) =>
                handleVariablesChange(variable.orderIndex, value)
              }
            />
          ),
        }))
      : [];

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const data = await getPriceEstimate(promptId, {
          modelId,
          aspectRatio: ratio,
          resolution,
        });
        console.log(data);
        if (!cancelled) setEstimate(data);
      } catch (e: any) {
        if (!cancelled) alert(e?.message ?? '에러');
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [ratio, resolution]);

  return (
    <div className="flex w-full flex-col gap-17">
      <div className="flex flex-col gap-5">
        <div className="flex w-full flex-col gap-2">
          <h4 className="typo-body1-semibold">변수입력</h4>
          <div className="flex w-full flex-col gap-6 rounded-[10px] p-5 shadow-[0px_0px_7px_0px_rgba(112,112,112,0.25)]">
            <div className="rounded-[10px] p-5 shadow-[0px_0px_7px_0px_rgba(112,112,112,0.25)]">
              <Tabs items={items} value={tab} onValueChange={setTab} />
            </div>
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
          <span className="inline-flex items-center justify-start gap-1.5 rounded-full px-2.5 py-1.5 outline outline-1 outline-offset-[-1px] outline-gray-500">
            <div className="flex items-center justify-start gap-0.5">
              <p className="flex items-center justify-center gap-2.5">{estimate} C</p>
            </div>
          </span>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button variant="solid" size="md">
          생성하기
        </Button>
      </div>
    </div>
  );
}
