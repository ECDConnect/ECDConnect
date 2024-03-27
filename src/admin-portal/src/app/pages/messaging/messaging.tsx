import { useHistory } from 'react-router';
import { MessageRoutes } from '../../routes/app.routes';
import { useEffect } from 'react';

export default function Messaging() {
  const history = useHistory();

  useEffect(() => {
    localStorage.removeItem('selectedMessage');

    async function init() {
      history.push({
        pathname: '/messaging/list-messages',
        state: {
          component: 'messaging',
        },
      });
    }
    init().catch(console.error);
  }, [history]);

  return (
    <div className="bg-white">
      <div className="m-5 flex flex-col">
        <MessageRoutes />
      </div>
    </div>
  );
}
