import { TabType, TAB_CONFIGS } from '../constants'

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="mb-6 flex flex-wrap border-b border-border">
      {TAB_CONFIGS.map((tab) => (
        <button
          key={tab.id}
          className={`px-2 py-2 text-sm sm:px-4 sm:text-base ${
            activeTab === tab.id 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">{tab.shortLabel}</span>
        </button>
      ))}
    </div>
  )
}