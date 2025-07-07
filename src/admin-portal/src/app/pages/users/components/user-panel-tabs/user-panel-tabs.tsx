import { classNames, UserPanelTabsProps } from '../users';

export default function UserPanelTabs(props: UserPanelTabsProps) {
  return (
    <div className="hidden sm:block">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {props.userTabs.map((tab) => (
            <div
              key={tab.title}
              onClick={() => props.onTabSelected(tab)}
              className={classNames(
                props.currentTab?.title === tab.title
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                'whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm cursor-pointer'
              )}
              aria-current={
                props.currentTab?.title === tab.title ? 'page' : undefined
              }
            >
              {tab.title}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
