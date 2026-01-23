'use client';

import { Button } from '@/components/commons/Button';
import PlusIcon from '@/public/icon/plus.svg';
import Input from '@/components/commons/Input';

export default function Test() {
  return (
    <main className="mb-20 flex h-[80%] w-full flex-col items-center gap-10">
      <div className="mt-20 flex w-[80%] flex-col gap-10">
        <h1 className="text-4xl font-semibold">Color</h1>
        <div className="flex flex-col gap-5">
          <div className="flex gap-5">
            <div className="bg-primary-50 h-10 w-10"></div>
            <div className="bg-primary-100 h-10 w-10"></div>
            <div className="bg-primary-200 h-10 w-10"></div>
            <div className="bg-primary-300 h-10 w-10"></div>
            <div className="bg-primary-400 h-10 w-10"></div>
          </div>
          <div className="flex gap-5">
            <div className="h-10 w-10 bg-gray-50"></div>
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
            <div className="h-10 w-10 bg-red-50"></div>
            <div className="h-10 w-10 bg-red-100"></div>
          </div>
          <div className="flex gap-5">
            <div className="h-10 w-10 bg-blue-50"></div>
            <div className="h-10 w-10 bg-blue-100"></div>
          </div>
        </div>
      </div>
      <div className="flex w-[80%] flex-col gap-10">
        <h1 className="text-4xl font-semibold">Typography</h1>
        <div className="flex flex-col gap-8">
          {/* Display */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Display</span>
            <p className="typo-display1">Display 1</p>
            <p className="typo-display2">Display 2</p>
            <p className="typo-display2 text-primary-200">Display 2· primary-200</p>
          </section>

          {/* Heading 1 */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Heading 1</span>
            <p className="typo-heading1-semibold">Heading 1 · semibold</p>
            <p className="typo-heading1-regular">Heading 1 · Regular</p>
          </section>

          {/* Heading 2 */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Heading 2</span>
            <p className="typo-heading2-semibold">Heading 2 · semibold</p>
            <p className="typo-heading2-medium">Heading 2 · Medium</p>
            <p className="typo-heading2-regular">Heading 2 · Regular</p>
          </section>

          {/* Heading 3 */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Heading 3</span>
            <p className="typo-heading3-semibold">Heading 3 · semibold</p>
            <p className="typo-heading3-medium">Heading 3 · Medium</p>
            <p className="typo-heading3-regular">Heading 3 · Regular</p>
          </section>

          {/* Body */}
          <section className="flex flex-col gap-2">
            <span className="typo-caption-medium text-gray-500">Body1</span>
            <p className="typo-body1-semibold">
              Body 1 · semibold — The quick brown fox jumps over the lazy dog.
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
            <p className="typo-body2-semibold">
              Body 2 · semibold — The quick brown fox jumps over the lazy dog.
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
            <p className="typo-caption-medium">Caption · medium — Metadata / Helper text</p>
            <p className="typo-caption-regular">Caption · Regular — Metadata / Helper text</p>
          </section>
        </div>
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-semibold">Button</h1>
          <section className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <section className="flex flex-col gap-2">
                {/* default */}
                <Button>default 버튼</Button>
                {/* variant, size */}
                <Button variant="solid" size="sm">
                  solid sm 버튼
                </Button>
              </section>
              <section className="flex flex-col gap-2">
                <Button variant="gradientSolid" size="xl">
                  gradientSolid xl 버튼
                </Button>
                <Button variant="gradientSolid" size="lg" suffixIcon={<PlusIcon />}>
                  gradientSolid lg 버튼
                </Button>
                <Button variant="gradientSolid" size="md">
                  gradientSolid 버튼
                </Button>
                <Button variant="gradientSolid" size="sm">
                  gradientSolid sm 버튼
                </Button>
              </section>
              <section className="flex flex-col gap-2">
                <Button variant="graySolid" size="md">
                  graySolid 버튼
                </Button>
                <Button variant="graySolid" size="sm">
                  graySolid sm 버튼
                </Button>
              </section>
              <section className="flex flex-col gap-2">
                <Button variant="outline" size="md">
                  outline 버튼
                </Button>
                <Button variant="outline" size="sm">
                  outline sm 버튼
                </Button>
              </section>
              <section className="flex flex-col gap-2">
                <Button variant="lightOutline" size="md">
                  lightOutline 버튼
                </Button>
                <Button variant="lightOutline" size="sm" suffixIcon={<PlusIcon />}>
                  lightOutline sm 버튼
                </Button>
              </section>
              <section className="flex flex-col gap-2">
                {/* className custom */}
                <Button className="border border-blue-400 bg-blue-50 text-blue-400">
                  커스텀 버튼
                </Button>
                <Button disabled>solid disabled 버튼</Button>
                <Button variant="outline" size="md" disabled>
                  outline disabled 버튼
                </Button>
                {/* Icon Button */}
                <Button variant="outline" size="sm" prefixIcon={<PlusIcon />}>
                  outline sm prefix icon 버튼
                </Button>
                <Button variant="outline" size="md" suffixIcon={<PlusIcon />}>
                  outline md suffix icon 버튼
                </Button>
                <Button variant="outline" size="lg" suffixIcon={<PlusIcon />}>
                  outline lg suffix icon 버튼
                </Button>
                <Button variant="outline" size="xl" suffixIcon={<PlusIcon />}>
                  outline xl suffix icon 버튼
                </Button>
                {/* onclick test */}
                <Button
                  onClick={() => {
                    console.log('Button clicked!');
                    alert('버튼 클릭됨!');
                  }}
                >
                  onClick 테스트
                </Button>
              </section>
            </div>
          </section>
        </div>
      </div>
      <div className="flex w-[80%] flex-col gap-10">
        <h1 className="text-4xl font-semibold">Input</h1>
        <section className="flex flex-col gap-2">
          <Input />
          <Input border="secondary" />
          <Input isSearching />
          <Input isSearching placeholder="Search..." />
        </section>
      </div>
    </main>
  );
}
