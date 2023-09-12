import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { EmptyPage, FADButton } from '@ecdlink/ui';

export const ClubsTab = () => {
  return (
    <div className="p-4 text-black">
      <EmptyPage
        image={AlienImage}
        title="You don’t have any clubs yet!"
        subTitle="Add a new club or, if you already have clubs, please reach out to your franchisor to make sure they have been assigned to you on Funda App."
      />
      <FADButton
        title="Add a new club"
        icon="PlusIcon"
        iconDirection="left"
        textToggle
        type="filled"
        color="primary"
        shape="round"
        className="absolute bottom-1 right-1 z-10 m-3 px-3.5 py-2.5"
        click={() => {}}
      />
    </div>
  );
};
