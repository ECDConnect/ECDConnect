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
  setAddCoachingCircleForm: (input: ClubMeetingModelInput) => void;
  addCoachingCircleForm: ClubMeetingModelInput;
}

export const Step1: React.FC<Step1Props> = ({
  activeStep,
  setActiveStep,
  setAddCoachingCircleForm,
  addCoachingCircleForm,
}) => {
  const coachClubs = useSelector(coachSelectors.getCoachClubs);
  const coachClubsList = coachClubs?.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });
  console.log({ coachClubsList });
  console.log(addCoachingCircleForm);

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
                addCoachingCircleForm?.meetingDate
                  ? new Date(addCoachingCircleForm?.meetingDate)
                  : undefined
              }
              onChange={(date: Date) => {
                setAddCoachingCircleForm({
                  ...addCoachingCircleForm,
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
            selectedValue={addCoachingCircleForm?.clubId}
            list={coachClubsList || []}
            onChange={(item) => {
              console.log(item);
              setAddCoachingCircleForm({
                ...addCoachingCircleForm,
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
            selectedValue={addCoachingCircleForm?.clubId}
            list={[]}
            onChange={(item) => {
              setAddCoachingCircleForm({
                ...addCoachingCircleForm,
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
        onChange={(e) =>
          setAddCoachingCircleForm({
            ...addCoachingCircleForm,
            meetingNotes: e.target.value,
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
