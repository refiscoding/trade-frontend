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
}

const CardsComponent: React.FC<CardsProps> = ({
  cards,
  mobileFlow,
  cartProducts,
  checkoutTotal,
  selectedAddress,
  selectedDeliveryDate,
  setShowDeleteCardModal
}) => {
  const history = useHistory()
  const { user } = useAuthContext()

  const handlePay = () => {
    if (cartProducts) {
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
