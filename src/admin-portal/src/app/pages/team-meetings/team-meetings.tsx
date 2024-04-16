import { Button, Card, Typography } from '@ecdlink/ui';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { add, format } from 'date-fns';
import { useQuery } from '@apollo/client';
import {
  GetAllHealthCareWorker,
  GetAllLanguage,
  GetAllPortalClinics,
} from '@ecdlink/graphql';
import { ClinicsTeamLeadView } from '../clinics/main-view/team-lead-view/clinics';
import TempIfographic from '../../../assets/infographics/Breastfeeding-infographic.png';
import LanguageSelector from '../../components/language-selector/language-selector';
import { useMemo } from 'react';
import { AddTeamMeetingReport } from './components/add-meeting-report/add-meeting-report';
import { usePanel } from '@ecdlink/core';
import { useUser } from '../../hooks/useUser';

export const TeamMeetingsMainPage = () => {
  const { user } = useUser();
  const panel = usePanel();
  const today = new Date();
  const titleDateFormatted = format(today, 'MMMM y');
  const title = `${titleDateFormatted} Meeting topic`;
  const currentMonthName = format(today, 'MMMM');
  const next = add(today, {
    months: 1,
  });
  const nextMonthName = format(next, 'MMMM');
  const dateInfoText = `You must submit the ${currentMonthName} meeting report by 7 ${nextMonthName}`;

  const { data } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: languagesData } = useQuery(GetAllLanguage, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: hcwData } = useQuery(GetAllHealthCareWorker, {
    variables: {
      search: '',
      clinicSearch: [],
      provinceSearch: [],
      subDistrictSearch: [],
      visitSearch: [],
      connectUsageSearch: [],
      pagingInput: {
        pageNumber: 1,
        pageSize: null,
      },
      order: [
        {
          insertedDate: 'DESC',
        },
      ],
    },
    fetchPolicy: 'network-only',
  });

  const languages = useMemo(
    () => languagesData?.GetAllLanguage,
    [languagesData?.GetAllLanguage]
  );

  const clinics = data?.allPortalClinics;

  const displayEditPanel = () => {
    panel({
      noPadding: true,
      catchOnCancel: false,
      title: `${currentMonthName} meeting report`,
      render: (onSubmit: any) => (
        <AddTeamMeetingReport
          key={`clinicPanelCreate`}
          closeDialog={(clinicCreated: boolean) => {
            onSubmit();
          }}
          clinics={clinics}
          isEdit={false}
          healthCareWorkersData={hcwData?.allHealthCareWorkers}
          user={user}
        />
      ),
    });
  };

  const onDownloadInfographic = () => {
    const doc = TempIfographic;
    const link = document.createElement('a');
    link.href = doc;
    link.setAttribute('download', 'infographic.png');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="bg-adminPortalBg h-100vh p-4">
      <div className="bg-adminPortalBg">
        <div className="flex w-full items-center justify-between">
          <Typography type={'h1'} text={title} color={'textDark'} />
          <Button
            className={`rounded-2xl p-4`}
            type={'filled'}
            color={'secondary'}
            onClick={() => {}}
            text="Add meeting report"
            textColor="white"
            icon="PlusCircleIcon"
          />
        </div>
        <div>
          <Card className="bg-infoMain my-8 flex items-center gap-4 rounded-xl p-4">
            <InformationCircleIcon className="h-5 w-5 text-white" />
            <Typography type={'h4'} text={dateInfoText} color={'white'} />
          </Card>
        </div>

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
            <Typography
              type={'body'}
              text={'///////// Get values from CMS /////////'}
              color={'textMid'}
            />
            <div>
              <img src={TempIfographic} alt="infographic" />
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
            <div className="mb-4">
              <Typography
                type={'h4'}
                text={'Check knowledge:'}
                color={'textDark'}
              />
              <Typography
                type={'body'}
                text={'1. Lorem ipsum'}
                color={'textMid'}
                className="my-2 ml-2"
              />
              <Typography
                type={'body'}
                text={
                  '2. Check knowledge:Lorem ipsum dolor sit amet, consectetur adipiscing elit,'
                }
                color={'textMid'}
                className="my-2 ml-2"
              />
              <Typography
                type={'body'}
                text={
                  '3. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                }
                color={'textMid'}
                className="my-2 ml-2"
              />
            </div>
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
        {/* <div>
          <ClinicsTeamLeadView />
        </div> */}
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
                text={'7. Performance review - 40-60 min'}
                color={'textDark'}
              />
              <LanguageSelector
                disabled={false}
                languages={languages?.filter((item) => item?.isActive === true)}
                currentLanguageId={'en-za'}
                // selectLanguage={setSelectedFirstLanguageId}
              />
            </div>
            <Typography
              type={'body'}
              text={
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
              }
              color={'textMid'}
              className="my-2"
            />
          </Card>
        </div>
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
      </div>
    </div>
  );
};
