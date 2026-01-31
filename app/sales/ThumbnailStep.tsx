'use client';

import { useSalesForm } from './SalesFormContext';
import { useCallback, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/styles';
import Input from '@/components/commons/Input';
import { ImageInfo } from './useSalesFormLogic';

export default function ThumbnailStep() {

    const { images, setImages, variables, selectedImageIndex, setSelectedImageIndex } = useSalesForm();
    const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null); // 드래그 중인 이미지의 인덱스를 저장하는 상태
    const fileInputRef = useRef<HTMLInputElement>(null); // 파일 입력(input type="file") 엘리먼트에 대한 참조
    const scrollContainerRef = useRef<HTMLDivElement>(null); // 이미지 스크롤 컨테이너에 대한 참조
    const [showPrev, setShowPrev] = useState(false); // 좌측 스크롤 화살표 표시 여부 상태
    const [showNext, setShowNext] = useState(false); // 우측 스크롤 화살표 표시 여부 상태

    // images 배열이 변경되거나 selectedImageIndex가 변경될 때 실행되는 효과
    useEffect(() => {
        // 이미지가 존재하고 선택된 이미지가 없으면 첫 번째 이미지를 선택
        if (images.length > 0 && selectedImageIndex === null) {
            setSelectedImageIndex(0);
        } // 이미지가 없으면 선택된 이미지 인덱스를 null로 설정
        else if (images.length === 0) {
            setSelectedImageIndex(null);
        }
    }, [images.length, selectedImageIndex, setSelectedImageIndex]);

    // 파일 입력 변경 이벤트를 처리하는 함수
    const handleFileChange = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files); // FileList를 배열로 변환
        // 총 이미지 수가 10개를 초과하면 경고 메시지를 표시하고 종료
        if (images.length + newFiles.length > 10) {
            alert('이미지는 최대 10개까지 업로드할 수 있습니다.');
            return;
        }

        // 새로 추가된 파일들을 ImageInfo[] 형태로 변환
        const newImageInfos: ImageInfo[] = newFiles.map(file => ({
            file,
            // 첫 번째 업로드된 이미지를 대표 이미지로 자동 설정
            isRepresentative: images.length === 0 && newFiles.indexOf(file) === 0,
            isThumbnail1: false, // 룩북 썸네일1 초기값
            isThumbnail2: false, // 룩북 썸네일2 초기값
            optionValues: {}, // 옵션 값 초기화
        }));

        // 기존 이미지 목록에 새 이미지들을 추가
        setImages(prev => [...prev, ...newImageInfos]);
        // 파일 입력 필드를 초기화하여 동일한 파일 재업로드를 가능하게 합니다.
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // 이미지 삭제를 처리하는 함수
    const handleRemoveImage = (indexToRemove: number) => {
        // 해당 인덱스의 이미지를 제외하고 이미지 목록을 업데이트
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
        // 삭제된 이미지가 현재 선택된 이미지인 경우
        if (selectedImageIndex === indexToRemove) {
            // 남은 이미지가 있으면 첫 번째 이미지를 선택하고, 없으면 null로 설정
            setSelectedImageIndex(images.length > 1 ? 0 : null);
        } // 선택된 이미지 인덱스가 삭제된 이미지 인덱스보다 큰 경우 (인덱스 조정)
        else if (selectedImageIndex && selectedImageIndex > indexToRemove) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    // 이미지별 옵션 값 변경을 처리하는 함수
    const handleOptionChange = (variable: string, value: string) => {
        if (selectedImageIndex === null) return;

        setImages(prev => {
            const newImages = [...prev]; // 불변성을 위해 새 배열을 생성
            const imageToUpdate = newImages[selectedImageIndex]; // 선택된 이미지 가져오기
            if (imageToUpdate) {
                // 선택된 이미지의 optionValues를 업데이트
                newImages[selectedImageIndex] = {
                    ...imageToUpdate,
                    optionValues: {
                        ...imageToUpdate.optionValues,
                        [variable]: value,
                    },
                };
            }
            return newImages;
        });
    };

    // 파일 드롭 이벤트를 처리하여 이미지 파일을 추가하는 함수
    const handleInitialDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); // 기본 이벤트 방지
        handleFileChange(e.dataTransfer.files); // 드롭된 파일 처리
    }, []);

    // 드래그 오버 이벤트
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); // 기본 이벤트 방지
    };

    // 특정 역할(대표, 썸네일1, 썸네일2) 영역에 이미지를 드롭했을 때 처리하는 함수
    const handleRoleDrop = (e: React.DragEvent<HTMLDivElement>, role: 'isRepresentative' | 'isThumbnail1' | 'isThumbnail2') => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedImageIndex === null) return;

        setImages(prev => {
            const newImages = prev.map(img => ({ ...img })); // 불변성을 위해 깊은 복사

            // 현재 해당 역할을 가지고 있는 이미지가 있다면 그 역할을 해제
            const currentHolderIndex = newImages.findIndex(img => img[role]);
            if (currentHolderIndex > -1) {
                newImages[currentHolderIndex][role] = false;
            }

            // 드롭된 이미지에 해당 역할을 부여
            newImages[draggedImageIndex][role] = true;

            return newImages;
        });
        setDraggedImageIndex(null); // 드래그 상태 초기화
    };

    // 현재 대표 이미지, 썸네일1, 썸네일2 이미지를 찾아 저장
    const representativeImage = images.find(img => img.isRepresentative);
    const thumbnail1Image = images.find(img => img.isThumbnail1);
    const thumbnail2Image = images.find(img => img.isThumbnail2);

    // 스크롤 화살표 표시 여부를 업데이트하는 함수
    const updateArrowVisibility = useCallback(() => {
        const el = scrollContainerRef.current;
        if (el) {
            const hasOverflow = el.scrollWidth > el.clientWidth; // 내용이 컨테이너보다 큰지 확인
            setShowPrev(el.scrollLeft > 0); // 좌측으로 스크롤 가능한지 확인
            // 우측으로 스크롤 가능한지 확인 (오차 범위 1픽셀 고려)
            setShowNext(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
        }
    }, []);

    // 이미지 목록이나 화살표 가시성 업데이트 함수가 변경될 때 실행되는 효과
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        updateArrowVisibility(); // 초기 가시성 설정

        // 리사이즈 옵저버를 사용하여 컨테이너 크기 변경 감지
        const resizeObserver = new ResizeObserver(updateArrowVisibility);
        resizeObserver.observe(el);
        // 스크롤 이벤트 리스너 추가
        el.addEventListener('scroll', updateArrowVisibility);

        // 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너와 옵저버 해제
        return () => {
            if (el) {
                resizeObserver.unobserve(el);
                el.removeEventListener('scroll', updateArrowVisibility);
            }
        };
    }, [images, updateArrowVisibility]);

    // 스크롤을 처리하는 함수 (좌/우)
    const handleScroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (el) {
            // 스크롤 양 설정 (컨테이너 너비의 80%)
            const scrollAmount = direction === 'left' ? -el.clientWidth * 0.8 : el.clientWidth * 0.8;
            el.scrollBy({ left: scrollAmount, behavior: 'smooth' }); // 부드러운 스크롤 적용
        }
    };

    return (
        <div className="space-y-6">
            <div className='flex gap-4'>
                {/* 메인 미리보기 영역 */}
                <div
                    className="relative min-w-104 h-66 rounded-[10px] overflow-hidden flex items-center justify-center bg-gray-300"
                    onDrop={handleInitialDrop}
                    onDragOver={handleDragOver}
                >
                    {selectedImageIndex !== null ? (
                        // 선택된 이미지가 있을 경우 미리보기 표시
                        <Image
                            src={URL.createObjectURL(images[selectedImageIndex].file)}
                            alt="Main preview"
                            fill className="object-cover"
                            onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                        />
                    ) : (
                        // 선택된 이미지가 없을 경우 이미지 업로드 안내 표시
                        <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer w-full h-full flex justify-center items-center">
                            <div className='flex items-center gap-1.5'>
                                <Image src='/icon/img-upload.svg' alt='Image upload icon' width={20} height={20} />
                                <span className='typo-body2-medium text-gray-600'>이미지 업로드</span>
                            </div>
                        </div>
                    )}
                    {/* 숨겨진 파일 입력 필드 */}
                    <input ref={fileInputRef} id="thumbnail-upload-main" type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
                </div>
                {/* 변수 옵션 입력 영역 */}
                <div className='flex flex-col w-full'>
                    {variables.map((variable) => (
                        <Input
                            key={variable}
                            className='w-full'
                            variant='secondary'
                            label={variable}
                            placeholder='옵션 값을 입력하세요.'
                            // 선택된 이미지의 해당 변수 값을 표시
                            value={(selectedImageIndex !== null && images[selectedImageIndex]?.optionValues[variable]) || ''}
                            onChange={(e) => handleOptionChange(variable, e.target.value)}
                            disabled={selectedImageIndex === null} // 선택된 이미지가 없으면 비활성화
                        />
                    ))}
                </div>
            </div>
            {/* 이미지 미리보기 스크롤 영역 (이미지가 있을 경우에만 표시) */}
            {images.length > 0 &&
                <div className="relative">
                    {/* 좌측 스크롤 화살표 */}
                    {showPrev && (
                        <button onClick={() => handleScroll('left')} className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-gray-50/50 backdrop-blur-sm flex items-center justify-center">
                            <Image className='rotate-90' src='/icon/drop-down.svg' alt='left swife' width={20} height={20} />
                        </button>
                    )}
                    {/* 스크롤 가능한 이미지 목록 */}
                    <div ref={scrollContainerRef} className="bg-gray-300 h-26.5 flex items-center gap-7 overflow-x-auto px-7 py-3 rounded-[10px] scroll-smooth" style={{ scrollbarWidth: 'none' }}>
                        {images.map((image, index) => (
                            <div key={image.file.lastModified}
                                draggable={true}
                                onDragStart={() => setDraggedImageIndex(index)} // 드래그 시작 시 인덱스 저장
                                onDragEnd={() => setDraggedImageIndex(null)} // 드래그 종료 시 인덱스 초기화
                                onClick={() => setSelectedImageIndex(index)} // 클릭 시 이미지 선택
                                className="relative shrink-0 w-31 h-full cursor-pointer"
                            >
                                <div className={cn("relative w-full h-full rounded-sm overflow-hidden border-2", selectedImageIndex === index ? "border-primary-200" : "border-transparent")}>
                                    <Image src={URL.createObjectURL(image.file)} alt={`preview ${index}`} fill className="object-cover bg-gray-50" onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)} />
                                </div>
                                {/* 이미지 삭제 버튼 */}
                                <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }} className="absolute cursor-pointer -top-1 -right-1 bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    ×
                                </button>
                            </div>
                        ))}
                        {/* 이미지 추가 버튼 (10개 미만일 경우에만 표시) */}
                        {images.length < 10 && (
                            <button type="button" onClick={() => fileInputRef.current?.click()} className='cursor-pointer ml-0.75 shrink-0'>
                                <Image src='/icon/img-upload.svg' alt='Image upload icon' width={20} height={20} />
                            </button>
                        )}
                    </div>
                    {/* 우측 스크롤 화살표 */}
                    {showNext && (
                        <button onClick={() => handleScroll('right')} className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-gray-50/50 backdrop-blur-sm flex items-center justify-center">
                            <Image className='-rotate-90' src='/icon/drop-down.svg' alt='left swife' width={20} height={20} />
                        </button>
                    )}
                </div>
            }
            {/* 이미지 역할 지정 영역 (대표 이미지, 룩북 썸네일 1, 룩북 썸네일 2) */}
            <div className='w-full h-19 bg-gray-100 grid grid-cols-3 divide-x divide-gray-450 border border-gray-450 rounded-[10px]'>
                {/* 대표 이미지 지정 영역 */}
                <div className='flex items-center justify-between p-1.5' onDrop={(e) => handleRoleDrop(e, 'isRepresentative')} onDragOver={handleDragOver}>
                    <div>
                        <h4 className='typo-body2-semibold text-primary-200 mb-1'>대표 이미지</h4>
                        <p className='typo-body2-regular text-gray-500'>상세 페이지에 표시될 썸네일</p>
                    </div>
                    <div className='relative aspect-square w-13 bg-gray-300 rounded-md overflow-hidden'>
                        {representativeImage ? (
                            <Image src={URL.createObjectURL(representativeImage.file)} alt="representative" fill className="object-cover" />
                        ) : (
                            <span className='typo-caption-regular text-center text-gray-500 p-1.5'>위에서<br />선택</span>
                        )}
                    </div>
                </div>
                {/* 룩북 썸네일 이미지 1 지정 영역 */}
                <div className='flex items-center justify-between p-1.5' onDrop={(e) => handleRoleDrop(e, 'isThumbnail1')} onDragOver={handleDragOver}>
                    <div>
                        <h4 className='typo-body2-semibold text-primary-200 mb-1'>룩북 썸네일 이미지 1</h4>
                        <p className='typo-body2-regular text-gray-500'>룩북 페이지에 표시될 썸네일</p>
                    </div>
                    <div className='relative aspect-square w-13 bg-gray-300 rounded-md overflow-hidden'>
                        {thumbnail1Image ? (
                            <Image src={URL.createObjectURL(thumbnail1Image.file)} alt="thumbnail1" fill className="object-cover" />
                        ) : (
                            <span className='typo-caption-regular text-center text-gray-500 p-1.5'>위에서<br />선택</span>
                        )}
                    </div>
                </div>
                {/* 룩북 썸네일 이미지 2 지정 영역 */}
                <div className='flex items-center justify-between p-1.5' onDrop={(e) => handleRoleDrop(e, 'isThumbnail2')} onDragOver={handleDragOver}>
                    <div>
                        <h4 className='typo-body2-semibold text-primary-200 mb-1'>룩북 썸네일 이미지 2</h4>
                        <p className='typo-body2-regular text-gray-500'>룩북 페이지에 표시될 썸네일</p>
                    </div>
                    <div className='relative aspect-square w-13 bg-gray-300 rounded-md overflow-hidden'>
                        {thumbnail2Image ? (
                            <Image src={URL.createObjectURL(thumbnail2Image.file)} alt="thumbnail2" fill className="object-cover" />
                        ) : (
                            <span className='typo-caption-regular text-center text-gray-500 p-1.5'>위에서<br />선택</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}