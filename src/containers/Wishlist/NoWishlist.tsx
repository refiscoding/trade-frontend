import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { images } from '../../theme';

import InfoPage from '../../components/InfoPage';

const EmptyStateComponent: React.FC = () => {
    const history = useHistory();
      return (
        <InfoPage
          image={images.emptyWishlist}
          header="No products here… "
          caption={`
              You don’t seem to have any products in your wish list yet. 
              Browse some products form the home section and add them to your wish list.`}
          action={() => history.push('/')}
          actionText="TAKE ME HOME"
        />
    );
};

export default EmptyStateComponent;
