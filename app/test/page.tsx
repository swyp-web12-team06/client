"use client";


import { Button } from "@/components/commons/Button";
import Input from "@/components/commons/Input";

export default function Test() {
  return (
    <main className="w-full h-[80%] mb-20 flex flex-col items-center gap-10">
      <div className="w-[80%] flex flex-col gap-10 mt-20">

        <h1 className="text-4xl font-bold">Color</h1>
        <div className="flex flex-col gap-5">
          <div className="flex gap-5">
            <div className="w-10 h-10 bg-brand-100"></div>
            <div className="w-10 h-10 bg-brand-200"></div>
            <div className="w-10 h-10 bg-brand-300"></div>
            <div className="w-10 h-10 bg-brand-400"></div>
            <div className="w-10 h-10 bg-brand-500"></div>
            <div className="w-10 h-10 bg-brand-600"></div>
            <div className="w-10 h-10 bg-brand-700"></div>
            <div className="w-10 h-10 bg-brand-800"></div>
            <div className="w-10 h-10 bg-brand-900"></div>
          </div>
          <div className="flex gap-5">
            <div className="w-10 h-10 bg-gray-100"></div>
            <div className="w-10 h-10 bg-gray-200"></div>
            <div className="w-10 h-10 bg-gray-300"></div>
            <div className="w-10 h-10 bg-gray-400"></div>
            <div className="w-10 h-10 bg-gray-500"></div>
            <div className="w-10 h-10 bg-gray-600"></div>
            <div className="w-10 h-10 bg-gray-700"></div>
            <div className="w-10 h-10 bg-gray-800"></div>
            <div className="w-10 h-10 bg-gray-900"></div>
          </div>

          <div className="flex gap-5">
            <div className="w-10 h-10 bg-system-red-bg"></div>
            <div className="w-10 h-10 bg-system-red"></div>
            <div className="w-10 h-10 bg-system-red-font"></div>
          </div>
        </div>
      </div>
      <div className="w-[80%] flex flex-col gap-10">
        <h1 className="text-4xl font-bold">Typography</h1>
        <div className="flex flex-col gap-8">
          {/* Display */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Display</span>
            <p className="typo-display1">Display 1 · Bold</p>
            <p className="typo-display4">Display 4 · Bold</p>
            <p className="typo-display4 text-brand-400">Display 4 · Bold · brand</p>
          </section>

          {/* Heading 1 */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Heading 1</span>
            <p className="typo-heading1-bold">Heading 1 · Bold</p>
            <p className="typo-heading1-regular">Heading 1 · Regular</p>
          </section>

          {/* Heading 2 */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Heading 2</span>
            <p className="typo-heading2-bold">Heading 2 · Bold</p>
            <p className="typo-heading2-medium">Heading 2 · Medium</p>
            <p className="typo-heading2-regular">Heading 2 · Regular</p>
          </section>

          {/* Heading 3 */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Heading 3</span>
            <p className="typo-heading3-bold">Heading 3 · Bold</p>
            <p className="typo-heading3-medium">Heading 3 · Medium</p>
            <p className="typo-heading3-regular">Heading 3 · Regular</p>
          </section>

          {/* Body */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Body</span>
            <p className="typo-body1-bold">
              Body 1 · Bold — The quick brown fox jumps over the lazy dog.
            </p>
            <p className="typo-body1-medium">
              Body 1 · Medium — The quick brown fox jumps over the lazy dog.
            </p>
            <p className="typo-body2-bold">
              Body 2 · Bold — The quick brown fox jumps over the lazy dog.
            </p>
            <p className="typo-body2-medium">
              Body 2 · Medium — The quick brown fox jumps over the lazy dog.
            </p>
          </section>

          {/* Caption */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Caption</span>
            <p className="typo-caption-bold">
              Caption · Bold — Metadata / Helper text
            </p>
            <p className="typo-caption-medium">
              Caption · Medium — Metadata / Helper text
            </p>
          </section>
        </div>
        <div className=" flex flex-col gap-8">
          <h1 className="text-4xl font-bold">Button</h1>
          <section className="space-y-4">
            <div className="flex gap-4 items-center">
              {/* default */}
              <Button>default 버튼</Button>
              {/* variant, size */}
              <Button variant="primary" size="sm">Primary sm 버튼</Button>
              <Button variant="primary" size="md">Primary 버튼</Button>
              <Button variant="tertiary" size="sm">Tertiary sm 버튼</Button>
              <Button variant="tertiary" size="md">Tertiary 버튼</Button>
              {/* className custom */}
              <Button className="text-blue-400 border border-blue-400">커스텀 버튼</Button>
              {/* onclick test */}
              <Button
                onClick={() => {
                  console.log("Button clicked!");
                  alert("버튼 클릭됨!");
                }}
              >
                onClick 테스트
              </Button>
            </div>
          </section>
        </div>
      </div>
      <div className="w-[80%] flex flex-col gap-10">
        <h1 className="text-4xl font-bold">Input</h1>
        <section className="flex flex-col gap-2">
          <Input/>
          <Input className="bg-red-500" radius="sm" border="secondary"/>
          <Input className="bg-blue-500 text-green-500" radius="md" border="primary"/>
          <Input isSearching/>
          <Input isSearching placeholder="Search..." />
        </section>
      </div>
    </main>
  );
}
