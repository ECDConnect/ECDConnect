import { useQuery } from '@apollo/client';
import { getAvatarColor, UserHierarchyEntityDto } from '@ecdlink/core';
import { GetAllUserHierarchyEntity } from '@ecdlink/graphql';
import { UserAvatar } from '@ecdlink/ui';

export interface UserHierarchyProps {
  userId?: string;
}

const UserHierarchy: React.FC<UserHierarchyProps> = ({ userId }) => {
  const { data } = useQuery(GetAllUserHierarchyEntity, {
    fetchPolicy: 'cache-and-network',
    variables: {
      parentId: userId,
    },
  });

  return (
    <nav className="flex-1 min-h-0 overflow-y-auto" aria-label="Directory">
      <div className="relative">
        <div className="z-10 sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
          <h3>User Connections</h3>
        </div>
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul role="list" className="relative z-0 divide-y divide-gray-200">
          {data &&
            data.GetAllUserHierarchyEntity &&
            data.GetAllUserHierarchyEntity.filter(
              (x: UserHierarchyEntityDto) => x.userId !== userId
            ).map((hierarchy: UserHierarchyEntityDto) => (
              <li key={hierarchy.id}>
                <div className="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500">
                  <div className="flex-shrink-0">
                    <UserAvatar
                      size={'md'}
                      avatarColor={getAvatarColor()}
                      text={`${hierarchy.user.firstName[0]}${hierarchy.user.surname[0]}`}
                      displayBorder
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="focus:outline-none">
                      {/* Extend touch target to entire panel */}
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">
                        {hierarchy.user.firstName} {hierarchy.user.surname}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {hierarchy.userType}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
};

export default UserHierarchy;
