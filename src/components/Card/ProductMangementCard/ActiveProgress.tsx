import * as React from 'react'

import Chart from 'react-apexcharts'
import { useMediaQuery } from 'react-responsive'

import { Flex, FlexProps } from '@chakra-ui/core'

import { ACTIVE_PRODUCT_PROGRESS } from '../../../constants'

import { theme } from '../../../theme'

type ActiveProgressCardProps = FlexProps & {}

const ActiveProgressCard: React.FC<ActiveProgressCardProps> = () => {
  const isTinyPhone = useMediaQuery({ query: '(max-width: 20em)' })
  const isSmallPhone = useMediaQuery({ query: '(max-width: 25em)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const chartWidth = isTinyPhone ? 280 : isSmallPhone ? 350 : isTabletOrMobile ? 400 : 650

  const options = {
    chart: {
      id: ACTIVE_PRODUCT_PROGRESS
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    xaxis: {
      categories: [
        'BMW',
        'Hammer',
        'Jeep',
        'Tesla',
        'Land Rover',
        'Land Cruiser',
        'Lamborghini',
        'Mercedes Benz',
        'Jaguar',
        'Porsche'
      ]
    },
    annotations: {
      xaxis: [
        {
          x: 80,
          x2: 100,
          fillColor: '#9fcdff',
          label: {
            text: 'Hotcake (Almost Out)'
          }
        }
      ]
    },
    fill: {
      colors: [`${theme.colors.greenFill}`]
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return !(val === 10) ? `${val}% Sold` : ``
      },
      offsetX: -20
    }
  }
  const series = [
    {
      name: ACTIVE_PRODUCT_PROGRESS,
      data: [10, 20, 30, 40, 50, 80, 90, 100]
    }
  ]
  return (
    <Flex>
      <Chart options={options} series={series} type="bar" width={chartWidth} height={320} />
    </Flex>
  )
}

export default ActiveProgressCard
