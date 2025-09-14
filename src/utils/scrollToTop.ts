// 페이지 상단이나 특정 위치로 스크롤 이동시키는 유틸입니다.

// 페이지 상단으로 스크롤 이동
export const scrollToTop = (behavior: ScrollBehavior = 'auto'): void => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior,
  });
};

// React Router 네비게이션과 함께 상단으로 스크롤
export const navigateAndScrollToTop = (
  navigate: (path: string | number) => void,
  path: string | number,
  behavior: ScrollBehavior = 'auto'
): void => {
  navigate(path);
  // 페이지 이동 후 스크롤 초기화를 위해 약간의 지연
  setTimeout(() => scrollToTop(behavior), 0);
};

// 특정 엘리먼트로 스크롤 이동
export const scrollToElement = (elementId: string, behavior: ScrollBehavior = 'smooth'): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior });
  }
};
