import { Button, RoundIcon, Typography } from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';
import { InfantProfileParams } from '../infant-profile.types';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import Clipboard from '@/assets/clipboardIcon.svg';
import { useCallback, useLayoutEffect } from 'react';
import { getReferralsForInfantSelector } from '@/store/referral/referral.selectors';
import { useAppDispatch } from '@/store';
import { referralThunkActions } from '@/store/referral';
import { getInfantById } from '@/store/infant/infant.selectors';

const HEADER_HEIGHT = 64;

export const ReferralsTab: React.FC = () => {
  const { height } = useWindowSize();
  const { id: infantId } = useParams<InfantProfileParams>();
  const referralsForInfant = useSelector(getReferralsForInfantSelector);
  const appDispatch = useAppDispatch();

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  console.log('referralsForInfant', referralsForInfant);
  console.log('infant', infant);

  useLayoutEffect(() => {
    appDispatch(
      referralThunkActions.getReferralsForInfant({ infantId })
    ).unwrap();
  }, [appDispatch, infantId]);

  const onMarkAll = useCallback(() => {}, []);

  return (
    <div className="flex flex-col" style={{ height: height - HEADER_HEIGHT }}>
      <div className="bg-uiBg mt-14 flex items-center gap-2 p-4">
        <RoundIcon imageUrl={Clipboard} backgroundColor="tertiary" />
        <div>
          <Typography
            type="h2"
            align="left"
            weight="bold"
            text={`Referrals for ${infant?.user?.firstName || ''} `}
            color="textDark"
            className="col-span-2"
          />
          <Typography
            className="col-span-2 row-span-2"
            type="body"
            align="left"
            weight="skinny"
            text={`${referralsForInfant?.length} referrals`}
            color="textMid"
          />
        </div>
      </div>
      <div className="px-4 pb-4 pt-7">
        <Typography
          type="h4"
          align="left"
          weight="bold"
          text="Tap the boxes once you have made the referrals on paper"
          color="textDark"
        />
        <Button
          text="Mark all as done"
          icon="CheckCircleIcon"
          type="filled"
          color="primary"
          textColor="white"
          className="mt-4 w-full"
          iconPosition="start"
          onClick={onMarkAll}
        />
      </div>
    </div>
  );
};
