import { practitionerSelectors } from '@/store/practitioner';
import {
  Alert,
  BannerWrapper,
  Button,
  Checkbox,
  Typography,
} from '@ecdlink/ui';

import { useState } from 'react';
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
interface GetCommunitySupportProps {
  setNotificationStep: any;
}

export const GetCommunitySupport: React.FC<GetCommunitySupportProps> = ({
  setNotificationStep,
}) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const coach = useSelector(coachSelectors.getCoach);
  const [viewPermissionToShare, setViewPermissionToShare] =
    useState<boolean>(false);
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

  console.log(communitySupportGetValues().haveSupport);

  const sendCommunitySupportAnswer = async () => {
    await new TraineeService(userAuth?.auth_token!).updateCommunitySupport(
      practitioner?.userId!,
      communitySupportGetValues().haveSupport
    );

    history.push(ROUTES.TRAINEE.TRAINEE_ONBOARDING);
  };

  console.log({ haveSupport });

  return (
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={'Business'}
        subTitle={date}
        color={'primary'}
        onBack={history.goBack}
        displayOffline={!isOnline}
        renderOverflow={true}
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
                  register={communitySupportRegister}
                  nameProp={'haveSupport'}
                  checked={communitySupportGetValues().haveSupport}
                  name="haveSupport"
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
                disabled={!communitySupportGetValues().haveSupport}
                onClick={sendCommunitySupportAnswer}
              />
            </div>
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
