import { motherSelectors } from '@/store/mother';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

export const ProgressTab = () => {
  const history = useHistory();

  const location = useLocation();

  const lasAttendedVisit = useSelector(
    motherSelectors.getMotherLastVisitSelector
  );

  useLayoutEffect(() => {
    if (lasAttendedVisit) {
      history.push(
        `${location.pathname}/activities-form/${lasAttendedVisit?.id}`
      );
    }
  });

  return (
    <div className="mt-16 p-4">
      {/* <Button
        className="w-full"
        type="filled"
        color="primary"
        textColor="white"
        text="Start visit"
        onClick={() =>
          history.push(
            `${location.pathname}/activities-form/${lasAttendedVisit?.id}`
          )
        }
      /> */}
    </div>
  );
};
