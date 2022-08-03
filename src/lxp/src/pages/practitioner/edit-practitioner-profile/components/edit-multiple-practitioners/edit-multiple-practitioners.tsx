import { SetStateAction, useCallback, useEffect, useState } from 'react';
import {
  Typography,
  Divider,
  StackedList,
  Button,
  ActionListDataItem,
  Card,
  Alert,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { AddOrRenamePractitioner } from './add-practitioner';
import { AddPractitionerModel } from '@/schemas/practitioner/add-practitioner';
import { useAppDispatch } from '@/store';
import {
  practitionerActions,
  practitionerSelectors,
} from '@/store/practitioner';
import { PractitionerDto } from '@ecdlink/core';

enum SetupPractitionersPage {
  confirmPractitioners = 1,
  addPractitioners = 2,
  editPractitioners = 3,
}

interface StackListItems extends ActionListDataItem {
  id: string;
}

export default function EditMultiplePractitioners({ onSubmit }: any) {
  const appDispatch = useAppDispatch();
  const user = useSelector(userSelectors.getUser);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const [currentPage, setCurrentPage] = useState(
    SetupPractitionersPage.confirmPractitioners
  );
  const [allInFundaApp, setAllInFundaApp] = useState<boolean>();
  const [editPractitioner, setEditPractitioner] =
    useState<AddPractitionerModel>();
  const [listItems, setListItems] = useState<StackListItems[]>([
    {
      title: user?.fullName ?? '',
      id: user?.idNumber ?? '',
      subTitle: 'Principal/owner',
      titleStyle:
        'text-textDark font-body text-base font-semibold leading-snug ',
      subTitleStyle: 'text-textMid font-body text-sm leading-5 ',
    },
  ]);

  useEffect(() => {
    const practitionerList = listItems.filter((i) => i.id !== user?.id);
    const practitionerIds = practitioners?.map((p) => p.user?.idNumber);
    const inFundaApp = practitionerList.length
      ? practitionerList.every((l) => practitionerIds?.includes(l.id))
      : undefined;
    setAllInFundaApp(inFundaApp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, listItems.length]);

  const createStackItem = useCallback(
    (data: AddPractitionerModel): StackListItems => {
      const isInFundaApp = practitioners?.find(
        (p) => p.user?.idNumber === data.id || data.passport
      );
      return {
        title: `${data.firstName} ${data.surname}`,
        id: data.id ?? data.passport,
        subTitle: isInFundaApp ? 'Practitioner' : 'Not on Funda App',
        titleStyle:
          'text-textDark font-body text-base font-semibold leading-snug ',
        subTitleStyle: `${
          isInFundaApp ? 'text-textMid' : 'text-alertDark'
        } font-body text-sm leading-5 `,
        actionName: 'Edit',
        actionIcon: 'PencilIcon',
        buttonType: 'filled',
        onActionClick() {
          setEditPractitioner(data);
          setCurrentPage(SetupPractitionersPage.editPractitioners);
        },
      };
    },
    [practitioners]
  );

  const handleAddOrEditPractitionerSubmit = (data: AddPractitionerModel) => {
    const indexToEdit = listItems.findIndex(
      (d) => d.id === editPractitioner?.id
    );

    if (indexToEdit > -1) {
      listItems.splice(indexToEdit, 1);
    }

    listItems.push(createStackItem(data));

    setListItems(listItems);
    setCurrentPage(SetupPractitionersPage.confirmPractitioners);
  };

  const handleConfirmPractitionerSubmit = () => {
    // const _l = listItems.map((l) => l.id);
    // const practitionerList = practitioners?.filter((p) => p.user?.idNumber && _l.includes(p.user?.idNumber)) || [];

    // appDispatch(practitionerActions.createPractitionersByPrincipal(practitionerList))
    console.log('add selected practitioners to the root state');
    onSubmit();
  };

  const renderPage = (page: SetupPractitionersPage) => {
    switch (page) {
      case SetupPractitionersPage.confirmPractitioners:
      default:
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
                  text={
                    'You can only add SmartStart practitioners to Funda App.'
                  }
                  color={'textMid'}
                />
              </div>

              {allInFundaApp !== undefined && (
                <div>
                  <Alert
                    type={allInFundaApp ? 'success' : 'error'}
                    title={
                      allInFundaApp
                        ? 'All practitioners at your programme are registered on Funda app.'
                        : 'One or more of your practitioners are not registered on Funda App. Ask all of your SmartStart practitioners to register.'
                    }
                    list={[
                      allInFundaApp
                        ? 'Practitioners have been notified.'
                        : 'If your practitioners need help, please contact the SmartStart call centre.',
                    ]}
                    button={
                      !allInFundaApp ? (
                        <Button
                          text="Contact call centre"
                          icon="PhoneIcon"
                          type={'filled'}
                          color={'primary'}
                          textColor={'white'}
                        />
                      ) : (
                        <></>
                      )
                    }
                  />
                </div>
              )}
              <div>
                <Divider className="-my-1" dividerType="dashed" />
                <StackedList<ActionListDataItem>
                  listItems={listItems}
                  // onClick={() => console.log('clicked')}
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
                  onClick={() =>
                    setCurrentPage(SetupPractitionersPage.addPractitioners)
                  }
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
                onClick={handleConfirmPractitionerSubmit}
              />
            </div>
          </div>
        );
      case SetupPractitionersPage.editPractitioners:
        return (
          <AddOrRenamePractitioner
            onSubmit={handleAddOrEditPractitionerSubmit}
            formData={editPractitioner}
          />
        );
      case SetupPractitionersPage.addPractitioners:
        return (
          <AddOrRenamePractitioner
            onSubmit={handleAddOrEditPractitionerSubmit}
          />
        );
    }
  };
  return renderPage(currentPage);
}
