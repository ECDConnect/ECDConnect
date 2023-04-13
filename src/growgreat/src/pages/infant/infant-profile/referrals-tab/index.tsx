import { Button, Checkbox, RoundIcon, Typography } from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';
import { InfantProfileParams } from '../infant-profile.types';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import Clipboard from '@/assets/clipboardIcon.svg';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useAppDispatch } from '@/store';
import { getInfantById } from '@/store/infant/infant.selectors';
import thumbsUpImage from '@/assets/thumbsUp.png';
import { infantSelectors, infantThunkActions } from '@/store/infant';

const HEADER_HEIGHT = 64;

export const ReferralsTab: React.FC = () => {
  const { height } = useWindowSize();
  const { id: infantId } = useParams<InfantProfileParams>();
  const referralsForInfant =
    useSelector(infantSelectors.getReferralsForInfantSelector) || [];
  const backReferralsForInfant = useSelector(
    infantSelectors.getBackReferralsForInfantSelector
  );
  const referralCompleted = false;
  const backReferralCompleted = false;
  const [currentOption, setCurrentOption] = useState<string>();

  const [checkedList, setCheckedList] = useState<
    { id: string; isCompleted: boolean }[]
  >([]);

  const appDispatch = useAppDispatch();

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  useLayoutEffect(() => {
    appDispatch(
      infantThunkActions.getReferralsForInfant({ infantId })
    ).unwrap();
    appDispatch(
      infantThunkActions.getBackReferralsForInfant({
        infantId,
        referralCompleted,
        backReferralCompleted,
      })
    ).unwrap();
  }, [appDispatch, infantId, referralCompleted, backReferralCompleted]);

  const onMarkAll = useCallback(() => {}, []);
  const onManageBackReferrals = useCallback(() => {}, []);

  const handleSelect = useCallback(
    (event) => {
      const id = event.target.value;
      const isChecked = event.target.checked;
      if (isChecked) {
        // Add checked item to list
        setCheckedList([...checkedList, { id: id, isCompleted: isChecked }]);
      } else {
        // Remove unchecked item from checkList
        const filteredList = checkedList.filter((item) => item.id !== id);
        setCheckedList(filteredList);
      }
    },
    [checkedList]
  );

  const handleSelect2 = useCallback(
    (item) => {
      const id = item.id;
      const isChecked = item.isCompleted;
      if (isChecked) {
        // Add checked item to list
        setCheckedList([...checkedList, { id: id, isCompleted: isChecked }]);
      } else {
        // Remove unchecked item from checkList
        const filteredList = checkedList.filter((item) => item.id !== id);
        setCheckedList(filteredList);
      }
    },
    [checkedList]
  );

  console.log('handleSelect2', checkedList);

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

      {referralsForInfant?.length !== 0 && (
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

          {referralsForInfant.map((item, index) => (
            <div
              className="bg-uiBg mt-2 flex items-center rounded-xl p-4"
              key={item?.comment}
            >
              <input
                type="checkbox"
                name="referrals"
                className="focus:ring-primary text-primary h-4 w-4 rounded border-gray-300"
                value={item.id}
                onChange={handleSelect}
              />

              <Typography
                type="body"
                align="left"
                weight="skinny"
                className="ml-4"
                text={item?.comment || ''}
                color="textMid"
                hasMarkup={true}
              />
              {referralsForInfant.length - 1 > index && (
                <button
                  className="ml-auto"
                  onClick={() => {
                    setCurrentOption(item.id);
                  }}
                ></button>
              )}
            </div>
          ))}
        </div>
      )}

      {referralsForInfant?.length === 0 && (
        <div className="px-4 pb-4 pt-7">
          <div className="text-textMid flex w-full flex-wrap justify-center rounded-2xl py-6 px-4">
            <div className="bg-tertiary flex h-24 w-24 items-center justify-center rounded-full">
              <img src={thumbsUpImage} alt="momImage" className="h-26 w-29" />
            </div>
            <div className="flex w-full justify-center">
              <Typography
                type="h3"
                color={'textDark'}
                text={`No referrals for ${infant?.user?.firstName || ''}! `}
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
            {backReferralsForInfant?.length !== 0 && (
              <Button
                text="Manage back-referrals"
                icon="ClipboardCheckIcon"
                type="outlined"
                color="primary"
                textColor="primary"
                className="mt-4 w-full"
                iconPosition="start"
                onClick={onManageBackReferrals}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
