import { PractitionerDto } from '@ecdlink/core';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import { Button, Card, Typography, renderIcon } from '@ecdlink/ui';
import { format } from 'date-fns';
import { useMemo } from 'react';

interface AbsenceCardProps {
  absenceIsToday: boolean;
  currentAbsentee: AbsenteeDto;
  handleComebackDay: (date: Date) => Date;
  practitioner: PractitionerDto;
  isOnLeave: boolean;
  isLeave: boolean;
  allAbsenteeClasses?: AbsenteeDto[];
  handleReassignClass: (
    practitionerId: string,
    allAbsenteeClasses?: AbsenteeDto[]
  ) => void;
  handleAbsenceModal: () => void;
  practitionerUserId: string;
}

export const AbsenceCard: React.FC<AbsenceCardProps> = ({
  absenceIsToday,
  currentAbsentee,
  handleComebackDay,
  practitioner,
  isOnLeave,
  handleReassignClass,
  handleAbsenceModal,
  isLeave,
  allAbsenteeClasses,
  practitionerUserId,
}) => {
  const renderCardHeader = useMemo(() => {
    if (absenceIsToday) {
      return (
        <>
          <Typography
            type={'h1'}
            color="textDark"
            text={`${practitioner?.user?.firstName} is absent today`}
            className={'mt-6 ml-4'}
          />
          <div className="flex items-center gap-2">
            <Typography
              type={'body'}
              color="textMid"
              weight="bold"
              text={`Reason:`}
              className={'mt-4 ml-4'}
            />
            <Typography
              type={'body'}
              color="textMid"
              text={`${currentAbsentee?.reason}`}
              className={'mt-4'}
            />
          </div>
          <div className="flex items-center gap-2">
            <Typography
              type={'body'}
              color="textMid"
              weight="bold"
              text={`${practitioner?.user?.firstName} will be back on:`}
              className={'mt-4 ml-4'}
            />
            <Typography
              type={'body'}
              color="textMid"
              text={`${format(
                new Date(
                  handleComebackDay(currentAbsentee?.absentDateEnd as Date)
                ),
                'd MMM yyyy'
              )}`}
              className={'mt-4'}
            />
          </div>
        </>
      );
    }

    if (isOnLeave) {
      return (
        <>
          <Typography
            type={'h1'}
            color="textDark"
            text={`${practitioner?.user?.firstName} is on leave`}
            className={'mt-6 ml-4'}
          />
          <div className="flex items-center gap-2">
            <Typography
              type={'body'}
              color="textMid"
              weight="bold"
              text={`Start date:`}
              className={'mt-4 ml-4'}
            />
            <Typography
              type={'body'}
              color="textMid"
              text={`${format(
                new Date(
                  handleComebackDay(currentAbsentee?.absentDate as Date)
                ),
                'd MMM yyyy'
              )}`}
              className={'mt-4'}
            />
          </div>
          <div className="flex items-center gap-2">
            <Typography
              type={'body'}
              color="textMid"
              weight="bold"
              text={`End date:`}
              className={'mt-4 ml-4'}
            />
            <Typography
              type={'body'}
              color="textMid"
              text={`${format(
                new Date(
                  handleComebackDay(currentAbsentee?.absentDateEnd as Date)
                ),
                'd MMM yyyy'
              )}`}
              className={'mt-4'}
            />
          </div>
          <div className="flex items-center gap-2">
            <Typography
              type={'body'}
              color="textMid"
              weight="bold"
              text={`Reason:`}
              className={'mt-4 ml-4'}
            />
            <Typography
              type={'body'}
              color="textMid"
              text={`${currentAbsentee?.reason}`}
              className={'mt-4'}
            />
          </div>
        </>
      );
    }

    if (
      !isOnLeave &&
      currentAbsentee?.absentDate === currentAbsentee?.absentDateEnd
    ) {
      return (
        <>
          <Typography
            type={'h1'}
            color="textDark"
            text={`${practitioner?.user?.firstName} will be absent on ${
              currentAbsentee?.absentDate &&
              format(new Date(currentAbsentee?.absentDate as string), 'EEEE')
            }, ${
              currentAbsentee?.absentDate &&
              format(new Date(currentAbsentee?.absentDate as string), 'd MMM')
            }`}
            className={'mt-6 ml-4'}
          />
          <div className="flex items-center gap-2">
            <Typography
              type={'body'}
              color="textMid"
              weight="bold"
              text={`Reason:`}
              className={'mt-4 ml-4'}
            />
            <Typography
              type={'body'}
              color="textMid"
              text={`${currentAbsentee?.reason}`}
              className={'mt-4'}
            />
          </div>
          <div className="flex items-center gap-2">
            <Typography
              type={'body'}
              color="textMid"
              weight="bold"
              text={`${practitioner?.user?.firstName} will be back on:`}
              className={'mt-4 ml-4'}
            />
            <Typography
              type={'body'}
              color="textMid"
              text={`${
                currentAbsentee?.absentDateEnd &&
                format(
                  new Date(
                    handleComebackDay(currentAbsentee?.absentDateEnd as Date)
                  ),
                  'd MMM yyyy'
                )
              }`}
              className={'mt-4'}
            />
          </div>
        </>
      );
    }

    return (
      <>
        <Typography
          type={'h1'}
          color="textDark"
          text={`${practitioner?.user?.firstName} will be on leave`}
          className={'mt-6 ml-4'}
        />
        <div className="flex items-center gap-2">
          <Typography
            type={'body'}
            color="textMid"
            weight="bold"
            text={`Start date:`}
            className={'mt-4 ml-4'}
          />
          <Typography
            type={'body'}
            color="textMid"
            text={`${format(
              new Date(handleComebackDay(currentAbsentee?.absentDate as Date)),
              'd MMM yyyy'
            )}`}
            className={'mt-4'}
          />
        </div>
        <div className="flex items-center gap-2">
          <Typography
            type={'body'}
            color="textMid"
            weight="bold"
            text={`End date:`}
            className={'mt-4 ml-4'}
          />
          <Typography
            type={'body'}
            color="textMid"
            text={`${format(
              new Date(
                handleComebackDay(currentAbsentee?.absentDateEnd as Date)
              ),
              'd MMM yyyy'
            )}`}
            className={'mt-4'}
          />
        </div>
        <div className="flex items-center gap-2">
          <Typography
            type={'body'}
            color="textMid"
            weight="bold"
            text={`Reason:`}
            className={'mt-4 ml-4'}
          />
          <Typography
            type={'body'}
            color="textMid"
            text={`${currentAbsentee?.reason}`}
            className={'mt-4'}
          />
        </div>
      </>
    );
  }, [
    absenceIsToday,
    currentAbsentee?.absentDate,
    currentAbsentee?.absentDateEnd,
    currentAbsentee?.reason,
    handleComebackDay,
    isOnLeave,
    practitioner?.user?.firstName,
  ]);

  return (
    <>
      {currentAbsentee ? (
        <Card className={'bg-uiBg mt-4 w-11/12 rounded-xl'}>
          <div className={'p-4'}>
            {renderCardHeader}
            {allAbsenteeClasses &&
              allAbsenteeClasses?.length > 0 &&
              allAbsenteeClasses?.map((item) => {
                return (
                  <div className="flex items-center gap-2">
                    <Typography
                      type={'body'}
                      color="textMid"
                      weight="bold"
                      text={`${item?.className} class reassigned to:`}
                      className={'mt-4 ml-4'}
                    />
                    <Typography
                      type={'body'}
                      color="textMid"
                      text={`${item?.reassignedToPerson}`}
                      className={'mt-4'}
                    />
                  </div>
                );
              })}

            <div className="flex justify-center">
              <Button
                type="filled"
                color="primary"
                className={'mt-6 mb-6 w-11/12 rounded-2xl'}
                onClick={() => handleAbsenceModal()}
              >
                {renderIcon(
                  'PencilAltIcon',
                  'w-5 h-5 color-white text-white mr-1'
                )}
                <Typography
                  type="body"
                  className="mr-4"
                  color="white"
                  text={isLeave ? 'Edit leave' : 'Edit absence'}
                ></Typography>
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div>
          <Card className={'bg-uiBg mt-4 w-11/12 rounded-xl'}>
            <div className={'mt-6 ml-4'}>
              <Typography
                type={'h1'}
                color="textDark"
                text={`Mark ${practitioner?.user?.firstName} absent`}
                className={'mt-6 ml-4'}
              />
              <Typography
                type={'body'}
                color="textMid"
                text={`Mark ${practitioner?.user?.firstName} absent and reassign classes to another practitioner if needed.`}
                className={'mt-4 ml-4'}
              />
              <div className="flex justify-center">
                <Button
                  type="filled"
                  color="primary"
                  className={'mt-6 mb-6 w-11/12 rounded-2xl'}
                  onClick={() => handleReassignClass(practitionerUserId)}
                >
                  {renderIcon(
                    'PencilAltIcon',
                    'w-5 h-5 color-white text-white mr-1'
                  )}
                  <Typography
                    type="body"
                    className="mr-4"
                    color="white"
                    text={'Record absence/leave'}
                  ></Typography>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
