import { useMutation } from '@apollo/client';
import { NOTIFICATION, PortalLeagueDto, useNotifications } from '@ecdlink/core';
import { Clinic, AddClinicToLeague } from '@ecdlink/graphql';
import { Alert, Button, Divider, Dropdown, Typography } from '@ecdlink/ui';
import { useState } from 'react';

export interface AssignClinicsToALeagueProps {
  unassignedClinics: Clinic[];
  leagues: PortalLeagueDto[];
  onClose: () => void;
}

type LeagueId = string;

export const AssignClinicsToALeague = ({
  unassignedClinics,
  leagues,
  onClose,
}: AssignClinicsToALeagueProps) => {
  const [assignedClinics, setAssignedClinics] = useState<{
    [clinicId: string]: LeagueId;
  }>({});
  console.log('unassignedClinics', unassignedClinics);
  const { setNotification } = useNotifications();

  const [addClinicToLeague, { loading: addingClinic }] =
    useMutation(AddClinicToLeague);

  const getLeaguesInDistrict = (districtId: string) => {
    return leagues
      ?.filter((league) => league.districtId === districtId)
      ?.map((league) => ({
        value: league.id,
        label: league.name,
      }));
  };

  const onChange = (clinicId: string, leagueId: string) => {
    setAssignedClinics((prevState) => ({
      ...prevState,
      [clinicId]: leagueId,
    }));
  };

  const onSave = async () => {
    const clinicPromises = Object.entries(assignedClinics).map(
      ([clinicId, leagueId]) => ({
        clinicId,
        promise: addClinicToLeague({
          variables: {
            clinicId,
            leagueId,
          },
        }),
      })
    );

    try {
      const results = await Promise.allSettled(
        clinicPromises.map((item) => item.promise)
      );

      const failedClinics = [];

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          failedClinics.push(clinicPromises[index].clinicId);
        }
      });

      if (failedClinics.length > 0) {
        const clinicNames = failedClinics
          .map(
            (clinicId) =>
              unassignedClinics.find((clinic) => clinic.id === clinicId)?.name
          )
          .join(', ');

        const isAllClinicsFailed =
          failedClinics.length === clinicPromises.length;

        setNotification({
          title: isAllClinicsFailed
            ? 'Failed to assign clinics to league'
            : 'Some clinics failed to be added to league!',
          message: isAllClinicsFailed
            ? ''
            : `Failed to assign clinics to league: ${clinicNames}`,
          variant: isAllClinicsFailed ? NOTIFICATION.ERROR : NOTIFICATION.ALERT,
          timeout: 10000,
        });
      } else {
        setNotification({
          title: `${results.length} clinic(s) added to league!`,
          variant: NOTIFICATION.SUCCESS,
        });
      }
    } catch (error) {
      setNotification({
        title: 'Failed to assign clinics to league',
        message: error,
        variant: NOTIFICATION.ERROR,
      });
    } finally {
      onClose();
    }
  };

  return (
    <>
      <Typography type="help" color="textMid" text="Step 1 of 1" />
      <Divider dividerType="dashed" className="mt-5 mb-9" />
      <Alert
        className="rounded-2xl"
        type="warning"
        title="At this stage, clinics can only be added to existing leagues within their district."
      />
      {unassignedClinics?.map((clinic) => (
        <Dropdown
          key={clinic.id}
          placeholder="Select a league"
          fillColor="adminPortalBg"
          className="mt-4"
          label={`Add ${clinic.name} (${
            clinic?.subDistrict?.name ?? ''
          }) to a league *`}
          selectedValue={assignedClinics?.[clinic.id]}
          onChange={(leagueId) => onChange(clinic.id, leagueId)}
          list={getLeaguesInDistrict(clinic?.subDistrict?.district?.id ?? '')}
        />
      ))}
      <Button
        className="mt-4 w-full rounded-2xl"
        icon="SaveIcon"
        type="filled"
        color="secondary"
        textColor="white"
        text="Save"
        isLoading={addingClinic}
        disabled={
          addingClinic ||
          Object.keys(assignedClinics).length !== unassignedClinics.length
        }
        onClick={onSave}
      />
    </>
  );
};
