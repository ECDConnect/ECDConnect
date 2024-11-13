import { authSelectors } from '@/store/auth';
import {
  ActionModal,
  Button,
  Card,
  DialogPosition,
  MoreInformationPage,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@/store/static-data';
import { MoreInformation } from '@ecdlink/graphql';
import InfoService from '@/services/InfoService/InfoService';
import { MoreInformationTypeEnum, useDialog } from '@ecdlink/core';
import { InfoPage } from '@/pages/business/money/submit-income-statements/components/info-page';
import { useTenant } from '@/hooks/useTenant';
import { ProgressWalkthroughStart } from '../walkthrough/progress-walkthrough-start';
import { childrenSelectors } from '@/store/children';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';

interface ProgressInfoPageProps {
  onClose: () => void;
}

export const ProgressInfoPage: React.FC<ProgressInfoPageProps> = ({
  onClose,
}) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [data, setData] = useState<MoreInformation[]>();
  const languages = useSelector(staticDataSelectors.getLanguages);
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');
  const { tenant } = useTenant();
  const history = useHistory();
  const children = useSelector(childrenSelectors.getChildren);
  const dialog = useDialog();

  const hasNoChildren = children?.length === 0;

  useEffect(() => {
    new InfoService()
      .getMoreInformation(
        MoreInformationTypeEnum.TrackingProgress,
        selectedLanguage
      )
      .then((info) => setData(info));
  }, [selectedLanguage, userAuth?.auth_token]);

  return (
    <InfoPage
      title="Tracking progress"
      section={MoreInformationTypeEnum.TrackingProgress}
      closeText="Start tracking progress"
      closeIcon=""
      onClose={onClose}
    >
      <Card className="bg-uiBg flex w-full flex-col justify-center rounded-2xl p-4">
        <Typography
          className="mt-4"
          color="textDark"
          type="h2"
          text={`How to use the progress tracker on ${
            tenant?.applicationName ? `${tenant.applicationName}` : ''
          }?`}
        />
        <Typography
          className="mt-4"
          color="textMid"
          type="body"
          text={`Tap the button below to see how to use this part ${
            tenant?.applicationName ? `of ${tenant.applicationName}` : ''
          }.`}
        />
        <Button
          text="Start walkthrough"
          icon="ArrowCircleRightIcon"
          type="filled"
          color="quatenary"
          textColor="white"
          className="mt-4 max-h-10 shadow-lg"
          iconPosition="start"
          onClick={() => {
            if (hasNoChildren) {
              dialog({
                blocking: false,
                position: DialogPosition.Middle,
                color: 'bg-white',
                render: (onClose) => {
                  return (
                    <ActionModal
                      title={'To see this walkthrough, add a child first!'}
                      icon={'InformationCircleIcon'}
                      iconColor={'infoDark'}
                      iconBorderColor={'infoBb'}
                      actionButtons={[
                        {
                          colour: 'primary',
                          text: 'Close',
                          textColour: 'white',
                          type: 'filled',
                          leadingIcon: 'XIcon',
                          onClick: () => {
                            onClose();
                          },
                        },
                      ]}
                    />
                  );
                },
              });
            } else {
              history.push(ROUTES.CHILD_PROFILE, {
                childId: children?.[0]?.id,
                isFromInfoPage: true,
              });
            }
          }}
        />
      </Card>
      <div className="my-2"></div>
    </InfoPage>
  );
};
