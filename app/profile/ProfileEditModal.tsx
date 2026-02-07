'use client';

import React, { useState, useEffect, useRef } from 'react';
import Modal from '@/components/Modal';
import { Button } from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import { useAuth } from '@/context/AuthContext';
import { httpClient } from '@/lib/api';
import Image from 'next/image';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string | undefined;
  currentBio: string | undefined;
  currentProfileImageUrl: string | undefined;
  onProfileUpdate: () => void;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  currentNickname,
  currentBio,
  currentProfileImageUrl,
  onProfileUpdate,
}: ProfileEditModalProps) {
  const { accessToken, user, reissueToken } = useAuth();
  const [nickname, setNickname] = useState(currentNickname || '');
  const [bio, setBio] = useState(currentBio || '');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState<string | null>(
    currentProfileImageUrl || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNickname(currentNickname || '');
    setBio(currentBio || '');
    setProfileImagePreviewUrl(currentProfileImageUrl || null);
    setProfileImageFile(null);
  }, [currentNickname, currentBio, currentProfileImageUrl, isOpen]); // Reset on modal open

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageDelete = () => {
    setProfileImageFile(null);
    setProfileImagePreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!accessToken) {
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.');
      setIsLoading(false);
      return;
    }

    let profileImageKey: string | undefined | null = undefined;

    try {
      if (profileImageFile) {
        const fileName = encodeURIComponent(profileImageFile.name);
        const contentType = encodeURIComponent(profileImageFile.type);

        const presignedResponse: { data: { presignedUrl: string; savedFileName: string } } =
          await httpClient.get(
            `/image/presigned-upload?fileName=${fileName}&contentType=${contentType}`,
            accessToken,
          );

        const { presignedUrl, savedFileName } = presignedResponse.data;

        // PUT 요청을 사용하여 파일을 미리 지정된 URL에 업로드
        await fetch(presignedUrl, {
          method: 'PUT',
          body: profileImageFile,
          headers: {
            'Content-Type': profileImageFile.type,
          },
        });
        profileImageKey = savedFileName;
      } else if (profileImagePreviewUrl === null && currentProfileImageUrl !== null) {
        profileImageKey = '';
      }

      const payload: {
        nickname?: string;
        bio?: string;
        profileImageKey?: string | null;
      } = {};

      if (nickname !== currentNickname) {
        payload.nickname = nickname;
      }
      if (bio !== currentBio) {
        payload.bio = bio;
      }
      if (profileImageKey !== undefined) {
        payload.profileImageKey = profileImageKey;
      }

      // 변경사항이 있을 경우에만 보내기
      if (Object.keys(payload).length === 0) {
        onClose();
        setIsLoading(false);
        return;
      }

      await httpClient.patch('/user/me', payload, accessToken);

      await reissueToken(); // AuthContext에서 사용자 데이터 새로 고침
      onProfileUpdate(); // 부모에 업데이트 성공 알리기 reissueToken
      onClose();
      alert('프로필이 성공적으로 업데이트되었습니다!');
    } catch (err: any) {
      console.error('Profile update failed:', err);
      setError(err.response?.data?.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    // 1. 이미 이미지가 있다면 기존 데이터 삭제
    if (profileImagePreviewUrl) {
      handleImageDelete(); // 기존 이미지 삭제 함수 호출
    }
    // 2. 파일 선택 창 열기
    // input의 value를 초기화해주어야 같은 파일을 다시 선택해도 onChange가 발생
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <h2 className="typo-heading2-semibold mb-3 text-gray-800">프로필 편집</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-15">
          <div className="relative h-24.5">
            <div
              onClick={handleBoxClick}
              className="absolute -bottom-11.75 left-5.5 z-1 flex h-23.5 w-23.5 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-500"
            >
              {profileImagePreviewUrl ? (
                <Image
                  src={profileImagePreviewUrl}
                  alt="Profile Preview"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  onClick={() => document.getElementById('profile-image')?.click()}
                  className="flex h-full w-full items-center justify-center"
                >
                  <Image src="/icon/camera.svg" alt="No image icon" width={24} height={24} />
                </div>
              )}
              {/* 마우스 오버 시 "변경" 안내 레이어 */}
              {profileImagePreviewUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  <Image src="/icon/camera.svg" alt="No image icon" width={24} height={24} />
                </div>
              )}
              {/* 실제 파일 인풋은 숨김 처리 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            {/* 추후에 업데이트할 배너 업로드 UI */}
            <div
              onClick={() => alert('업데이트 예정')}
              className="absolute h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg bg-gray-600"
            >
              <div className="flex h-full w-full items-center justify-center">
                <div>
                  <Image
                    className="mx-auto"
                    src="/icon/camera.svg"
                    alt="No image icon"
                    width={24}
                    height={24}
                  />
                  <p className="text-gray-100">배너 이미지 변경</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <Input
            id="nickname"
            label="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요."
            variant="secondary"
            size="small"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="bio" className="typo-body1-semibold mb-1.5 text-gray-800">
            소개글
          </label>
          <textarea
            id="bio"
            className="focus-within:border-primary-200 min-h-30 w-full rounded-lg border border-gray-500 bg-gray-100 px-4.75 py-2.5 text-gray-800 outline-none placeholder:text-gray-500 hover:border-gray-800 disabled:bg-gray-300 has-[input:disabled]:hover:border-gray-500"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="예: AI 아티스트"
            maxLength={200}
          />
        </div>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <div className="text-right">
          <Button className="w-27.5" type="submit" size="sm" disabled={isLoading}>
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
