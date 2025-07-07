import { useQuery } from '@apollo/client';
import { GetAttendance } from '@ecdlink/graphql';
import { AttendanceDto } from '@ecdlink/core';
import { getAvatarColor } from '@ecdlink/core';
import { AcademicCapIcon } from '@heroicons/react/outline';
import { UserAvatar } from '@ecdlink/ui';
import { format } from 'date-fns';
import { ContentLoader } from '../../../../components/content-loader/content-loader';

export default function AttendanceWidget() {
  const { data } = useQuery(GetAttendance, {
    variables: {
      monthOfYear: new Date().getMonth() - 1,
      year: new Date().getFullYear(),
    },
  });

  let key = 0;

  if (data && data.attendance) {
    return (
      <div className={'py-4'}>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {data.attendance.map((attendance: AttendanceDto) => {
              ++key;
              return (
                <li
                  key={`${attendance.userId}${attendance.attendanceDate}${key}`}
                >
                  <div className="block hover:bg-gray-50">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <UserAvatar
                            size={'md'}
                            avatarColor={getAvatarColor()}
                            text={`${
                              attendance?.user?.firstName &&
                              attendance.user.firstName[0]
                            }${
                              attendance?.user?.surname &&
                              attendance.user.surname[0]
                            }`}
                            displayBorder
                          />
                        </div>
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p className="text-sm font-medium text-primary truncate">
                              {attendance.user?.firstName}{' '}
                              {attendance.user?.surname}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500">
                              <AcademicCapIcon
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <span className="truncate">
                                {
                                  attendance.classroomProgramme?.classroomGroup
                                    ?.name
                                }
                              </span>
                            </p>
                          </div>
                          <div className="hidden md:block">
                            <div>
                              <p className="text-sm text-gray-900">
                                {attendance.attendanceDate &&
                                  format(
                                    new Date(attendance.attendanceDate),
                                    'MM/dd/yyyy'
                                  )}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500">
                                {attendance.attended ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-successMain text-white">
                                    present
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-errorMain text-white">
                                    absent
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
