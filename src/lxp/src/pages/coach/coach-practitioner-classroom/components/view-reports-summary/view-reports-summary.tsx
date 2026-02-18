import {
  Alert,
  BannerWrapper,
  Button,
  Card,
  DialogPosition,
  Divider,
  ImageWithFallback,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import ROUTES from '@/routes/routes';
import { useProgressForClassAndAgeGroupCoach } from '@/hooks/useProgressForClassAndAgeCoach';
import { useEffect } from 'react';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { formatPhonenumberInternational } from '@/utils/common/contact-details.utils';
import { getLogo, LogoSvgs } from '@/utils/common/svg.utils';
import { useDialog } from '@ecdlink/core';
import { coachThunkActions } from '@store/coach';
import { useAppDispatch } from '@store';

export type ProgressViewReportsSummaryState = {
  ageGroupId: number;
  practitionerId: string;
};

export const CoachProgressViewReportsSummary: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const appDispatch = useAppDispatch();
  const { state: routeState } = useLocation<ProgressViewReportsSummaryState>();

  const { reportsSummary, ageGroup, allChildReports } =
    useProgressForClassAndAgeGroupCoach(
      routeState.practitionerId,
      routeState.ageGroupId
    );

  const classPractitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(routeState.practitionerId)
  );

  const name = classPractitioner?.user?.firstName || 'the practitioner';
  const phone = classPractitioner?.user?.phoneNumber;

  useEffect(() => {
    if (!isOnline) {
      dialog({
        position: DialogPosition.Middle,
        render: (submit) => (
          <OnlineOnlyModal
            overrideText="You need to go online to contact the practitioner."
            onSubmit={submit}
          />
        ),
      });
    }
  }, [isOnline, dialog]);

  const call = () => phone && window.open(`tel:${phone}`);
  const whatsapp = () =>
    phone &&
    window.open(`https://wa.me/${formatPhonenumberInternational(phone)}`);

  const handleDone = () => {
    appDispatch(
      coachThunkActions.saveCoachContact({
        practitionerId: routeState.practitionerId,
        actionItemType: 3,
        period: new Date(),
      })
    );
    history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
      practitionerId: routeState.practitionerId,
    });
  };

  const handleGoBack = () => {
    history.push(ROUTES.COACH.PRACTITIONER_CLASSROOM, {
      practitionerId: routeState.practitionerId,
    });
  };

  return (
    <BannerWrapper
      size={'small'}
      title={`${name} - progress summary`}
      onBack={() => handleGoBack()}
    >
      <div className={'flex flex-col px-4 pb-4 pt-4'}>
        <Typography
          color="textDark"
          text={`${name} - progress summary`}
          type={'h2'}
          className="mb-4"
        />
        <Typography
          className="mb-2"
          type="h4"
          color="textDark"
          text={`Progress reports created for ${allChildReports.length} children`}
        />
        <div
          className={`mb-4 flex flex-shrink-0 flex-row items-center justify-between rounded-full px-3 py-1 bg-${
            ageGroup.color || 'secondary'
          }`}
          style={{ height: 'fit-content', width: 'fit-content' }}
        >
          <Typography
            type="buttonSmall"
            weight="bold"
            color="white"
            text={`${ageGroup.description}`}
            lineHeight={4}
            className="text-center"
          />
        </div>
        <Divider dividerType="solid" />
        <Typography
          className="mt-4"
          type="h4"
          color="textDark"
          text={'Number of children working on each skill'}
        />
        {reportsSummary.map((category) => (
          <div key={category.id} className="mt-4">
            <div className="mb-4 flex flex-row items-center">
              <ImageWithFallback
                src={category.imageUrl}
                alt="category"
                className="mr-2 h-12 w-12"
              />
              <Typography type="h3" color="textDark" text={category.name} />
            </div>
            <Card className="bg-uiBg mb-4 rounded-2xl p-4">
              {category.subCategories.map((subCategory) => (
                <div key={subCategory.id} className="mb-4">
                  <div className="flex flex-row items-center">
                    <ImageWithFallback
                      src={subCategory.imageUrl}
                      alt="category"
                      className="mr-2 h-8 w-8"
                    />
                    <Typography
                      type="h4"
                      color="textDark"
                      text={subCategory.name.toUpperCase()}
                    />
                  </div>
                  {subCategory.skills.map((skill) => (
                    <div key={skill.id} className="mt-4 flex flex-row">
                      <Typography
                        type="h4"
                        color="textDark"
                        className="mr-4"
                        text={skill.childrenWorkingOnSkillCount.toString()}
                      />
                      <Typography
                        type="body"
                        color="textMid"
                        text={skill.description}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </Card>
            <Divider dividerType="dashed" />
          </div>
        ))}
      </div>
      <div className="px-4 pb-6">
        <div className="mt-2">
          <Typography type="h2" text={`Contact ${name}`} className="mb-2" />
          <Typography
            type="h5"
            color="quatenary"
            text={
              phone
                ? `${formatPhonenumberInternational(phone)}`
                : 'Phone number not available'
            }
          />

          <div className="mt-4 flex flex-col gap-3">
            <Button
              type="outlined"
              color="secondary"
              size="small"
              onClick={whatsapp}
              disabled={!phone}
              className="w-full justify-start"
            >
              <img
                src={getLogo(LogoSvgs.whatsapp)}
                alt="WhatsApp"
                className="mr-3 h-5 w-5"
              />
              <Typography
                type="small"
                weight="bold"
                text={`WhatsApp ${name}`}
                color="secondary"
              />
            </Button>

            <Button
              type="outlined"
              color="secondary"
              icon="PhoneIcon"
              iconPosition="start"
              size="small"
              onClick={call}
              disabled={!phone}
              className="w-full"
            >
              <Typography
                type="small"
                weight="bold"
                text={`Call ${name}`}
                color="secondary"
              />
            </Button>
          </div>

          <Alert
            type="info"
            title="WhatsApp and phone calls will be charged at your standard carrier rates."
            className="mt-6"
          />

          <Button
            type="filled"
            color="quatenary"
            icon="CheckCircleIcon"
            onClick={handleDone}
            className="mt-8 w-full rounded-2xl"
          >
            <Typography
              type="help"
              color="white"
              text={`I have contacted ${name}`}
            />
          </Button>
        </div>
      </div>
    </BannerWrapper>
  );
};
