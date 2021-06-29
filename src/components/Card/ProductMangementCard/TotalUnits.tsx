import * as React from 'react'

import Chart from 'react-apexcharts'

import { useMediaQuery } from 'react-responsive'

import { Flex, FlexProps } from '@chakra-ui/core'

import { theme } from '../../../theme'
import { TOTAL_UNITS_SOLD } from '../../../constants'

type TotalUnitsCardProps = FlexProps & {
  totalUnitsChartData: string
}

const TotalUnitsCard: React.FC<TotalUnitsCardProps> = ({ totalUnitsChartData }) => {
  const isTinyPhone = useMediaQuery({ query: '(max-width: 20em)' })
  const isSmallPhone = useMediaQuery({ query: '(max-width: 25em)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const data = JSON.parse(totalUnitsChartData)

  const chartWidth = isTinyPhone ? 280 : isSmallPhone ? 350 : isTabletOrMobile ? 360 : 600

  const options = {
    chart: {
      id: TOTAL_UNITS_SOLD
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: 'top'
        }
      }
    },
    xaxis: {
      categories: Object.keys(data)
    },
    fill: {
      colors: [`${theme.colors.blueText}`]
    }
  }
  const series = [
    {
      name: TOTAL_UNITS_SOLD,
      data: Object.values(data)
    }
  ]
  return (
    <Flex>
      <Chart options={options} series={series} type="bar" width={chartWidth} height={320} />
    </Flex>
  )
}

export default TotalUnitsCard
