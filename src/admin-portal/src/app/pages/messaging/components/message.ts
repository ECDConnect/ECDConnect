export const ssRoles = [
  {
    id: 'trainees',
    label: 'Trainees',
  },
  {
    id: 'practitioners_principals',
    label: 'Practitioners - principals',
  },
  {
    id: 'practitioners_non_principals',
    label: 'Practitioners - non-principals',
  },
  {
    id: 'coaches',
    label: 'Coaches',
  },
];

export const ggRoles = [
  {
    id: 'chw',
    label: 'CHWs',
  },
  {
    id: 'team_lead',
    label: 'Team Lead',
  },
];

export interface MessageRoleDto {
  id: string;
  label: string;
}
