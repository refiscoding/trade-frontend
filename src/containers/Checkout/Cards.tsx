import * as React from 'react'

import { Button, Spinner } from '@chakra-ui/core'

import CardsContainer from './CardsContainer'
import CardComponent, { Card } from './CardComponent'

import { CartProduct } from '../Cart'
import { ComponentLocationAddress } from '../../generated/graphql'

type CardsProps = {
  cards: Card[]
  mobileFlow: boolean
  createOrderLoading?: boolean
  checkoutTotal: number
  selectedDeliveryDate: Date | Date[]
  cartProducts?: CartProduct[]
  handlePay?: () => void
  selectedAddress: ComponentLocationAddress | undefined
  setShowDeleteCardModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setShowCheckoutSignatoryModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

const CardsComponent: React.FC<CardsProps> = ({
  cards,
  handlePay,
  mobileFlow,
  cartProducts,
  checkoutTotal,
  selectedAddress,
  createOrderLoading,
  selectedDeliveryDate,
  setShowDeleteCardModal,
  setShowCheckoutSignatoryModal
}) => {
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
          {createOrderLoading && <Spinner height="25px" />}
          {`PAY R ${checkoutTotal}.00`}
        </Button>
      )}
    </React.Fragment>
  )
}

export default CardsComponent
