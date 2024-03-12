import { StatusChip, Typography, ScoreCard } from '@ecdlink/ui';
import { PointsReportSummaryDto } from '../view-clinic-report';

interface PointsReportSummaryProps {
  dataFromClinicPointsData: PointsReportSummaryDto;
}

export const PointsReportSummary: React.FC<PointsReportSummaryProps> = ({
  dataFromClinicPointsData,
}) => {
  return (
    <>
      <div className="mt-8">
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
      </div>
      <div className="mt-8 w-6/12 rounded-2xl bg-white p-6">
        <div className="bg-alertBg rounded-2xl p-2">
          <ScoreCard
            className="my-4"
            mainText={String(300)}
            hint="points earned"
            currentPoints={300}
            maxPoints={1000}
            barBgColour="uiLight"
            barColour="alertMain"
            bgColour="alertBg"
            barSize="small"
            textColour="black"
            barStatusChip={{
              backgroundColour: 'alertMain',
              borderColour: 'alertMain',
              textColour: 'white',
              text: 'Bronze',
            }}
          />
        </div>
      </div>
    </>
  );
};
