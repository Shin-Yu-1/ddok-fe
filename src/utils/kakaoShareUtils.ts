// 카카오 SDK 관련 타입 정의
declare global {
  interface Window {
    Kakao: {
      init: (apiKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (settings: KakaoShareSettings) => void;
        createDefaultButton: (settings: KakaoCreateButtonSettings) => void;
      };
    };
  }
}

interface KakaoShareContent {
  title: string;
  description: string;
  imageUrl: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

interface KakaoShareButton {
  title: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

interface KakaoShareSettings {
  objectType: 'feed';
  content: KakaoShareContent;
  buttons: KakaoShareButton[];
}

interface KakaoCreateButtonSettings {
  container: string;
  objectType: 'feed';
  content: KakaoShareContent;
  buttons: KakaoShareButton[];
}

// 카카오 SDK 로드 및 초기화
export const initializeKakaoSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 초기화되어 있다면 바로 resolve
    if (window.Kakao && window.Kakao.isInitialized()) {
      resolve();
      return;
    }

    // SDK가 이미 로드되어 있지만 초기화되지 않은 경우
    if (window.Kakao && !window.Kakao.isInitialized()) {
      const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
      if (!apiKey) {
        reject(new Error('카카오 API 키가 설정되지 않았습니다.'));
        return;
      }

      window.Kakao.init(apiKey);
      resolve();
      return;
    }

    // SDK 스크립트 로드
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    script.integrity = 'sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4';
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
      if (!apiKey) {
        reject(new Error('카카오 API 키가 설정되지 않았습니다.'));
        return;
      }

      if (window.Kakao) {
        window.Kakao.init(apiKey);
        resolve();
      } else {
        reject(new Error('카카오 SDK 로드에 실패했습니다.'));
      }
    };

    script.onerror = () => {
      reject(new Error('카카오 SDK 스크립트 로드에 실패했습니다.'));
    };

    document.head.appendChild(script);
  });
};

// 컴포넌트에서 사용할 카카오 SDK 초기화 훅
export const useKakaoSDK = () => {
  const initializeKakao = async () => {
    try {
      await initializeKakaoSDK();
      return true;
    } catch (error) {
      console.error('카카오 SDK 초기화 실패:', error);
      return false;
    }
  };

  return { initializeKakao };
};
