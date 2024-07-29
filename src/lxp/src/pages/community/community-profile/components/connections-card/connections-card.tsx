import { CommunityProfileDto } from '@ecdlink/core';
import { Button, Card, Typography, renderIcon } from '@ecdlink/ui';
import { useHistory } from 'react-router';
interface ConnectionsCardProps {
  title: string;
  subtitle: string;
  icon: string;
  connectionsNumber: number | undefined;
  route?: string;
  usersData?: CommunityProfileDto[];
  isConnectedScreen?: boolean;
}

export const ConnectionsCard: React.FC<ConnectionsCardProps> = ({
  title,
  subtitle,
  icon,
  connectionsNumber,
  route,
  usersData,
  isConnectedScreen,
}) => {
  const history = useHistory();

  return (
    <div>
      <Card className="bg-infoBb rounded-2xl p-4">
        <div className="w-ful flex gap-2">
          <div className="bg-infoMain flex h-12 w-12 items-center justify-center rounded-full p-2">
            {renderIcon(`${icon}`, 'h-8 w-8 text-white')}
          </div>
          <div>
            <Typography
              type={'h3'}
              color="textDark"
              text={title}
              className="mb-2"
            />
            <Typography
              type={'help'}
              weight="bold"
              color="textDark"
              text={subtitle}
            />
            <div className="flex items-center gap-1">
              <Typography
                type={'body'}
                weight="bold"
                color="textDark"
                text={String(connectionsNumber)}
              />
              <Typography type={'body'} color="textDark" text={`ECD Heroes`} />
            </div>
            <Button
              className={'mt-3 rounded-xl'}
              type="filled"
              color="quatenary"
              onClick={() =>
                route &&
                history.push(route, {
                  isRequest: isConnectedScreen ? false : true,
                  isConnectedScreen: isConnectedScreen,
                })
              }
              icon={connectionsNumber ? 'EyeIcon' : 'ShareIcon'}
              textColor="white"
              text={connectionsNumber ? 'View' : 'Connect'}
            ></Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
