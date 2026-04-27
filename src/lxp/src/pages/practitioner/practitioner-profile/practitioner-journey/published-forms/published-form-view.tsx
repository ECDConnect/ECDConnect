import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import {
  Alert,
  BannerWrapper,
  Button,
  Card,
  Colours,
  Divider,
  ListItem,
  Typography,
} from '@ecdlink/ui';
import { getJourneyAssessmentReportByIdSelector } from '@/store/pqa/pqa.selectors';
import { userSelectors } from '@/store/user';
import { PractitionerProfileRouteState } from '../../practitioner-profile.types';
import { ReactComponent as PositiveEmoticon } from '@/assets/positive-green-emoticon.svg';
import { ReactComponent as NeutralEmoticon } from '@/assets/neutral_blue_emoticon.svg';
import { ReactComponent as VeryUnhappy } from '@/assets/ECD_Connect_emoji_unhappy.svg';
import { ReactComponent as MehEmoticon } from '@/assets/mehFace.svg';
import { Score } from './score';

export type ViewPublishedFormProps = {
  onBack: () => void;
};

type FeedbackSectionProps = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  bg: string;
  color: Colours;
  title: string;
  subtitle: string;
  items: string[];
  iconName: string;
  iconColor: Colours;
};

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  icon: Icon,
  bg,
  color,
  title,
  subtitle,
  items,
  iconName,
  iconColor,
}) => {
  if (!items?.length) return null;

  return (
    <>
      <Card className={`${bg} mb-4 flex items-center gap-4 rounded-2xl p-4`}>
        <Icon className="h-16 w-12" />
        <div className="flex flex-col">
          <Typography type="h3" weight="bold" color={color} text={title} />
          <Typography type="body" color="textMid" text={subtitle} />
        </div>
      </Card>

      {items.map((text, index) => (
        <ListItem
          key={`${color}-${index}`}
          title={text}
          iconName={iconName}
          iconColor={iconColor}
          showIcon
          showDivider={false}
          withBorderRadius
          className="no-hand-cursor"
        />
      ))}
      <Divider dividerType="dashed" className="my-2" />
    </>
  );
};

export const ViewPublishedForm: React.FC<ViewPublishedFormProps> = ({
  onBack,
}) => {
  const location = useLocation<PractitionerProfileRouteState>();
  const timelineReport = useSelector(
    getJourneyAssessmentReportByIdSelector(location.state.visitId)
  );
  const user = useSelector(userSelectors.getUser);
  const totalHealthCheckQuestions = 22;

  // Loading / Empty state
  if (!timelineReport) {
    return (
      <BannerWrapper
        size="normal"
        renderBorder
        title="Assessment Report"
        color="primary"
        onBack={onBack}
        onClose={onBack}
        backgroundColour="white"
      >
        <div className="p-4">
          <Typography type="body" text="No report data found." />
          <Button
            type="filled"
            text="Close"
            color="quatenary"
            textColor="white"
            className="mt-4 w-full rounded-2xl"
            onClick={onBack}
          />
        </div>
      </BannerWrapper>
    );
  }

  return (
    <BannerWrapper
      size="normal"
      renderBorder
      title={timelineReport?.name ?? 'Assessment'}
      color="primary"
      renderOverflow
      onBack={onBack}
      onClose={onBack}
      backgroundColour="white"
    >
      <div className="w-full p-4">
        <Typography
          className="mt-3"
          type="h3"
          weight="bold"
          text={`${timelineReport?.name} form`}
        />
        <Typography
          type="body"
          color="textMid"
          text={`${user?.firstName ?? ''} ${user?.surname ?? ''}`}
        />
        <Divider dividerType="dashed" className="my-2" />
        {/* Preschool detail */}
        {timelineReport?.preschoolDetail && (
          <>
            <Typography
              className="mt-3"
              type="h3"
              weight="bold"
              text={'Preschool detail'}
            />

            {timelineReport.preschoolDetail.map((detail, index) => (
              <Typography
                key={`preschool-detail-${index}`}
                type={'markdown'}
                text={detail}
              />
            ))}
            <Divider dividerType="dashed" className="my-2" />
          </>
        )}

        {timelineReport?.name === 'Health and safety check' && (
          <>
            <Typography
              className="mt-3"
              type="h3"
              weight="bold"
              text={'Health and Safety standards:'}
            />
            <div className="mb-4">
              {timelineReport.safetyStandards?.length! > 0 ? (
                <>
                  <Card className="bg-alertBg rounded-2xl">
                    <div className="flex items-center gap-4 p-4">
                      <VeryUnhappy className="h-12 w-12 shrink-0 text-white" />{' '}
                      <div className="flex-1">
                        <Typography
                          type="h3"
                          color="textDark"
                          weight="bold"
                          text="Some areas need attention"
                        />
                      </div>
                      <Score
                        sum={
                          totalHealthCheckQuestions -
                          (timelineReport.safetyStandards?.length || 0)
                        }
                        total={totalHealthCheckQuestions}
                      />
                    </div>
                  </Card>

                  <Typography
                    className="mt-3"
                    type="h4"
                    weight="bold"
                    text={'These standards were not met:'}
                  />

                  <Typography
                    type={'markdown'}
                    text={timelineReport
                      .safetyStandards!.map((d) => `* ${d}`)
                      .join('\n')}
                  />
                  <Divider dividerType="dashed" className="my-2" />
                </>
              ) : (
                <Card className="bg-successBg rounded-2xl">
                  <div className="flex items-center gap-4 p-4">
                    <PositiveEmoticon className="h-12 w-12 shrink-0 text-white" />{' '}
                    <div className="flex-1">
                      <Typography
                        type="h3"
                        color="textDark"
                        weight="bold"
                        text="All standards met!"
                      />
                    </div>
                    <Score
                      sum={totalHealthCheckQuestions}
                      total={totalHealthCheckQuestions}
                    />
                  </div>
                </Card>
              )}
            </div>
          </>
        )}

        {/* Classroom capacity */}
        {timelineReport?.classroomDetail!! &&
          timelineReport?.classroomDetail.length > 0 && (
            <>
              <Typography
                className="mt-3"
                type="h3"
                weight="bold"
                text={'Classroom capacity:'}
              />
              <div className="text-textMid bg-uiBg z-10 mx-auto w-full rounded-lg bg-white p-4">
                {timelineReport.classroomDetail.map((detail, index) => (
                  <Typography
                    key={`classroom-detail-${index}`}
                    type={'markdown'}
                    text={detail}
                  />
                ))}
              </div>
              <Divider dividerType="dashed" className="my-2" />
            </>
          )}

        {/* Text Q&A */}
        {timelineReport?.textQuestion && (
          <>
            <Typography
              className="mt-3"
              type="h3"
              weight="bold"
              text={timelineReport.textQuestion}
            />
            <Typography
              className="mt-3 mb-4"
              type="body"
              color="textMid"
              text={timelineReport.textAnswer}
            />
            <Divider dividerType="dashed" className="my-2" />
          </>
        )}

        {/* Green Section */}
        <FeedbackSection
          icon={PositiveEmoticon}
          bg="bg-successBg"
          color="successDark"
          title="You do these things all the time."
          subtitle="Great job!"
          items={timelineReport?.greenQuestions ?? []}
          iconName="CheckCircleIcon"
          iconColor="successMain"
        />

        {/* Blue Section */}
        <FeedbackSection
          icon={NeutralEmoticon}
          bg="bg-quatenaryBg"
          color="quatenaryMain"
          title="You do these things most of the time."
          subtitle="Keep it up! Aim for all the time!"
          items={timelineReport?.blueQuestions ?? []}
          iconName="ArrowCircleRightIcon"
          iconColor="quatenaryMain"
        />

        {/* Amber Section */}
        <FeedbackSection
          icon={MehEmoticon}
          bg="bg-alertBg"
          color="alertMain"
          title="You do these things sometimes."
          subtitle="Try to do these more often!"
          items={timelineReport?.amberQuestions ?? []}
          iconName="ExclamationCircleIcon"
          iconColor="alertMain"
        />

        {/* Daily Activities */}
        {(timelineReport?.dailyActivities?.length ?? 0) > 0 && (
          <>
            <Typography
              className="mt-3 mb-4"
              type="h3"
              text="You do these activities every day - great! Keep it up!"
            />
            {timelineReport?.dailyActivities?.map((text, index) => (
              <ListItem
                key={`daily-${index}`}
                title={text}
                iconName="CheckCircleIcon"
                iconColor="successMain"
                showIcon
                dividerType="none"
                className="no-hand-cursor"
              />
            ))}
            <Divider dividerType="dashed" className="my-2" />
          </>
        )}

        {/* Skipped Activities */}
        {(timelineReport?.skippedActivities?.length ?? 0) > 0 && (
          <>
            <Typography
              className="mt-3 mb-4"
              type="h3"
              text="You don't do these activities every day - try to include them more!"
            />
            {timelineReport?.skippedActivities?.map((text, index) => (
              <ListItem
                key={`skipped-${index}`}
                title={text}
                iconName="XCircleIcon"
                iconColor="errorMain"
                showIcon
                dividerType="none"
                className="no-hand-cursor"
              />
            ))}
            <Divider dividerType="dashed" className="my-2" />
          </>
        )}

        <Button
          type="filled"
          text="Close"
          color="quatenary"
          textColor="white"
          className="mb-8 w-full rounded-2xl"
          iconPosition="start"
          icon="XIcon"
          onClick={onBack}
        />
      </div>
    </BannerWrapper>
  );
};
