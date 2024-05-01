import { Alert, Button, Card, LoadingSpinner, Typography } from '@ecdlink/ui';
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/solid';
import { add, format, getDate, sub } from 'date-fns';
import { useLazyQuery, useQuery } from '@apollo/client';
import {
  GetAllLanguage,
  GetAllPortalClinics,
  GetAllTopic,
  GetClinicMeetingForMonth,
  MeetingTopic,
} from '@ecdlink/graphql';
import { ClinicsTeamLeadView } from '../clinics/main-view/team-lead-view/clinics';
import LanguageSelector from '../../components/language-selector/language-selector';
import { useEffect, useMemo, useState } from 'react';
import { AddTeamMeetingReport } from './components/add-meeting-report/add-meeting-report';
import { ClinicMeetingReportDto, usePanel } from '@ecdlink/core';
import { useUser } from '../../hooks/useUser';
import { LanguageId } from '../../constants/language';

interface TeamMeetingsMainPageProps {
  clinicId?: string;
}

export const TeamMeetingsMainPage: React.FC<TeamMeetingsMainPageProps> = ({
  clinicId,
}) => {
  const { user } = useUser();
  const panel = usePanel();
  const today = new Date();
  const titleDateFormatted = format(today, 'MMMM y');
  const nextMonth = add(today, {
    months: 1,
  });
  const nextMonthName = format(nextMonth, 'MMMM');
  const previousMonth = sub(today, {
    months: 1,
  });
  const untilDay7TitleFormatted = format(previousMonth, 'MMMM y');
  const todaysDateNumber = getDate(today);
  const availableDateToAddReport =
    todaysDateNumber >= 24 || todaysDateNumber <= 7;
  const isUntilDaySevenOfTheMonth = todaysDateNumber < 7;
  const previousMonthName = format(previousMonth, 'MMMM');
  const currentMonthName = format(today, 'MMMM');
  const title = isUntilDaySevenOfTheMonth
    ? `${untilDay7TitleFormatted} Meeting topic`
    : `${titleDateFormatted} Meeting topic`;
  const blueAlertMonthName = isUntilDaySevenOfTheMonth
    ? previousMonthName
    : currentMonthName;
  const reportSubmittedText = `Great job, ${currentMonthName} report submitted!`;
  const dateInfoText = `You must submit the ${blueAlertMonthName} meeting report by 7 ${
    isUntilDaySevenOfTheMonth ? currentMonthName : nextMonthName
  }`;
  const [selectedTabId, setSelectedTabId] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const { data } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: languagesData } = useQuery(GetAllLanguage, {
    fetchPolicy: 'cache-and-network',
  });

  const [
    fetchMeetinReportData,
    {
      data: clinicMeetingData,
      refetch: refetchClinicMeetingData,
      loading: loadingClinicMeetingData,
    },
  ] = useLazyQuery(GetClinicMeetingForMonth, {
    variables: {
      clinicId: selectedTabId,
    },
    fetchPolicy: 'cache-and-network',
  });

  const { data: topicData, loading: loadingTopicData } = useQuery(GetAllTopic, {
    fetchPolicy: 'network-only',
    variables: {
      localeId: selectedLanguage || LanguageId.enZa,
    },
  });

  const currentTopic: MeetingTopic = useMemo(
    () =>
      topicData?.GetAllTopic?.find(
        (item) => item?.title === titleDateFormatted
      ),
    [titleDateFormatted, topicData?.GetAllTopic]
  );

  useEffect(() => {
    if (selectedTabId) {
      fetchMeetinReportData();
    }
  }, [selectedTabId, fetchMeetinReportData]);

  const clinicMeetingReport: ClinicMeetingReportDto =
    clinicMeetingData?.clinicMeetingForMonth;
  const monthMeetingSubmitted = clinicMeetingReport?.id;
  const submittedDateFormatted =
    clinicMeetingReport?.meetingDate &&
    format(new Date(clinicMeetingReport?.meetingDate), 'd MMMM');

  const languages = useMemo(
    () => languagesData?.GetAllLanguage,
    [languagesData?.GetAllLanguage]
  );
  console.log({ isUntilDaySevenOfTheMonth });
  const clinics = data?.allPortalClinics;
  console.log({ previousMonthName });
  const displayEditPanel = () => {
    panel({
      noPadding: true,
      catchOnCancel: false,
      title: isUntilDaySevenOfTheMonth
        ? `${previousMonthName} meeting report`
        : `${currentMonthName} meeting report`,
      overlay: true,
      render: (onSubmit: any) => (
        <AddTeamMeetingReport
          key={`clinicPanelCreate`}
          closeDialog={(reportCreated: boolean) => {
            onSubmit();

            if (reportCreated) {
              refetchClinicMeetingData();
            }
          }}
          clinics={clinics}
          isEdit={false}
          user={user}
          selectedTabId={selectedTabId}
        />
      ),
    });
  };

  const onDownloadInfographic = () => {
    const doc = currentTopic?.infoGraphic;
    const link = document.createElement('a');
    link.href = doc;
    link.setAttribute('download', 'infographic.png');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="bg-adminPortalBg h-100vh p-4">
      <div className="bg-adminPortalBg">
        {!monthMeetingSubmitted && availableDateToAddReport && (
          <div className="flex w-full items-center justify-between">
            <Typography type={'h1'} text={title} color={'textDark'} />
            <Button
              className={`rounded-2xl p-4`}
              type={'filled'}
              color={'secondary'}
              onClick={displayEditPanel}
              text="Add meeting report"
              textColor="white"
              icon="PlusCircleIcon"
            />
          </div>
        )}
        {!monthMeetingSubmitted && !loadingClinicMeetingData && (
          <div>
            <Card className="bg-infoMain my-8 flex items-center gap-4 rounded-xl p-4">
              <InformationCircleIcon className="h-5 w-5 text-white" />
              <Typography type={'h4'} text={dateInfoText} color={'white'} />
            </Card>
          </div>
        )}

        {monthMeetingSubmitted && !loadingClinicMeetingData && (
          <div>
            <Card className="bg-successMain my-8 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <CheckCircleIcon className="h-5 w-5 text-white" />
                <Typography
                  type={'h4'}
                  text={reportSubmittedText}
                  color={'white'}
                />
              </div>
              <Typography
                type={'body'}
                text={`• You submitted the ${currentMonthName} report on ${submittedDateFormatted}.`}
                color={'white'}
                className="my-2 ml-8"
              />
            </Card>
          </div>
        )}

        <div>
          <Card className="my-8 rounded-xl bg-white p-6">
            <Typography
              type={'h3'}
              text={'1. Welcome - 5 min'}
              color={'textDark'}
            />
            <Typography
              type={'body'}
              text={
                'Start the meeting by warmly welcoming CHWs. Allow a short amount of time for CHWs to greet each other and then run through the agenda and timelines.'
              }
              color={'textMid'}
              className="my-2"
            />
            <Typography
              type={'body'}
              text={'Agenda:'}
              weight="bold"
              color={'textDark'}
              className="my-2"
            />
            <div>
              <Typography
                type={'body'}
                text={'1. Welcome - 5 min'}
                color={'textDark'}
                className="ml-2"
              />
              <Typography
                type={'body'}
                text={'2. Stories from the field and problem solving - 20 min'}
                color={'textDark'}
                className="ml-2"
              />
              <Typography
                type={'body'}
                text={'3. Knowledge sharing - 30 min'}
                color={'textDark'}
                className="ml-2"
              />
              <Typography
                type={'body'}
                text={'4. Growth monitoring activity - 20 min'}
                color={'textDark'}
                className="ml-2"
              />
              <Typography
                type={'body'}
                text={'5. Performance review'}
                color={'textDark'}
                className="ml-2"
              />
              <Typography
                type={'body'}
                text={'6. Important dates - 5 min'}
                color={'textDark'}
                className="ml-2"
              />
              <Typography
                type={'body'}
                text={'7. Self care - 10 min'}
                color={'textDark'}
                className="ml-2"
              />
            </div>
          </Card>
        </div>
        <div>
          <Card className="my-8 rounded-xl bg-white p-6">
            <Typography
              type={'h3'}
              text={'2. Stories from the field and problem solving - 20 min'}
              color={'textDark'}
            />
            <Typography
              type={'body'}
              text={
                'This is an opportunity for CHWs to talk to each other about a problem and come up with a solution as a group and offer support and encouragement.'
              }
              color={'textMid'}
              className="my-2"
            />
            <Typography
              type={'body'}
              text={
                '          Instead of getting the whole team to give feedback, identify one or two CHWs to share a story related to the theme for the meeting. At the end of this session, summarise the key outcomes.'
              }
              color={'textMid'}
              className="my-2"
            />
          </Card>
        </div>
        <div>
          <Card className="my-8 rounded-xl bg-white p-6">
            <Typography
              type={'h3'}
              text={'3. Knowledge sharing - 30 min'}
              color={'textDark'}
            />
            {currentTopic && !loadingTopicData && (
              <div>
                <Typography
                  type={'h4'}
                  text={`Topic: ${currentTopic?.topicTitle}`}
                  color={'textDark'}
                />
                <div
                  className="text-textDark my-2"
                  dangerouslySetInnerHTML={{
                    __html: `${currentTopic?.topicContent}`,
                  }}
                />
                <Typography
                  type={'h4'}
                  text={`Share the infographic(s):`}
                  color={'textDark'}
                  className="my-8"
                />
                <div>
                  <img src={currentTopic?.infoGraphic} alt="infographic" />
                  <div className="my-2 flex w-full justify-end">
                    <Button
                      className={`rounded-2xl p-4`}
                      type={'filled'}
                      color={'secondary'}
                      onClick={onDownloadInfographic}
                      text="Download infographic"
                      textColor="white"
                      icon="DownloadIcon"
                    />
                  </div>
                </div>
                <div className="my-4">
                  <Typography
                    type={'h4'}
                    text={'Check knowledge:'}
                    color={'textDark'}
                  />
                  <div
                    className="text-textDark"
                    dangerouslySetInnerHTML={{
                      __html: `${currentTopic?.knowledgeContent}`,
                    }}
                  />
                </div>
              </div>
            )}
            {!currentTopic && !loadingTopicData && (
              <Alert
                className="mt-5 mb-3"
                message={`Knowledge sharing have not been added yet.`}
                type="warning"
              />
            )}
            {loadingTopicData && (
              <LoadingSpinner
                backgroundColor="secondary"
                spinnerColor="adminPortalBg"
                size="small"
              />
            )}
          </Card>
        </div>
        <div className="mb-4">
          <Card className="my-8 rounded-xl bg-white p-6">
            <Typography
              type={'h3'}
              text={'4. Growth monitoring activity - 20 min'}
              color={'textDark'}
            />
            <Typography
              type={'body'}
              text={
                'This is an especially important aspect of reducing stunting. It is therefore important to include a growth monitoring activity at every team meeting.'
              }
              color={'textMid'}
              className="my-2"
            />
            <Typography
              type={'body'}
              text={
                '1. Provide CHWs with a child’s age and either weight, length or MUAC. Give them a few minutes to calculate the age, plot and interpret the measurement.'
              }
              color={'textMid'}
              className="my-2 ml-2"
            />
            <Typography
              type={'body'}
              text={
                '2. Once everyone has completed this – discuss, as a group, the possible interventions i.e what advice to give parents, is a referral needed etc...'
              }
              color={'textMid'}
              className="my-2 ml-2"
            />
          </Card>
        </div>
        <div className="mb-4">
          <Card className="my-8 rounded-xl bg-white p-6">
            <Typography
              type={'h3'}
              text={'5. Performance review - 40-60 min'}
              color={'textDark'}
            />
            <Typography
              type={'body'}
              text={
                'Start this section by sharing and discussing the latest scoreboard with CHWs. Then based on the performance summary below, discuss areas where they are doing well and areas where they can improve.'
              }
              color={'textMid'}
              className="my-2"
            />
          </Card>
        </div>
        <div>
          <ClinicsTeamLeadView
            clinicId={clinicId}
            setSelectedTabId={setSelectedTabId}
            isFromTeamMeetings={true}
          />
        </div>
        <div className="mb-4">
          <Card className="my-8 rounded-xl bg-white p-6">
            <Typography
              type={'h3'}
              text={'6. Important dates - 5 min'}
              color={'textDark'}
            />
            <Typography
              type={'body'}
              text={
                'Set a date for the next meeting and discuss any upcoming events or campaigns with CHWs.'
              }
              color={'textMid'}
              className="my-2"
            />
            <Typography
              type={'body'}
              text={
                'Review the health calendar and help CHWs identify possible campaign events they would like to host in their community.'
              }
              color={'textMid'}
              className="my-2"
            />
          </Card>
        </div>
        <div className="mb-4">
          <Card className="my-8 rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
              <Typography
                type={'h3'}
                text={'7. Self care - 10 min'}
                color={'textDark'}
              />
              <LanguageSelector
                disabled={false}
                languages={languages?.filter((item) => item?.isActive === true)}
                currentLanguageId={'en-za'}
                selectLanguage={setSelectedLanguage}
              />
            </div>
            {loadingTopicData && (
              <LoadingSpinner
                backgroundColor="secondary"
                spinnerColor="adminPortalBg"
                size="small"
              />
            )}
            {currentTopic && !loadingTopicData && (
              <div
                className="text-textDark"
                dangerouslySetInnerHTML={{
                  __html: `${currentTopic?.selfCareContent}`,
                }}
              />
            )}

            {!currentTopic && !loadingTopicData && (
              <Alert
                className="mt-5 mb-3"
                message={`Self care tips have not been added yet.`}
                type="warning"
              />
            )}
          </Card>
        </div>
        {!monthMeetingSubmitted && availableDateToAddReport && (
          <div className="mb-8">
            <Button
              className={`rounded-2xl py-4 px-8`}
              type={'filled'}
              color={'secondary'}
              onClick={displayEditPanel}
              text="Add meeting report"
              textColor="white"
              icon="PlusCircleIcon"
            />
          </div>
        )}
      </div>
    </div>
  );
};
