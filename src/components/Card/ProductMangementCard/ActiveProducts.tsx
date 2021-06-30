import * as React from 'react'

import { Flex, FlexProps } from '@chakra-ui/core'
import { ChevronRight, Clock } from 'react-feather'

import { theme } from '../../../theme'
import { Text } from '../../../typography'

type ActiveProductsCardProps = FlexProps & {
  activeProductsChartData: string
}

const OlderActiveProduct = () => {
  return (
    <Flex
      borderRadius={5}
      p={3}
      mt={3}
      flexDirection="column"
      border={`1px solid ${theme.colors.background}`}
    >
      <Flex justify="space-between" alignItems="center">
        <Text fontWeight={600}>BMW</Text>
        <Flex>
          <Flex mr={3} p={2} background={theme.colors.background} borderRadius={3}>
            <Clock />
            <Text ml={3}>12/09/21</Text>
          </Flex>
          <ChevronRight />
        </Flex>
      </Flex>
    </Flex>
  )
}

const ActiveProductsCard: React.FC<ActiveProductsCardProps> = ({ activeProductsChartData }) => {
  return (
    <Flex>
      <OlderActiveProduct />
    </Flex>
  )
}

export default ActiveProductsCard
