import {
  MenuListDataItem,
  StackedList,
  StackedListType,
  Typography,
} from '@ecdlink/ui';
import Trophy from '../../../../assets/trophy.svg';
import { useHistory } from 'react-router';
import ROUTES from '../../../routes/app.routes-constants';

export const Leagues = () => {
  const history = useHistory();
  const leagues: MenuListDataItem[] = [1, 2, 3].map((item) => ({
    title: `League ${item}`,
    subTitle: '{description}',
    id: 'league1',
    backgroundColor: 'white',
    menuIconUrl: Trophy,
    iconBackgroundColor: 'secondary',
    iconColor: 'white',
    showIcon: true,
    className: 'border-b border-gray-200',
    titleStyle: 'text-lg text-textMid font-semibold',
    subTitleStyle: 'text-sm text-textLight',
    onActionClick: () =>
      history.push(ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ROOT),
  }));

  return (
    <>
      <Typography
        type="h1"
        text="Choose a league"
        color="textMid"
        className="mb-8"
      />
      <StackedList type={'MenuList' as StackedListType} listItems={leagues} />
    </>
  );
};
