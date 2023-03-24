import { SuccessCard } from '@/components/success-card/success-card';
import { Label, TipCard } from '../../../components';
import CareForMomImage from '../../activity-list/forms/assets/careForMom.png';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { Step } from '.';
import { classNames, Divider } from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';

export const Screen3 = ({
  caregiverName,
  className,
  showComponent,
  onClick,
}: Step) => {
  const { width, height } = useWindowSize();

  return (
    <div className={classNames('relative h-full', className)}>
      {!showComponent && (
        <div
          className="absolute top-0 z-10 bg-white"
          style={{ height, width }}
        />
      )}
      <img src={CareForMomImage} className="w-full" alt="care for mom" />
      <div className="flex flex-col gap-4 p-4" id="step4">
        <div id="step5">
          <TipCard
            buttonText="See more info"
            buttonIcon="InformationCircleIcon"
            onClick={() => onClick?.()}
          />
        </div>
        <SuccessCard
          customIcon={<CelebrateIcon className="h-14	w-14" />}
          text={`Congratulations to ${caregiverName || ''}!`}
          textColour="successDark"
          subTextColours="textDark"
          color="successBg"
        />
        <Divider dividerType="dashed" />
        <Label text={`Ask ${caregiverName || ''} how they are feeling.`} />
        <Divider dividerType="dashed" />
      </div>
    </div>
  );
};
