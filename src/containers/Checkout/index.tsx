import * as Yup from "yup";
import * as React from 'react';

import { get } from "lodash";
import { useToast } from "@chakra-ui/core";
import { ApolloError } from "apollo-client";
import { useMediaQuery } from "react-responsive";

import CheckoutWebFlow from "./CheckoutFlowWeb";
import CheckoutMobileFlow from "./CheckoutFlowMobile";
import { Address, TimeSlot } from "./AddressComponent";

import { CartProduct } from "../Cart";
import { ERROR_TOAST } from "../../constants";
import { addresses, timeSlots } from "./mockData";
import { useFetchUsersCartQuery } from "../../generated/graphql";

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

export type SelectedAddress = DeliveryAddressValues & {
   name: string
   type: string
   contact: string
};

export type TimeSlotProps = {
   slot: TimeSlot
   slots?: TimeSlot[]
}

export type CheckoutProps = {
   active: number
   addresses: Address[]
   timeSlots: TimeSlot[]
   cartProducts: CartProduct[]
   noAddressDataHeader: string
   noAddressDataCaption: string
   selectedAddress: SelectedAddress | undefined
   showDeleteItemsModal: boolean | undefined
   setActiveStep: (step: number) => void 
   setShowDeleteItemsModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
   setSelectedAddress: React.Dispatch<React.SetStateAction<SelectedAddress | undefined>>
};

const CheckoutPage: React.FC = () => {
   const toast = useToast();
   const [active, setActive] = React.useState<number>(0);
   const [showDeleteItemsModal, setShowDeleteItemsModal] = React.useState<boolean | undefined>();
   const [selectedAddress, setSelectedAddress] = React.useState<SelectedAddress | undefined>();
   const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' });

   const noAddressDataHeader = "No Delivery Addresses Here...";
   const noAddressDataCaption = `
       You don't seem to have any delivery addresses yet.
       Add a new address and have it displayed here.
   `;

   const { data: userCart } = useFetchUsersCartQuery({
      onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
   });

   const setActiveStep = (step: number) => {
      setActive(step);
   };

   const products = get(userCart, "findCart.payload.productsQuantities", null) as CartProduct[];

   return (
     <React.Fragment>
        {
           isTabletOrMobile
            ?  <CheckoutMobileFlow
                  active={active}
                  addresses={addresses}
                  timeSlots={timeSlots}
                  selectedAddress={selectedAddress}
                  cartProducts={products}
                  setActiveStep={setActiveStep}
                  setSelectedAddress={setSelectedAddress}
                  noAddressDataHeader={noAddressDataHeader}
                  showDeleteItemsModal={showDeleteItemsModal}
                  noAddressDataCaption={noAddressDataCaption}
                  setShowDeleteItemsModal={setShowDeleteItemsModal}
               />
            :  <CheckoutWebFlow
                  active={active}
                  addresses={addresses}
                  timeSlots={timeSlots}
                  selectedAddress={selectedAddress}
                  cartProducts={products}
                  setActiveStep={setActiveStep}
                  setSelectedAddress={setSelectedAddress}
                  noAddressDataHeader={noAddressDataHeader}
                  showDeleteItemsModal={showDeleteItemsModal}
                  noAddressDataCaption={noAddressDataCaption}
                  setShowDeleteItemsModal={setShowDeleteItemsModal}
               />
        }
     </React.Fragment>
  );
};

export default CheckoutPage;
