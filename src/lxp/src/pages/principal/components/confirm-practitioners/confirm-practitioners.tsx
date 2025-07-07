import {
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  Typography,
  StackedList,
  Button,
  ActionListDataItem,
  Card,
  LoadingSpinner,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
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
import { LocalStorageKeys } from '@ecdlink/core';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { AddNewPractitionerModel } from '../add-practitioner/add-practitioner.types';

export interface StackListItems extends ActionListDataItem {
  idNumber: string;
  phoneNumber?: string;
}

export default function ConfirmPractitioners({
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
  const userAuth = useSelector(authSelectors.getAuthUser);
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const practitionersForPrincipal = useSelector(
    practitionerSelectors.getPrincipalPractitioners
  );
  const [principalPractitioners, setPrincipalPractitioners] = useState<
    RegisterPractitioner[]
  >([]);
  const [allInFundaApp, setAllInFundaApp] = useState<boolean>();
  const [editPractitioner, setEditPractitioner] =
    useState<RegisterPractitioner>();
  const clasroom = useSelector(classroomsSelectors.getClassroom);
  const [listItems, setListItems] = useState<StackListItems[]>([]);
  const [invitingPractitioner, setInvitingPractitioner] =
    useState<AddNewPractitionerModel>();
  const inviTePractitionerIdNumber = localStorage
    .getItem(LocalStorageKeys.practitionerInvitedPrincipalIdNumber)
    ?.replace(/['"]+/g, '');
  const hasInvitingPractitioner = useMemo(
    () =>
      listItems?.find((item) => item?.idNumber === inviTePractitionerIdNumber),
    [listItems, inviTePractitionerIdNumber]
  );
  const [isLoadingInvitingPractitioner, setIsLoadingInvitingPractitioner] =
    useState(false);

  useLayoutEffect(() => {
    if (inviTePractitionerIdNumber) {
      if (inviTePractitionerIdNumber && !hasInvitingPractitioner) {
        handleInvitingPractitioner();
      }
    }
  }, [inviTePractitionerIdNumber, hasInvitingPractitioner]);

  const handleInvitingPractitioner = useCallback(async () => {
    setIsLoadingInvitingPractitioner(true);
    const _practitioner: any = await new PractitionerService(
      userAuth?.auth_token!
    ).getPractitionerByIdNumber(inviTePractitionerIdNumber!);

    setInvitingPractitioner({
      userId: _practitioner?.appUser?.id,
      idNumber: _practitioner?.appUser?.idNumber,
      firstName: _practitioner?.appUser?.firstName,
    });

    setIsLoadingInvitingPractitioner(false);
  }, []);

  useLayoutEffect(() => {
    if (invitingPractitioner) {
      listItems.push(createStackItem(invitingPractitioner as any));

      const hasPractitioner = principalPractitioners?.find(
        (prac) => prac?.idNumber === invitingPractitioner?.idNumber
      );

      if (!hasPractitioner) {
        principalPractitioners.push(invitingPractitioner as any);
        setPrincipalPractitioners(principalPractitioners);
      }
    }
  }, [invitingPractitioner]);

  useEffect(() => {
    if (listItems) {
    }
  });

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
        title: data.firstName ? `${data.firstName}` : data?.phoneNumber || '',
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

  const handleAddOrEditAnotherPractitionerSubmit = (
    data: RegisterPractitioner
  ) => {
    const indexToEdit = listItems.findIndex(
      (d) =>
        d.idNumber === editPractitioner?.idNumber ||
        d?.phoneNumber === editPractitioner?.phoneNumber
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
                text={
                  listItems?.length > 0
                    ? 'Confirm practitioners'
                    : 'Invite practitioners'
                }
                color={'textDark'}
              />

              {isLoadingInvitingPractitioner ? (
                <div className="mt-16">
                  <LoadingSpinner
                    size="medium"
                    backgroundColor="uiBg"
                    spinnerColor="quatenary"
                  />
                </div>
              ) : (
                <StackedList<ActionListDataItem>
                  listItems={listItems}
                  type={'ActionList'}
                />
              )}
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
                  disabled={isLoadingInvitingPractitioner}
                />
              </div>
            </div>

            <div className="-mb-4 self-end">
              <Button
                size="normal"
                className="mb-4 w-full"
                type="filled"
                color="quatenary"
                text={listItems?.length === 0 ? 'Skip' : 'Next'}
                textColor="white"
                icon="ArrowCircleRightIcon"
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
            handleAddOrEditAnotherPractitionerSubmit={
              handleAddOrEditAnotherPractitionerSubmit
            }
          />
        );
      case ConfirmPractitionersSteps.ADD_PRACTITIONER:
        return (
          <AddOrEditPractitioner
            onSubmit={handleAddOrEditPractitionerSubmit}
            listItems={listItems}
            handleAddOrEditAnotherPractitionerSubmit={
              handleAddOrEditAnotherPractitionerSubmit
            }
          />
        );
    }
  };
  return renderPage(page);
}
