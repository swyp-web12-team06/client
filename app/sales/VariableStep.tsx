'use client';

import { Button } from '@/components/commons/Button';
import { useSalesForm } from '../../context/SalesFormContext';
import { Tab } from '@/components/commons/Tabs/Tab';

export default function VariableStep() {
  const {
    displayRef,
    prompt,
    formatPrompt,
    handlePromptChange,
    handleSelectionChange,
    setSelection,
    selection,
    handleAddVariableFromSelection,
    activeVariable,
    variables,
    setActiveVariable,
    getVariableName,
    variableInfo,
    setVariableInfo,
  } = useSalesForm();

  return (
    <div>
      <div>
        <label htmlFor="sales-prompt" className="typo-body1-semibold mb-1.5 text-gray-800">
          프롬프트
        </label>
        <div className="relative h-35 w-full">
          <div
            ref={displayRef}
            className="pointer-events-none absolute top-0 left-0 h-full w-full resize-none overflow-y-auto rounded-lg border border-transparent p-4 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: formatPrompt(prompt) }}
          />
          <textarea
            id="sales-prompt"
            className="absolute top-0 left-0 h-full w-full resize-none overflow-y-auto rounded-lg border border-gray-500 bg-transparent p-4 whitespace-pre-wrap text-transparent caret-gray-800 focus:outline-none"
            value={prompt}
            onChange={handlePromptChange}
            onSelect={handleSelectionChange}
            onBlur={() => setSelection(null)}
            onScroll={(e) => {
              if (displayRef.current) {
                displayRef.current.scrollTop = e.currentTarget.scrollTop;
                displayRef.current.scrollLeft = e.currentTarget.scrollLeft;
              }
            }}
            spellCheck="false"
          />
          {prompt.length === 0 && (
            <div className="pointer-events-none absolute top-5 left-5 text-gray-600">
              프롬프트를 입력해주세요.
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-between">
          <span className="typo-body2-regular text-gray-500">
            텍스트를 드래그하여 변수를 지정하세요. (최대 5개)
          </span>
          <Button
            type="button"
            className="h-9 min-w-37.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400"
            onClick={handleAddVariableFromSelection}
            onMouseDown={(e) => e.preventDefault()}
            disabled={!selection}
          >
            변수 추가
          </Button>
        </div>
      </div>
      {activeVariable && (
        <div className="mt-5">
          <div className="rounded-[10px] bg-gray-100 px-5 py-5.5 shadow-[0px_0px_7px_0px_#70707040]">
            <div className="grid grid-cols-5 gap-[11.39px]">
              {variables.map((variable) => (
                <Tab
                  key={variable}
                  variant={activeVariable === variable ? 'active' : 'default'}
                  type="button"
                  onClick={() => setActiveVariable(variable)}
                >
                  <span className="truncate">{variable}</span>
                </Tab>
              ))}
            </div>

            <div className="mt-4">
              <p className="typo-body1-semibold mb-1.5 text-gray-800">{getVariableName()}</p>
              <span className="typo-body1-regular mb-1.5 text-gray-800">{activeVariable}</span>
            </div>

            <div className="mt-3">
              <span className="typo-body1-semibold mb-1.5 text-gray-800">DESCRIPTION</span>
              <textarea
                className="h-14 w-full resize-none rounded-lg border border-gray-500 bg-gray-300 px-2.5 py-2 outline-none"
                placeholder={`변수 [${activeVariable}]에 대한 설명을 입력해주세요.`}
                value={variableInfo[activeVariable] || ''}
                onChange={(e) => {
                  setVariableInfo((prev) => ({
                    ...prev,
                    [activeVariable]: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
