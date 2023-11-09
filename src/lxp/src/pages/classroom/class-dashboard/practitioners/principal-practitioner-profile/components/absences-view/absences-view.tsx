import ROUTES from '@/routes/routes';
import { PractitionerDto } from '@ecdlink/core';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import {
  BannerWrapper,
  Button,
  Card,
  Divider,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { format, isSameMonth } from 'date-fns';
import { useHistory } from 'react-router';

interface AbsencesViewProps {
  practitioner: PractitionerDto;
  setShowAbsences: (item: boolean) => void;
  lastMonth: Date;
  absences?: AbsenteeDto[];
}

export const AbsencesView: React.FC<AbsencesViewProps> = ({
  practitioner,
  setShowAbsences,
  lastMonth,
  absences,
}) => {
  const lastMonthAbsences = absences?.filter(
    (item) =>
      item?.absentDate === item?.absentDateEnd &&
      isSameMonth(new Date(item?.absentDate as string), new Date(lastMonth))
  );

  const history = useHistory();
  return (
    <BannerWrapper
      size="small"
      onBack={() => setShowAbsences(false)}
      color="primary"
      className={'h-full'}
      title={'Days absent'}
      subTitle={`${practitioner?.user?.fullName}`}
    >
      <div className="p-4">
        <div className="my-2 flex items-center gap-2">
          <div
            className={`text-14 bg-alertMain )} flex h-8 w-8
          items-center justify-center rounded-full font-bold text-white`}
          >
            <Typography
              type={'h2'}
              text={`${practitioner?.daysAbsentLastMonth}`}
              color={'white'}
              weight="bold"
            />
          </div>
          <Typography
            type={'h2'}
            text={`Days absent in ${format(lastMonth, 'MMMM yyyy')}`}
            color={'textDark'}
          />
        </div>
        <div>
          {lastMonthAbsences &&
            lastMonthAbsences?.length > 0 &&
            lastMonthAbsences?.map((item) => {
              return (
                <>
                  <Typography
                    type={'body'}
                    text={`Reason: ${item?.reason}`}
                    color={'textMid'}
                  />
                  <Typography
                    type={'body'}
                    text={`${format(
                      new Date(item?.absentDate as string),
                      'cccc '
                    )}, ${format(
                      new Date(item?.absentDate as string),
                      'd MMM y'
                    )}`}
                    color={'textMid'}
                  />
                  <Divider dividerType="dashed" />
                </>
              );
            })}

          <Card className={'bg-uiBg mt-4 w-full rounded-xl'}>
            <div className={'p-4'}>
              <Typography
                type="body"
                className="mt-2"
                color="textMid"
                text={
                  'If Bulelwa is no longer a practitioner at your programme, please remove them.'
                }
              />
              <div className="flex justify-center">
                <Button
                  type="filled"
                  color="primary"
                  className={'mt-4 mb-4 w-11/12 rounded-2xl'}
                  onClick={() =>
                    history.push(
                      ROUTES.PRINCIPAL.PRACTITIONER_REMOVE_FROM_PROGRAMME,
                      {
                        practitionerId: practitioner?.userId,
                      }
                    )
                  }
                >
                  {renderIcon(
                    'TrashIcon',
                    'w-5 h-5 color-white text-white mr-1'
                  )}
                  <Typography
                    type="body"
                    className="mr-4"
                    color="white"
                    text={'Remove practitioner'}
                  ></Typography>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </BannerWrapper>
  );
};
