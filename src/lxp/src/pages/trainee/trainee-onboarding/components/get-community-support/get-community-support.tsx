import { practitionerSelectors } from '@/store/practitioner';
import {
  Alert,
  BannerWrapper,
  Button,
  Checkbox,
  Typography,
} from '@ecdlink/ui';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { coachSelectors } from '@/store/coach';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { format } from 'date-fns';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  CommunitySupportModel,
  CommunitySupportSchema,
  initialCommunitySupportValues,
} from '@/schemas/trainee/community-support';
import { TraineeService } from '@/services/TraineeService';
import { authSelectors } from '@/store/auth';
import ROUTES from '@/routes/routes';
import { timelineSteps } from '../trainee-onboarding-dashboard/timeline-steps';
import { traineeSelectors } from '@/store/trainee';
interface GetCommunitySupportProps {
  setNotificationStep: any;
}

export const GetCommunitySupport: React.FC<GetCommunitySupportProps> = ({
  setNotificationStep,
}) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const date = format(new Date(), 'EEEE, d LLLL');
  const userAuth = useSelector(authSelectors.getAuthUser);

  const {
    control,
    setValue,
    register: communitySupportRegister,
    getValues: communitySupportGetValues,
  } = useForm<CommunitySupportModel>({
    resolver: yupResolver(CommunitySupportSchema),
    mode: 'onChange',
    defaultValues: initialCommunitySupportValues,
  });

  const { haveSupport } = useWatch({ control });

  const sendCommunitySupportAnswer = async () => {
    await new TraineeService(userAuth?.auth_token!).updateCommunitySupport(
      practitioner?.userId!,
      communitySupportGetValues().haveSupport
    );

    setNotificationStep('');
  };

  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);

  const completedSteps = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined
  ).filter((item) => item?.type === 'completed');

  useEffect(() => {
    if (
      completedSteps &&
      completedSteps.some((x) => x.title === 'Community support gained')
    ) {
      setValue('haveSupport', !haveSupport);
    }
  }, []);

  return (
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={'Business'}
        subTitle={date}
        color={'primary'}
        onBack={() => setNotificationStep('')}
        displayOffline={!isOnline}
        className="pb-16"
      >
        <div className="flex flex-col justify-around p-4">
          <div>
            <Typography
              className={'my-3'}
              color={'textDark'}
              type={'h2'}
              text={'Community support'}
            />
            <div className="'flex items-center' w-full flex-row justify-start">
              <div
                className="flex items-start gap-2"
                onClick={() => setValue('haveSupport', !haveSupport)}
              >
                <Checkbox<CommunitySupportModel>
                  onCheckboxChange={() => setValue('haveSupport', !haveSupport)}
                  register={communitySupportRegister}
                  nameProp={'haveSupport'}
                  checked={
                    communitySupportGetValues().haveSupport ||
                    completedSteps.some(
                      (x) => x.title === 'Community support gained'
                    )
                  }
                  name="haveSupport"
                  disabled={completedSteps.some(
                    (x) => x.title === 'Community support gained'
                  )}
                ></Checkbox>
                <Typography
                  text={
                    'I have the support of local authorities or groups and others in my community'
                  }
                  type="body"
                  color={'textMid'}
                />
              </div>
            </div>
            <Alert
              className={'mt-5 mb-3'}
              title="Getting the support of ECD centres and forums in your area is very important if you want to be successful!"
              list={[
                'You may need to get support from: local tribal authorities; churches, mosques or synagogues; ward councillors; DBE offices; parents in the community; local clinic; other ECD service organisations; other ECD centres.',
              ]}
              type={'info'}
            />
            <div className="mt-4 mb-16 h-full w-full">
              <Button
                size="normal"
                className="mb-4 w-full"
                type="filled"
                color="primary"
                text="Save"
                textColor="white"
                icon="ArrowCircleRightIcon"
                disabled={
                  !communitySupportGetValues().haveSupport ||
                  completedSteps.some(
                    (x) => x.title === 'Community support gained'
                  )
                }
                onClick={sendCommunitySupportAnswer}
              />
            </div>
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
