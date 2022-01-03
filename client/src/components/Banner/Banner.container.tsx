import React from 'react';
import { useConfigQuery } from 'src/graphql';

import Banner from './Banner';

const BannerContainer: React.FC = () => {
  const { data } = useConfigQuery({
    variables: { id: 'banner' },
    fetchPolicy: 'no-cache',
  });

  if (data?.config?.value == null) {
    return null;
  }

  return <Banner message={data?.config?.value} />;
};

export default BannerContainer;
