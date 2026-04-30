\export function NicknameRulesPanel() {
  return (
    <div className="flex flex-col gap-2 bg-badge-caution-bg rounded-[6px] p-3 w-full">
      <div className="flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="7.5" stroke="#F57F17" />
          <path
            d="M8 5V8.5"
            stroke="#F57F17"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="11" r="0.75" fill="#F57F17" />
        </svg>
        <span className="text-caption font-bold text-gray-700">닉네임 규칙</span>
      </div>
      <p className="text-caption text-gray-700">
        • 한글 / 영문 / 숫자 / 밑줄로 이루어진 2~12자
      </p>
      <p className="text-caption text-gray-700">• 30일간은 변경할 수 없어요.</p>
      <p className="text-caption text-gray-700">
        • 욕설, 비속어나 부적절한 단어가 포함될 경우 닉네임 등록이 제한되거나
        등록이 되더라도 관리자에 의해 삭제될 수 있습니다.
      </p>
    </div>
  );
}
