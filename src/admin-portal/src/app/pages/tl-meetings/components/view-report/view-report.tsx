import { useHistory, useLocation } from 'react-router';
import { ViewReportRouteState } from './view-report.types';
import ROUTES from '../../../../routes/app.routes-constants';
import {
  Breadcrumb,
  BreadcrumbProps,
  Button,
  Card,
  Typography,
} from '@ecdlink/ui';
import { format } from 'date-fns';

export const ViewReport = () => {
  const { state } = useLocation<ViewReportRouteState>();
  const history = useHistory();

  const paths: BreadcrumbProps['paths'] = [
    { name: 'TL Meetings', url: ROUTES.TL_MEETINGS.REPORTS.SEE_REPORTS },
    {
      name: 'See reports',
      url: ROUTES.TL_MEETINGS.REPORTS.SEE_REPORTS,
      state,
    },
    { name: 'View report', url: '' },
  ];

  const report = state?.report;

  return (
    <div className="p-4">
      <Breadcrumb paths={paths} />
      <Typography
        type={'h1'}
        text={`${report?.teamLeadName} - ${report?.month}`}
        color={'textDark'}
        className="py-6"
      />
      <div className="flex flex-col gap-8">
        <Card className="rounded-2xl bg-white p-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Typography
                type={'help'}
                weight="bold"
                text={`Clinic:`}
                color={'textDark'}
              />
              <Typography
                type={'help'}
                text={`${report?.clinicName}`}
                color={'textDark'}
              />
            </div>
            <div className="flex items-center gap-2">
              <Typography
                type={'help'}
                weight="bold"
                text={`Report submitted:`}
                color={'textDark'}
              />
              <Typography
                type={'help'}
                text={`${format(new Date(report?.dateSubmitted), 'dd MMMM y')}`}
                color={'textDark'}
              />
            </div>
          </div>
        </Card>
        <Card className="flex flex-col gap-4 rounded-2xl bg-white p-8">
          <Typography type={'h3'} text={`CHWs opted out`} color={'textDark'} />
          <div className="flex flex-col">
            <Typography
              type={'help'}
              weight="bold"
              text={`Have any CHWs opted out of GGC this month?`}
              color={'textDark'}
            />
            <Typography
              type={'help'}
              text={report?.participantsOptedOut?.length > 0 ? `Yes` : `No`}
              color={'textDark'}
            />
          </div>
          {report?.participantsOptedOut?.length > 0 && (
            <div className="flex flex-col">
              <Typography
                type={'help'}
                weight="bold"
                text={`Select all CHWs who have opted out this month:`}
                color={'textDark'}
              />
              {report?.participantsOptedOut?.map((item) => (
                <Typography
                  key={item?.hCWId}
                  type={'help'}
                  text={item?.hCWName}
                  color={'textDark'}
                />
              ))}
            </div>
          )}
        </Card>
        <Card className="flex flex-col gap-4 rounded-2xl bg-white p-8">
          <Typography
            type={'h3'}
            text={`Stories from the field and problem solving`}
            color={'textDark'}
          />
          <div className="flex flex-col">
            <Typography
              type={'help'}
              weight="bold"
              text={`Please share a positive story from the field.`}
              color={'textDark'}
            />
            <Typography
              type={'help'}
              text={report?.positiveStory}
              color={'textDark'}
            />
          </div>
          <div className="flex flex-col">
            <Typography
              type={'help'}
              weight="bold"
              text={`Is there anything you would like to report to GGC? Please provide detail.`}
              color={'textDark'}
            />
            <Typography
              type={'help'}
              text={report?.reportingIssue}
              color={'textDark'}
            />
          </div>
        </Card>
        <Card className="flex flex-col gap-4 rounded-2xl bg-white p-8">
          <Typography
            type={'h3'}
            text={`In-field & supervision`}
            color={'textDark'}
          />
          <div className="flex flex-col">
            <Typography
              type={'help'}
              weight="bold"
              text={`How many in-field support visits have you done this month?`}
              color={'textDark'}
            />
            <Typography
              type={'help'}
              text={String(report?.totalSupportVisits)}
              color={'textDark'}
            />
          </div>
          {report?.participantsInField?.length > 0 && (
            <div className="flex flex-col">
              <Typography
                type={'help'}
                weight="bold"
                text={`Select all CHWs you went into the field with.`}
                color={'textDark'}
              />
              {report?.participantsInField?.map((item) => (
                <Typography
                  key={item?.hCWId}
                  type={'help'}
                  text={item?.hCWName}
                  color={'textDark'}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
      <Button
        className="mt-12 rounded-2xl px-16 shadow-none"
        icon="ArrowCircleLeftIcon"
        text="Back to reports"
        type="filled"
        color="secondary"
        textColor="white"
        iconPosition="start"
        onClick={() => history.push(ROUTES.TL_MEETINGS.REPORTS.SEE_REPORTS)}
      />
    </div>
  );
};
