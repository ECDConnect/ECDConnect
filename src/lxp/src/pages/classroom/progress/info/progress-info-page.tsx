import {
  Alert,
  ActionModal,
  Button,
  Card,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { MoreInformationTypeEnum, useDialog } from '@ecdlink/core';
import { InfoPage } from '@/pages/business/money/submit-income-statements/components/info-page';
import { useTenant } from '@/hooks/useTenant';
import { childrenSelectors } from '@/store/children';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { useMemo } from 'react';

interface ProgressInfoPageProps {
  onClose: () => void;
}

export const ProgressInfoPage: React.FC<ProgressInfoPageProps> = ({
  onClose,
}) => {
  const { tenant } = useTenant();
  const history = useHistory();
  const children = useSelector(childrenSelectors.getChildren);
  const dialog = useDialog();
  const hasNoChildren = children?.length === 0;

  const onDownloadPdf = () => {
    const pdfUrl =
      'https://localhost:5001/unknown/979e688f-e372-465b-ace4-5a8769ca3896_TrackProgressReportExample.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'TrackProgressReportExample.pdf');
    document.body.appendChild(link);
    link.click();
  };

  const renderFooterComponent = useMemo(
    () => (
      <>
        <Alert
          type="info"
          title="Children learn and grow at different rates!"
          list={[
            `It is fine if the child can't do the things in the progress tracker yet`,
          ]}
        />
        <Typography
          className="mt-4"
          color="textDark"
          type="h4"
          text={`What does the progress report for caregivers look like?`}
        />
        <Typography
          className="mt-4"
          type={'body'}
          color={'textMid'}
          text={`The report created by ${
            tenant?.applicationName ? `${tenant.applicationName}` : ''
          } will show the caregiver everything the child can or does do, everything you are working on with the child and all the skills the child still needs to develop.

        If you would like to see an example of what the report will look like, you can download an example.`}
        />
        <Button
          className="mt-3 mb-3 w-60"
          icon="ArrowCircleDownIcon"
          type="outlined"
          color="alertMain"
          textColor="alertMain"
          text={`Download example report`}
          onClick={onDownloadPdf}
        />
      </>
    ),
    [tenant?.applicationName]
  );

  return (
    <InfoPage
      title="Tracking progress"
      section={MoreInformationTypeEnum.TrackingProgress}
      closeText="Start tracking progress"
      closeIcon=""
      onClose={onClose}
      footer={renderFooterComponent}
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
    </InfoPage>
  );
};
