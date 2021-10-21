import * as React from 'react'

import { Image, Grid, Button } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'

import { images } from '../../theme'
import ModalWrap from '../../components/ModalWrap'
import { Text } from '../../typography'

type BeforeCheckoutModalProps = FlexProps & {
  handleCancelButtonClicked: () => void
  handleProceedButtonClicked: () => void
  confirmationText: string
  createOrderLoading: boolean
  checkoutTotal: number
}

const BeforeCheckoutModal: React.FC<BeforeCheckoutModalProps> = ({
  checkoutTotal,
  confirmationText,
  createOrderLoading,
  handleCancelButtonClicked,
  handleProceedButtonClicked
}) => {
  return (
    <ModalWrap title="Polite Notice" isOpen={true} onClose={handleCancelButtonClicked} isCentered>
      <Grid gridTemplateRows="repeat(1fr, 2)" justifyItems="center" padding={5}>
        <Image src={images?.beforeChekout} />
        <Text mt={4} fontSize="14px" textAlign="center">
          {confirmationText}
        </Text>
      </Grid>
      <Grid gridTemplateColumns="repeat(2, 1fr)" gap="10px" padding={5}>
        <Button
          width="100%"
          onClick={handleCancelButtonClicked}
          mt={4}
          variantColor="gray"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          mt={4}
          width="100%"
          variantColor="brand"
          isLoading={createOrderLoading}
          onClick={handleProceedButtonClicked}
        >
          {`PAY ZAR ${checkoutTotal.toFixed(2)}`}
        </Button>
      </Grid>
    </ModalWrap>
  )
}

export default BeforeCheckoutModal
