import * as React from 'react'

import Chart from 'react-apexcharts'
import { useMediaQuery } from 'react-responsive'

import { Flex, FlexProps } from '@chakra-ui/core'

import { ACTIVE_PRODUCT_PROGRESS } from '../../../constants'

import { theme } from '../../../theme'

type ActiveProgressCardProps = FlexProps & {
  activeProductsChartData: string
}

const ActiveProgressCard: React.FC<ActiveProgressCardProps> = ({ activeProductsChartData }) => {
  const isTinyPhone = useMediaQuery({ query: '(max-width: 20em)' })
  const isSmallPhone = useMediaQuery({ query: '(max-width: 25em)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const data = JSON.parse(activeProductsChartData)

  const chartWidth = isTinyPhone ? 280 : isSmallPhone ? 350 : isTabletOrMobile ? 400 : 650
  const items = Object.keys(data).map((row) => {
    const item = data[row]
    const sold = item.soldUnits
    const name = item.product.name
    return {
      [name]: sold
    }
  })

  const cts: string[] = []
  const vls: number[] = []
  const annoationStyles = {
    fillColor: '#9fcdff',
    label: {
      text: 'High Mover'
    }
  }

  const offsetX = isTabletOrMobile ? 0 : -20
  const horizontal = isTabletOrMobile ? false : true
  const annotations = isTabletOrMobile
    ? {
        yaxis: [
          {
            y: 80,
            y2: 100,
            ...annoationStyles
          }
        ]
      }
    : {
        xaxis: [
          {
            x: 80,
            x2: 100,
            ...annoationStyles
          }
        ]
      }

  const categories = items
    .map((item: Record<string, any>) => {
      return [...cts, `${Object.keys(item)[0].slice(0, 11)}..`]
    })
    .flat()

  const values = items
    .map((item: Record<number, any>) => {
      return [...vls, Object.values(item)[0]]
    })
    .flat()

  const options = {
    chart: {
      id: ACTIVE_PRODUCT_PROGRESS
    },
    plotOptions: {
      bar: {
        horizontal,
        dataLabels: {
          position: 'top'
        }
      }
    },
    xaxis: {
      categories,
      min: 0,
      max: 100
    },
    yaxis: {
      min: 0,
      max: 100
    },
    annotations,
    fill: {
      colors: [`${theme.colors.greenFill}`]
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return !(val === 10) ? `${val}% Sold` : ``
      },
      offsetX
    }
  }
  const series = [
    {
      name: ACTIVE_PRODUCT_PROGRESS,
      data: values
    }
  ]
  return (
    <Flex>
      <Chart options={options} series={series} type="bar" width={chartWidth} height={320} />
    </Flex>
  )
}

export default ActiveProgressCard
