import * as Yup from "yup";
import * as React from 'react';

import { useMediaQuery } from "react-responsive";

import CheckoutMobileWeb from "./CheckoutFlowWeb";
import CheckoutMobileFlow from "./CheckoutFlowMobile";
import { Address } from "./AddressComponent";

import { addresses } from "./mockData";

export const DeliveryAddressValidation = Yup.object().shape({
   street: Yup.string().required("Street Address is required"),
   buildingComplex: Yup.string(),
   surburb: Yup.string().required("Surburb is required"),
   cityOrTown: Yup.string().required("City/Town is required"),
   postalCode: Yup.string().required("Postal Code is required"),
});

export type DeliveryAddressValues = {
   street: string
   buildingComplex: string
   surburb: string
   cityOrTown: string
   postalCode: string
};

export const initialDeliveryAddressValues = {
   street: "",
   buildingComplex: "",
   surburb: "",
   cityOrTown: "",
   postalCode: "",
};

export type CheckoutProps = {
   active: number
   addresses: Address[]
   noAddressDataHeader: string
   noAddressDataCaption: string
   setActiveStep: (step: number) => void 
};

const CheckoutPage: React.FC = () => {
   const [active, setActive] = React.useState<number>(0);
   const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' });

   const noAddressDataHeader = "No Delivery Addresses Here...";
   const noAddressDataCaption = `
       You don't seem to have any delivery addresses yet.
       Add a new address and have it displayed here.
   `;

   const setActiveStep = (step: number) => {
      setActive(step);
   };
   return (
     <React.Fragment>
        {
           isTabletOrMobile
            ?  <CheckoutMobileFlow
                  active={active}
                  addresses={addresses}
                  setActiveStep={setActiveStep}
                  noAddressDataHeader={noAddressDataHeader}
                  noAddressDataCaption={noAddressDataCaption}
               />
            :  <CheckoutMobileWeb
                  active={active}
                  addresses={addresses}
                  setActiveStep={setActiveStep}
                  noAddressDataHeader={noAddressDataHeader}
                  noAddressDataCaption={noAddressDataCaption}
               />
        }
     </React.Fragment>
  );
};

export default CheckoutPage;
