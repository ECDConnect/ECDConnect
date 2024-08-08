import { detailTexts } from '@/pages/coach/coach-practitioner-journey/forms/reaccreditation/step-8/options';
import { Button, Card, Divider, Typography } from '@ecdlink/ui';

interface DetailsCardProps {
  title: string;
  detailOne?: string;
  textOne?: string;
  detailTwo?: string;
  textTwo?: string;
  isFilled?: boolean;
  isAbout?: boolean;
  action?: (item: boolean) => void;
  connectionProfile?: boolean;
}

export const DetailsCard: React.FC<DetailsCardProps> = ({
  title,
  detailOne,
  detailTwo,
  textOne,
  textTwo,
  isFilled,
  isAbout,
  action,
  connectionProfile,
}) => {
  return (
    <div className="mb-2">
      <Card className="bg-adminBackground rounded-2xl p-4">
        <div>
          <div className="flex items-center justify-between">
            <Typography type={'h4'} text={title} color={'textDark'} />
            {!connectionProfile && (
              <Button
                className={'mt-3 rounded-xl'}
                type="filled"
                color={isFilled ? 'secondaryAccent2' : 'quatenary'}
                icon={isFilled ? 'PencilIcon' : 'PlusIcon'}
                textColor={isFilled ? 'secondary' : 'white'}
                text={isFilled ? 'Edit' : 'Add'}
                size="small"
                iconPosition={isFilled ? 'end' : 'start'}
                onClick={() => action && action(true)}
              />
            )}
          </div>
          <Divider dividerType="dashed" className="my-2" />
          <div className="flex flex-col gap-2">
            <div>
              {detailOne && (
                <Typography
                  type={'h4'}
                  text={detailOne}
                  color={'textDark'}
                  className="mt-1"
                />
              )}
              <Typography
                type={'body'}
                text={
                  textOne
                    ? textOne
                    : isAbout && !connectionProfile
                    ? "None - please add. Here's some space to tell others a little more about yourself."
                    : 'None'
                }
                color={'textMid'}
                className="mt-1"
              />
            </div>
            <div>
              {detailTwo && (
                <>
                  <Typography
                    type={'h4'}
                    text={detailTwo}
                    color={'textDark'}
                    className="mt-1"
                  />
                  <Typography
                    type={'body'}
                    text={textTwo || 'None'}
                    color={'textMid'}
                    className="mt-1"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
