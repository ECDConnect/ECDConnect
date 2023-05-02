import { FormComponentProps } from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  Button,
  Dialog,
  Typography,
  DialogPosition,
  renderIcon,
  classNames,
} from '@ecdlink/ui';
import { ChildDevelopmentLevelFormModel } from '@schemas/classroom/child-progress-observations/child-development-level-form';
import { useSelector } from 'react-redux';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import { childrenSelectors } from '@store/children';
import { progressTrackingSelectors } from '@store/progress-tracking';
import ChildDevelopmentLevelsDisplay from '../../components/child-development-levels-display/child-development-levels-display';
import { useState } from 'react';

interface ChildDevelopmentLevelFormProps
  extends FormComponentProps<ChildDevelopmentLevelFormModel> {
  childDevelopmentLevelForm?: ChildDevelopmentLevelFormModel;
  childId: string;
  childAchievedLevelId: number;
}

export const ChildDevelopmentLevelForm: React.FC<
  ChildDevelopmentLevelFormProps
> = ({ childId, childAchievedLevelId, onSubmit }) => {
  const currentChild = useSelector(childrenSelectors.getChildById(childId));
  const [developmentLevelsDisplayActive, setDevelopmentLevelsDisplayActive] =
    useState(false);
  const currentChildUser = useSelector(
    childrenSelectors.getChildUserById(currentChild?.userId)
  );
  const { getLevelSummaryText } = useChildProgressObservation(childId);

  const levels = useSelector(
    progressTrackingSelectors.getProgressTrackingLevels
  );

  const currentChildLevel = levels.find(
    (level) => level.id === childAchievedLevelId
  );

  const handleFormSubmit = () => {
    if (onSubmit) {
      onSubmit({
        practitionerAgreeToLevel: true,
        levelId: currentChildLevel?.id || 0,
      });
    }
  };

  const openLevelDescriptions = () => {
    setDevelopmentLevelsDisplayActive(!developmentLevelsDisplayActive);
  };

  return (
    <>
      <div className={'bg-white px-4 pt-2'}>
        <Typography
          type={'h1'}
          text={`${currentChildUser?.firstName}’s developmental stage:`}
          color={'textDark'}
        />
        <div className={'flex flex-row items-center'}>
          {currentChildLevel?.imageUrl && (
            <img src={currentChildLevel?.imageUrl} alt="child level" />
          )}
          <Typography
            className={'ml-2'}
            type={'body'}
            text={currentChildLevel?.name || 'Beginning'}
            color={'textMid'}
          />
        </div>
        <div>
          <Alert
            type="info"
            title={getLevelSummaryText(
              childAchievedLevelId,
              currentChildUser?.firstName || ''
            )}
            className={'mt-4'}
            button={
              <Button
                onClick={() => openLevelDescriptions()}
                className="w-full"
                size="small"
                color="primary"
                type="filled"
              >
                {renderIcon(
                  'QuestionMarkCircleIcon',
                  classNames('h-5 w-5 text-white')
                )}
                <Typography
                  type="small"
                  className="ml-2"
                  text="What does this mean?"
                  color="white"
                />
              </Button>
            }
          />
          <Button
            onClick={handleFormSubmit}
            className="mt-4 w-full"
            size="small"
            color="primary"
            type="filled"
            disabled={false}
          >
            {renderIcon(
              'ArrowCircleRightIcon',
              classNames('h-5 w-5 text-white')
            )}
            <Typography type="h6" className="ml-2" text="Next" color="white" />
          </Button>
        </div>
      </div>
      <Dialog
        fullScreen={false}
        visible={developmentLevelsDisplayActive}
        position={DialogPosition.Full}
      >
        <BannerWrapper
          size="small"
          onBack={openLevelDescriptions}
          title="Tracking progress"
          renderOverflow
        >
          <ChildDevelopmentLevelsDisplay onClose={openLevelDescriptions} />
        </BannerWrapper>
      </Dialog>
    </>
  );
};
