import { RoleDto } from '@ecdlink/core';
import { useEffect, useState } from 'react';

export interface UserRolesProps {
  roles?: RoleDto[];
  roleList: RoleDto[];
  onUserRoleChange: (values: RoleDto[]) => void;
}

const UserRoles: React.FC<UserRolesProps> = ({
  roles,
  roleList,
  onUserRoleChange,
}) => {
  const [selectedUserRole, setSelectedUserRole] = useState<string>('');

  useEffect(() => {
    if (roles && roles.length > 0) {
      setSelectedUserRole(roles[0].name);
    }
  }, [roles]);

  const handleUserRolesChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedRoleName = event.target.value;
    setSelectedUserRole(selectedRoleName);

    const selectedRole = roleList.find(
      (role) => role.name === selectedRoleName
    );
    if (selectedRole) {
      onUserRoleChange([selectedRole]);
    } else {
      onUserRoleChange([]);
    }
  };

  return (
    <div>
      <select
        value={selectedUserRole}
        onChange={handleUserRolesChange}
        className="bg-uiBg focus:outline-none sm:text-md block w-full rounded-lg py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
      >
        <option value="">Select a role...</option>
        {roleList &&
          roleList.map((role) => (
            <option key={role.id} value={role.name}>
              {role.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default UserRoles;
