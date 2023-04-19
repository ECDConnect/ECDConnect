import {
  Alert,
  Button,
  CheckboxChange,
  CheckboxGroup,
  Divider,
  RoundIcon,
  Typography,
} from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import Clipboard from '@/assets/clipboardIcon.svg';
import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useAppDispatch } from '@/store';
import thumbsUpImage from '@/assets/thumbsUp.png';
import { toCamelCase } from '@ecdlink/core';
import { VisitDataStatus, VisitDataStatusFilterInput } from '@ecdlink/graphql';
import { ReactComponent as PollyImpressed } from '@/assets/celebrateIcon.svg';
import { format } from 'date-fns';
import { getMotherById } from '@/store/mother/mother.selectors';
import { PregnantProfileParams } from '../index.types';
import { motherSelectors, motherThunkActions } from '@/store/mother';

const HEADER_HEIGHT = 64;

interface GroupedData {
  [key: string]: VisitDataStatus[];
  clinicReferrals: VisitDataStatus[];
  departmentOfHomeAffairsReferrals: VisitDataStatus[];
  immunisationsSupplementsAndDeworming: VisitDataStatus[];
}

export const ReferralsTab: React.FC = () => {
  const { height } = useWindowSize();
  const { id: motherId } = useParams<PregnantProfileParams>();
  const referralsForMother = useSelector(
    motherSelectors.getReferralsForMotherSelector
  );
  const completedreferralsForMother =
    useSelector(motherSelectors.getCompletedReferralsForMotherSelector) || [];
  const [referralsInput, setReferralsInput] =
    useState<VisitDataStatusFilterInput[]>();
  const [showMarkAllButton, setShowMarkAllButton] = useState(true);
  const [isReferralsView, setIsReferralsView] = useState(true);

  const appDispatch = useAppDispatch();
  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  // Getting referrals for approval
  useLayoutEffect(() => {
    appDispatch(
      motherThunkActions.getReferralsForMother({ motherId })
    ).unwrap();
  }, [appDispatch, motherId]);

  // Getting referrals already approved
  useLayoutEffect(() => {
    appDispatch(
      motherThunkActions.getCompletedReferralsForMother({ motherId })
    ).unwrap();
  }, [appDispatch, motherId]);

  // group data under sections
  const groupedData = useMemo(() => {
    const groupedData = referralsForMother?.reduce(
      (acc: { [key: string]: any }, currentValue) => {
        const section = toCamelCase(currentValue?.section || '');
        if (!section) return acc;
        if (!acc[section]) {
          acc[section] = [];
        }
        acc[section].push(currentValue);
        return acc;
      },
      {}
    );
    return groupedData;
  }, [referralsForMother]) as GroupedData;

  // all sections
  const sections =
    groupedData &&
    Object.keys(groupedData)?.map((item) => ({
      label: groupedData[item][0].section,
      value: item,
    }));

  const [questions, setAnswers] = useState(groupedData);

  const handleSetReferrals = useCallback(
    (value: VisitDataStatusFilterInput[]) => {
      setReferralsInput((prevState) => {
        const newState = [...(prevState || [])];
        value.forEach((item) => {
          const index = newState.findIndex((element) => element.id === item.id);
          if (index !== -1) {
            newState[index].isCompleted = item.isCompleted;
          } else {
            newState.push(item);
          }
        });

        // setting the mark all done button visibility
        let _showAllMarkButton = false;
        for (const item of newState) {
          if (!item.isCompleted) {
            _showAllMarkButton = true;
          }
        }
        setShowMarkAllButton(_showAllMarkButton);

        // saving the new state for data status record
        if (newState.length > 0) {
          // appDispatch(infantActions.addInfantCompleteReferrals(newState));
          appDispatch(
            motherThunkActions.updateVisitDataStatus({ input: newState })
          ).unwrap();
        }

        return newState;
      });
    },
    [setReferralsInput, appDispatch]
  );

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedAnswers = currentQuestion?.map((question) => {
        if (question.id === value.id) {
          return value;
        }
        return question;
      });

      const updatedQuestions = { ...questions, [index]: updatedAnswers };
      const formattedQuestions = updatedAnswers.map((item) => {
        const { id, isCompleted } = item;
        return { id, isCompleted };
      });

      handleSetReferrals?.(formattedQuestions);
      setAnswers(updatedQuestions);
    },
    [handleSetReferrals, questions]
  );

  // change function for checkbox
  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      const referral = questions[event.name].find(
        (item) => item.comment === event.value
      );

      return onOptionSelected(
        { ...referral, isCompleted: event.checked },
        event.name
      );
    },
    [onOptionSelected, questions]
  );

  // Mark all referrals for client
  const onMarkAll = useCallback(() => {
    let currentQuestions: any;
    for (const section of sections) {
      currentQuestions = questions[section.value];
      for (const question of currentQuestions) {
        const referral = questions[section.value].find(
          (item) => item.comment === question.comment
        );

        return onOptionSelected(
          { ...referral, isCompleted: true },
          section.value
        );
      }
    }
  }, [onOptionSelected, sections, questions]);

  const onShowBackReferrals = useCallback(() => {
    setIsReferralsView(false);
  }, []);

  const onShowReferrals = useCallback(() => {
    setIsReferralsView(true);
  }, []);

  const onUpdateBackReferral = useCallback((id) => {
    // TODO - new branch await
    // console.log('redirect to update page', id);
  }, []);

  return (
    <div className="flex flex-col" style={{ height: height - HEADER_HEIGHT }}>
      {/* HEADING: REFERRALS -----------------------------------------*/}
      {isReferralsView && (
        <div className="bg-uiBg mt-14 flex items-center gap-2 p-4">
          <RoundIcon imageUrl={Clipboard} backgroundColor="tertiary" />
          <div>
            <Typography
              type="h2"
              align="left"
              weight="bold"
              color="textDark"
              text={`Referrals for ${mother?.user?.firstName || ''} `}
            />
            <Typography
              className="col-span-2 row-span-2"
              type="body"
              align="left"
              weight="skinny"
              text={`${referralsForMother?.length} referrals`}
              color="textMid"
            />
          </div>
        </div>
      )}

      {/* HEADING: BACK-REFERRALS -----------------------------------------*/}
      {!isReferralsView && (
        <div className="bg-uiBg mt-14 flex items-center gap-2 p-4">
          <RoundIcon imageUrl={Clipboard} backgroundColor="tertiary" />
          <div>
            <Typography
              type="h2"
              align="left"
              weight="bold"
              color="textDark"
              text={`Back-refferals for ${mother?.user?.firstName || ''} `}
            />
            <Typography
              className="col-span-2 row-span-2"
              type="body"
              align="left"
              weight="skinny"
              text={`${completedreferralsForMother?.length} back-referrals to update`}
              color="textMid"
            />
          </div>
        </div>
      )}

      {/* BODY: REFERRALS -----------------------------------------*/}
      {isReferralsView && referralsForMother?.length !== 0 && (
        <div className="px-4 pb-4 pt-7">
          <Typography
            type="h4"
            align="left"
            weight="bold"
            text="Tap the boxes once you have made the referrals on paper"
            color="textDark"
            className="mb-4"
          />

          {showMarkAllButton && (
            <Button
              text="Mark all as done"
              icon="CheckCircleIcon"
              type="filled"
              color="primary"
              textColor="white"
              className="mb-4 w-full"
              iconPosition="start"
              onClick={onMarkAll}
            />
          )}

          {sections &&
            sections?.map((section) => (
              <Fragment key={section.value}>
                <Typography
                  type="h3"
                  text={section.label || ''}
                  color="textDark"
                />
                {questions?.[section.value].map((item: VisitDataStatus) => (
                  <>
                    <CheckboxGroup
                      id={item?.id}
                      key={item?.id}
                      title={item?.comment || ''}
                      titleColours="textMid"
                      checked={item?.isCompleted}
                      name={section?.value || ''}
                      value={item?.comment || ''}
                      onChange={(event) => onCheckboxChange(event)}
                    />

                    <Typography
                      key={`datekey_${item?.id}`}
                      type="small"
                      text={format(new Date(item.insertedDate), 'dd MMM yyyy')}
                      color="textDark"
                      align="right"
                      weight="semibold"
                      className="mt-0"
                    />
                  </>
                ))}
              </Fragment>
            ))}

          {/* Show success message when all referrals are selected */}
          {!showMarkAllButton && (
            <>
              <Alert
                type="success"
                className="mt-4"
                messageColor="successDark"
                variant="flat"
                message={`Great job! You have made all referrals for ${
                  mother?.user?.firstName || ''
                }`}
                customIcon={
                  <div>
                    <PollyImpressed className="h-14 w-14" />
                  </div>
                }
              />

              <Button
                text="Manage back-referrals"
                icon="ClipboardCheckIcon"
                type="outlined"
                color="primary"
                textColor="primary"
                className="mt-4 w-full"
                iconPosition="start"
                onClick={onShowBackReferrals}
              />
            </>
          )}
        </div>
      )}

      {/* BODY: BACK-REFERRALS -----------------------------------------*/}
      {!isReferralsView && completedreferralsForMother?.length > 0 && (
        <div className="px-4 pb-4 pt-7">
          {completedreferralsForMother?.map((item: VisitDataStatus) => (
            <div>
              <div className="my-4 flex items-center gap-3">
                <div className="flex flex-col">
                  <Typography
                    key={`brcomment_${item?.id}`}
                    type="h4"
                    align="left"
                    weight="bold"
                    text={item?.comment || ''}
                    color="textDark"
                    hasMarkup={true}
                  />
                  <Typography
                    key={`brdate_${item?.id}`}
                    type="body"
                    align="left"
                    weight="skinny"
                    text={`Reffered on ${format(
                      new Date(item.insertedDate),
                      'dd MMM yyyy'
                    )}`}
                    color="textMid"
                    className="text-sm"
                  />
                </div>
                <Button
                  key={`brbutton_${item?.id}`}
                  text="Update"
                  icon="PencilIcon"
                  type="filled"
                  color="secondary"
                  textColor="white"
                  className="h-10 w-48"
                  iconPosition="end"
                  onClick={() => onUpdateBackReferral(item.id)}
                />
              </div>
              <Divider
                key={`divider_${item?.id}`}
                className="p-4"
                dividerType="dashed"
              />
            </div>
          ))}

          {/* Show referral button here when there are no back-referral   */}
          <Button
            text="Manage referrals"
            icon="ClipboardCheckIcon"
            type="filled"
            color="primary"
            textColor="white"
            className="mt-4 w-full"
            iconPosition="start"
            onClick={onShowReferrals}
          />
        </div>
      )}

      {/* EMPTY BODY: REFERRALS -----------------------------------------*/}
      {isReferralsView && referralsForMother?.length === 0 && (
        <div className="px-4 pb-4 pt-7">
          <div className="text-textMid flex w-full flex-wrap justify-center rounded-2xl py-6 px-4">
            <div className="bg-tertiary flex h-24 w-24 items-center justify-center rounded-full">
              <img src={thumbsUpImage} alt="momImage" className="h-26 w-29" />
            </div>
            <div className="flex w-full justify-center">
              <Typography
                type="h3"
                color={'textDark'}
                text={`No referrals for ${mother?.user?.firstName || ''}! `}
                className="pt-2"
                align="center"
              />
            </div>
            <Typography
              type="body"
              align="center"
              weight="skinny"
              text="You can see and manage all your completed referrals & update back-referrals here."
              color="textMid"
            />
          </div>

          {/* Show back referral button when there are completed referrals  */}
          {completedreferralsForMother?.length > 0 && (
            <Button
              text="Manage back-referrals"
              icon="ClipboardCheckIcon"
              type="outlined"
              color="primary"
              textColor="primary"
              className="mt-4 w-full"
              iconPosition="start"
              onClick={onShowBackReferrals}
            />
          )}
        </div>
      )}

      {/* EMPTY BODY: BACK-REFERRALS -----------------------------------------*/}
      {!isReferralsView && completedreferralsForMother?.length === 0 && (
        <div className="px-4 pb-4 pt-7">
          <div className="text-textMid flex w-full flex-wrap justify-center rounded-2xl py-6 px-4">
            <div className="bg-tertiary flex h-24 w-24 items-center justify-center rounded-full">
              <img src={thumbsUpImage} alt="momImage" className="h-26 w-29" />
            </div>
            <div className="flex w-full justify-center">
              <Typography
                type="h3"
                color={'textDark'}
                text={`All back-referrals are complted for ${
                  mother?.user?.firstName || ''
                }! `}
                className="pt-2"
                align="center"
              />
            </div>
            <Typography
              type="body"
              align="center"
              weight="skinny"
              text="You can see your complted back-referrals here."
              color="textMid"
            />
          </div>

          {/* Show referral button here when there are no back-referral   */}
          <Button
            text="Manage referrals"
            icon="ClipboardCheckIcon"
            type="outlined"
            color="primary"
            textColor="primary"
            className="mt-4 w-full"
            iconPosition="start"
            onClick={onShowReferrals}
          />
        </div>
      )}
    </div>
  );
};
