import * as React from 'react'

import { useMediaQuery } from 'react-responsive'
import { Flex, Image, Text } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'

import { images, theme } from '../../../theme'
import { TotalUnits, ActiveProgress, ActiveProducts } from './charts'
import { TOTAL_UNITS_SOLD, ACTIVE_PRODUCT_PROGRESS, ACTIVE_PRODUCTS } from '../../../constants'

type ProductManagementCardProps = FlexProps & {
  title: string
  caption: string
}

const ProductManagementCard: React.FC<ProductManagementCardProps> = ({ title, caption }) => {
  const isTinyPhone = useMediaQuery({ query: '(max-width: 20em)' })
  const isSmallPhone = useMediaQuery({ query: '(max-width: 25em)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const mobileCardWidth = isTinyPhone
    ? '320px'
    : isSmallPhone
    ? '350px'
    : isTabletOrMobile
    ? '400px'
    : '600px'
  const mobileCardHeight = isTinyPhone ? '320px' : isSmallPhone ? '290px' : '270px'

  const hasData = true

  const totalUnits = title === TOTAL_UNITS_SOLD
  const activeProgress = title === ACTIVE_PRODUCT_PROGRESS
  const activeProducts = title === ACTIVE_PRODUCTS

  return (
    <Flex
      flexDirection="column"
      minWidth={!isTabletOrMobile ? '100%' : mobileCardWidth}
      minHeight={!isTabletOrMobile ? '350px' : mobileCardHeight}
      bg="white"
      boxShadow={theme.boxShadowLight}
      borderRadius="8px"
      my={2}
    >
      <Text m="15px" fontWeight={600} fontSize="14px">
        {title}
      </Text>
      <Flex width="100%" flexDirection="column" alignItems="center" margin="auto">
        {hasData ? (
          <React.Fragment>
            {totalUnits && <TotalUnits />}
            {activeProgress && <ActiveProgress />}
            {activeProducts && <ActiveProducts />}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Image width="70px" height="auto" src={images.filesIcon} />
            <Text fontSize="12px">{caption}</Text>
          </React.Fragment>
        )}
      </Flex>
    </Flex>
  )
}

export default ProductManagementCard
