import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 테일윈드 사용시 필요한 유틸함수 className
// className={cn(buttonVariants({ variant, size, className }), className)}
// 위와같이 들어오면 싹 정리를 해주는 유틸함수

//cn = classnames의 줄임말 -> classnames관련 유틸함수
//twMerge = 클래스 충돌 방지
//clsx = 쓸수 없는 값들을 정리 해줌 -> 조건부 쓰다보면 꼬이는 경우가 생기는데 문자열로 합치면서 정리를 도와줌

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { cn };
