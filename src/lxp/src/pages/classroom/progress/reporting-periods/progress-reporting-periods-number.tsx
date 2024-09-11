import { ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';

export type ProgressReportingPeriodsNumberProps = {
  numberOfReportingPeriods: number | undefined;
  setNumberOfReportingPeriods: (input: number) => void;
};

export const ProgressReportingPeriodsNumber: React.FC<
  ProgressReportingPeriodsNumberProps
> = ({ numberOfReportingPeriods, setNumberOfReportingPeriods }) => {
  return (
    <>
      <Typography
        className="mt-4"
        color="textDark"
        text={'Choose when child progress reports should be created'}
        type={'h2'}
      />
      <Typography
        className="mt-2"
        color="textDark"
        text="How many times a year would you like to create child progress reports to share with caregivers?"
        type={'body'}
      />
      <ButtonGroup<number>
        type={ButtonGroupTypes.Button}
        options={[
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 },
        ]}
        onOptionSelected={(value: number | number[]) => {
          setNumberOfReportingPeriods(value as number);
        }}
        multiple={false}
        selectedOptions={
          !!numberOfReportingPeriods ? [numberOfReportingPeriods] : []
        }
        color="secondary"
        className="mt-2"
      />
    </>
  );
};
