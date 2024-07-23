import { useCallback, useEffect, useState } from 'react';
import {
  Typography,
  Divider,
  StackedList,
  Button,
  ActionListDataItem,
  Alert,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { AddOrEditPractitioner } from './add-or-edit-practitioner';
import { AddPractitionerModel } from '@/schemas/practitioner/add-practitioner';
import { useAppDispatch } from '@/store';
import {
  practitionerActions,
  practitionerSelectors,
} from '@/store/practitioner';
import { SetupPractitionersPage } from '../../edit-practitioner-profile.types';

interface StackListItems extends ActionListDataItem {
  idNumber: string;
}

export default function EditMultiplePractitioners({
  onSubmit,
  page = SetupPractitionersPage.confirmPractitioners,
}: {
  onSubmit: any;
  page: SetupPractitionersPage;
}) {
  const appDispatch = useAppDispatch();
  const user = useSelector(userSelectors.getUser);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitionersForPrincipal = useSelector(
    practitionerSelectors.getPrincipalPractitioners
  );

  const [currentPage, setCurrentPage] = useState(page);
  const [principalPractitioners, setPrincipalPractitioners] = useState<
    AddPractitionerModel[]
  >([]);
  const [allInFundaApp, setAllInFundaApp] = useState<boolean>();
  const [editPractitioner, setEditPractitioner] =
    useState<AddPractitionerModel>();
  const [listItems, setListItems] = useState<StackListItems[]>([
    {
      title: user?.fullName ?? '',
      idNumber: user?.idNumber ?? '',
      subTitle: 'Principal',
      titleStyle:
        'text-textDark font-body text-base font-semibold leading-snug ',
      subTitleStyle: 'text-textMid font-body text-sm leading-5 ',
    },
  ]);

  useEffect(() => {
    if (practitionersForPrincipal?.length) {
      practitionersForPrincipal.forEach(
        ({ firstName, surname, id, idNumber }) => {
          listItems.push(
            createStackItem({
              firstName: firstName ?? '',
              surname: surname ?? '',
              idNumber: idNumber ?? '',
              userId: id ?? '',
              passport: '',
              preferId: !!idNumber,
            })
          );
          setListItems(listItems);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const practitionerList = listItems.filter(
      (i) => i.idNumber !== user?.idNumber
    );
    const practitionerIds = practitioners?.map((p) => p.user?.idNumber);
    const inFundaApp = practitionerList.length
      ? practitionerList.every((l) => practitionerIds?.includes(l.idNumber))
      : undefined;
    setAllInFundaApp(inFundaApp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, listItems.length]);

  const createStackItem = useCallback(
    (data: AddPractitionerModel): StackListItems => {
      const isInFundaApp = practitioners?.find(
        (p) => p.user?.idNumber === data.idNumber || data.passport
      );
      return {
        title: `${data.firstName} ${data.surname}`,
        idNumber: data.idNumber ?? data.passport,
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

  useEffect(() => {
    if (practitioners?.length) {
      practitioners.forEach((item) => {
        listItems.push(
          createStackItem({
            firstName: item?.user?.firstName ?? '',
            surname: item?.user?.surname ?? '',
            idNumber: item?.user?.idNumber ?? '',
            userId: item?.user?.id ?? '',
            passport: '',
            preferId: !!item?.user?.idNumber,
          })
        );
        setListItems(listItems);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitioners]);

  const handleAddOrEditPractitionerSubmit = (data: AddPractitionerModel) => {
    const indexToEdit = listItems.findIndex(
      (d) => d.idNumber === editPractitioner?.idNumber
    );

    if (indexToEdit > -1) {
      principalPractitioners.splice(indexToEdit, 1);
      listItems.splice(indexToEdit, 1);
    }

    listItems.push(createStackItem(data));
    principalPractitioners.push(data);

    setCurrentPage(SetupPractitionersPage.confirmPractitioners);

    setPrincipalPractitioners(principalPractitioners);
    setListItems(listItems);
  };

  const handleConfirmPractitionerSubmit = () => {
    appDispatch(
      practitionerActions.addPrincipalPractitioners(principalPractitioners)
    );
    onSubmit();
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

  const renderPage = (page: SetupPractitionersPage) => {
    switch (page) {
      case SetupPractitionersPage.confirmPractitioners:
      default:
        return (
          <div className="wrapper-with-sticky-button">
            <div className="flex flex-col gap-4 pt-4">
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
                    type={allInFundaApp ? 'success' : 'warning'}
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
                          onClick={callForHelp}
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
                  type={'ActionList'}
                />
              </div>

              <div>
                <Button
                  size="small"
                  type="filled"
                  color="quatenary"
                  text="Add practitioner"
                  textColor="white"
                  icon="PlusIcon"
                  onClick={() =>
                    setCurrentPage(SetupPractitionersPage.addPractitioners)
                  }
                />
              </div>
            </div>

            <div className="-mb-4 self-end">
              <Button
                size="normal"
                className="mb-4 w-full"
                type="filled"
                color="primary"
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
          <AddOrEditPractitioner
            onSubmit={handleAddOrEditPractitionerSubmit}
            formData={editPractitioner}
          />
        );
      case SetupPractitionersPage.addPractitioners:
        return (
          <AddOrEditPractitioner onSubmit={handleAddOrEditPractitionerSubmit} />
        );
    }
  };
  return renderPage(currentPage);
}
