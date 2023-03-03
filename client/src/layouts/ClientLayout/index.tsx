import React from 'react';

interface Props {
  children: JSX.Element;
}

const ClientLayout: React.FC<Props> = ({ children }) => {
  return children;
};

export default ClientLayout;
