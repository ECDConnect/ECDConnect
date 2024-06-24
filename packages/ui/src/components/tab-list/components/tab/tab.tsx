import { useEffect } from 'react';
import { ComponentBaseProps } from '../../../../models/ComponentBaseProps';
import Typography from '../../../typography/typography';
import * as styles from './tab.styles';
import { Colours } from '../../../../models';

export interface TabProps extends ComponentBaseProps {
  title: string;
  tabIndex: number;
  activeIndex: number;
  activeTabColour?: Colours;
  isOnlyTab?: boolean;
  activeTabClassName?: string;
  tabSelected?: (index: number) => void;
}

export function Tab({
  id,
  title,
  tabIndex,
  activeIndex,
  tabSelected,
  className,
  isOnlyTab,
  activeTabClassName,
  activeTabColour = 'quatenary',
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
      id={id}
      data-tab-index={tabIndex}
      key={`${title}-tab-` + tabIndex}
      className={styles.getTabClass(
        tabIndex === activeIndex,
        className ? className : '',
        isOnlyTab,
        activeTabColour,
        activeTabClassName
      )}
      onClick={() => selectTabReceived(tabIndex)}
      style={{ width: '-webkit-fill-available' }}
    >
      <Typography
        type={isOnlyTab ? 'h2' : 'h4'}
        color={
          isOnlyTab
            ? 'textDark'
            : tabIndex === activeIndex
            ? activeTabColour
            : 'primaryAccent1'
        }
        text={title}
        className="font-medium"
      />
    </div>
  );
}

export default Tab;
