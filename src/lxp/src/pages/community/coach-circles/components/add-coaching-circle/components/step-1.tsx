import { coachSelectors } from '@/store/coach';
import { ClubDto } from '@ecdlink/core';
import { ClubMeetingModelInput } from '@ecdlink/graphql';
import {
  Button,
  Dropdown,
  FormInput,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { CalendarIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';

interface Step1Props {
  setActiveStep: (item: number) => void;
  activeStep: number;
}

export const Step1: React.FC<Step1Props> = ({ activeStep, setActiveStep }) => {
  const [addCoachingCirlceForm, setAddCoachingCirlceForm] =
    useState<ClubMeetingModelInput>({
      clubId: '',
      meetingDate: '',
    });
  const coachClubs = useSelector(coachSelectors.getCoachClubs);
  const coachClubsList = coachClubs?.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });
  console.log({ coachClubsList });
  console.log(addCoachingCirlceForm);

  return (
    <div className="flex flex-col gap-4 p-4">
      <Typography
        type="h2"
        color="textDark"
        text={'Add a coaching circle'}
        className="mt-4"
      />
      <div>
        <label className="text-md text-textDark mb-1 block w-11/12 font-medium">
          What date would you like to reassign the class?
        </label>
        <div className="bg-uiBg flex items-center">
          <span className="w-full">
            <ReactDatePicker
              placeholderText={`Tap to select date...`}
              wrapperClassName="text-center w-full"
              className="text-textMid bg-uiBg mx-auto w-full rounded-md border-none"
              selected={
                addCoachingCirlceForm?.meetingDate
                  ? new Date(addCoachingCirlceForm?.meetingDate)
                  : undefined
              }
              onChange={(date: Date) => {
                setAddCoachingCirlceForm({
                  ...addCoachingCirlceForm,
                  meetingDate: date,
                });
              }}
              dateFormat="EEE, dd MMM yyyy"
              showIcon
            />
          </span>
          <span>
            <CalendarIcon className="text-primary mr-2 h-4 w-4" />
          </span>
        </div>
      </div>
      <div>
        <label className={'text-textDark block font-medium'}>
          {'Which club did you hold this coaching circle for?'}
        </label>
        <div className={'flex items-center justify-between'}>
          <Dropdown
            className="w-full border-none"
            placeholder={'Tap to select club...'}
            fillType="clear"
            selectedValue={addCoachingCirlceForm?.clubId}
            list={coachClubsList || []}
            onChange={(item) => {
              console.log(item);
              setAddCoachingCirlceForm({
                ...addCoachingCirlceForm,
                clubId: item,
              });
            }}
          />
        </div>
      </div>
      <div>
        <label className={'text-textDark block font-medium'}>
          {'Which topic did you choose?'}
        </label>
        <div className={'flex items-center justify-between'}>
          <Dropdown
            className="w-full border-none"
            placeholder={'Tap to select topic...'}
            fillType="clear"
            selectedValue={addCoachingCirlceForm?.clubId}
            list={[]}
            onChange={(item) => {
              setAddCoachingCirlceForm({
                ...addCoachingCirlceForm,
                meetingType: 'a',
              });
            }}
          />
        </div>
      </div>
      <FormInput<String>
        label={'Meeting notes'}
        textInputType="textarea"
        placeholder={'e.g. We discussed increasing preschool fees.'}
        onChange={() =>
          setAddCoachingCirlceForm({
            ...addCoachingCirlceForm,
            meetingNotes: 'aadfdsfd',
          })
        }
      />
      <div className="absolute bottom-0 left-0 right-0 max-h-40 bg-white p-4">
        <Button
          onClick={() => setActiveStep(activeStep + 1)}
          className="mb-4 w-full rounded-2xl"
          size="small"
          color="primary"
          type="filled"
        >
          {renderIcon('ArrowCircleRightIcon', classNames('h-5 w-5 text-white'))}
          <Typography type="help" className="ml-2" text="Next" color="white" />
        </Button>
      </div>
    </div>
  );
};
