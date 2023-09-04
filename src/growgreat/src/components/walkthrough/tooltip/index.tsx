import {
  Button,
  Card,
  SliderPagination,
  Typography,
  classNames,
} from '@ecdlink/ui';
import { TooltipRenderProps } from 'react-joyride';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';

type TooltipProps = TooltipRenderProps & {
  className?: string;
  isLoading?: boolean;
  pollyInformationalSteps?: number[];
  pollyImpressedSteps?: number[];
  pollyTimeSteps?: number[];
  pollyNeutralSteps?: number[];
  displayCloseButton?: boolean;
};

export function Tooltip({
  index,
  className,
  isLoading,
  isLastStep,
  primaryProps,
  size,
  step,
  tooltipProps,
  pollyInformationalSteps,
  pollyImpressedSteps,
  pollyNeutralSteps,
  pollyTimeSteps,
  displayCloseButton,
}: TooltipProps) {
  return (
    <div
      {...tooltipProps}
      className={classNames(className, !isLastStep ? 'ml-5' : 'mr-1')}
    >
      <Card className="mt-auto rounded-2xl p-6">
        {step.content && (
          <div className="flex items-center gap-4 align-middle">
            {pollyInformationalSteps?.includes(index) && (
              <div className="bg-tertiary h-20 w-20 rounded-full">
                <Polly className="h-20 w-20" />
              </div>
            )}
            {pollyNeutralSteps?.includes(index) && (
              <div>
                <PollyNeutral className="h-20 w-20" />
              </div>
            )}
            {pollyImpressedSteps?.includes(index) && (
              <div>
                <PollyImpressed className="h-20 w-20" />
              </div>
            )}
            {pollyTimeSteps?.includes(index) && (
              <div>
                <PollyTime className="h-20 w-20" />
              </div>
            )}
            <Typography
              color={'textDark'}
              type={'h2'}
              weight={'normal'}
              text={String(step?.content)}
            />
          </div>
        )}
        <div className="mt-4 flex justify-between gap-4">
          {index <= size - 2 && (
            <SliderPagination
              totalItems={size - 1}
              activeIndex={index}
              className={'py-4'}
            />
          )}
          {!step.spotlightClicks && (
            <div {...primaryProps} className={'flex w-full justify-end'}>
              <Button
                isLoading={isLoading}
                disabled={isLoading}
                type="filled"
                color="primary"
                textColor="white"
                className="w-full"
                icon={displayCloseButton ? 'ArrowCircleRightIcon' : 'XIcon'}
                text={displayCloseButton ? 'Next' : 'Close'}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
