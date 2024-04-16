import { FormInput, Table, Typography } from '@ecdlink/ui';
import { ChangeEvent, useState } from 'react';

export const Step2 = () => {
  const [leagueName, setLeagueName] = useState('');

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

  const rows = [];

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLeagueName(event.target.value);
  };

  return (
    <>
      <Typography
        type="h1"
        color="textDark"
        text="Add clinics to League {count}"
        className="mt-9"
      />
      <Typography
        type="body"
        color="textMid"
        text="Select the clinics you want to add to each league. You can use the filters or search to find a specific clinic."
        className="mb-7"
      />
      <form className="rounded-2xl bg-white p-7">
        <Typography
          type="h2"
          color="textDark"
          text="League {count}"
          className="mb-4"
        />
        <FormInput
          className="mb-11"
          label="Name the league *"
          hint="Must be no more than 30 characters."
          placeholder="Add a name..."
          value={leagueName}
          onChange={onChange}
          {...(!!leagueName && { maxCharacters: 30 })}
        />
        <Table columns={columns} rows={rows} />
      </form>
    </>
  );
};
