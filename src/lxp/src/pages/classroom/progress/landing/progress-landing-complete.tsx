import {
  Alert,
  Button,
  Card,
  Divider,
  ListItem,
  Typography,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { ChildDto } from '@ecdlink/core';
import { ReactComponent as EmojiYellowSmile } from '@/assets/ECD_Connect_emoji3.svg';
import { format, isBefore } from 'date-fns';
import { ProgressReportPeriod } from '@/models/progress/progress-report-period';
import { useState } from 'react';
import { ChildProgressDetailedReport } from '@/models/progress/child-progress-report';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@/store/progress-tracking';

export type ProgressLandingCompleteProps = {
  childId: string;
  child: ChildDto;
  currentReportingPeriod: ProgressReportPeriod;
  currentReport: ChildProgressDetailedReport;
};

export const ProgressLandingComplete: React.FC<
  ProgressLandingCompleteProps
> = ({ childId, child, currentReportingPeriod, currentReport }) => {
  const history = useHistory();
  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories
  );
  const subCategory = useSelector(
    progressTrackingSelectors.getProgressTrackingSubCategories
  );

  console.log('categories', categories);
  console.log('subCategory', subCategory);

  const [showDetails, setShowDetails] = useState(false);

  const isBeforePeriod = isBefore(
    new Date(),
    new Date(currentReportingPeriod.startDate)
  );

  return (
    <>
      <Card className="bg-successMain my-4 flex items-center gap-4 rounded-2xl p-4">
        <EmojiYellowSmile className="h-16 w-12" />
        <Typography
          type="h3"
          weight="bold"
          color="white"
          text={`You have completed ${child.user?.firstName}'s progress observations!`}
        />
      </Card>
      {isBeforePeriod && (
        <Alert
          type={'info'}
          messageColor="textDark"
          title={`You can create the caregiver report from ${format(
            new Date(currentReportingPeriod.startDate),
            'd MMMM'
          )}`}
          list={[
            `Keep observing ${child.user?.firstName} & tap "See completed sections" to edit you observations.`,
          ]}
        />
      )}
      {!isBeforePeriod && (
        <Typography
          type="body"
          color="textMid"
          text={
            'You can edit your observations, add a note, or create the progress report.'
          }
        />
      )}
      <ListItem
        key={'notes'}
        title={'Add a note'}
        subTitle={'Write a note or observation'}
        buttonType={'filled'}
        buttonIcon={'PlusIcon'}
        buttonText={'Add'}
        buttonTextColor={'white'}
        buttonColor={'quatenary'}
        showButton={true}
        showDivider={true}
        withBorderRadius={false}
        dividerType={'dashed'}
        withPaddingY={true}
        onButtonClick={() => {}} // TODO
      />
      <Button
        onClick={() =>
          history.push(ROUTES.PROGRESS_OBSERVATIONS, {
            childId: childId,
          })
        }
        className="mt-auto mb-4 w-full"
        size="normal"
        color="quatenary"
        type="filled"
        icon="ArrowCircleRightIcon"
        text="Keep tracking progress"
        textColor="white"
      />
      <Button
        onClick={() => setShowDetails(!showDetails)}
        className="mb-4 w-full"
        size="normal"
        color="quatenary"
        type="outlined"
        icon={showDetails ? 'EyeOffIcon' : 'EyeIcon'}
        text={showDetails ? 'Hide details' : 'Show details'}
        textColor="quatenary"
      />
      {showDetails && (
        <>
          <Divider dividerType="dashed" />
          <Typography
            type="h3"
            color="textDark"
            text={`What you are working on with ${child.user?.firstName}`}
          />
          <Card className="bg-uiBg rounded-2xl p-4">
            {categories
              .filter((x) =>
                currentReport.skillObservations.some(
                  (y) => y.categoryId === x.id && y.value === "Don't know"
                )
              )
              .map(
                (
                  category // TODO - remove hardcoding
                ) => (
                  <div key={category.id}>
                    <Typography
                      type="h3"
                      color="textDark"
                      text={category.name}
                    />
                    {/* TODO - map subcateogies and skills */}
                    {/* TODO - map skills to work on */}
                    {/* TODO - add category / subcategory images */}
                  </div>
                )
              )}
          </Card>
        </>
      )}
    </>
  );
};
