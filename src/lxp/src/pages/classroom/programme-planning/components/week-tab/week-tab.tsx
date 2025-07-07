import { classNames, renderIcon, Typography } from '@ecdlink/ui';
import { WeekTabProps, WeekDayBreakdown } from './week-tab.types';

export const WeekTab: React.FC<WeekTabProps> = ({
  steps,
  className,
  activeStepIndex = 0,
  onStepChanged,
}) => {
  const handleStepClick = (step: WeekDayBreakdown, index: number) => {
    if (step.isDisabled) return;

    onStepChanged(index);
  };

  const getTabIcon = (step: WeekDayBreakdown, isActiveStep: boolean) => {
    if (step.isDisabled) {
      return (
        <div
          className={`flex h-4 w-4 flex-row items-center justify-center rounded-full bg-transparent`}
        >
          <div className={`bg-uiLight h-2 w-2 rounded-full`}></div>
        </div>
      );
    }

    if (step.isHoliday) {
      return (
        <div
          className={`flex h-4 w-4 flex-row items-center justify-center rounded-full bg-transparent`}
        >
          <div className={`bg-alertMain h-2 w-2 rounded-full`}></div>
        </div>
      );
    }

    if (step.isCompleted) {
      return renderIcon(
        step.completedIcon || 'CheckCircleIcon',
        `w-4 h-4 text-${isActiveStep ? 'primary' : 'successDark'}`
      );
    }

    return (
      <div
        className={`flex h-4 w-4 flex-row items-center justify-center rounded-full bg-${
          isActiveStep ? 'uiLight' : 'transparent'
        }`}
      >
        <div
          className={`h-2 w-2 rounded-full bg-${
            isActiveStep ? 'primary' : 'uiLight'
          }`}
        ></div>
      </div>
    );
  };

  return (
    <div className={classNames(className, 'flex w-full flex-row bg-white')}>
      {steps.map((step, idx) => {
        const isActiveStep = idx === activeStepIndex;

        return (
          <div
            key={step.weekDay}
            className={`flex flex-1 flex-shrink flex-row items-center border-b-2 py-4 px-2 border-${
              isActiveStep ? 'primary' : 'transparent'
            }`}
            onClick={() => handleStepClick(step, idx)}
          >
            {getTabIcon(step, isActiveStep)}

            <Typography
              className={'ml-2'}
              type={'help'}
              text={
                step.weekDay.charAt(0).toUpperCase() + step.weekDay.slice(1)
              }
              color={
                step.isDisabled
                  ? 'uiLight'
                  : isActiveStep
                  ? 'primary'
                  : 'textMid'
              }
            />
          </div>
        );
      })}
    </div>
  );
};
