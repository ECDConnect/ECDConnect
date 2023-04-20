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
import { infantSelectors, infantThunkActions } from '@/store/infant';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/solid';
import { RootState } from '@/store/types';
import { getInfantById } from '@/store/infant/infant.selectors';
import { format } from 'date-fns';
import { useAppDispatch } from '@/store';
import { newGuid } from '@/utils/common/uuid.utils';
import { toCamelCase } from '@ecdlink/core/lib';
import { addVisitBackReferral } from '@/store/referral/referral.actions';

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

export const InfantBackReferralUpdate: React.FC<
  VisitBackReferralFilterInput
> = () => {
  const history = useHistory();
  const location = useLocation();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [hasReferred, setHasReferred] = useState(false);
  const [isClinicalReferral, setIsClinicalReferral] = useState(false);
  const [referralComment, setReferralComment] = useState<string>();
  const appDispatch = useAppDispatch();

  const [, , , infantId] = location.pathname.split('/');
  const [, , , , , visitDataStatusId] = location.pathname.split('/');

  const completedReferralsForInfant =
    useSelector(infantSelectors.getCompletedReferralsForInfantSelector) || [];

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const selectedReferral = useMemo(() => {
    for (const item of completedReferralsForInfant) {
      if (item.id === visitDataStatusId) {
        return item;
      }
    }
  }, [completedReferralsForInfant]);

  const setQuestion = useMemo(() => {
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

  const saveBackReferral = () => {
    const inputModel: VisitBackReferralModelInput = {
      id: newGuid(),
      answer: hasReferred ? 'Yes' : 'No',
      comment: referralComment,
      visitDataStatusId: selectedReferral?.id,
    };

    if (selectedReferral?.backReferrals?.length === 0) {
      // add back referral
      // appDispatch(infantActions.updateInfantReferrals());
      appDispatch(
        addVisitBackReferral({
          input: inputModel,
        })
      ).unwrap();
      refreshList();
      history.goBack();
    }
  };

  const refreshList = useCallback(() => {
    appDispatch(
      infantThunkActions.getCompletedReferralsForInfant({ infantId })
    ).unwrap();
  }, [infantId]);

  const onCommentChanged = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setReferralComment(value);
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
    >
      <Typography
        type="h2"
        align="left"
        weight="bold"
        color="textDark"
        className="mt-2"
        text="Update back-referral"
      />

      <div className="bg-uiBg mt-2 flex gap-2 p-4">
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
            text={`Date ${infant?.user?.firstName} was referred`}
            className="text-sm"
          />
          <Typography
            type="body"
            align="left"
            text={format(
              new Date(selectedReferral?.insertedDate),
              'dd MMM yyyy'
            )}
            className="text-sm"
          />
        </div>
      </div>
      {isClinicalReferral && (
        <div className="mt-3 flex gap-2">
          <Typography
            type="h3"
            align="left"
            weight="bold"
            color="textDark"
            text={`Has the clinic referred ${infant?.user?.firstName} back to you and shared their recommendations?`}
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
        <div className="mt-3 gap-2">
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
            onClick={() => saveBackReferral()}
          />
        </div>
      )}
    </BannerWrapper>
  );
};
