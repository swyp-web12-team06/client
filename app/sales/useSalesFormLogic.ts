'use client';

import { useState, useRef, useEffect, useCallback, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// 각 이미지의 변수별 값 (예: { species: 'cat', clothing: 'armor' })
export interface ImageOptionValues {
  [key: string]: string;
}

// 업로드된 각 이미지의 전체 정보를 담는 인터페이스
export interface ImageInfo {
  file: File; // 실제 파일 객체
  isRepresentative: boolean; // 대표 이미지 여부
  isThumbnail1: boolean; // 룩북 썸네일1 여부
  isThumbnail2: boolean; // 룩북 썸네일2 여부
  optionValues: ImageOptionValues; // 해당 이미지에만 적용되는 변수 값
}

// SalesForm 컨텍스트의 전체 데이터 형태를 정의하는 인터페이스
// 이 훅이 반환하는 모든 상태와 함수들을 포함
export interface SalesFormContextType {
  step: number;
  setStep: (value: number) => void;
  promptName: string;
  setPromptName: (value: string) => void;
  promptDescription: string;
  setPromptDescription: (value: string) => void;
  bestModel: number;
  setBestModel: (value: number) => void;
  categoryId: number;
  setCategoryId: (value: number) => void;
  credit: number;
  setCredit: (value: number) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  images: ImageInfo[];
  setImages: React.Dispatch<React.SetStateAction<ImageInfo[]>>;
  selectedImageIndex: number | null;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  prompt: string;
  handlePromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  variables: string[];
  activeVariable: string | null;
  setActiveVariable: (variable: string | null) => void;
  variableInfo: Record<string, string>;
  setVariableInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selection: { start: number; end: number } | null;
  setSelection: React.Dispatch<React.SetStateAction<{ start: number; end: number } | null>>;
  displayRef: React.RefObject<HTMLDivElement | null>;
  formatPrompt: (text: string) => string;
  handleSelectionChange: (event: React.SyntheticEvent<HTMLTextAreaElement>) => void;
  handleAddVariableFromSelection: () => void;
  getVariableName: () => string | null;
  modelItems: { value: number; label: string }[];
  categoryItems: { value: number; label: string }[];
  error: string | null;
  setError: (value: SetStateAction<string | null>) => void;
  loading: boolean;
  successMessage: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  errorStep: number | null;
  setErrorStep: React.Dispatch<React.SetStateAction<number | null>>;
}

/**
 * 상품 등록 폼의 모든 상태와 로직을 관리하는 커스텀 훅.
 * @param props - UI의 현재 스텝(단계) 정보를 담은 객체.
 * @returns SalesFormContext에 제공될 상태와 함수들.
 */
export function useSalesFormLogic(): SalesFormContextType {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth(); // 로그인 정보 (액세스 토큰) 가져오기

  // --- 상태(State) 선언부 ---
  const [step, setStep] = useState<number>(1);
  const [promptName, setPromptName] = useState(''); // 프롬프트 이름
  const [promptDescription, setPromptDescription] = useState(''); // 프롬프트 설명
  const [modelItems, setModelItems] = useState<{ value: number; label: string }[]>([]); // 생성 모델 목록
  const [categoryItems, setCategoryItems] = useState<{ value: number; label: string }[]>([]); // 카테고리 목록
  const [bestModel, setBestModel] = useState(0); // 생성 모델
  const [categoryId, setCategoryId] = useState(0); // 카테고리 ID
  const [credit, setCredit] = useState(500); // 가격
  const [tags, setTags] = useState<string[]>([]); // 태그 목록
  const [images, setImages] = useState<ImageInfo[]>([]); // 업로드된 이미지 정보 목록
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null); // 사용자가 선택한 이미지의 인덱스 (옵션 값 편집용)
  const [prompt, setPrompt] = useState(''); // 사용자가 입력하는 마스터 프롬프트 텍스트
  const [variables, setVariables] = useState<string[]>([]); // 마스터 프롬프트에서 추출된 변수 목록 (예: ['species', 'clothing'])
  const [activeVariable, setActiveVariable] = useState<string | null>(null); // 현재 활성화/선택된 변수
  const [variableInfo, setVariableInfo] = useState<Record<string, string>>({}); // 각 변수에 대한 설명
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null); // 텍스트 드래그 선택 영역 정보
  const [error, setError] = useState<string | null>(null); // 서버 에러 메시지
  const [loading, setLoading] = useState(false); // 로딩 상태 (API 요청 등)
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // 성공 메시지
  const [errorStep, setErrorStep] = useState<number | null>(null); // 에러 스텝 구간 파악 상태

  const displayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 카테고리 및 AI모델 불러오기
    const fetchModelsAndCategories = async () => {
      setLoading(true);
      try {
        const modelsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/metadata/ai-models`,
        );
        if (!modelsResponse.ok) {
          throw new Error('AI 모델 목록을 불러오는데 실패했습니다.');
        }
        const modelsData = await modelsResponse.json();
        if (modelsData.code === 'SUCCESS') {
          const fetchedModels = modelsData.data.map((model: { id: number; name: string }) => ({
            value: model.id,
            label: model.name,
          }));
          setModelItems(fetchedModels);
          if (fetchedModels.length > 0) {
            setBestModel(fetchedModels[0].value);
          }
        } else {
          throw new Error(modelsData.message || 'AI 모델 목록을 불러오는데 실패했습니다.');
        }

        const categoriesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/metadata/categories`,
        );
        if (!categoriesResponse.ok) {
          throw new Error('카테고리 목록을 불러오는데 실패했습니다.');
        }
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.code === 'SUCCESS') {
          const fetchedCategories = categoriesData.data.map(
            (category: { id: number; name: string }) => ({
              value: category.id,
              label: category.name,
            }),
          );
          setCategoryItems(fetchedCategories);
          if (fetchedCategories.length > 0) {
            setCategoryId(fetchedCategories[0].value);
          }
        } else {
          throw new Error(categoriesData.message || '카테고리 목록을 불러오는데 실패했습니다.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModelsAndCategories();
  }, []);

  // 프롬프트 텍스트에서 추출된 variables 상태가 변경될 때마다 실행되는 부수 효과
  useEffect(() => {
    const newVariableInfo = { ...variableInfo };
    let infoChanged = false;
    // 만약 프롬프트에서 변수가 삭제되었다면, variableInfo에서도 해당 변수 정보를 삭제
    Object.keys(variableInfo).forEach((key) => {
      if (!variables.includes(key)) {
        delete newVariableInfo[key];
        infoChanged = true;
      }
    });
    if (infoChanged) setVariableInfo(newVariableInfo);

    // 현재 활성화된 변수가 더 이상 변수 목록에 없으면, 목록의 첫 번째 변수를 활성화
    if (variables.length > 0 && !variables.includes(activeVariable || '')) {
      setActiveVariable(variables[0]);
    } else if (variables.length === 0) {
      setActiveVariable(null);
    }
  }, [variables, activeVariable, variableInfo]);

  /**
   * 마스터 프롬프트 텍스트가 변경될 때 호출되는 함수.
   * 텍스트에서 대괄호([, ])로 둘러싸인 부분을 찾아 변수 목록(variables) 상태를 업데이트.
   */
  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPrompt(text);
    const matches = text.match(/\[([^\]]*)\]/g);
    if (matches) {
      const extractedVariables = matches.map((match) => match.substring(1, match.length - 1));
      // 중복을 제거하여 변수 목록 업데이트
      setVariables([...new Set(extractedVariables.filter((v) => v))]);
    } else {
      setVariables([]);
    }
  }, []);

  // 프롬프트 내의 변수 부분을 특정 색상으로 강조하여 HTML로 변환하는 함수
  const formatPrompt = (text: string) => {
    const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const highlightedText = escapedText.replace(
      /\[([^\]]*)\]/g,
      '<span class="text-primary-200">[$1]</span>',
    );
    return highlightedText.replace(/\n/g, '<br>');
  };

  // 텍스트 영역에서 사용자가 텍스트를 드래그하여 선택했을 때, 그 시작과 끝 위치를 저장하는 함수
  const handleSelectionChange = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const { selectionStart, selectionEnd } = event.currentTarget;
    if (selectionStart !== selectionEnd) {
      setSelection({ start: selectionStart, end: selectionEnd });
    } else {
      setSelection(null);
    }
  };

  // 사용자가 선택한 텍스트를 변수로 만드는 함수 (대괄호로 감싸기)
  const handleAddVariableFromSelection = () => {
    if (selection && prompt) {
      const { start, end } = selection;
      const selectedText = prompt.substring(start, end);
      // 이미 변수인 경우는 무시
      if (selectedText.startsWith('[') && selectedText.endsWith(']')) {
        setSelection(null);
        return;
      }
      const newValue = prompt.substring(0, start) + `[${selectedText}]` + prompt.substring(end);
      // handlePromptChange를 호출하여 변수 목록을 다시 파싱하도록 함
      handlePromptChange({ target: { value: newValue } } as React.ChangeEvent<HTMLTextAreaElement>);
      setSelection(null);
    }
  };

  // 현재 활성화된 변수의 이름을 "변수 1", "변수 2" 등으로 반환하는 함수
  const getVariableName = () => {
    if (activeVariable === null) return null;
    const index = variables.indexOf(activeVariable);
    return index === -1 ? null : '변수 ' + (index + 1);
  };

  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
    setErrorStep(null); // Reset error step when re-evaluating

    if (isAuthLoading) {
      // 인증이 로드되는 동안 여기서는 아무것도 안함
      // AuthContext 자체의 isLoading 상태가 전체 앱 로딩을 처리
      return;
    }

    if (!accessToken) {
      alert('로그인이 필요합니다.');
      router.push('/');
      return;
    }

    if (step === 1) {
      if (!promptName || !promptDescription) {
        setError('프롬프트의 이름과 설명은 필수 입력 필드입니다.');
        setErrorStep(1);
      } else if (promptDescription.length < 20) {
        setError('프롬프트 설명은 20자 이상이어야 합니다.');
        setErrorStep(1);
      } else if (credit % 100 !== 0) {
        setError('가격은 100원 단위로 설정해야 합니다.');
        setErrorStep(1);
      } else if (tags.length < 2 || tags.length > 5) {
        setError('태그는 최소 2개, 최대 5개까지 등록해야 합니다.');
        setErrorStep(1);
      } else if (tags.some((tag) => tag.length < 2 || tag.length > 12)) {
        setError('각 태그는 2~12자 이내여야 합니다.');
        setErrorStep(1);
      } else {
        const tagRegex = /^[가-힣a-zA-Z0-9 ]+$/;
        if (tags.some((tag) => !tagRegex.test(tag))) {
          setError('태그는 한글, 영문, 숫자, 공백만 사용 가능합니다.');
          setErrorStep(1);
        }
      }
    } else if (step === 2) {
      if (prompt.length < 20) {
        setError('프롬프트는 최소 20자 이상으로 입력해야 합니다.');
        setErrorStep(2);
      } else if (variables.length < 1) {
        setError('변수를 최소 1개 이상 지정해야 합니다.');
        setErrorStep(2);
      }
    } else if (step === 3) {
      if (images.length < 1) {
        setError('최소 1개의 이미지를 등록해야 합니다.');
        setErrorStep(3);
      } else {
        for (const image of images) {
          for (const variable of variables) {
            if (!image.optionValues?.[variable]) {
              setError(
                `'${image.file.name.slice(0, 10)}' 이미지의 '${variable}' 변수 값을 입력해주세요.`,
              );
              setErrorStep(3);
            }
          }
        }
      }
    }
  }, [
    step,
    accessToken,
    isAuthLoading,
    prompt,
    promptName,
    promptDescription,
    variables,
    credit,
    tags,
    images,
    router,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      // --- 이미지 업로드 프로세스 (2단계) ---
      const uploadedImageDetails = await Promise.all(
        images.map(async (imageInfo) => {
          // 이미지 파일 크기 5MB 제한
          const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
          if (imageInfo.file.size > MAX_FILE_SIZE) {
            alert('이미지 파일 크기는 5MB 이하여야 합니다.');
            throw new Error(`이미지 파일 크기가 5MB를 초과합니다: ${imageInfo.file.name}`);
          }
          // 1단계: 서버에 Presigned URL 요청
          const presignedUrlResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE}/image/presigned-upload?fileName=${encodeURIComponent(imageInfo.file.name)}&contentType=${encodeURIComponent(imageInfo.file.type)}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );

          if (!presignedUrlResponse.ok) {
            throw new Error(`Presigned URL 요청 실패: ${imageInfo.file.name}`);
          }
          const presignedData = await presignedUrlResponse.json();
          const { presignedUrl, savedFileName, publicUrl } = presignedData.data;

          // 2단계: Presigned URL로 PUT 업로드
          const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': imageInfo.file.type },
            body: imageInfo.file,
          });

          if (!uploadResponse.ok) {
            throw new Error(`이미지 업로드 실패: ${imageInfo.file.name}`);
          }

          // 업로드 성공 후, 필요한 정보 반환
          return {
            imageUrl: savedFileName,
            isRepresentative: imageInfo.isRepresentative ?? false,
            isThumbnail1: imageInfo.isThumbnail1 ?? false,
            isThumbnail2: imageInfo.isThumbnail2 ?? false,
            optionValues: imageInfo.optionValues ?? {},
          };
        }),
      );

      // --- API 명세에 맞게 전송할 데이터(payload) 조립 ---
      const payload = {
        title: promptName,
        description: promptDescription,
        categoryId: categoryId,
        price: credit,
        modelId: bestModel,
        masterPrompt: prompt,
        tags: tags,
        promptVariables: variables.map((key, index) => ({
          keyName: key,
          description: variableInfo[key],
          orderIndex: index + 1,
        })),
        images: uploadedImageDetails.map((detail) => ({
          imageUrl: detail.imageUrl,
          isRepresentative: detail.isRepresentative || detail.isThumbnail1 || detail.isThumbnail2,
          isPreview: detail.isRepresentative,
          optionValues: detail.optionValues,
        })),
      };

      // 서버에 최종 데이터 제출 (POST 요청)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '상품 등록에 실패했습니다.');
      }

      if (response.ok) {
        alert('상품이 성공적으로 등록되었습니다!');
        router.push('/'); // 성공 시 홈으로 이동
      }
    } catch (err: any) {
      setError(err.message || '상품 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
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
    images,
    setImages,
    selectedImageIndex,
    setSelectedImageIndex,
    prompt,
    handlePromptChange,
    variables,
    activeVariable,
    setActiveVariable,
    variableInfo,
    setVariableInfo,
    selection,
    setSelection,
    displayRef,
    formatPrompt,
    handleSelectionChange,
    handleAddVariableFromSelection,
    getVariableName,
    error,
    loading,
    successMessage,
    setError,
    handleSubmit,
    errorStep,
    setErrorStep,
  };
}
