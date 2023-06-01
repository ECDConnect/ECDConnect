import Article from '@/components/article/article';
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
import { ContentConsentTypeEnum } from '@ecdlink/core';
import { coachSelectors } from '@/store/coach';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { format } from 'date-fns';

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
              <div className="flex items-start gap-2">
                <Checkbox
                  // checked={}
                  onCheckboxChange={(value) => {}}
                />
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
              message="You may need to get support from: local tribal authorities; churches, mosques or synagogues; ward councillors; DBE offices; parents in the community; local clinic; other ECD service organisations; other ECD centres."
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
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
