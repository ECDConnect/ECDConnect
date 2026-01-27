import { Card, Divider, ProfileAvatar, Typography } from '@ecdlink/ui';
import { format } from 'date-fns';
import lightbulbEmoji from '@/assets/ECD_Connect_lightbulb.png';
import childrePlayingImg from '@/assets/progress-reports/children-playing.png';
import greenFaceImg from '@/assets/progress-reports/green-face.png';
import blueFaceImg from '@/assets/progress-reports/blue-face.png';
import pinkFaceImg from '@/assets/progress-reports/pink-face.png';
import * as styles from './pdf-report.styles';

export type ProgressCaregiverReportPageProps = {
  childFirstName: string;
  childFullName: string;
  classroomName: string;
  practitionerName: string;
  principalName: string;
  principalPhoneNumber: string;
  reportingPeriodEndDate: Date;
  ageInMonths: number;
  childEnjoys: string;
  goodProgressWith: string;
  howCanCaregiverSupport: string;
  totalPages: number;
  logo?: string;
};

export const ProgressCaregiverReportSummaryPage: React.FC<
  ProgressCaregiverReportPageProps
> = ({
  childFirstName,
  childFullName,
  classroomName,
  practitionerName,
  principalName,
  principalPhoneNumber,
  reportingPeriodEndDate,
  ageInMonths,
  childEnjoys,
  goodProgressWith,
  howCanCaregiverSupport,
  totalPages,
  logo,
}) => {
  const years = Math.floor(ageInMonths / 12); // integer division for years
  const months = ageInMonths % 12; // remainder for months
  const ageString =
    months === 0 ? `${years} years` : `${years} years ${months} months`;

  return (
    <div
      className={'flex flex-col px-4 pb-4 pt-4'}
      style={{ height: '1100px' }}
    >
      <div className="mb-4 flex flex-row">
        <div className="flex flex-col">
          <Typography
            type="body"
            color="textDark"
            text={`Progress report - ${childFullName}`}
            className="mb-2 text-2xl font-bold"
          />
          <div
            className={`bg-quatenary mt-3 mt-6 flex flex-shrink-0 flex-row justify-between rounded-full px-3 py-1`}
            style={{ height: 'fit-content', width: 'fit-content' }}
          >
            <Typography
              type="small"
              weight="bold"
              color="white"
              text={`${format(
                reportingPeriodEndDate,
                'MMM yyy'
              )} | ${ageString}`}
              lineHeight={4}
              className="pb-3 text-center"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <Card className="bg-uiBg w-full rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {logo && (
                <img
                  src={logo}
                  alt="Preschool logo"
                  className="h-36 w-36 rounded-full object-cover shadow-md"
                />
              )}
            </div>
            <div className="flex flex-col">
              <Typography
                type="h3"
                color="textDark"
                weight="bold"
                text={classroomName}
                className="mb-2"
              />
              <div className="flex flex-wrap items-center gap-1">
                <Typography
                  type="small"
                  color="textDark"
                  weight="bold"
                  text={`${childFirstName}'s practitioner:`}
                />
                <Typography
                  type="small"
                  color="textDark"
                  text={practitionerName}
                />
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <Typography
                  type="small"
                  color="textDark"
                  weight="bold"
                  text="Principal:"
                />
                <Typography
                  type="small"
                  color="textDark"
                  text={principalName}
                />
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <Typography
                  type="small"
                  color="textDark"
                  weight="bold"
                  text="Phone number:"
                />
                <Typography
                  type="small"
                  color="textDark"
                  text={principalPhoneNumber}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Divider dividerType="dashed" className="mb-4" />
      <Typography
        type="h1"
        color="textDark"
        text={'Progress summary'}
        className="pb-5"
      />

      <div style={styles.TertiaryBox}>
        <div className="flex flex-row">
          <img src={greenFaceImg} className="mr-4 h-14 w-14" />
          <Typography
            type="h3"
            color="textDark"
            text={`${childFirstName} enjoys:`}
            className="mb-2"
          />
        </div>
        <Typography type="small" color="textDark" text={childEnjoys} />
      </div>

      <div style={styles.QuatenaryBox}>
        <div className="flex flex-row">
          <img src={blueFaceImg} className="mr-4 h-14 w-14" />
          <Typography
            type="h3"
            color="textDark"
            text={`${childFirstName} has made good progress with:`}
            className="mb-2"
          />
        </div>
        <Typography type="small" color="textDark" text={goodProgressWith} />
      </div>

      <div style={styles.SecondaryBox}>
        <div className="flex flex-row">
          <img src={pinkFaceImg} className="mr-4 h-14 w-14" />
          <Typography
            type="h3"
            color="textDark"
            text={`As a caregiver, you can support ${childFirstName}'s learning by:`}
            className="mb-2"
          />
        </div>
        <Typography
          type="small"
          color="textDark"
          text={howCanCaregiverSupport}
        />
      </div>

      <div className="mt-auto">
        <Card className="bg-textDark mb-4 mt-auto flex flex-row rounded-2xl p-4">
          <img src={lightbulbEmoji} className="mr-4 h-14 w-14" />
          <div className="flex flex-col">
            <Typography
              type="h2"
              color="white"
              text={'Every child is unique'}
            />
            <Typography
              type="body"
              color="white"
              text={'Children learn and grow at different rates!'}
            />
          </div>
          <div
            className="mr-4 ml-auto h-14 w-1/2"
            style={{ position: 'relative', overflow: 'visible' }}
          >
            <img
              src={childrePlayingImg}
              className=""
              style={{ position: 'absolute', bottom: 0, left: 0 }}
            />
          </div>
        </Card>
        <div className="mb-4 flex flex-row">
          {ageInMonths < 36 && (
            <Typography
              type="buttonSmall"
              color="textMid"
              text={
                'Created on the ECD Connect app. This progress tracker has been adapted from the Caregiver-Reported Early Development Instruments (CREDI) developed by the Harvard Graduate School of Education and aligned with South Africa’s National Curriculum Framework for Children from Birth to Four (NCF).'
              }
            />
          )}
          {ageInMonths > 35 && ageInMonths < 61 && (
            <Typography
              type="buttonSmall"
              color="textMid"
              text={
                'Created on the ECD Connect app. This progress tracker is based on South Africa’s National Curriculum Framework for Children from Birth to Four (NCF) developed by the Department of Basic Education (DBE).'
              }
            />
          )}
          {ageInMonths > 60 && (
            <Typography
              type="buttonSmall"
              color="textMid"
              text={`Created on the ECD Connect app. This progress tracker has been adapted from the ChildSteps tool which was created using South Africa's School Based Assessment for Grade R.`}
            />
          )}
          <p
            className="font-body text-textDark mt-auto w-60 text-right"
            style={{ fontSize: '12px', fontWeight: 'bold' }}
          >
            {`Page 1 of ${totalPages}`}
          </p>
        </div>
      </div>
    </div>
  );
};
