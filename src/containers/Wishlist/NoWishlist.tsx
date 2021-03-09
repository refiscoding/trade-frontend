import * as React from 'react';
import { FlexProps } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';

import InfoPage from '../../components/InfoPage';
import { images } from '../../theme';

type EmptyStateComponentProps = FlexProps & {
  isCart: boolean
};

const EmptyStateComponent: React.FC<EmptyStateComponentProps> = ({ isCart }) => {
    const history = useHistory();
    const currentText = isCart ? 'cart' : 'wish list';
    return (
        <InfoPage
          image={images.emptyWishlist}
          header="No products here… "
          caption={`
              You don’t seem to have any products in your ${currentText} yet. 
              Browse some products form the home section and add them to your ${currentText}.`}
          action={() => history.push('/')}
          actionText="TAKE ME HOME"
        />
    );
};

export default EmptyStateComponent;
