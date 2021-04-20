import * as React from 'react';

import { useMediaQuery } from "react-responsive";


import CheckoutMobileFlow from "./CheckoutFlowMobile";
import CheckoutMobileWeb from "./CheckoutFlowWeb";

const CheckoutPage: React.FC = () => {
   const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' });
  return (
     <React.Fragment>
        {
           isTabletOrMobile
            ? <CheckoutMobileFlow />
            : <CheckoutMobileWeb />
        }
     </React.Fragment>
  );
};

export default CheckoutPage;
