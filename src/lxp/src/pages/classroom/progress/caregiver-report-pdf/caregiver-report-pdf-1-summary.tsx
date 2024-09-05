import { Card, Divider, Typography } from '@ecdlink/ui';
import { format } from 'date-fns';
import lightbulbEmoji from '@/assets/ECD_Connect_lightbulb.png';
import childrePlayingImg from '@/assets/progress-reports/children-playing.png';
import greenFaceImg from '@/assets/progress-reports/green-face.png';
import blueFaceImg from '@/assets/progress-reports/blue-face.png';
import pinkFaceImg from '@/assets/progress-reports/pink-face.png';

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
}) => {
  return (
    <div
      className={'flex flex-col px-4 pb-4 pt-4'}
      style={{ height: '1100px' }}
    >
      <div className="mb-4 flex flex-row">
        <div className="flex flex-col">
          <Typography
            type="h1"
            color="textDark"
            text={'Progress report'}
            className="mb-2"
          />
          <Typography type="h1" color="textDark" text={childFullName} />
          <div
            className={`bg-quatenary mt-3 ml-auto mt-6 flex flex-shrink-0 flex-row items-center justify-between rounded-full px-3 py-1`}
            style={{ height: 'fit-content', width: 'fit-content' }}
          >
            <Typography
              type="small"
              weight="bold"
              color="white"
              text={`${format(
                reportingPeriodEndDate,
                'MMM yyy'
              )} | ${ageInMonths} months old`}
              lineHeight={4}
              className="pb-3 text-center"
            />
          </div>
        </div>
        <Card className="bg-uiBg ml-auto rounded-2xl p-4">
          <Typography
            type="h3"
            color="textDark"
            text={classroomName}
            className="mb-2"
          />
          <Typography
            type="small"
            color="textDark"
            text={`${childFirstName}'s practitioner: ${practitionerName}`}
          />
          <Typography
            type="small"
            color="textDark"
            text={`Principal: ${principalName}`}
          />
          <Typography
            type="small"
            color="textDark"
            text={`Phone number: ${principalPhoneNumber}`}
          />
        </Card>
      </div>
      <Divider dividerType="dashed" className="mb-4" />
      <Typography type="h1" color="textDark" text={'Progress summary'} />

      <div className="border-tertiary bg-successBg mt-6 mb-4 flex flex-col rounded-sm rounded-2xl border-2 p-4 pb-6 shadow-sm">
        {/*  style={{position: 'relative'}} */}
        {/* <div className='rounded-sm rounded-2xl shadow-sm bg-tertiary' style={{ opacity: '10%', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: -1}}/> */}
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

      <div className="border-quatenary bg-quatenaryBg mb-4 flex flex-col rounded-sm rounded-2xl border-2 p-4 pb-6 shadow-sm">
        {/*  style={{position: 'relative'}} */}
        {/* <div className='rounded-sm rounded-2xl shadow-sm bg-quatenary' style={{opacity: '10%', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: -1}}/> */}
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

      <div className="border-secondary bg-errorBg mb-4 flex flex-col rounded-sm rounded-2xl border-2 p-4 pb-6 shadow-sm">
        {' '}
        {/*  style={{position: 'relative'}} */}
        {/* <div className='rounded-sm rounded-2xl shadow-sm bg-secondary' style={{opacity: '10%', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: -1}}/> */}
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
          {ageInMonths > 35 && (
            <Typography
              type="buttonSmall"
              color="textMid"
              text={
                'Created on the ECD Connect app. This progress tracker is based on South Africa’s National Curriculum Framework for Children from Birth to Four (NCF) developed by the Department of Basic Education (DBE).'
              }
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
