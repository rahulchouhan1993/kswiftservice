const HasPermission = ({ permissions = [], children, authPermissions = [] }) => {
  const hasAnyPermission = permissions.some(p => authPermissions.includes(p));
  return hasAnyPermission ? children : null;
};

export default HasPermission;
