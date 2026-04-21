type TabItem = { label: string; value: string };

type TabProps = {
  tabs: TabItem[];
  activeValue: string;
  onChange: (value: string) => void;
};

export function Tab({ tabs, activeValue, onChange }: TabProps) {
  return (
    <div className="flex w-full bg-white border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`flex-1 h-11 text-[15px] font-medium transition-colors ${
              isActive
                ? "border-b-2 border-primary-500 text-primary-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
