import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/store';
import { Divider, RoundIcon, Typography } from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';
import { ConnectItem } from '@ecdlink/graphql';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { ExternalLinkIcon } from '@heroicons/react/solid';

const HEADER_HEIGHT = 222;

export interface iConnectItem {
  name?: string;
  children?: ConnectItem[];
}

export const Connect: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const { height } = useWindowSize();

  const connectData = useSelector(communitySelectors.getConnectData);

  const connectItemData = useSelector(communitySelectors.getConnectItems);

  useEffect(() => {
    if (isOnline && connectData?.length === 0) {
      appDispatch(
        communityThunkActions.getAllConnect({
          locale: 'en-za',
        })
      );
    }
  }, [isOnline, appDispatch, connectData]);

  useEffect(() => {
    if (isOnline && connectItemData?.length === 0) {
      appDispatch(
        communityThunkActions.getAllConnectItem({
          locale: 'en-za',
        })
      );
    }
  }, [isOnline, appDispatch, connectItemData]);

  const { connectItems } = useMemo(() => {
    function getChildren(name: string) {
      let children: any = [];

      connectItemData?.forEach((element: ConnectItem) => {
        if (
          element?.linkedConnect &&
          element?.linkedConnect[0]?.name === name
        ) {
          children.push({ buttonText: element.buttonText, link: element.link });
        }
      });

      return children;
    }
    const connectItems = connectData?.map(
      (item): iConnectItem => ({
        name: item.name || '',
        children: getChildren(item?.name || ''),
      })
    );
    return { connectItems };
  }, [connectData, connectItemData]);

  const onLinkClicked = (link: string) => {
    const newWindow = window.open(link, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div
      className="flex flex-col p-4"
      style={{ height: height - HEADER_HEIGHT }}
    >
      <div className="flex items-center gap-3 rounded-2xl py-4">
        <RoundIcon icon="BookOpenIcon" backgroundColor="secondary" />
        <Typography type="h2" color="textDark" text="Links & resoures" />
      </div>
      <Divider className="mb-4" dividerType="dashed" />

      {connectItems?.map((item, index) => (
        <div key={item.name}>
          <Typography
            type="h3"
            weight="bold"
            lineHeight="snug"
            color="textDark"
            className="mb-4"
            text={item?.name || ''}
          />

          {item?.children?.map((child) => (
            <div
              className="bg-uiBg text-textDark mb-2 flex items-center gap-1 rounded-2xl p-4 font-semibold"
              key={child?.id}
            >
              <table
                className="border border-gray-100"
                width={`100%`}
                key={child?.link}
              >
                <tbody>
                  <tr>
                    <td width={`90%`}>{child?.buttonText}</td>
                    <td width={`10%`}>
                      <a
                        href={child?.link || ''}
                        onClick={() => {
                          onLinkClicked(child?.link || '');
                        }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLinkIcon className="text-primary h-6 w-6" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
          {connectItems?.length !== index + 1 && (
            <Divider className="p-4" dividerType="dashed" />
          )}
        </div>
      ))}
    </div>
  );
};
