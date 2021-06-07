import * as React from 'react';
import { FlexProps } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';

import InfoPage from '../../components/InfoPage';
import { images } from '../../theme';
import { useMediaQuery } from "react-responsive";

type EmptyStateComponentProps = FlexProps & {
  isCart: boolean
};

const EmptyStateComponent: React.FC<EmptyStateComponentProps> = ({ isCart }) => {
  const history = useHistory();
  const currentText = isCart ? 'cart' : 'wish list';
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <InfoPage
      image={images.emptyWishlist}
      header="No products here… "
      caption={`
              You don’t seem to have any products in your ${currentText} yet. 
              Browse some products from the home section and add them to your ${currentText}.`}
      action={isTabletOrMobile ? () => history.push('/') : () => { }}
      actionText="TAKE ME HOME"
    />
  );
};

export default EmptyStateComponent;
