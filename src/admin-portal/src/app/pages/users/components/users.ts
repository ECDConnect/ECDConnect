import { PractitionerDto, UserDto } from '@ecdlink/core';
import { TabItem } from '@ecdlink/ui';

export const defaultTabItems = [
  {
    title: 'Profile',
    initActive: true,
  },
];

export const profile = {
  imageUrl:
    'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
};

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export interface UserPanelProps {
  user: UserDto;
  showPasswordReset?: false;
  closeDialog: (value: boolean) => void;
}

export interface UserPanelCreateProps {
  closeDialog: (value: boolean) => void;
  setFormIsDirty?: (value: boolean) => void;
  practitioners?: PractitionerDto[];
}

export interface UserPanelSaveProps {
  user?: UserDto;
  disabled: boolean;
  onSave: () => void;
  isLoading?: boolean;
}

export interface UserPanelTabsProps {
  currentTab: TabItem;
  userTabs: TabItem[];
  onTabSelected: (tab: TabItem) => void;
}

export enum UserTypeViewEnum {
  Coach = 'Coach',
  Principal = 'Principal',
  Practitioner = 'Practitioner',
  Child = 'Child',
}
