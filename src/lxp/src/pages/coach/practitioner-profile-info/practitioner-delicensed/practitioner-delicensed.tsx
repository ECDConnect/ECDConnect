import {
  BannerWrapper,
  Button,
  Alert,
  Typography,
  renderIcon,
  Divider,
  CheckboxGroup,
  FormInput,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import {
  PractitionerDto,
  ReasonsForPractitionerLeaving,
  getPreviousAndNextMonths,
} from '@ecdlink/core';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useState } from 'react';
import {
  deActivatePractitioner,
  delicensePractitioner,
} from '@/store/practitioner/practitioner.actions';
import { useAppDispatch } from '@/store';

export type PractitionerDelicensedProps = {
  practitioner: PractitionerDto;
  delicenseDate: Date;
};

type Step = 'Landing' | 'Collection' | 'Leaving';

export const PractitionerDelicensed: React.FC<PractitionerDelicensedProps> = ({
  practitioner,
  delicenseDate,
}) => {
  console.log('delicenseDate', delicenseDate);
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();

  const [step, setStep] = useState<Step>('Landing');

  const [playkitReturned, setPlaykitReturned] = useState<boolean>(false);
  const [handbookReturned, setHandbookReturned] = useState<boolean>(false);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  const onSubmitDelicensing = () => {
    if (!!practitioner?.userId) {
      appDispatch(
        deActivatePractitioner({
          userId: practitioner?.userId,
          reasonForPractitionerLeavingId:
            ReasonsForPractitionerLeaving.DELICENSED,
          leavingComment: '',
        })
      );
      appDispatch(
        delicensePractitioner({
          userId: practitioner?.userId,
          delicensedDate: new Date(),
          delicensedComment: additionalNotes,
          collectedSSHandbook: handbookReturned,
          collectedSSPlaykit: playkitReturned,
        })
      );
    }
  };

  return (
    <>
      <BannerWrapper
        title={`${practitioner?.user?.fullName}`}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={true}
        onBack={() => history.push(ROUTES.COACH.PRACTITIONERS)}
        displayOffline={!isOnline}
        className="w-full justify-center p-2"
        subTitle={
          step === 'Landing'
            ? 'Delicensed'
            : step === 'Collection'
            ? 'step 1 of 2'
            : 'step 2 of 2'
        }
      >
        {step === 'Landing' && (
          <>
            <div className="flex h-full flex-col p-4">
              <Alert
                className="rounded-xl"
                type={'error'}
                title={`${
                  practitioner?.user?.firstName
                } was delicensed on ${format(delicenseDate!, 'd MMM yyyy')}.`}
              />

              <div className="mt-4">
                <div className="ml-2">
                  <Typography
                    color={'textMid'}
                    text={`If you do not remove ${
                      practitioner?.user?.firstName
                    }, they will be automatically removed by: ${format(
                      getPreviousAndNextMonths(delicenseDate!, 1).nextDate,
                      'd MMM yyyy'
                    )}`}
                    type="small"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center">
              <Button
                type="filled"
                color="primary"
                className={`mt-6 w-11/12 ${
                  !practitioner?.isPrincipal &&
                  !practitioner?.isFundaAppAdmin &&
                  'mb-6'
                }`}
                onClick={() => setStep('Collection')}
              >
                {renderIcon('TrashIcon', 'w-5 h-5 color-white text-white mr-2')}
                <Typography
                  type="body"
                  className="mr-4"
                  color="white"
                  text={`Remove ${practitioner?.user?.firstName}`}
                ></Typography>
              </Button>
            </div>
          </>
        )}
        {step === 'Collection' && (
          <>
            <div className="flex h-full flex-col p-4">
              {!isOnline && (
                <Alert
                  className="mb-4"
                  type="error"
                  title="Not available offline"
                />
              )}
              <Typography
                type="h2"
                text="Exiting the programme"
                color="textDark"
              />
              <Typography
                type="h4"
                text={`${practitioner.user?.firstName} ${
                  practitioner.user?.surname
                }, ${new Date().toLocaleDateString('en-ZA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}`}
                color="textMid"
              />
              <Divider dividerType="dashed" className="my-4" />
              <Typography
                className="mt-4 mb-4"
                type="body"
                text={`Please ask ${practitioner.user?.firstName} to return the items below and confirm that you have received them.`}
                color="textDark"
              />
              <CheckboxGroup
                titleWeight="normal"
                className="mt-2"
                checkboxColor="primary"
                id={'playkit'}
                key={'playkit'}
                title={`I have collected ${practitioner?.user?.firstName}’s SmartStart playkit`}
                titleColours="textMid"
                checked={playkitReturned}
                value={'playkit'}
                onChange={(e) => setPlaykitReturned(e.checked)}
              />
              <CheckboxGroup
                titleWeight="normal"
                className="mt-2"
                checkboxColor="primary"
                id={'handbook'}
                key={'handbook'}
                title={`I have collected ${practitioner?.user?.firstName}’s SmartStart handbook`}
                titleColours="textMid"
                checked={handbookReturned}
                value={'handbook'}
                onChange={(e) => setHandbookReturned(e.checked)}
              />
              <FormInput
                label={'Additional notes'}
                subLabel="Optional"
                placeholder="e.g. discussed alternative career paths"
                type="text"
                textInputType="textarea"
                className="mt-4"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>
            <div className="flex w-full justify-center">
              <Button
                type="filled"
                color="primary"
                className={`mt-6 w-11/12 ${
                  !practitioner?.isPrincipal &&
                  !practitioner?.isFundaAppAdmin &&
                  'mb-6'
                }`}
                onClick={() => setStep('Leaving')}
              >
                {renderIcon(
                  'ArrowRightIcon',
                  'w-5 h-5 color-white text-white mr-2'
                )}
                <Typography
                  type="body"
                  className="mr-4"
                  color="white"
                  text={`Next`}
                ></Typography>
              </Button>
            </div>
          </>
        )}
        {step === 'Leaving' && (
          <>
            <div className="flex h-full flex-col gap-4 p-4">
              <Alert
                type="error"
                title={`${practitioner?.user?.firstName} will be removed from the programme immediately`}
                list={[
                  `If you remove ${practitioner?.user?.firstName} now, they will no longer be able to see child information or perform any actions in the classroom section.`,
                ]}
              />
              <Typography
                type="h2"
                text={`Why is ${practitioner?.user?.firstName} leaving SmartStart?`}
                color="textDark"
              />
              <FormInput
                label="Reason for leaving"
                value="Delicensed"
                disabled
              />
              <Alert
                type="info"
                title="You cannot change the reason for leaving because the SmartStarter has been delicensed."
              />
            </div>
            <div className="flex w-full justify-center">
              <Button
                type="filled"
                color="primary"
                className={`mt-6 w-11/12 ${
                  !practitioner?.isPrincipal &&
                  !practitioner?.isFundaAppAdmin &&
                  'mb-6'
                }`}
                onClick={onSubmitDelicensing}
              >
                {renderIcon('TrashIcon', 'w-5 h-5 color-white text-white mr-2')}
                <Typography
                  type="body"
                  className="mr-4"
                  color="white"
                  text={`Remove ${practitioner?.user?.firstName}`}
                ></Typography>
              </Button>
            </div>
            <div className="flex w-full justify-center">
              <Button
                type="outlined"
                color="primary"
                className={`w-11/12 ${
                  !practitioner?.isPrincipal &&
                  !practitioner?.isFundaAppAdmin &&
                  'mb-6'
                }`}
                onClick={() => history.push(ROUTES.COACH.PRACTITIONERS)}
              >
                {renderIcon('XIcon', 'w-5 h-5 color-primary text-white mr-2')}
                <Typography
                  type="body"
                  className="mr-4"
                  color="primary"
                  text={'Cancel'}
                ></Typography>
              </Button>
            </div>
          </>
        )}
      </BannerWrapper>
    </>
  );
};
