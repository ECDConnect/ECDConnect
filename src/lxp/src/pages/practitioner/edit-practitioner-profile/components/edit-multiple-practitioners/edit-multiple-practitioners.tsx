import React from 'react';
import { Typography, Divider, StackedList, Button } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
export default function EditMultiplePractitioners({ onSubmit }: any) {
  const user = useSelector(userSelectors.getUser);
  console.log(user);
  return (
    <div className="pt-4">
      <div className="flex flex-col gap-4 pb-20">
        <div>
          <Typography
            type={'h2'}
            text={'Confirm practitioners'}
            color={'textDark'}
          />
          <Typography
            type={'h4'}
            text={'You can only add SmartStart practitioners to Funda App.'}
            color={'textMid'}
          />
        </div>

        <div>
          <Divider className="-my-1" dividerType="dashed" />
          <StackedList
            listItems={[
              {
                title: user?.fullName ?? '',
                subTitle: 'Principal/owner',
                titleStyle:
                  'text-textDark font-body text-base font-semibold leading-snug ',
                subTitleStyle: 'text-textMid font-body text-sm leading-5 ',
              },
            ]}
            onClick={() => console.log('clicked')}
            type={'ActionList'}
          />
        </div>

        <div>
          <Button
            size="small"
            type="filled"
            color="primary"
            text="Add practitioner"
            textColor="white"
            icon="PlusIcon"
            onClick={() => console.log('create practitioner')}
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 max-h-20 bg-white">
        <Button
          size="normal"
          className="w-full"
          type="filled"
          color="quatenary"
          text="Confirm"
          textColor="white"
          icon="CheckCircleIcon"
          onClick={() => onSubmit('sending data to the backend')}
        />
      </div>
    </div>
  );
}
