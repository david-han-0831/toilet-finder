'use client'

/**
 * 설정 화면 컴포넌트
 * 언어 설정 등 앱 설정을 관리합니다.
 */
export default function SettingsPage() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="뒤로 가기"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="text-lg font-semibold">설정</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* 설정 메뉴 */}
      <div className="p-4">
        <div className="bg-white rounded-lg overflow-hidden">
          {/* 언어 설정 */}
          <button className="w-full px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <span>언어 설정</span>
            <span className="text-gray-500">한국어</span>
          </button>
          
          {/* 다크모드 설정 */}
          <button className="w-full px-4 py-3 flex items-center justify-between">
            <span>다크모드</span>
            {/* 토글 스위치 */}
          </button>
        </div>
      </div>
    </div>
  );
} 