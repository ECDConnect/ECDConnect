import { getInfantCurrentVisitSelector } from '@/store/infant/infant.selectors';
import { Button } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

export const ProgressTab = () => {
  const history = useHistory();

  const location = useLocation();

  const currentVisit = useSelector(getInfantCurrentVisitSelector);

  return (
    <div className="mt-16 p-4">
      <Button
        className="w-full"
        type="filled"
        color="primary"
        textColor="white"
        text="Start visit"
        onClick={() =>
          history.push(
            `${location.pathname}/activities-form/${currentVisit?.id || ''}`
          )
        }
      />
    </div>
  );
};
