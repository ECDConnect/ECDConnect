import { StatusChip, ProgressBar, Typography } from '@ecdlink/ui';
import { PointsReportSummaryDto } from '../view-clinic-report';

interface PointsReportSummaryProps {
  dataFromClinicPointsData: PointsReportSummaryDto;
}

export const PointsReportSummary: React.FC<PointsReportSummaryProps> = ({
  dataFromClinicPointsData,
}) => {
  return (
    <>
      <Typography
        className="truncate"
        type="h2"
        weight="bold"
        color="textMid"
        text={`Summary`}
      />
      <div className="mt-2 flex w-full items-center gap-2">
        <StatusChip
          backgroundColour="darkBlue"
          borderColour="darkBlue"
          text={`${dataFromClinicPointsData?.totalHCWs} CHWs`}
          textColour={'white'}
          className={'px-4 py-1.5'}
        />
        <StatusChip
          backgroundColour="successMain"
          borderColour="successMain"
          text={`#${dataFromClinicPointsData?.leagueRanking} in the league`}
          textColour={'white'}
          className={'px-4 py-1.5'}
        />
      </div>
      <div className="mt-8 w-6/12 rounded-2xl bg-white p-8">
        <div className="bg-alertBg flex flex-col justify-center rounded-2xl px-12 py-6">
          <Typography
            align="center"
            type="unspecified"
            weight="bold"
            color="textMid"
            text={`${dataFromClinicPointsData?.pointsTotal}`}
            fontSize="48"
          />
          <Typography
            type="h4"
            weight="bold"
            color="textDark"
            text={`poinst so far in Quarter number#`}
            align="center"
          />
          <ProgressBar
            className="h1"
            label={``}
            subLabel=""
            value={0}
            primaryColour={'uiLight'}
            secondaryColour={'alertMain'}
            size="medium"
            divides={[
              { widthPercentage: 40 },
              { widthPercentage: 40 },
              { widthPercentage: 20 },
            ]}
            textColour="textDark"
          />
          <div className="w-5/12">
            <StatusChip
              backgroundColour="alertMain"
              borderColour="alertMain"
              text={`Bronze`}
              textColour={'white'}
              className="mt-4 px-8"
            />
          </div>
        </div>
      </div>
    </>
  );
};
