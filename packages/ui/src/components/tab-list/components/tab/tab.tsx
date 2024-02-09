import { useEffect } from 'react';
import { ComponentBaseProps } from '../../../../models/ComponentBaseProps';
import Typography from '../../../typography/typography';
import * as styles from './tab.styles';

export interface TabProps extends ComponentBaseProps {
  title: string;
  tabIndex: number;
  activeIndex: number;
  isOnlyTab?: boolean;
  tabSelected?: (index: number) => void;
}

export function Tab({
  title,
  tabIndex,
  activeIndex,
  tabSelected,
  className,
  isOnlyTab,
}: TabProps) {
  const selectTabReceived = (tab: number) => {
    if (tabSelected) {
      tabSelected(tab);
    }
  };

  useEffect(() => {
    // center the selected tab
    setTimeout(() => {
      const activeTabElement = document.querySelector(
        `[data-tab-index="${activeIndex}"]`
      );
      if (activeTabElement) {
        activeTabElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }, 0);
  }, [activeIndex]);

  return (
    <div
      data-tab-index={tabIndex}
      key={`${title}-tab-` + tabIndex}
      className={styles.getTabClass(
        tabIndex === activeIndex,
        className ? className : '',
        isOnlyTab
      )}
      onClick={() => selectTabReceived(tabIndex)}
      style={{ minWidth: 120 }}
    >
      <Typography
        type={isOnlyTab ? 'h2' : 'h4'}
        color={
          isOnlyTab
            ? 'textDark'
            : tabIndex === activeIndex
            ? 'primary'
            : 'primaryAccent1'
        }
        text={title}
        className="font-medium"
      />
    </div>
  );
}

export default Tab;
