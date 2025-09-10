// auth 관련 페이지들에서 사용되는 타입 모음 파일입니다.
// 예: 로그인 form 등

// 사용자 위치 정보 타입 (API 응답 기준)
export interface UserLocation {
  address?: string; // 전체 주소
  region1depthName?: string; // 시도 (예: 부산광역시)
  region2depthName?: string; // 구군 (예: 해운대구)
  region3depthName?: string; // 동면 (예: 우동)
  roadName?: string; // 도로명 (예: 센텀중앙로)
  mainBuildingNo?: string; // 주번지 (예: 90)
  subBuildingNo?: string; // 부번지 (예: '')
  zoneNo?: string; // 우편번호 (예: 48058)
  latitude: number;
  longitude: number;
}

// API에서 받는 사용자 정보 (로그인 응답)
export interface ApiUserInfo {
  id: number;
  username: string;
  email: string;
  nickname?: string | null;
  profileImageUrl?: string | null;
  isPreference?: boolean;
  isSocial?: boolean;
  mainPosition?: string | null;
  location?: UserLocation | null;
}

// 로그인 API 응답 타입
export interface SignInApiResponse {
  status: number;
  message: string;
  data: {
    accessToken: string;
    user: ApiUserInfo;
  };
}

// 소셜 로그인 콜백 응답 타입
export interface SocialLoginResponse {
  accessToken: string;
  user: ApiUserInfo;
}

// 회원가입 API 요청 타입
export interface SignUpRequest {
  email: string;
  username: string;
  password: string;
  passwordCheck: string;
  phoneNumber: string;
  phoneCode: string;
}

// 회원가입 API 응답 타입
export interface SignUpApiResponse {
  status: number;
  message: string;
  data: {
    id: number;
    username: string;
  };
}

// 이메일 찾기 요청 타입
export interface FindEmailRequest {
  username: string;
  phoneNumber: string;
  phoneCode: string;
}

// 이메일 찾기 응답 타입
export interface FindEmailResponse {
  email: string;
}

// 비밀번호 찾기 요청 타입
export interface FindPasswordRequest {
  username: string;
  email: string;
  phoneNumber: string;
  phoneCode: string;
}

// 비밀번호 찾기 응답 타입
export interface FindPasswordResponse {
  reauthToken: string;
}

// 비밀번호 재설정 요청 타입
export interface ResetPasswordRequest {
  newPassword: string;
  passwordCheck: string;
}

// 카카오 로그인 요청 타입
export interface KakaoSignInRequest {
  authorizationCode: string;
  redirectUri: string;
}

// 토큰 갱신 API 응답 타입
export interface RefreshTokenResponse {
  status: number;
  message: string;
  data: {
    accessToken: string;
  };
}

// 개인화 설정 요청 타입
export interface PersonalizationRequest {
  mainPosition: string;
  subPosition: string[];
  techStacks: string[];
  location: UserLocation;
  traits: string[];
  birthDate: string;
  activeHours: {
    start: string;
    end: string;
  };
}

// 개인화 설정 응답 타입
export interface PersonalizationResponse {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  profileImageUrl?: string;
  mainPosition?: string;
  preferences?: {
    mainPosition: string;
    subPosition: string[];
    techStacks: string[];
    location: UserLocation;
    traits: string[];
    birthDate: string;
    activeHours: {
      start: string;
      end: string;
    };
  };
}
