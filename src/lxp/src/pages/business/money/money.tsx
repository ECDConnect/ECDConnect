import { Typography, Card, Button, FADButton } from '@ecdlink/ui';
import { ReactComponent as MoneyIcon } from '@/assets/moneyIcon.svg';
import * as styles from './money.styles';

export const Money = () => {
  return (
    <>
      <div className="h-full pt-7">
        <div className="mt-2 flex flex-wrap justify-center p-8">
          <div className="">
            <MoneyIcon />
          </div>
          <div>
            <Typography
              className="mt-4 text-center"
              color="textDark"
              text="You don't have any income statements yet!"
              type={'h3'}
            />
          </div>
          <div>
            <Typography
              className="mt-2 text-center"
              color="textMid"
              text="Tap “Add income or expense” to get started"
              type={'body'}
            />
          </div>
        </div>

        <FADButton
          title={'Add income or expense'}
          icon={'PlusIcon'}
          iconDirection={'left'}
          textToggle={true}
          type={'filled'}
          color={'primary'}
          shape={'round'}
          className={styles.fadButton}
          click={() => {}}
        />
      </div>
    </>
  );
};
