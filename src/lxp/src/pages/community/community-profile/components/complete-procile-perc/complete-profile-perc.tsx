import { communitySelectors } from '@/store/community';
import { Card, Colours, ProgressBar, Typography } from '@ecdlink/ui';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as PositiveEmoticon } from '@/assets/positive-green-emoticon.svg';
import { ReactComponent as NeutralEmoticon } from '@/assets/blueFace.svg';
import { ReactComponent as MehEmoticon } from '@/assets/mehFace.svg';

export const CompleteProfilePerc = () => {
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const completenessPerc = communityProfile?.completenessPerc;
  const getBgColor = useMemo(() => {
    if (completenessPerc) {
      if (completenessPerc < 11) {
        return 'alertBg';
      } else if (completenessPerc < 61) {
        return 'quatenaryBg';
      } else return 'successBg';
    }
    return '';
  }, [completenessPerc]);

  const getProgressBarColor = useMemo(() => {
    if (completenessPerc) {
      if (completenessPerc < 11) {
        return 'alertMain';
      } else if (completenessPerc < 61) {
        return 'quatenary';
      } else return 'successMain';
    }
    return 'successBg';
  }, [completenessPerc]);

  const getCardAvatar = useMemo(() => {
    if (completenessPerc) {
      if (completenessPerc < 11) {
        return <MehEmoticon />;
      } else if (completenessPerc < 61) {
        return <NeutralEmoticon />;
      } else return <PositiveEmoticon />;
    }
    return null;
  }, [completenessPerc]);
  return (
    <div>
      <Card className={`bg-${getBgColor} rounded-2xl`}>
        <div className="flex items-center gap-4 p-4">
          <div>{getCardAvatar}</div>
          <div className="w-full">
            <Typography
              type={'h1'}
              color="textDark"
              weight="bold"
              text={`${completenessPerc}% complete!`}
            />
            <ProgressBar
              label=""
              subLabel=""
              value={completenessPerc!}
              primaryColour={getProgressBarColor}
              secondaryColour={'white'}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
