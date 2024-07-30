export const ssRoles = [
  {
    id: 'practitioners_principals',
    label: 'Principals',
  },
  {
    id: 'practitioners_non_principals',
    label: 'Practitioners',
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
