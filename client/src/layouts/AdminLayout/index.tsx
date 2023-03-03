import React from 'react';

interface Props {
  children: JSX.Element;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  return children;
};

export default AdminLayout;
