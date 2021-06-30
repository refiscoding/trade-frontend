import * as React from 'react'

import { ApolloError } from 'apollo-boost'
import { useMediaQuery } from 'react-responsive'
import { FlexProps } from '@chakra-ui/core/dist/Flex'
import { Flex, Image, Text, useToast } from '@chakra-ui/core'

import { images, theme } from '../../../theme'
import { TotalUnits, ActiveProgress, ActiveProducts } from './charts'
import {
  useFindActiveProductsQuery,
  useFindGrandTotalUnitsSoldPerMonthQuery
} from '../../../generated/graphql'
import {
  TOTAL_UNITS_SOLD,
  ACTIVE_PRODUCT_PROGRESS,
  ACTIVE_PRODUCTS,
  ERROR_TOAST
} from '../../../constants'

type ProductManagementCardProps = FlexProps & {
  title: string
  caption: string
}

const ProductManagementCard: React.FC<ProductManagementCardProps> = ({ title, caption }) => {
  const toast = useToast()
  const isTinyPhone = useMediaQuery({ query: '(max-width: 20em)' })
  const isSmallPhone = useMediaQuery({ query: '(max-width: 25em)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const [totalUnitsChartData, setTotalUnitsChartData] = React.useState<string>('{}')
  const [activeProductsChartData, setActiveProductsChartData] = React.useState<string>('{}')

  const mobileCardWidth = isTinyPhone
    ? '290px'
    : isSmallPhone
    ? '330px'
    : isTabletOrMobile
    ? '380px'
    : '600px'
  const mobileCardHeight = isTinyPhone ? '320px' : isSmallPhone ? '290px' : '270px'

  const hasData = true

  const totalUnits = title === TOTAL_UNITS_SOLD
  const activeProgress = title === ACTIVE_PRODUCT_PROGRESS
  const activeProducts = title === ACTIVE_PRODUCTS

  const { data: totalUnitsData } = useFindGrandTotalUnitsSoldPerMonthQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })
  const { data: activeProductsData } = useFindActiveProductsQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  // console.log('===>', activeProductsChartData)

  React.useEffect(() => {
    const totalUnitsResponse = totalUnitsData?.findGrandTotalUnitsSoldPerMonth?.payload
    if (totalUnitsResponse) {
      setTotalUnitsChartData(totalUnitsResponse)
    }
  }, [totalUnitsData, setTotalUnitsChartData])
  React.useEffect(() => {
    const activeProductsResponse = activeProductsData?.findActiveProducts?.payload
    if (activeProductsResponse) {
      setActiveProductsChartData(activeProductsResponse)
    }
  }, [activeProductsData, setActiveProductsChartData])
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
            {totalUnits && <TotalUnits totalUnitsChartData={totalUnitsChartData} />}
            {activeProgress && <ActiveProgress activeProductsChartData={activeProductsChartData} />}
            {activeProducts && <ActiveProducts activeProductsChartData={activeProductsChartData} />}
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
