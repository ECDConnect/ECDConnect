import {
  VisitBackReferralFilterInput,
  VisitBackReferralModelInput,
} from '@ecdlink/graphql/lib';
import { useHistory, useLocation } from 'react-router';
import {
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/solid';
import { RootState } from '@/store/types';
import { format } from 'date-fns';
import { useAppDispatch } from '@/store';
import { newGuid } from '@/utils/common/uuid.utils';
import { toCamelCase } from '@ecdlink/core/lib';
import { addVisitBackReferral } from '@/store/referral/referral.actions';
import { motherSelectors, motherThunkActions } from '@/store/mother';
import {
  getMotherCurrentVisitSelector,
  getMotherById,
  getMotherNearestPreviousVisitByOrderDate,
} from '@/store/mother/mother.selectors';
import { isVisitInProgress } from '@/helpers/visit-helpers';

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

export const MotherBackReferralUpdate: React.FC<
  VisitBackReferralFilterInput
> = () => {
  const history = useHistory();
  const location = useLocation();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [hasReferred, setHasReferred] = useState(false);
  const [isClinicalReferral, setIsClinicalReferral] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [referralComment, setReferralComment] = useState<string>();
  const appDispatch = useAppDispatch();

  const [, , , motherId] = location.pathname.split('/');
  const [, , , , , visitDataStatusId] = location.pathname.split('/');

  const completedReferralsForMother = useSelector(
    motherSelectors.getCompletedReferralsForMotherSelector
  );

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const currentVisit = useSelector((state: RootState) =>
    getMotherCurrentVisitSelector(state, '')
  );

  const previousVisit = useSelector((state: RootState) =>
    getMotherNearestPreviousVisitByOrderDate(state, currentVisit)
  );

  const isToGetPreviousVisitStatusData =
    (!currentVisit ||
      (!currentVisit?.attended && isVisitInProgress(currentVisit))) &&
    !!previousVisit;

  const selectedReferral = useMemo(() => {
    if (completedReferralsForMother) {
      for (const item of completedReferralsForMother) {
        if (item.id === visitDataStatusId) {
          return item;
        }
      }
    }
  }, [completedReferralsForMother, visitDataStatusId]);

  const setVisibility = useCallback(() => {
    var key = toCamelCase(selectedReferral?.section || '').toString();
    if (
      key === 'clinicReferrals' ||
      key === 'immunisationsSupplementsAndDeworming'
    ) {
      setIsClinicalReferral(true);
    } else {
      setIsClinicalReferral(false);
      setHasAnswered(true);
      setHasReferred(true);
    }
  }, [setIsClinicalReferral, setHasAnswered, setHasReferred, selectedReferral]);

  useEffect(() => setVisibility(), [setVisibility]);

  const saveBackReferral = () => {
    const inputModel: VisitBackReferralModelInput = {
      id: newGuid(),
      answer: hasReferred ? 'Yes' : 'No',
      comment: referralComment,
      visitDataStatusId: selectedReferral?.id,
    };

    // add back referral
    appDispatch(
      addVisitBackReferral({
        input: inputModel,
      })
    ).unwrap();
    refreshList();
    history.goBack();
  };

  const refreshList = useCallback(() => {
    if (isToGetPreviousVisitStatusData) {
      appDispatch(
        motherThunkActions.getCompletedReferralsForMother({
          motherId: motherId,
          visitId: previousVisit.id,
        })
      ).unwrap();
    } else if (currentVisit) {
      appDispatch(
        motherThunkActions.getCompletedReferralsForMother({
          motherId: motherId,
          visitId: currentVisit.id,
        })
      ).unwrap();
    }
  }, [
    isToGetPreviousVisitStatusData,
    currentVisit,
    appDispatch,
    motherId,
    previousVisit?.id,
  ]);

  const onCommentChanged = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setReferralComment(value);
      setIsValid(true);
    },
    [setReferralComment]
  );

  return (
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Update back-referral"
      subTitle={`${selectedReferral?.comment}`}
      backgroundColour="white"
      className="p-4"
    >
      <Typography
        type="h2"
        align="left"
        weight="bold"
        color="textDark"
        className="mt-2 mb-2"
        text="Update back-referral"
      />

      <div className="bg-errorBg rounded-10 mb-2 flex gap-3 p-4">
        <DocumentTextIcon color="darkred" className="h-12 w-12" />
        <div>
          <Typography
            type="markdown"
            align="left"
            text="Referral"
            className="text-sm"
          />
          <Typography
            type="body"
            align="left"
            text={`${selectedReferral?.comment}`}
            color="errorDark"
            hasMarkup={true}
            className="text-sm"
          />
          <Typography
            type="markdown"
            align="left"
            text={`Date ${mother?.user?.firstName} was referred`}
            className="text-sm"
          />
          {selectedReferral?.insertedDate && (
            <Typography
              type="body"
              align="left"
              text={format(
                new Date(selectedReferral?.insertedDate),
                'dd MMM yyyy'
              )}
              className="text-sm"
            />
          )}
        </div>
      </div>
      {isClinicalReferral && (
        <div className="mt-3 flex gap-2">
          <Typography
            type="h3"
            align="left"
            weight="bold"
            color="textDark"
            text={`Has the clinic referred ${mother?.user?.firstName} back to you and shared their recommendations?`}
          />
        </div>
      )}
      {isClinicalReferral && (
        <div className="mt-3 flex gap-2">
          <ButtonGroup<boolean>
            options={yesNoOptions}
            onOptionSelected={(value: boolean | boolean[]) => {
              setHasAnswered(true);
              setHasReferred(value as boolean);
            }}
            color="secondary"
            type={ButtonGroupTypes.Button}
            className={'mt-2 w-full'}
          />
        </div>
      )}
      {hasAnswered && hasReferred && (
        <div className="mt-3 mb-2 gap-2">
          <Typography
            type="h3"
            align="left"
            weight="bold"
            color="textDark"
            text="Add notes, details, or recommendations"
          />
          <div>
            <FormInput
              className={'mt-3'}
              textInputType="textarea"
              placeholder="E.g. Mom and baby seem happy and healthy."
              value={referralComment}
              onChange={onCommentChanged}
            />
          </div>
        </div>
      )}
      {hasAnswered && !hasReferred && (
        <div className="mt-3 gap-2">
          <Typography
            type="h3"
            align="left"
            weight="bold"
            color="textDark"
            text="Please provide detail about why the clinic did not respond"
          />
          <div>
            <Typography
              type="markdown"
              align="left"
              text="This information will be shared with your Team Lead."
              className="text-sm"
            />
          </div>
          <div>
            <FormInput
              className={'mt-3'}
              textInputType="textarea"
              placeholder="E.g. Mom and baby seem happy and healthy."
              value={referralComment}
              onChange={onCommentChanged}
            />
          </div>
        </div>
      )}
      {hasAnswered && (
        <div className="flex items-end">
          <Button
            type={'filled'}
            color={'primary'}
            className={'mt-2 w-full'}
            textColor={'white'}
            text={'Save'}
            icon={'SaveIcon'}
            iconPosition={'start'}
            disabled={!isValid}
            onClick={() => saveBackReferral()}
          />
        </div>
      )}
    </BannerWrapper>
  );
};
