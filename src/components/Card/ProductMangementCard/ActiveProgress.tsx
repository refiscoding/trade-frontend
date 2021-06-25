import * as React from 'react'

import Chart from 'react-apexcharts'

import { Flex, FlexProps } from '@chakra-ui/core'

import { ACTIVE_PRODUCT_PROGRESS } from '../../../constants'

type ActiveProgressCardProps = FlexProps & {}

const ActiveProgressCard: React.FC<ActiveProgressCardProps> = () => {
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
        'Porsche',
        'Toyota',
        'Hyundai'
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
      colors: ['#3ACF2F', '#74a970', '#9C27B0']
    },
    dataLabels: {
      enabled: true,
      formatter: (val: string) => `${val}%`,
      offsetX: -10
    }
  }
  const series = [
    {
      name: ACTIVE_PRODUCT_PROGRESS,
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    }
  ]
  return (
    <Flex>
      <Chart options={options} series={series} type="bar" width={500} height={320} />
    </Flex>
  )
}

export default ActiveProgressCard
