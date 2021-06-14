import * as React from 'react'

import styled from '@emotion/styled'

import { ArrowLeft } from 'react-feather'

import { Grid, Flex, Image } from '@chakra-ui/core'

import { Text } from '../../typography'
import { theme, images } from '../../theme'

type SelectPaymentComponentProps = {
  mobileFlow: boolean
  setShowPaymentOptions: () => void
}

const Input = styled.input`
  justify-self: end;
  cursor: pointer;
`

const SelectPaymentComponent: React.FC<SelectPaymentComponentProps> = ({
  mobileFlow,
  setShowPaymentOptions
}) => {
  const background = mobileFlow ? theme.colors.accent[50] : ''
  const padding = mobileFlow ? 5 : 0
  const borderRadius = mobileFlow ? 5 : 0
  const boxShadow = mobileFlow ? '0 1px 2px 0 rgba(0,0,0,0.17)' : ''
  return (
    <Grid
      gridTemplateRows="40px 1fr 1fr"
      background={background}
      padding={padding}
      borderRadius={borderRadius}
      boxShadow={boxShadow}
    >
      {mobileFlow ? (
        <Flex>
          <ArrowLeft />
          <Text ml={3} fontWeight={600} onClick={setShowPaymentOptions}>
            Select Payment Method
          </Text>
        </Flex>
      ) : (
        <Text fontWeight={600}>Select Payment Method</Text>
      )}
      <Grid gridTemplateRows="30px 1fr" borderBottom={`1px solid ${theme.colors.background}`} p={2}>
        <Text fontWeight={600} fontSize={12} my={2}>
          Credit and Debit Card
        </Text>
        <Grid gridTemplateColumns="1fr 1fr" alignContent="center">
          <Grid gridTemplateColumns="1fr 1fr 1fr" alignContent="center" columnGap="15px">
            <Flex>
              <Image src={images.masterCardPayment} />
            </Flex>
            <Flex>
              <Image src={images.visaCardPayment} />
            </Flex>
            <Flex>
              <Image src={images.AmericanExpressPayment} />
            </Flex>
          </Grid>
          <Input type="checkbox" checked />
        </Grid>
      </Grid>
      {/* <Grid gridTemplateRows="1fr 1fr" borderBottom={`1px solid ${theme.colors.background}`} p={2}>
                <Text fontWeight={600} fontSize={12} my={2}>Online Payment</Text>
                <Grid gridTemplateColumns="1fr 1fr">
                    <Grid gridTemplateColumns="1fr 1fr 1fr">
                        <Image src={images.FNBPayment} />
                    </Grid>
                    <Input type="checkbox" />
                </Grid>
            </Grid> */}
    </Grid>
  )
}
export default SelectPaymentComponent
