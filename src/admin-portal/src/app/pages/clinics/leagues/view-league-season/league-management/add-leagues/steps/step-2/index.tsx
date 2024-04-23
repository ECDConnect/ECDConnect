import {
  DistrictLeagues,
  LeagueIdEnum,
  LeagueInputModelInput,
  SimpleClinicDto,
  usePrevious,
} from '@ecdlink/core';
import {
  Button,
  FormInput,
  SearchDropDownOption,
  Table,
  Typography,
} from '@ecdlink/ui';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Irow } from 'react-tailwind-table';
import ROUTES from '../../../../../../../../routes/app.routes-constants';
import { AddLeaguesRouteState } from '../../types';

interface Step2Props {
  currentLeagueData?: LeagueInputModelInput;
  district: DistrictLeagues;
  leagueNumber: number;
  availableClinics: DistrictLeagues['unassignedClinics'];
  onChange: (league: { [league: string]: LeagueInputModelInput }) => void;
}

export const Step2 = ({
  availableClinics,
  currentLeagueData,
  district,
  leagueNumber,
  onChange: onUpdate,
}: Step2Props) => {
  const [selectedRows, setSelectedRows] = useState<Irow[]>([]);
  const [leagueName, setLeagueName] = useState('');
  const [search, setSearch] = useState<string>('');
  const [subDistrictFilter, setSubDistrictFilter] =
    useState<SearchDropDownOption<string>[]>();

  const previousLeagueNumber = usePrevious(leagueNumber);
  const previousLeagueData = usePrevious(currentLeagueData);

  const history = useHistory();

  const { state } = useLocation<AddLeaguesRouteState>();

  const isToAddSuperLeagues = state?.leagueType === LeagueIdEnum.SuperLeague;

  const columns: Icolumn[] = [
    {
      field: 'id',
      use: 'Unique ID',
    },
    {
      field: 'name',
      use: 'Name',
    },
    {
      field: 'teamLead',
      use: 'Team Lead(s)',
    },
    {
      field: 'subDistrict',
      use: 'Sub-district',
    },
  ];

  const title = useMemo(() => {
    if (!!state?.leagueToEdit) {
      return leagueName;
    }
    if (isToAddSuperLeagues) {
      return 'Super League';
    }

    return `League ${leagueNumber}`;
  }, [isToAddSuperLeagues, leagueName, leagueNumber, state?.leagueToEdit]);

  const searchedClinics = useMemo(
    () =>
      availableClinics?.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(search.toLowerCase()) ||
          clinic.id.toLowerCase().includes(search.toLowerCase())
      ) ?? [],
    [availableClinics, search]
  );

  const transformClinic = (clinic: SimpleClinicDto, index: number) => ({
    key: index,
    id: clinic.id,
    name: clinic.name,
    teamLead:
      clinic.teamLeads
        ?.map((lead) => `${lead.firstName} ${lead.surname}`)
        .join(', ') || '-',
    subDistrict: clinic.subDistrictName || '-',
  });

  const rows = useMemo(() => {
    const clinics = search ? searchedClinics : availableClinics;

    if (!subDistrictFilter?.length) {
      return clinics.map(transformClinic);
    }

    return clinics
      .filter((clinic) =>
        subDistrictFilter.some((filter) => clinic.subDistrictName === filter.id)
      )
      .map(transformClinic);
  }, [availableClinics, search, searchedClinics, subDistrictFilter]);

  const league: LeagueInputModelInput = useMemo(
    () => ({
      clinicIds: selectedRows.map((row) => row.id),
      ...(state?.districtId && { districtId: district.id }),
      name: leagueName,
      typeId: state?.leagueType,
    }),
    [district, leagueName, selectedRows, state]
  );

  const leagueKey = `league-${previousLeagueNumber ?? leagueNumber}`;

  const uniqueSubDistrictNames = new Set(
    availableClinics?.map((clinic) => clinic.subDistrictName)
  );

  const optionsSubDistricts = Array.from(uniqueSubDistrictNames).map(
    (name) => ({
      id: name,
      label: name,
      value: name,
    })
  );

  const onChangeName = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = event.target.value;
    setLeagueName(name);
    onUpdate({ [leagueKey]: { ...league, name } });
  };

  const onChangeSelectedRows = (newRows: Irow[]) => {
    const formattedRows = rows?.filter((currentRow) =>
      newRows.some((r) => r.id === currentRow.id)
    );

    setSelectedRows(formattedRows);
    onUpdate({
      [leagueKey]: {
        ...league,
        clinicIds: formattedRows?.map((row) => row.id),
      },
    });
  };

  useEffect(() => {
    if (
      previousLeagueNumber !== leagueNumber ||
      (!!state?.leagueToEdit &&
        previousLeagueData === undefined &&
        currentLeagueData !== undefined)
    ) {
      setLeagueName(currentLeagueData?.name ?? '');
      setSelectedRows(
        rows.filter((clinic) =>
          currentLeagueData?.clinicIds.includes(clinic.id)
        ) || []
      );
      onUpdate({ [leagueKey]: league });
    }
  }, [
    previousLeagueNumber,
    leagueNumber,
    currentLeagueData,
    rows,
    onUpdate,
    leagueKey,
    league,
    previousLeagueData,
    state?.leagueToEdit,
  ]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Typography
            type="h1"
            color="textDark"
            text={`Add clinics to ${title}`}
            className="mt-9"
          />
          <Typography
            type="body"
            color="textMid"
            text="Select the clinics you want to add to each league. You can use the filters or search to find a specific clinic."
            className="mb-7"
          />
        </div>
        <Button
          className="rounded-xl px-4 shadow-none"
          icon="XIcon"
          text="Cancel"
          type="filled"
          color="errorBg"
          textColor="tertiary"
          iconPosition="end"
          onClick={() =>
            history.push(ROUTES.CLINICS.LEAGUES.LEAGUE_MANAGEMENT.ROOT, {
              startDate: state?.startDate,
              endDate: state?.endDate,
            } as AddLeaguesRouteState)
          }
        />
      </div>
      <form className="rounded-2xl bg-white p-7">
        <Typography type="h2" color="textDark" text={title} className="mb-4" />
        <FormInput
          isAdminPortalField
          className="w- mb-11 mt-8"
          label="Name the league *"
          hint="Must be no more than 30 characters."
          placeholder="Add a name..."
          value={leagueName}
          onChange={onChangeName}
          {...(!!leagueName && { maxCharacters: 30 })}
        />
        <Table
          key={leagueNumber}
          multiSelect
          columns={columns}
          rows={rows}
          selectedRows={selectedRows}
          search={{
            placeholder: 'Search by unique ID or clinic name...',
            value: search,
            onChange: (e) => setSearch(e.target.value),
          }}
          filters={[
            {
              multiple: true,
              type: 'search-dropdown',
              menuItemClassName: 'mt-80 mx-16 w-10/12',
              placeholder: 'Sub-district',
              options: optionsSubDistricts,
              selectedOptions: subDistrictFilter,
              onChange: (e) => setSubDistrictFilter(e),
            },
          ]}
          onChangeSelectedRows={onChangeSelectedRows}
          onClearFilters={() => setSubDistrictFilter([])}
          noContentText="All clinics are assigned to a group, or your filters may be hiding available clinics. To add clinics to this league, try adjusting your filters or remove clinics from another league to make them available."
        />
      </form>
      {!!selectedRows.length && (
        <>
          <Typography
            className="mt-9"
            type="h4"
            text={`Selected clinics for ${leagueName ?? ''} league:`}
          />
          <ul className="text-textMid ml-6 list-disc">
            {selectedRows.map((row) => (
              <li key={row.id}>
                {row.name}, {row.subDistrict}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};
