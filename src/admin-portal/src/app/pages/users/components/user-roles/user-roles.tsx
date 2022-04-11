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
  const [selectedUserRoles, setUserRoles] = useState<RoleDto[]>([]);

  useEffect(() => {
    if (roles) {
      setUserRoles([...roles]);
    }
  }, [roles]);

  const getUserRoleNames = () => {
    const blah = selectedUserRoles.map((x: RoleDto) => x.name);
    return blah;
  };

  const handleUserRolesChange = async (role: RoleDto) => {
    const copyUserRoles = [...selectedUserRoles];
    if (getUserRoleNames().includes(role.name)) {
      const idx = copyUserRoles.findIndex((ur) => ur.id === role.id);
      if (idx > -1) {
        copyUserRoles.splice(idx, 1);
      }
    } else {
      copyUserRoles.push(role);
    }
    setUserRoles(copyUserRoles);
    onUserRoleChange(copyUserRoles);
  };

  return (
    <div>
      {roleList &&
        roleList.map((role: RoleDto) => {
          const checked = selectedUserRoles.some((x) => x.name === role.name);
          return (
            <div key={role.id} className="relative flex items-start pt-5">
              <div className="flex items-center h-5">
                <input
                  checked={checked}
                  type="checkbox"
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  onChange={() => handleUserRolesChange(role)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="candidates"
                  className="font-medium text-gray-700"
                >
                  {role.name}
                </label>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default UserRoles;
