import * as React from 'react'

import dayjs from 'dayjs'
import { Flex, Grid } from '@chakra-ui/core'
import { ChevronRight } from 'react-feather'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import RelativeTime from 'dayjs/plugin/relativeTime'
import styled from '@emotion/styled'

import { Order } from '../../generated/graphql'
import { Text } from '../../typography'
import { theme } from '../../theme'
import { MotionFlex } from '../../components'

dayjs.extend(LocalizedFormat)
dayjs.extend(RelativeTime)

type ReadyForDispatchComponentProps = {
  setSelectedOrder: (val: Order) => void
  order: Order
}

const StyledFlex = styled(MotionFlex)`
  &:hover {
    background: #c9cfd4;
  }
`

const ReadyForDispatchComponent: React.FC<ReadyForDispatchComponentProps> = ({
  setSelectedOrder,
  order
}) => {
  const handleOrderClicked = () => {
    setSelectedOrder(order)
  }

  return (
    <Grid
      borderRadius="4px"
      boxShadow="0.8px 2px 4px rgba(0,0,0,0.25)"
      backgroundColor="white"
      p={4}
      width="332px"
      margin="1rem"
    >
      <Flex borderBottom={`1px solid ${theme.colors.background}`} mb={2} pb={3}>
        <Text
          fontSize={16}
          fontWeight={600}
        >{`Order Ready For Dispatch - ${order?.orderNumber}`}</Text>
      </Flex>
      <StyledFlex
        justify="space-between"
        pt={2}
        pb={3}
        cursor="pointer"
        onClick={handleOrderClicked}
      >
        <Text fontSize={12} fontWeight={700}>
          Order information
        </Text>
        <ChevronRight />
      </StyledFlex>
    </Grid>
  )
}

export default ReadyForDispatchComponent
