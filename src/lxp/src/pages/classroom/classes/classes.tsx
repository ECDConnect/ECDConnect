import { practitionerSelectors } from '@/store/practitioner';
import { getAvatarColor, useDialog } from '@ecdlink/core';
import {
  DialogPosition,
  FADButton,
  StackedList,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ClassMenu } from './components/class-menu';

export const Classes = () => {
  const [addChildButtonExpanded, setAddChildButtonExpanded] =
    useState<boolean>(true);

  const dialog = useDialog();

  const practitioner = useSelector(practitionerSelectors?.getPractitioner);

  const isPrincipal = !!practitioner?.isPrincipal;

  const onScroll = (scrollTop: number) => {
    if (scrollTop < 30) {
      setAddChildButtonExpanded(true);
    } else {
      setAddChildButtonExpanded(false);
    }
  };

  const onClassClick = (id: string) => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => (
        <ClassMenu isPrincipal={isPrincipal} classId={id} onClose={onClose} />
      ),
    });
  };

  const classes: UserAlertListDataItem[] = [
    {
      title: 'Class 1',
      profileText: 'C1',
      subTitle: '{practitionerName}, {count} children',
      alertSeverity: 'none',
      avatarColor: getAvatarColor(),
      iconColor: 'secondary',
      hideAlertSeverity: true,
      onActionClick: () => onClassClick('{id}'),
    },
  ];

  return (
    <div className="p-4 pt-6">
      <StackedList
        type="UserAlertList"
        listItems={classes}
        onScroll={onScroll}
      />
      {isPrincipal && (
        <FADButton
          title="Add a class"
          icon="PlusIcon"
          iconDirection="left"
          textToggle={addChildButtonExpanded}
          type="filled"
          color="quatenary"
          shape={'round'}
          className="absolute bottom-6 right-0 z-10 m-3 px-3.5 py-2.5"
          // TODO: Implement onClick
          click={() => {}}
        />
      )}
    </div>
  );
};
