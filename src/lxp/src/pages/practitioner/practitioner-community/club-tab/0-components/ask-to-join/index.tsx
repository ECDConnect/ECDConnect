import { useEffect, useState } from 'react';
import {
  getStorageItem,
  setStorageItem,
} from '@/utils/common/local-storage.utils';
import { LocalStorageKeys } from '@ecdlink/core';
import { AskCoach } from './components/ask-coach';
import { AskCallCentre } from './components/ask-call-center';

export const AskToJoin: React.FC = () => {
  const [hasTwoWeeksPassed, setHasTwoWeeksPassed] = useState<boolean>();

  // Check how long they have been out of a club and viewed this screen
  useEffect(() => {
    const storageItem = getStorageItem<number>(
      LocalStorageKeys.askToJoinClubViewed
    );

    const now = new Date().getTime();

    if (!storageItem) {
      setHasTwoWeeksPassed(false);
      setStorageItem(now, LocalStorageKeys.askToJoinClubViewed);
    } else {
      var millisecondsSinceViewed = now - storageItem;
      var daysSinceViewed = millisecondsSinceViewed / (1000 * 60 * 60 * 24);

      setHasTwoWeeksPassed(daysSinceViewed > 14);
    }
  }, []);

  return hasTwoWeeksPassed ? <AskCallCentre /> : <AskCoach />;
};
