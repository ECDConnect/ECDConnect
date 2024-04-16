import { Table } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { Icolumn, Irow } from 'react-tailwind-table';
import ROUTES from '../../../../../routes/app.routes-constants';

export const LeaguePerformance = () => {
  const history = useHistory();

  const columns: Icolumn[] = [
    {
      field: 'name',
      use: 'Name',
    },
    {
      field: 'type',
      use: 'Type',
    },
    {
      field: 'clinics',
      use: '# clinics',
    },
    {
      field: 'dateAdded',
      use: 'Date added',
    },
  ];

  const rows: Irow[] = [
    {
      name: 'Clinic 1',
      type: 'Type 1',
      clinics: 1,
      dateAdded: '2021-09-02',
    },
    {
      name: 'Clinic 2',
      type: 'Type 2',
      clinics: 2,
      dateAdded: '2021-09-02',
    },
    {
      name: 'Clinic 3',
      type: 'Type 3',
      clinics: 3,
      dateAdded: '2021-09-02',
    },
  ];

  return (
    <div className="mt-8 rounded-2xl bg-white p-12">
      <Table
        columns={columns}
        rows={rows}
        search={{
          placeholder: 'Search by league name',
          // TODO: implement search functionality
          onChange: (value) => console.log(value),
        }}
        filters={[
          {
            type: 'search-dropdown',
            placeholder: 'District',
            options: [],
          },
        ]}
        onClickRow={() =>
          history.push(ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.LEAGUE_DETAILS)
        }
      />
    </div>
  );
};
