import { SetStateAction, useCallback, useEffect, useState } from 'react';
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
import { AddPractitioner } from './add-practitioner';
import { useAppDispatch } from '@/store';
import {
  practitionerActions,
  practitionerSelectors,
} from '@/store/practitioner';
import {
  ConfirmPractitionersSteps,
  OnNext,
  PractitionerSetupSteps,
  RegisterPractitioner,
} from '../../setup-principal/setup-principal.types';

interface StackListItems extends ActionListDataItem {
  idNumber: string;
}

export default function ConfirmPractitioner({
  onNext,
  page,
  setConfirmPractitionerPage,
}: {
  onNext: OnNext;
  page: ConfirmPractitionersSteps;
  setConfirmPractitionerPage: React.Dispatch<
    React.SetStateAction<ConfirmPractitionersSteps>
  >;
}) {
  const appDispatch = useAppDispatch();
  const user = useSelector(userSelectors.getUser);
  const practitionersForPrincipal = useSelector(
    practitionerSelectors.getPrincipalPractitioners
  );
  const [principalPractitioners, setPrincipalPractitioners] = useState<
    RegisterPractitioner[]
  >([]);
  const [allInFundaApp, setAllInFundaApp] = useState<boolean>();
  const [editPractitioner, setEditPractitioner] =
    useState<RegisterPractitioner>();
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
      const _practitionersList: SetStateAction<RegisterPractitioner[]> = [];
      (practitionersForPrincipal as unknown as RegisterPractitioner[]).forEach(
        ({ firstName, surname, id, idNumber, isRegistered, userId }) => {
          listItems.push(
            createStackItem({
              firstName: firstName ?? '',
              surname: surname ?? '',
              idNumber: idNumber ?? '',
              userId: id ?? '',
              passport: '',
              preferId: !!idNumber,
              isRegistered: Boolean(isRegistered),
            })
          );

          const filteredList = listItems.filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.id === value.id)
          );
          setListItems(filteredList);

          _practitionersList.push({
            firstName: firstName ?? '',
            surname: surname ?? '',
            idNumber: idNumber ?? '',
            id: id ?? '',
            userId: userId,
            passport: '',
            preferId: !!idNumber,
            isRegistered: Boolean(isRegistered),
          });
        }
      );

      const principalFilteredList = _practitionersList.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id)
      );
      setPrincipalPractitioners(principalFilteredList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitionersForPrincipal]);

  const createStackItem = useCallback(
    (data: RegisterPractitioner): StackListItems => {
      return {
        title: `${data.firstName} ${data.surname}`,
        idNumber: data.idNumber ?? data.passport,
        subTitle: data.isRegistered ? 'Practitioner' : 'Not on Funda App',
        titleStyle:
          'text-textDark font-body text-base font-semibold leading-snug ',
        subTitleStyle: `${
          data.isRegistered ? 'text-textMid' : 'text-alertDark'
        } font-body text-sm leading-5 `,
        actionName: 'Edit',
        actionIcon: 'PencilIcon',
        buttonType: 'filled',
        onActionClick() {
          setEditPractitioner(data);
          setConfirmPractitionerPage(
            ConfirmPractitionersSteps.EDIT_PRACTITIONER
          );
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleAddOrEditPractitionerSubmit = (data: RegisterPractitioner) => {
    const indexToEdit = listItems.findIndex(
      (d) => d.idNumber === editPractitioner?.idNumber
    );

    if (indexToEdit > -1) {
      principalPractitioners.splice(indexToEdit, 1);
      listItems.splice(indexToEdit, 1);
    }

    listItems.push(createStackItem(data));
    principalPractitioners.push(data);
    setPrincipalPractitioners(principalPractitioners);
    setListItems(listItems);

    const allInFunda = principalPractitioners.every(
      (l) => l.isRegistered === true
    );
    setAllInFundaApp(allInFunda);
    setConfirmPractitionerPage(ConfirmPractitionersSteps.CONFIRM_PRACTITIONERS);
  };

  const handleConfirmPractitionerSubmit = () => {
    appDispatch(
      practitionerActions.addPrincipalPractitioners(principalPractitioners)
    );
    onNext(PractitionerSetupSteps.CONFIRM_CLASSES);
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

  const renderPage = (page: ConfirmPractitionersSteps) => {
    switch (page) {
      case ConfirmPractitionersSteps.CONFIRM_PRACTITIONERS:
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
                  color="primary"
                  text="Add practitioner"
                  textColor="white"
                  icon="PlusIcon"
                  onClick={() =>
                    setConfirmPractitionerPage(
                      ConfirmPractitionersSteps.ADD_PRACTITIONER
                    )
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
      case ConfirmPractitionersSteps.EDIT_PRACTITIONER:
        return (
          <AddPractitioner
            onSubmit={handleAddOrEditPractitionerSubmit}
            formData={editPractitioner}
          />
        );
      case ConfirmPractitionersSteps.ADD_PRACTITIONER:
        return <AddPractitioner onSubmit={handleAddOrEditPractitionerSubmit} />;
    }
  };
  return renderPage(page);
}
