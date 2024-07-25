import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  CheckboxGroup,
  FormInput,
  LoadingSpinner,
  Radio,
  SA_CELL_REGEX,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { ReactComponent as VeryHappy } from '@/assets/emoji_yellow_bigsmile.svg';
import { ReactComponent as Happy } from '@/assets/ECD_Connect_emoji1.svg';
import { ReactComponent as Neutral } from '@/assets/ECD_Connect_emoji_neutral.svg';
import { ReactComponent as Unhappy } from '@/assets/ECD_Connect_emoji_unhappy.svg';
import { ReactComponent as VeryUnhappy } from '@/assets/red_rating.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNotifications, useSnackbar } from '@ecdlink/core';
import { useTenant } from '@/hooks/useTenant';
import { useSelector } from 'react-redux';
import { coachSelectors } from '@/store/coach';
import {
  CoachFeedbackInputModelInput,
  FeedbackTypeSortInput,
  SupportRatingModel,
  SupportRatingSortInput,
} from '@ecdlink/graphql';
import { useAppDispatch } from '@/store';
import { communityThunkActions } from '@/store/community';
import { CoachSupportRatingsTypes } from './coach-feedback.types';
import { userSelectors } from '@/store/user';
import { CommunityService } from '@/services/CommunityService';

interface HelpFormProps {
  closeAction?: (item: boolean) => void;
}

export const CoachFeedback: React.FC<HelpFormProps> = ({ closeAction }) => {
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbar();
  const [feedBackTypeIds, setFeedBackTypeIds] = useState<string[]>([]);
  const coach = useSelector(coachSelectors?.getCoach);
  const user = useSelector(userSelectors.getUser);
  const [feedbackValue, setFeedbackValue] = useState('');

  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tenant = useTenant();
  const orgName = tenant?.tenant?.organisationName;
  const [feedbackTypes, setFeedbackTypes] = useState<FeedbackTypeSortInput[]>();
  const [supportRatings, setSupportRatings] =
    useState<SupportRatingSortInput[]>();
  const [supportRatingId, setSupportRatingId] = useState('');
  const disableButton =
    feedBackTypeIds?.length === 0 || !feedbackValue || !supportRatingId;

  useEffect(() => {
    handleCoachFeedBackQueries();
  }, []);

  const handleCoachFeedBackQueries = useCallback(async () => {
    setIsLoadingTypes(true);
    const feedBackTypesResponse = await dispatch(
      communityThunkActions.getFeedbackTypes({})
    );

    const supportRatingsResponse = await dispatch(
      communityThunkActions.getSupportRatings({})
    );

    if (feedBackTypesResponse) {
      setFeedbackTypes(feedBackTypesResponse?.payload);
    }

    if (supportRatingsResponse) {
      setSupportRatings(supportRatingsResponse?.payload);
    }
    setIsLoadingTypes(false);
  }, []);

  const sendCoachFeedback = async () => {
    const input: any = {
      feedbackTypeIds: feedBackTypeIds,
      fromUserId: user?.id,
      supportRatingId: supportRatingId,
      feedbackDetails: feedbackValue,
      toUserId: coach?.user?.id,
    };
    setIsLoading(true);
    const feedbackResponse = await dispatch(
      communityThunkActions?.saveCoachFeedback({ input })
    ).catch(() => {
      showMessage({
        message: 'Feedback not sent!',
        type: 'error',
      });
    });

    if (feedbackResponse) {
      showMessage({
        message: 'Feedback sent!',
        type: 'success',
      });
      setIsLoading(false);
    }
    setIsLoading(false);
    closeAction && closeAction(false);
  };

  function updateArray(checkbox: any, id: string) {
    if (checkbox.checked) {
      setFeedBackTypeIds([...feedBackTypeIds, id]);
    } else {
      const filteredPermissions = feedBackTypeIds?.filter(
        (item) => item !== id
      );
      setFeedBackTypeIds(filteredPermissions);
    }
  }

  const handleSupportRatingsImage = (name: string) => {
    switch (name) {
      case CoachSupportRatingsTypes?.VeryHappy:
        return <VeryHappy className="h-10 w-10" />;
      case CoachSupportRatingsTypes?.Happy:
        return <Happy className="h-10 w-10" />;
      case CoachSupportRatingsTypes?.Neutral:
        return <Neutral className="h-10 w-10" />;
      case CoachSupportRatingsTypes?.Neutral:
        return <Neutral className="h-10 w-10" />;
      case CoachSupportRatingsTypes?.Unhappy:
        return <Unhappy className="h-10 w-10" />;
      default:
        return <VeryUnhappy className="h-10 w-10" />;
    }
  };

  return (
    <div>
      <BannerWrapper
        size="small"
        onBack={() => closeAction && closeAction(false)}
        color="primary"
        className={'h-screen'}
        title={`Coach feedback`}
        subTitle={'Step 1 of 1'}
        displayOffline={!isOnline}
        onClose={() => closeAction && closeAction(false)}
      >
        {isLoadingTypes && (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner
              size="big"
              spinnerColor="quatenary"
              backgroundColor="uiLight"
            />
          </div>
        )}
        {!isLoadingTypes && (
          <div className={'flex h-full flex-col overflow-y-scroll p-4'}>
            <Typography
              type="h2"
              color={'textDark'}
              text={`Give feedback about ${coach?.user?.firstName}`}
            />
            <Typography
              type="body"
              color={'textMid'}
              text={`This feedback is private and goes to the ${orgName} admin team. It helps us support you better.`}
            />
            <fieldset className="my-4 flex flex-col gap-2">
              <Typography
                type="h4"
                text={'What type of feedback would you like to share?'}
              />
              {feedbackTypes &&
                feedbackTypes?.map((item) => (
                  <CheckboxGroup
                    title=""
                    key={item?.id}
                    description={item?.name!}
                    value={item?.id!}
                    onChange={(e) => {
                      updateArray(e, item?.id!);
                    }}
                    checked={feedBackTypeIds?.some(
                      (option: any) => option === item?.id
                    )}
                  />
                ))}
            </fieldset>
            <FormInput
              textInputType="textarea"
              label="Details"
              subLabel="Please share more information."
              placeholder="Add text..."
              onChange={(e) => setFeedbackValue(e?.target?.value)}
            />
            <fieldset className="my-4 flex flex-col gap-2">
              <Typography
                type="h4"
                text={`How do you feel about ${coach?.user?.firstName} support?`}
              />
              {supportRatings &&
                supportRatings?.map((item) => (
                  <Radio
                    key={item?.id}
                    description={item?.name!}
                    value={item?.id!}
                    checked={item?.id === supportRatingId}
                    onChange={() => setSupportRatingId(String(item?.id))}
                    className="mb-4"
                    variant="slim"
                    customIcon={
                      <div className="mx-4">
                        {handleSupportRatingsImage(item?.name!)}
                      </div>
                    }
                  />
                ))}
            </fieldset>
            <div className={'w-full py-4'}>
              <Button
                type={'filled'}
                color={'quatenary'}
                className={'mb-20 w-full'}
                disabled={disableButton}
                isLoading={isLoading}
                onClick={() => {
                  sendCoachFeedback();
                }}
              >
                {renderIcon('SaveIcon', 'w-5 h-5 text-white mr-1')}
                <Typography type="help" color={'white'} text={`Save`} />
              </Button>
            </div>
          </div>
        )}
      </BannerWrapper>
    </div>
  );
};
