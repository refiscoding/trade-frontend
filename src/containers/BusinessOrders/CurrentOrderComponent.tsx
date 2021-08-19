import * as React from 'react'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { ChevronRight } from 'react-feather'
import { Flex, Grid, Button, Link } from '@chakra-ui/core'

import { Text } from '../../typography'
import { theme } from '../../theme'
import { Order } from '../../generated/graphql'
import PickupModal from './PickupModal'

dayjs.extend(RelativeTime)
dayjs.extend(LocalizedFormat)

type CurrentOrderComponentProps = {
  confirmationText: string
  order: Order
  setSelectedOrder: (val: Order) => void
}

const CurrentOrderComponent: React.FC<CurrentOrderComponentProps> = ({
  confirmationText,
  order,
  setSelectedOrder,
}) => {
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const handleOrderClicked = () => {
    setSelectedOrder(order)
  }

  return (
    <Flex>
      {showModal && (
        <PickupModal
          confirmationText={confirmationText}
          handleProceedButtonClicked={()=> {}}
          handleCancelButtonClicked={() => setShowModal(false)}
        />
      )}
      <Grid
        borderRadius="4px"
        boxShadow="0.8px 2px 4px rgba(0,0,0,0.25)"
        backgroundColor="white"
        p={4}
        width="332px"
        margin="1rem"
      >
        <Flex borderBottom={`1px solid ${theme.colors.background}`} mb={2} pb={3}>
          <Text fontSize={16} fontWeight={600}>{`Order in Process - ${order?.orderNumber}`}</Text>
        </Flex>
        <Flex
          justify="space-between"
          borderBottom={`1px solid ${theme.colors.background}`}
          pt={2}
          pb={3}
          cursor="pointer"
          onClick={handleOrderClicked}
        >
          <Text fontSize={12} fontWeight={700}>
            Order information
          </Text>
          <ChevronRight />
        </Flex>
        <Flex justify="space-between" width="100%" flexDirection="column">
          <Flex mt={3} ml={3} width="90%">
            <Button
              type="submit"
              mt={4}
              width="95%"
              variantColor="brand"
              onClick={() => setShowModal(true)}
            >
              <Text fontSize="12px">READY FOR PICKUP</Text>
            </Button>
          </Flex>
          <Flex flexDirection="column" mt={3} mb={3} width="100%" alignItems="center">
            <Text fontSize={12} fontWeight={700}>
              Something not right?{' '}
              <Link href="#" cursor="pointer">
                Contact Support
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Grid>
    </Flex>
  )
}

export default CurrentOrderComponent
