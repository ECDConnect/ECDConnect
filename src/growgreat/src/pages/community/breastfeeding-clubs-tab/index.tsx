import { Button, Divider, LoadingSpinner, Typography } from '@ecdlink/ui';
import { NoCommunityFound } from '../0-components/no-community-found';
import { getCommunityQuarterDescription } from '@/utils/community/community-quartes.utils';
import { useWindowSize } from '@reach/window-size';
import { format } from 'date-fns';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { CommunityRouteState } from '../community.types';
import { COMMUNITY_TABS } from '../community';

export const BreastfeedingClubsTab: React.FC = () => {
  const { height } = useWindowSize();

  const history = useHistory();

  const isLoading = false;

  const headerHeight = 120;

  const today = new Date();
  const year = today.getFullYear();

  const { quarter } = getCommunityQuarterDescription(today);

  const startMonth = new Date(year, quarter.startMonth, 1);
  const endMonth = new Date(year, quarter.endMonth, 1);

  const title = `${format(startMonth, 'MMM')} ${year - 1} to ${format(
    endMonth,
    'MMM'
  )} ${year}`;

  if (isLoading) {
    return (
      <LoadingSpinner
        className="mt-6"
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
      />
    );
  }

  if (false) {
    return <NoCommunityFound />;
  }

  return (
    <div
      className="overflow-auto p-4 pt-6"
      style={{ height: height - headerHeight }}
    >
      <div className="flex h-full flex-col">
        <Typography type="h2" text={title} />
        <Typography
          type="h4"
          color="textDark"
          text="Past breastfeeding clubs:"
          className="mt-7 mb-5"
        />

        <div className={`mt-auto flex flex-col gap-4`}>
          <Divider dividerType="dashed" className="mb-2" />
          <Button
            icon="PlusCircleIcon"
            type="filled"
            textColor="white"
            color="primary"
            text="Add a breastfeeding club"
            onClick={() => {}}
          />
          <Button
            className="mb-4"
            icon="ArrowCircleLeftIcon"
            type="outlined"
            textColor="primary"
            color="primary"
            text="Back to team"
            onClick={() =>
              history.push(ROUTES.COMMUNITY.ROOT, {
                activeTabIndex: COMMUNITY_TABS.TEAM,
              } as CommunityRouteState)
            }
          />
        </div>
      </div>
    </div>
  );
};
