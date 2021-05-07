import * as React from 'react'

import { Button } from '@chakra-ui/core'
import { useHistory } from 'react-router-dom'

import CardsContainer from './CardsContainer'
import StrapiHelpers from '../../utils/strapiHelpers'
import CardComponent, { Card } from './CardComponent'

import { CartProduct } from '../Cart'
import { useAuthContext } from "../../context/AuthProvider";
import { ComponentLocationAddress } from '../../generated/graphql'


type CardsProps = {
  cards: Card[]
  mobileFlow: boolean
  checkoutTotal: number
  selectedDeliveryDate: Date | Date[]
  cartProducts?: CartProduct[]
  selectedAddress: ComponentLocationAddress | undefined
  setShowDeleteCardModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setShowCheckoutSignatoryModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

const CardsComponent: React.FC<CardsProps> = ({
  cards,
  mobileFlow,
  cartProducts,
  checkoutTotal,
  selectedAddress,
  selectedDeliveryDate,
  setShowDeleteCardModal,
  setShowCheckoutSignatoryModal
}) => {
  const history = useHistory()
  // const toast = useToast();

  const { user } = useAuthContext()
  // const [createOrder] = useCreateCheckoutOrderMutation({
  //   onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
  //   onCompleted: async () => {
  //     toast({
  //       description: 'You have successfully placed your order!',
  //       ...SUCCESS_TOAST
  //     })
  //     history.push("/checkout-success");
  //   }
  // });

  const handlePay = async () => {
    setShowCheckoutSignatoryModal(true)
    if (cartProducts) {
      // await createOrder({
      //   variables: {
      //     input: {
      //       deliveryAddress: {
      //         ...selectedAddress
      //       },
      //       deliveryDate: selectedDeliveryDate

      //     }
      //   }
      // })
      StrapiHelpers.sendOrderSummaryEmail(cartProducts, user, selectedAddress, selectedDeliveryDate);
      history.push('/checkout-success')
    }
  }
  return (
    <React.Fragment>
      <CardsContainer mobileFlow={mobileFlow}>
        {cards?.map((card, index) => {
          return (
            <CardComponent
              setShowDeleteCardModal={setShowDeleteCardModal}
              key={`${index}_address`}
              mobileFlow={mobileFlow}
              card={card}
            />
          )
        })}
      </CardsContainer>
      {!mobileFlow && (
        <Button
          justifySelf="end"
          mt={-1}
          width="25%"
          type="submit"
          variantColor="brand"
          onClick={handlePay}
        >
          {`PAY R ${checkoutTotal}.00`}
        </Button>
      )}
    </React.Fragment>
  )
}

export default CardsComponent
