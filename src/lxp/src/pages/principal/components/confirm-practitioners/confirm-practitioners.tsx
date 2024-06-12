import { SetStateAction, useCallback, useEffect, useState } from 'react';
import {
  Typography,
  Divider,
  StackedList,
  Button,
  ActionListDataItem,
  Alert,
  Card,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { AddOrEditPractitioner } from './add-or-edit-practitioner';
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
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';
import { classroomsSelectors } from '@/store/classroom';
import { useTenant } from '@/hooks/useTenant';

export interface StackListItems extends ActionListDataItem {
  idNumber: string;
}

export default function ConfirmPractitioners({
  onNext,
  page,
  setConfirmPractitionerPage,
  isFundaAppAdmin,
}: {
  onNext: OnNext;
  page: ConfirmPractitionersSteps;
  isFundaAppAdmin: any;
  setConfirmPractitionerPage: React.Dispatch<
    React.SetStateAction<ConfirmPractitionersSteps>
  >;
}) {
  const appDispatch = useAppDispatch();
  const user = useSelector(userSelectors.getUser);
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const practitionersForPrincipal = useSelector(
    practitionerSelectors.getPrincipalPractitioners
  );
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const [principalPractitioners, setPrincipalPractitioners] = useState<
    RegisterPractitioner[]
  >([]);
  const [allInFundaApp, setAllInFundaApp] = useState<boolean>();
  const [hasTrainees, setHasTrainees] = useState<boolean>();
  const [editPractitioner, setEditPractitioner] =
    useState<RegisterPractitioner>();
  const clasroom = useSelector(classroomsSelectors.getClassroom);
  const [listItems, setListItems] = useState<StackListItems[]>([]);
  const isSmartLinkImported = user?.isImported;

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

  useEffect(() => {
    if (isSmartLinkImported) {
      const _practitionersList: SetStateAction<RegisterPractitioner[]> = [];
      practitioners?.forEach((item) => {
        if (item?.userId !== user?.id)
          listItems.push(
            createStackItem({
              firstName: item?.user?.firstName ?? '',
              surname: item?.user?.surname ?? '',
              idNumber: item?.user?.idNumber ?? '',
              userId: item?.user?.id ?? '',
              passport: '',
              preferId: !!item?.user?.idNumber,
              isRegistered: Boolean(item?.isRegistered),
              isTrainee: Boolean(item?.isTrainee),
            })
          );

        const filteredList = listItems.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t?.idNumber === value?.idNumber)
        );

        setListItems(filteredList);

        _practitionersList.push({
          firstName: item?.user?.firstName ?? '',
          surname: item?.user?.surname ?? '',
          idNumber: item?.user?.idNumber ?? '',
          id: item?.user?.id ?? '',
          userId: item?.user?.id,
          passport: '',
          preferId: !!item?.user?.idNumber,
          isRegistered: Boolean(item?.isRegistered),
          isTrainee: Boolean(item?.isTrainee),
        });
      });

      const principalFilteredList = _practitionersList.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t?.idNumber === value?.idNumber)
      );
      setPrincipalPractitioners(principalFilteredList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFundaAppAdmin, isSmartLinkImported, practitioners, user?.idNumber]);

  useEffect(() => {
    if (practitionersForPrincipal?.length) {
      const _practitionersList: SetStateAction<RegisterPractitioner[]> = [];
      (practitionersForPrincipal as unknown as RegisterPractitioner[]).forEach(
        ({
          firstName,
          surname,
          id,
          idNumber,
          isRegistered,
          userId,
          isTrainee,
        }) => {
          listItems.push(
            createStackItem({
              firstName: firstName ?? '',
              surname: surname ?? '',
              idNumber: idNumber ?? '',
              userId: id ?? '',
              passport: '',
              preferId: !!idNumber,
              isRegistered: Boolean(isRegistered),
              isTrainee: Boolean(isTrainee),
            })
          );

          const filteredList = listItems.filter(
            (value, index, self) =>
              index === self.findIndex((t) => t?.idNumber === value?.idNumber)
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
            isTrainee: Boolean(isTrainee),
          });
        }
      );

      const principalFilteredList = _practitionersList.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t?.idNumber === value?.idNumber)
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
        subTitle: 'Practitioner',
        titleStyle:
          'text-textDark font-body text-base font-semibold leading-snug ',
        subTitleStyle: 'text-textMid',
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

  const renderPage = (page: ConfirmPractitionersSteps) => {
    switch (page) {
      case ConfirmPractitionersSteps.CONFIRM_PRACTITIONERS:
      default:
        return (
          <div className="wrapper-with-sticky-button">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-11">
                <div className="flex flex-col gap-11">
                  <div>
                    <Card
                      className="bg-uiBg mb-6 flex flex-col items-center gap-3 p-6"
                      borderRaduis="xl"
                      shadowSize="lg"
                    >
                      <div className="">
                        <Cebisa />
                      </div>
                      <Typography
                        color="textDark"
                        text={`If there are other practitioners at ${clasroom?.name}, you can invite them to ${appName}.`}
                        type={'h3'}
                        align="center"
                      />
                    </Card>
                  </div>
                </div>
              </div>
              <Typography
                type={'h2'}
                text={'Invite practitioners'}
                color={'textDark'}
              />
              <StackedList<ActionListDataItem>
                listItems={listItems}
                type={'ActionList'}
              />
              <div>
                <Button
                  size="small"
                  type="filled"
                  color="quatenary"
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
                color="quatenary"
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
          <AddOrEditPractitioner
            onSubmit={handleAddOrEditPractitionerSubmit}
            formData={editPractitioner}
            listItems={listItems}
            setListItems={setListItems}
            setConfirmPractitionerPage={setConfirmPractitionerPage}
          />
        );
      case ConfirmPractitionersSteps.ADD_PRACTITIONER:
        return (
          <AddOrEditPractitioner
            onSubmit={handleAddOrEditPractitionerSubmit}
            listItems={listItems}
          />
        );
    }
  };
  return renderPage(page);
}
