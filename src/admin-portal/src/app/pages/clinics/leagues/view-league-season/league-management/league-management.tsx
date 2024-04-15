import {
  Button,
  MenuListDataItem,
  StackedList,
  StackedListType,
  Typography,
} from '@ecdlink/ui';

export const LeagueManagement = () => {
  const leagues: MenuListDataItem[] = [1, 2, 3].map((item) => ({
    title: `League ${item}`,
    subTitle: '{description}',
    id: 'league1',
    backgroundColor: 'white',
    iconBackgroundColor: 'secondary',
    iconColor: 'white',
    showIcon: true,
    className: 'border-b border-gray-200',
    titleStyle: 'text-lg text-textMid font-semibold',
    subTitleStyle: 'text-sm text-textLight',
  }));

  return (
    <>
      <Typography
        type="h1"
        text="{startDate} - {endDate} Leagues"
        color="textMid"
        className="my-8"
      />
      <Typography
        type="h2"
        text="Super Leagues"
        color="textMid"
        className="mt-9"
      />
      <Typography
        type="help"
        text="Click below to add a super league."
        color="textLight"
        className="mb-4"
      />
      <div className="rounded-2xl bg-white p-7">
        <Typography
          type="help"
          text="You haven’t added any super leagues yet."
          color="textLight"
          className="mb-4"
        />
        <Button
          type="filled"
          color="secondary"
          text="Add a super league"
          textColor="white"
          className="rounded-2xl px-16"
          icon="PlusCircleIcon"
        />
      </div>
      <Typography type="h2" text="Leagues" color="textMid" className="mt-9" />
      <Typography
        type="help"
        text="Click a district below to add leagues."
        color="textLight"
        className="mb-4"
      />
      <StackedList
        type={'MenuList' as StackedListType}
        listItems={leagues}
        className="rounded-2xl"
      />
    </>
  );
};
