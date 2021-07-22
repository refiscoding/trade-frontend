import * as React from 'react'
import styled from '@emotion/styled'

import { Flex, Grid } from '@chakra-ui/core'

import { theme } from '../../theme'
import { PageWrap } from '../../layouts'
import { Stepper } from '../../components'
import { H3, Text } from '../../typography'

const StepperContainer = styled.div`
  margin-top: 15px;
`
const Step = styled.div``

type BeforeCheckoutProps = {}

const BeforeCheckout: React.FC<BeforeCheckoutProps> = () => {

  const cancelButtonStyles = { textDecoration: 'underline', cursor: 'pointer' }
  const stepsMap = [
    'Select Delivery Address',
    'Set Delivery Date and Time',
    'Confirm Order and Pay'
  ]
  

  return (
    <PageWrap title="Before Checkout" alignSelf="center" width="90%" mt={20} pt={0} p={0}>
      <Flex width="100%">
        <Flex width="100%" flexDirection="column">
          <Grid
            p={5}
            width="100%"
            borderRadius={5}
            background={theme.colors.accent[50]}
            boxShadow={theme.boxShadowMedium}
          >
            <Grid gridTemplateRows="20px 45px">
              <Flex justify="space-between">
                <H3 textAlign="left" fontSize={18} fontWeight={600}>
                  {stepsMap}
                </H3>
                <Text
                  fontSize="12px"
                  color={theme.colors.blueText}
                  style={cancelButtonStyles}
                >
                  Cancel
                </Text>
              </Flex>
              <StepperContainer style={{ marginTop: 15 }}>
                <Stepper activeStep={1}>
                  <Step />
                  <Step />
                  <Step />
                </Stepper>
              </StepperContainer>
            </Grid>
          </Grid>
          <Grid mt={5} gridTemplateColumns="400px 1fr" columnGap="15px">
            <Flex
              p={4}
              borderRadius={5}
              background={theme.colors.accent[50]}
              boxShadow={theme.boxShadowMedium}
              height='100%'
            >
              sth here
            </Flex>
            <Flex>
                <Grid gridTemplateRows="1fr 40px" width="100%">
                  hapa kuna kitu
                </Grid>
            </Flex>
          </Grid>
        </Flex>
      </Flex>
    </PageWrap>
  )
}

export default BeforeCheckout
