import React, { useEffect } from 'react';

interface Props {
  title: string;
}

const TitlePage: React.FC<Props> = ({ title }) => {
  useEffect(() => {
    document.title = title;
  });
  return <></>;
};

export default TitlePage;
