import * as React from 'react'

import Chart from 'react-apexcharts'

import { Flex, FlexProps } from '@chakra-ui/core'

import { TOTAL_UNITS_SOLD } from '../../../constants'

type TotalUnitsCardProps = FlexProps & {}

const TotalUnitsCard: React.FC<TotalUnitsCardProps> = () => {
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
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dev'
      ]
    }
  }
  const series = [
    {
      name: TOTAL_UNITS_SOLD,
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
    }
  ]
  return (
    <Flex>
      <Chart options={options} series={series} type="bar" width={500} height={320} />
    </Flex>
  )
}

export default TotalUnitsCard
