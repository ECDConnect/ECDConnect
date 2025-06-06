import {
  Typography,
  Card,
  StackedList,
  MenuListDataItem,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';
import { useTenant } from '@/hooks/useTenant';
import { useState } from 'react';
import { ShareSomeDetails } from '../share-some-detail/share-some-detail';
import { PractitionerSetupSteps } from '../../setup-principal/setup-principal.types';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { cloneDeep } from '@apollo/client/utilities';
import {
  practitionerActions,
  practitionerSelectors,
} from '@/store/practitioner';
import { useAppDispatch } from '@/store';
import { ReactComponent as Kindgarden } from '@/assets//icon/kindergarten1.svg';
import { ReactComponent as BookAndApple } from '@/assets//icon/book_and_apple_1.svg';

export const SelectPractitionerRole = ({
  onNext,
  setIsNotPrincipal,
  setPage,
}: {
  onNext: () => void;
  setIsNotPrincipal: (item: boolean) => void;
  setPage: (item: PractitionerSetupSteps) => void;
}) => {
  const appDispatch = useAppDispatch();
  const tenant = useTenant();
  const isOpenAccess = tenant?.isOpenAccess;
  const [shareSomeDetails, setShareSomeDetails] = useState(false);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const user = useSelector(userSelectors.getUser);

  const savePractitionerIsPrincipal = () => {
    const copy = cloneDeep(practitioner);
    if (copy) {
      copy.isPrincipal = true;

      appDispatch(practitionerActions.updatePractitioner(copy));
    }
  };

  const savePractitionerIsNotPrincipal = () => {
    const copy = cloneDeep(practitioner);
    if (copy) {
      copy.isPrincipal = false;

      appDispatch(practitionerActions.updatePractitioner(copy));
    }
  };

  const listItems: MenuListDataItem[] = [
    {
      title: `Principal`,
      titleStyle: 'text-textMid font-h4',
      subTitle: 'I run a preschool',
      subTitleStyle: 'text-sm font-h1 font-normal text-textMid',
      customIcon: (
        <div className="bg-quatenary mr-2 rounded-full p-3">
          <Kindgarden className="h-8 w-8" />
        </div>
      ),
      iconBackgroundColor: 'quatenary',
      iconColor: 'white',
      showIcon: true,
      onActionClick:
        isOpenAccess && !user?.firstName
          ? () => {
              setIsNotPrincipal(false);
              savePractitionerIsPrincipal();
              setShareSomeDetails(true);
            }
          : () => {
              setIsNotPrincipal(false);
              savePractitionerIsPrincipal();
              onNext();
            },
    },
    {
      title: `Practitioner`,
      titleStyle: 'text-textMid font-h4',
      subTitle: 'I teach at a preschool that has a principal',
      subTitleStyle: 'text-sm font-h1 font-normal text-textMid',
      customIcon: (
        <div className="bg-secondary mr-2 rounded-full p-3">
          <BookAndApple className="bg-secondary h-8 w-8" />
        </div>
      ),
      iconBackgroundColor: 'secondary',
      iconColor: 'white',
      showIcon: true,
      backgroundColor: 'secondaryAccent2',
      onActionClick:
        isOpenAccess && !user?.firstName
          ? () => {
              setIsNotPrincipal(true);
              savePractitionerIsNotPrincipal();
              setShareSomeDetails(true);
            }
          : () => {
              setIsNotPrincipal(true);
              savePractitionerIsNotPrincipal();
              onNext();
            },
    },
  ];

  return (
    <>
      <div className="h-full pt-7">
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
                  text={`What is your role at the preschool?`}
                  type={'h3'}
                  align="center"
                />
              </Card>
            </div>
          </div>
        </div>

        <Typography
          color="textDark"
          text={`I am a...`}
          type={'h3'}
          className="my-4"
        />

        <StackedList<MenuListDataItem>
          listItems={listItems}
          type={'MenuList'}
          className="flex flex-col gap-2"
        />
        <Dialog
          stretch={true}
          visible={shareSomeDetails}
          position={DialogPosition.Full}
        >
          <ShareSomeDetails
            onNext={() => setPage(PractitionerSetupSteps.SETUP_PROGRAMME)}
            setIsNotPrincipal={setIsNotPrincipal}
            setShareSomeDetails={setShareSomeDetails}
          />
        </Dialog>
      </div>
    </>
  );
};
