import { TabItem } from './models/TabItem';
import { useEffect, useState } from 'react';
import { Tab, TabProps } from './components/tab/tab';
import * as styles from './tab-list.styles';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import { classNames } from '../../utils';

export interface TabListProps extends ComponentBaseProps {
  tabItems: TabItem[];
  setSelectedIndex?: number;
  tabClassName?: string;
  activeTabClassName?: TabProps['activeTabClassName'];
  activeTabColour?: TabProps['activeTabColour'];
  tabSelected?: (item: TabItem, tabIndex: number) => void;
}

export const TabList: React.FC<TabListProps> = ({
  id,
  tabItems,
  tabSelected,
  setSelectedIndex,
  className,
  tabClassName,
  activeTabClassName,
  activeTabColour,
}) => {
  const [activeTabIndex, setActiveIndexTab] = useState(0);
  const [activeTabItem, setActiveTabItem] = useState<TabItem>();

  useEffect(() => {
    if (tabItems != null) {
      if (tabItems.length > 0) {
        const currentActiveTab = tabItems.findIndex(
          (x) => x.initActive === true
        );
        if (currentActiveTab !== -1) {
          setActiveIndexTab(currentActiveTab);
          setActiveTabItem(tabItems[currentActiveTab]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (setSelectedIndex !== undefined) {
      setActiveIndexTab(setSelectedIndex);
      setActiveTabItem(tabItems[setSelectedIndex]);
      setSelectedTab(tabItems[setSelectedIndex], setSelectedIndex);
    }
  }, [setSelectedIndex]);

  const setSelectedTab = (tab: TabItem, tabIndex: number) => {
    setActiveIndexTab(tabIndex);
    setActiveTabItem(tab);

    if (tabSelected) tabSelected(tab, tabIndex);
  };

  return (
    <>
      <div id={id} className={classNames(styles.tabScrollBar, className)}>
        <div>
          <div className={styles.navContainer}>
            <nav className={styles.navStyle} aria-label="Tabs">
              {tabItems.length === 1 ? (
                <Tab
                  className={classNames(styles.fullWidth, tabClassName)}
                  title={tabItems[0].title}
                  tabIndex={0}
                  activeIndex={0}
                  isOnlyTab={true}
                  activeTabClassName={activeTabClassName}
                  activeTabColour={activeTabColour}
                />
              ) : (
                tabItems.map((item, index) => {
                  return (
                    <Tab
                      id={item?.id}
                      className={classNames(
                        'text-textDark font-medium',
                        tabClassName
                      )}
                      key={index}
                      title={item.title}
                      tabIndex={index}
                      activeIndex={activeTabIndex}
                      tabSelected={(idx) => setSelectedTab(item, idx)}
                      activeTabClassName={activeTabClassName}
                      activeTabColour={activeTabColour}
                    />
                  );
                })
              )}
            </nav>
          </div>
        </div>
      </div>

      {activeTabItem && activeTabItem.child}
    </>
  );
};

export default TabList;
