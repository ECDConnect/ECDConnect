import React, { useMemo, useState } from 'react';
import {
  Button,
  classNames,
  Colours,
  MenuListDataItem,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { activitiesList, activitiesTypes } from '../activities-list';
import { useWindowSize } from '@reach/window-size';
import { Step } from '.';

export const Screen2 = ({ currentStep, className, onClick }: Step) => {
  const [isShowCompletedForms, setIsShowCompletedForms] = useState(false);

  const { width, height } = useWindowSize();

  const isFollowUp = Number(currentStep) >= 6;

  const today = useMemo(() => new Date(), []);
  const options: Intl.DateTimeFormatOptions = useMemo(
    () => ({
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    []
  );

  const { completedForms, uncompletedForms, followUpForm } = useMemo(() => {
    const completedActivities =
      currentStep === 7 ? activitiesList : activitiesList.slice(0, 3);
    const uncompletedActivities = activitiesList;

    const completedForms = completedActivities.map(
      (item): MenuListDataItem => ({
        showIcon: true,
        menuIconUrl: item?.menuIconUrl,
        menuIconClassName: 'border-0',
        title: item?.title,
        subTitle: '',
        iconBackgroundColor: 'successMain' as Colours,
        backgroundColor: 'successBg' as Colours,
        rightIcon: 'BadgeCheckIcon',
        rightIconClassName: 'h-5 w-5 text-successMain',
      })
    );

    const uncompletedForms = uncompletedActivities.map(
      (item): MenuListDataItem => ({
        showIcon: true,
        menuIconUrl: item?.menuIconUrl,
        menuIconClassName: 'border-0',
        title: item?.title,
        subTitle: '',
        iconBackgroundColor: item.iconBackgroundColor as Colours,
        iconHexBackgroundColor: item.iconHexBackgroundColor,
        backgroundColor: (item.backgroundColor as Colours) || '',
        hexBackgroundColor: item.hexBackgroundColor || '',
        className: item.className,
        onActionClick: () => {},
      })
    );

    const followUpForm: MenuListDataItem[] = [
      {
        showIcon: true,
        menuIcon: 'CalendarIcon',
        menuIconClassName: 'border-0',
        iconColor: 'white',
        title: 'Follow up',
        subTitle: 'Schedule your next visit, make referrals & save notes',
        iconBackgroundColor: 'tertiary' as Colours,
        backgroundColor: 'uiBg' as Colours,
        onActionClick: () => {},
      },
    ];

    return { uncompletedForms, completedForms, followUpForm };
  }, [currentStep]);

  return (
    <div className={classNames('relative p-4', className)} style={{ height }}>
      <div className="absolute z-0 bg-black" style={{ height }} />
      <Typography
        type="h2"
        align="left"
        weight="bold"
        text={'Your summary for this visit'}
        color="textDark"
        className="col-span-2"
      />
      <Typography
        type="body"
        align="left"
        weight="skinny"
        text={today.toLocaleDateString('en-ZA', options)}
        color="textMid"
      />
      <div id="step2">
        <Typography
          type="h4"
          align="left"
          weight="bold"
          text="Tap a button below to get started."
          color="textDark"
          className="mt-6 mb-4"
        />
        {isFollowUp ? (
          <div id="step8">
            <StackedList
              isFullHeight={false}
              className={'flex flex-col gap-2'}
              listItems={followUpForm}
              type={'MenuList'}
            />
          </div>
        ) : (
          <>
            <div id="step3" onClick={onClick}>
              <StackedList
                isFullHeight={false}
                className={'flex flex-col gap-2'}
                listItems={[uncompletedForms[0]]}
                type={'MenuList'}
              />
            </div>
            <StackedList
              isFullHeight={false}
              className={'mt-2 flex flex-col gap-2'}
              listItems={uncompletedForms.slice(1, 3)}
              type={'MenuList'}
            />
          </>
        )}
      </div>
      {!isFollowUp && (
        <StackedList
          isFullHeight={false}
          className={'mt-2 flex flex-col gap-2'}
          listItems={uncompletedForms.slice(3, 7)}
          type={'MenuList'}
        />
      )}
      <div className="mt-8 flex gap-1">
        {Object.values(activitiesTypes).map((item, index) => (
          <span
            key={item}
            className="rounded-10 h-2"
            style={{
              minWidth: 37,
              background:
                (Number(currentStep) >= 5 && index <= 2) ||
                (Number(currentStep) >= 7 && index <= 6)
                  ? '#26ACAF'
                  : '#D4EEEF',
              width: width / Object.values(activitiesTypes).length,
            }}
          />
        ))}
      </div>
      <div id="step7">
        {Number(currentStep) >= 4 && (
          <Button
            id="step6"
            className="mt-8 w-full"
            type="outlined"
            color="primary"
            textColor="primary"
            icon={isShowCompletedForms ? 'EyeOffIcon' : 'EyeIcon'}
            text={
              isShowCompletedForms
                ? 'Hide completed activities'
                : 'See completed activities'
            }
            onClick={() => {
              onClick?.();
              setIsShowCompletedForms((prevState) => !prevState);
            }}
          />
        )}
        {isShowCompletedForms && (
          <StackedList
            isFullHeight={false}
            className={'mt-8 flex flex-col gap-2'}
            listItems={completedForms}
            type={'MenuList'}
          />
        )}
      </div>
    </div>
  );
};
