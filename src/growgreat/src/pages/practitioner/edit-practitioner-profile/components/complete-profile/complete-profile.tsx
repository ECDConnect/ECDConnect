import { NotificationHeaderCard } from '@/pages/dashboard/components/notification-header-card/notification-header-card';

export const CompleteProfile: React.FC = () => {
  return (
    <div className="px-4">
      <NotificationHeaderCard
        header={'Tell us more about you!'}
        message={
          'Share more information about who you are to make CHW Connect more useful for you.'
        }
        actionText={'Tell us more about you!'}
        onActioned={() => {}}
      />
    </div>
  );
};

export default CompleteProfile;
