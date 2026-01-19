'use client';

import { Button } from '@/components/commons/Button';
import Input from '@/components/Input';

export default function Test() {
  return (
    <main className="flex h-[80%] w-full flex-col items-center gap-10">
      <div className="mt-20 flex w-[80%] flex-col gap-10">
        <h1 className="text-4xl font-bold">Color</h1>
        <div className="flex flex-col gap-5">
          <div className="flex gap-5">
            <div className="bg-brand-100 h-10 w-10"></div>
            <div className="bg-brand-200 h-10 w-10"></div>
            <div className="bg-brand-300 h-10 w-10"></div>
            <div className="bg-brand-400 h-10 w-10"></div>
            <div className="bg-brand-500 h-10 w-10"></div>
            <div className="bg-brand-600 h-10 w-10"></div>
            <div className="bg-brand-700 h-10 w-10"></div>
            <div className="bg-brand-800 h-10 w-10"></div>
            <div className="bg-brand-900 h-10 w-10"></div>
          </div>
          <div className="flex gap-5">
            <div className="h-10 w-10 bg-gray-100"></div>
            <div className="h-10 w-10 bg-gray-200"></div>
            <div className="h-10 w-10 bg-gray-300"></div>
            <div className="h-10 w-10 bg-gray-400"></div>
            <div className="h-10 w-10 bg-gray-500"></div>
            <div className="h-10 w-10 bg-gray-600"></div>
            <div className="h-10 w-10 bg-gray-700"></div>
            <div className="h-10 w-10 bg-gray-800"></div>
            <div className="h-10 w-10 bg-gray-900"></div>
          </div>

          <div className="flex gap-5">
            <div className="bg-system-red-bg h-10 w-10"></div>
            <div className="bg-system-red h-10 w-10"></div>
            <div className="bg-system-red-font h-10 w-10"></div>
          </div>
        </div>
      </div>
      <div className="flex w-[80%] flex-col gap-10">
        <h1 className="text-4xl font-bold">Typography</h1>
        <div className="flex flex-col gap-8">
          {/* Display */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Display</span>
            <p className="typo-display1">Display 1</p>
            <p className="typo-display2">Display 2</p>
            <p className="typo-display2 text-brand-400">Display 2· brand</p>
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
            <span className="typo-caption-medium text-gray-500">Body1</span>
            <p className="typo-body1-bold">
              Body 1 · Bold — The quick brown fox jumps over the lazy dog.
            </p>
            <p className="typo-body1-medium">
              Body 1 · Medium — The quick brown fox jumps over the lazy dog.
            </p>
            <p className="typo-body1-regular">
              Body 1 · Regular — The quick brown fox jumps over the lazy dog.
            </p>{' '}
          </section>
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Body2</span>
            <p className="typo-body2-bold">
              Body 2 · Bold — The quick brown fox jumps over the lazy dog.
            </p>
            <p className="typo-body2-medium">
              Body 2 · Medium — The quick brown fox jumps over the lazy dog.
            </p>
            <p className="typo-body2-regular">
              Body 2 · Regular — The quick brown fox jumps over the lazy dog.
            </p>
          </section>

          {/* Caption */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Caption</span>
            <p className="typo-caption-bold">Caption · Bold — Metadata / Helper text</p>
            <p className="typo-caption-regular">Caption · Regular — Metadata / Helper text</p>
          </section>
        </div>
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-bold">Button</h1>
          <section className="space-y-4">
            <div className="flex items-center gap-4">
              {/* default */}
              <Button>default 버튼</Button>
              {/* variant, size */}
              <Button variant="primary" size="sm">
                Primary sm 버튼
              </Button>
              <Button variant="primary" size="md">
                Primary 버튼
              </Button>
              <Button variant="tertiary" size="sm">
                Tertiary sm 버튼
              </Button>
              <Button variant="tertiary" size="md">
                Tertiary 버튼
              </Button>
              {/* className custom */}
              <Button className="border border-blue-400 text-blue-400">커스텀 버튼</Button>
              {/* onclick test */}
              <Button
                onClick={() => {
                  console.log('Button clicked!');
                  alert('버튼 클릭됨!');
                }}
              >
                onClick 테스트
              </Button>
            </div>
          </section>
        </div>
      </div>
      <div className="flex w-[80%] flex-col gap-10">
        <h1 className="text-4xl font-bold">Input</h1>
        <section className="flex flex-col gap-2">
          <Input />
          <Input isSearching />
          <Input isSearching placeholder="Search..." />
        </section>
      </div>
    </main>
  );
}
