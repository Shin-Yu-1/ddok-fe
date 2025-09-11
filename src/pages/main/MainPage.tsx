import { useState } from 'react';

import { Plus, Users, Code, BookOpen, MapPin, UserCheck, HandTap } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import { MAIN_COPY, DDOK_STORY_PREVIEW } from '@/constants/mainContent';
import DdokStoryModal from '@/features/main/components/DdokStoryModal/DdokStoryModal';
import MainSection from '@/features/main/components/MainSection/MainSection';
import { useMainData } from '@/features/main/hooks/useMainData';
import { useAuthStore } from '@/stores/authStore';

import styles from './MainPage.module.scss';

export default function MainPage() {
  const { data, isLoading } = useMainData();
  const { isLoggedIn, user } = useAuthStore();
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // 안전하게 데이터 추출
  const ongoingStudies = data.ongoingStudies || [];
  const recruitingStudies = data.recruitingStudies || [];
  const ongoingProjects = data.ongoingProjects || [];
  const recruitingProjects = data.recruitingProjects || [];
  const userOngoingStudies = data.userOngoingStudies || [];
  const userOngoingProjects = data.userOngoingProjects || [];

  // 아이콘 매핑
  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'user-match':
        return <UserCheck size={32} weight="bold" />;
      case 'map':
        return <MapPin size={32} weight="bold" />;
      case 'click':
        return <HandTap size={32} weight="bold" />;
      default:
        return <UserCheck size={32} weight="bold" />;
    }
  };

  return (
    <div className={styles.mainPage}>
      {/* 히어로 섹션 */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {isLoggedIn && user ? (
              <>
                안녕하세요,{' '}
                <span className={styles.userName}>{user.nickname || user.username}</span>님!
                <br />
                {MAIN_COPY.hero.title}
              </>
            ) : (
              MAIN_COPY.hero.title
            )}
          </h1>
          <p className={styles.heroSubtitle}>{MAIN_COPY.hero.subtitle}</p>

          <div className={styles.heroActions}>
            {isLoggedIn ? (
              <>
                <Link to="/create/study" className={styles.primaryButton}>
                  <BookOpen size={20} weight="bold" />
                  <span>새로운 스터디 만들기</span>
                </Link>
                <Link to="/create/project" className={styles.primaryButton}>
                  <Code size={20} weight="bold" />
                  <span>새로운 프로젝트 만들기</span>
                </Link>
                <Link to="/map" className={styles.primaryButton}>
                  <MapPin size={20} weight="bold" />
                  <span>지도로 탐색하기</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth/signin" className={styles.primaryButton}>
                  <Users size={20} weight="bold" />
                  <span>시작하기</span>
                </Link>
                <Link to="/search/study" className={styles.primaryButton}>
                  <span>둘러보기</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 통계 카드들 */}
        <div className={styles.statsCards}>
          <div className={styles.statsCard}>
            <div className={styles.statsIcon}>
              <BookOpen size={24} weight="bold" />
            </div>
            <div className={styles.statsContent}>
              <div className={styles.statsNumber}>{data.stats.recruitingStudiesCount}</div>
              <div className={styles.statsLabel}>모집중인 스터디</div>
            </div>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsIcon}>
              <Code size={24} weight="bold" />
            </div>
            <div className={styles.statsContent}>
              <div className={styles.statsNumber}>{data.stats.recruitingProjectsCount}</div>
              <div className={styles.statsLabel}>모집중인 프로젝트</div>
            </div>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsIcon}>
              <Users size={24} weight="bold" />
            </div>
            <div className={styles.statsContent}>
              <div className={styles.statsNumber}>
                {data.stats.ongoingStudiesCount + data.stats.ongoingProjectsCount}
              </div>
              <div className={styles.statsLabel}>진행중인 전체 팀</div>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 소개 섹션 */}
      <section className={styles.introSection}>
        <div className={styles.introContent}>
          <div className={styles.problemSection}>
            <p className={styles.problemText}>{MAIN_COPY.description.problem}</p>
          </div>

          <div className={styles.solutionSection}>
            <p className={styles.solutionText}>{MAIN_COPY.description.solution}</p>
            <p className={styles.experienceText}>{MAIN_COPY.description.experience}</p>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>똑DDOK만의 특별함</h2>
        <div className={styles.featuresGrid}>
          {MAIN_COPY.features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{getFeatureIcon(feature.icon)}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 스터디/프로젝트 섹션 */}
      <main className={styles.mainContent}>
        {isLoggedIn ? (
          /* 로그인한 사용자: 2열 레이아웃 */
          <div className={styles.contentTwoColumn}>
            {/* 왼쪽 열: 전체 스터디/프로젝트 */}
            <div className={styles.globalSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>전체 활동</h2>
                <p className={styles.sectionSubtitle}>다양한 스터디와 프로젝트에 참여해보세요</p>
              </div>

              <MainSection
                title="진행중인 스터디"
                items={ongoingStudies}
                viewAllLink="/search/study"
                isLoading={isLoading}
                emptyMessage="현재 진행중인 스터디가 없습니다"
              />

              <MainSection
                title="모집중인 스터디"
                items={recruitingStudies}
                viewAllLink="/search/study"
                isLoading={isLoading}
                emptyMessage="현재 모집중인 스터디가 없습니다"
              />

              <MainSection
                title="진행중인 프로젝트"
                items={ongoingProjects}
                viewAllLink="/search/project"
                isLoading={isLoading}
                emptyMessage="현재 진행중인 프로젝트가 없습니다"
              />

              <MainSection
                title="모집중인 프로젝트"
                items={recruitingProjects}
                viewAllLink="/search/project"
                isLoading={isLoading}
                emptyMessage="현재 모집중인 프로젝트가 없습니다"
              />
            </div>

            {/* 오른쪽 열: 나의 스터디/프로젝트 */}
            <div className={styles.personalSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>나의 활동</h2>
                <p className={styles.sectionSubtitle}>현재 참여하고 있는 활동들을 확인하세요</p>
              </div>

              {userOngoingStudies.length > 0 && (
                <MainSection
                  title="참여중인 스터디"
                  items={userOngoingStudies}
                  viewAllLink="/profile/my"
                  isLoading={isLoading}
                  emptyMessage="참여중인 스터디가 없습니다"
                />
              )}

              {userOngoingProjects.length > 0 && (
                <MainSection
                  title="참여중인 프로젝트"
                  items={userOngoingProjects}
                  viewAllLink="/profile/my"
                  isLoading={isLoading}
                  emptyMessage="참여중인 프로젝트가 없습니다"
                />
              )}

              {userOngoingStudies.length === 0 && userOngoingProjects.length === 0 && (
                <div className={styles.emptyPersonalSection}>
                  <p className={styles.emptyMessage}>아직 참여중인 활동이 없습니다</p>
                  <div className={styles.emptyActions}>
                    <Link to="/create/study" className={styles.primaryButton}>
                      <BookOpen size={16} weight="bold" />
                      <span>스터디 만들기</span>
                    </Link>
                    <Link to="/create/project" className={styles.primaryButton}>
                      <Code size={16} weight="bold" />
                      <span>프로젝트 만들기</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 비로그인 사용자: 기존 1열 레이아웃 */
          <div className={styles.contentSingleColumn}>
            <MainSection
              title="진행중인 스터디"
              subtitle="지금 활발히 진행되고 있는 스터디들입니다"
              items={ongoingStudies}
              viewAllLink="/search/study"
              isLoading={isLoading}
              emptyMessage="현재 진행중인 스터디가 없습니다"
            />

            <MainSection
              title="모집중인 스터디"
              subtitle="새로운 멤버를 찾고 있는 스터디들입니다"
              items={recruitingStudies}
              viewAllLink="/search/study"
              isLoading={isLoading}
              emptyMessage="현재 모집중인 스터디가 없습니다"
            />

            <MainSection
              title="진행중인 프로젝트"
              subtitle="지금 활발히 진행되고 있는 프로젝트들입니다"
              items={ongoingProjects}
              viewAllLink="/search/project"
              isLoading={isLoading}
              emptyMessage="현재 진행중인 프로젝트가 없습니다"
            />

            <MainSection
              title="모집중인 프로젝트"
              subtitle="새로운 팀원을 찾고 있는 프로젝트들입니다"
              items={recruitingProjects}
              viewAllLink="/search/project"
              isLoading={isLoading}
              emptyMessage="현재 모집중인 프로젝트가 없습니다"
            />
          </div>
        )}
      </main>

      {/* 도깨비 이야기 섹션 */}
      <section className={styles.storySection}>
        <div className={styles.storyContent}>
          <div className={styles.storyText}>
            <h2 className={styles.storyTitle}>{DDOK_STORY_PREVIEW.title}</h2>
            <p className={styles.storyPreview}>{DDOK_STORY_PREVIEW.preview}</p>
            <button className={styles.storyButton} onClick={() => setIsStoryModalOpen(true)}>
              {DDOK_STORY_PREVIEW.cta}
            </button>
          </div>
          <div className={styles.storyVisual}>
            <div className={styles.ddokCharacter}>똑DDOK</div>
          </div>
        </div>
      </section>

      {/* 마지막 CTA 섹션 */}
      <section className={styles.finalSection}>
        <div className={styles.finalContent}>
          <p className={styles.visionText}>{MAIN_COPY.description.vision}</p>
          {!isLoggedIn && (
            <div className={styles.finalActions}>
              <Link to="/auth/signup" className={styles.finalPrimaryButton}>
                <Plus size={20} weight="bold" />
                <span>지금 시작하기</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 도깨비 이야기 모달 */}
      <DdokStoryModal isOpen={isStoryModalOpen} onClose={() => setIsStoryModalOpen(false)} />
    </div>
  );
}
