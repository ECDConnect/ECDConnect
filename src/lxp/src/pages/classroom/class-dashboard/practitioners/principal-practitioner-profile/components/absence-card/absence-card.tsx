import { PractitionerDto } from '@ecdlink/core';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import { Button, Card, Typography, renderIcon } from '@ecdlink/ui';
import { add, format, isPast, isSameDay } from 'date-fns';

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
  handleAbsenceModal: (item: AbsenteeDto) => void;
  practitionerUserId: string;
  classesWithAbsence?: AbsenteeDto[];
  practitionerAbsentees?: AbsenteeDto[];
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
  classesWithAbsence,
  practitionerAbsentees,
}) => {
  const call = () => {
    window.open(`tel:${practitioner?.user?.phoneNumber}`);
  };

  return (
    <>
      {classesWithAbsence && classesWithAbsence?.length > 0 ? (
        classesWithAbsence?.map((item: AbsenteeDto) => {
          const practitionerAbsenteeClasses = practitionerAbsentees?.filter(
            (absence) => absence?.absentDate === item?.absentDate
          );

          const isAbsenceToday = isSameDay(
            new Date(),
            new Date(item?.absentDate as string)
          );
          const itemIsLeave = item?.absentDate !== item?.absentDateEnd;
          if (isAbsenceToday) {
            return (
              <>
                <Card className={'bg-uiBg mt-4 w-11/12 rounded-xl'}>
                  <div className={'p-4'}>
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
                        text={`${item?.reason}`}
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
                            handleComebackDay(item?.absentDateEnd as Date)
                          ),
                          'd MMM yyyy'
                        )}`}
                        className={'mt-4'}
                      />
                    </div>
                    {practitionerAbsenteeClasses &&
                      practitionerAbsenteeClasses?.length > 0 &&
                      practitionerAbsenteeClasses?.map((item2) => {
                        return (
                          <div className="flex items-center gap-2">
                            <Typography
                              type={'body'}
                              color="textMid"
                              weight="bold"
                              text={
                                item2?.className &&
                                `${item2?.className} class reassigned to:`
                              }
                              className={'mt-4 ml-4'}
                            />
                            <Typography
                              type={'body'}
                              color="textMid"
                              text={`${item2?.reassignedToPerson}`}
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
                        onClick={() => handleAbsenceModal(item)}
                      >
                        {renderIcon(
                          'PencilAltIcon',
                          'w-5 h-5 color-white text-white mr-1'
                        )}
                        <Typography
                          type="body"
                          className="mr-4"
                          color="white"
                          text={itemIsLeave ? 'Edit leave' : 'Edit absence'}
                        ></Typography>
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            );
          }

          if (isOnLeave) {
            return (
              <>
                <Card className={'bg-uiBg mt-4 w-11/12 rounded-xl'}>
                  <div className={'p-4'}>
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
                          new Date(item?.absentDate as Date),
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
                            handleComebackDay(item?.absentDateEnd as Date)
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
                        text={`${item?.reason}`}
                        className={'mt-4'}
                      />
                    </div>
                    {practitionerAbsenteeClasses &&
                      practitionerAbsenteeClasses?.length > 0 &&
                      practitionerAbsenteeClasses?.map((item2) => {
                        return (
                          <div className="flex items-center gap-2">
                            <Typography
                              type={'body'}
                              color="textMid"
                              weight="bold"
                              text={
                                item2?.className &&
                                `${item2?.className} class reassigned to:`
                              }
                              className={'mt-4 ml-4'}
                            />
                            <Typography
                              type={'body'}
                              color="textMid"
                              text={`${item2?.reassignedToPerson}`}
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
                        onClick={() => handleAbsenceModal(item)}
                      >
                        {renderIcon(
                          'PencilAltIcon',
                          'w-5 h-5 color-white text-white mr-1'
                        )}
                        <Typography
                          type="body"
                          className="mr-4"
                          color="white"
                          text={itemIsLeave ? 'Edit leave' : 'Edit absence'}
                        ></Typography>
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            );
          }

          if (!isOnLeave && item?.absentDate === item?.absentDateEnd) {
            return (
              <>
                <Card className={'bg-uiBg mt-4 w-11/12 rounded-xl'}>
                  <div className={'p-4'}>
                    <Typography
                      type={'h1'}
                      color="textDark"
                      text={`${
                        practitioner?.user?.firstName
                      } will be absent on ${
                        item?.absentDate &&
                        format(new Date(item?.absentDate as string), 'EEEE')
                      }, ${
                        item?.absentDate &&
                        format(new Date(item?.absentDate as string), 'd MMM')
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
                        text={`${item?.reason}`}
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
                          item?.absentDateEnd &&
                          format(
                            new Date(
                              handleComebackDay(item?.absentDateEnd as Date)
                            ),
                            'd MMM yyyy'
                          )
                        }`}
                        className={'mt-4'}
                      />
                    </div>
                    {practitionerAbsenteeClasses &&
                      practitionerAbsenteeClasses?.length > 0 &&
                      practitionerAbsenteeClasses?.map((item2) => {
                        return (
                          <div className="flex items-center gap-2">
                            <Typography
                              type={'body'}
                              color="textMid"
                              weight="bold"
                              text={
                                item2?.className &&
                                `${item2?.className} class reassigned to:`
                              }
                              className={'mt-4 ml-4'}
                            />
                            <Typography
                              type={'body'}
                              color="textMid"
                              text={
                                item2?.reassignedToPerson &&
                                `${item2?.reassignedToPerson}`
                              }
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
                        onClick={() => handleAbsenceModal(item)}
                      >
                        {renderIcon(
                          'PencilAltIcon',
                          'w-5 h-5 color-white text-white mr-1'
                        )}
                        <Typography
                          type="body"
                          className="mr-4"
                          color="white"
                          text={itemIsLeave ? 'Edit leave' : 'Edit absence'}
                        ></Typography>
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            );
          }

          return (
            <>
              {item && (
                <Card className={'bg-uiBg mt-4 w-11/12 rounded-xl'}>
                  <div className={'p-4'}>
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
                          new Date(item?.absentDate as Date),
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
                            handleComebackDay(item?.absentDateEnd as Date)
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
                        text={`${item?.reason}`}
                        className={'mt-4'}
                      />
                    </div>
                    {practitionerAbsenteeClasses &&
                      practitionerAbsenteeClasses?.length > 0 &&
                      practitionerAbsenteeClasses?.map((item2) => {
                        return (
                          <div className="flex items-center gap-2">
                            <Typography
                              type={'body'}
                              color="textMid"
                              weight="bold"
                              text={
                                item2?.className &&
                                `${item2?.className} class reassigned to:`
                              }
                              className={'mt-4 ml-4'}
                            />
                            <Typography
                              type={'body'}
                              color="textMid"
                              text={`${item2?.reassignedToPerson}`}
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
                        onClick={() => handleAbsenceModal(item)}
                      >
                        {renderIcon(
                          'PencilAltIcon',
                          'w-5 h-5 color-white text-white mr-1'
                        )}
                        <Typography
                          type="body"
                          className="mr-4"
                          color="white"
                          text={itemIsLeave ? 'Edit leave' : 'Edit absence'}
                        ></Typography>
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </>
          );
        })
      ) : (
        <div className="flex w-full justify-center">
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
