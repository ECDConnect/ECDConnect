import { classNames, Divider, ProgressBar, Typography } from '@ecdlink/ui';
import { Step } from '.';
import { Card } from '../intro-screen/components/card';
import { GrowthCard } from '../intro-screen/components/growth-card';

export const Screen1 = ({ infantName, caregiverName, className }: Step) => {
  return (
    <div className={classNames('h-full p-4', className)}>
      <div id="step1">
        <div className="flex gap-4">
          <Typography
            className="w-2/4"
            type="h4"
            text={`${caregiverName} & ${infantName} are doing well!`}
          />
          <div className="w-2/4">
            <ProgressBar
              label="7/7"
              subLabel="score"
              value={100}
              primaryColour="successMain"
              secondaryColour="successBg"
            />
          </div>
        </div>
        <Divider dividerType="dashed" className="my-8" />
        <Typography
          className="mb-8"
          type="h4"
          text={`Here is a summary of how ${infantName} & ${caregiverName} are doing`}
        />
        <GrowthCard
          text={`${infantName} is growing well!`}
          color="successMain"
          icon="BadgeCheckIcon"
        />
        <Card
          className="my-4"
          label="Weight"
          value="4.2"
          date={new Date().toString()}
          message="Normal"
          color="Success"
        />
      </div>
    </div>
  );
};
