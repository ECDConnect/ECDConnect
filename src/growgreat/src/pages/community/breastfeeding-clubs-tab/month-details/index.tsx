import {
  MonthData,
  getPointsDetails,
} from '@/utils/community/breastfeeding-clubs.utils';
import { BreastFeedingClubDto, withScrollToTop } from '@ecdlink/core';
import {
  Alert,
  AlertProps,
  BannerWrapper,
  Button,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { format } from 'date-fns';

interface MonthDetailsProps {
  monthData: MonthData;
  onBack: () => void;
}
const Component = ({ monthData, onBack }: MonthDetailsProps) => {
  const date = new Date(monthData.year, monthData.month, 1);

  const month = format(date, 'MMMM');

  const titleMonth = `${month} breastfeeding clubs`;

  const sortedData = monthData?.data?.sort(
    (a, b) =>
      new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime()
  );

  const { points, colour, breastfeedingClubsLength } = getPointsDetails(
    monthData.data
  );

  const getBreastFeedingClubFeedback = (
    data: BreastFeedingClubDto
  ): { title: string; type: AlertProps['type'] } => {
    if (data.clients.length >= 4 && data.clients.length <= 6) {
      return { title: 'clients attended - great!', type: 'success' };
    }

    return {
      title:
        'clients attended - make sure at least 4 and no more than 6 clients attend.',
      type: 'warning',
    };
  };

  return (
    <BannerWrapper
      title={titleMonth}
      onBack={onBack}
      renderBorder
      renderOverflow
      className="px-4 pt-6 pb-0"
    >
      <div className="flex h-full flex-col ">
        <Typography type="h2" text={titleMonth} className="mb-5" />
        <Alert
          type={colour.toLowerCase() as AlertProps['type']}
          leftChip={String(breastfeedingClubsLength ?? 0)}
          title="breastfeeding clubs with 4 to 6 clients attending"
          titleColor="textDark"
          rightChip={`+${points}`}
        />
        <Alert
          className="my-4 flex items-center justify-center"
          type="info"
          title="Try to have at least 4 breastfeeding clubs each month!"
          list={[
            'To earn 200 points, make sure 4 to 6 clients attend each club.',
          ]}
        />
        {!!sortedData?.length && <Divider dividerType="dashed" />}
        {sortedData?.map((item, index) => {
          const { title, type } = getBreastFeedingClubFeedback(item);

          return (
            <div
              key={item.id}
              className={`mt-6 ${
                sortedData.length - 1 === index ? 'mb-6' : ''
              }`}
            >
              <Typography
                type="h3"
                color="textDark"
                text={`${format(
                  new Date(item.meetingDate),
                  'dd MMMM yyyy'
                )} client attended`}
              />
              <Alert
                type={type}
                leftChip={String(item?.clients?.length ?? 0)}
                title={title}
                titleColor="textDark"
              />
            </div>
          );
        })}
        <div className="mt-auto w-full">
          <Button
            className="w-full"
            type="outlined"
            textColor="primary"
            color="primary"
            text="Close"
            icon="XCircleIcon"
            onClick={onBack}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};

export const MonthDetails = withScrollToTop(Component);
