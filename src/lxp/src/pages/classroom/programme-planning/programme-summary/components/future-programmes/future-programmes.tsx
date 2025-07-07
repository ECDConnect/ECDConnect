import { ProgrammeDto } from '@ecdlink/core';
import { ComponentBaseProps, StatusChip } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { DateFormats } from '../../../../../../constants/Dates';
import { programmeSelectors } from '@store/programme';
import { getDateRangeText } from '@utils/classroom/programme-planning/programmes.utils';

interface FutureProgrammesProps extends ComponentBaseProps {
  programme?: ProgrammeDto;
  onSummarySelected: (programme?: ProgrammeDto) => void;
  noPlan?: boolean;
}

export const FutureProgrammes: React.FC<FutureProgrammesProps> = ({
  programme,
  onSummarySelected,
  noPlan,
}) => {
  const todaysProgramme = useSelector(programmeSelectors.getTodaysProgramme());

  const futureProgrammes: ProgrammeDto[] = useSelector(
    programmeSelectors.getProgrammesAfterDate(new Date())
  );

  return (
    <div
      className={
        'flex flex-row w-full overflow-x-scroll py-2 border-b border-uiLight'
      }
    >
      {noPlan ? (
        <StatusChip
          className="ml-2 px-3 py-2 flex-nowrap"
          borderColour="infoDark"
          textColour="white"
          backgroundColour="infoDark"
          text={`Today, ${new Date().toLocaleString(
            'en-ZA',
            DateFormats.dayWithShortMonthName
          )}`}
        />
      ) : (
        <StatusChip
          key={todaysProgramme?.id}
          className="ml-2 px-3 py-2 flex-nowrap"
          borderColour={
            todaysProgramme?.id === programme?.id ? 'infoDark' : 'textLight'
          }
          textColour={
            todaysProgramme?.id === programme?.id ? 'white' : 'textLight'
          }
          backgroundColour={
            todaysProgramme?.id === programme?.id ? 'infoDark' : 'white'
          }
          text={`${todaysProgramme?.name || 'Today'}, ${
            todaysProgramme
              ? getDateRangeText(
                  todaysProgramme.startDate,
                  todaysProgramme.endDate
                )
              : new Date().toLocaleString(
                  'en-ZA',
                  DateFormats.dayWithShortMonthName
                )
          }`}
          onClick={() => {
            onSummarySelected(todaysProgramme);
          }}
        />
      )}
      {futureProgrammes.map((fProg) => {
        const isCurrentProgramme = fProg.id === programme?.id;

        return (
          <StatusChip
            key={fProg.id}
            className="ml-2 px-3 py-2"
            borderColour={isCurrentProgramme ? 'infoDark' : 'textLight'}
            textColour={isCurrentProgramme ? 'white' : 'textLight'}
            backgroundColour={isCurrentProgramme ? 'infoDark' : 'white'}
            text={`${fProg.name}, ${getDateRangeText(
              fProg.startDate,
              fProg.endDate
            )}`}
            onClick={() => {
              onSummarySelected(fProg);
            }}
          />
        );
      })}
    </div>
  );
};
