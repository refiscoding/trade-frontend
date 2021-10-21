import * as React from 'react'

import { Grid, GridProps } from '@chakra-ui/core'

export type CardsContainerProps = GridProps & {
  mobileFlow: boolean
}

const CardsContainer: React.FC<CardsContainerProps> = ({ children, mobileFlow, ...rest }) => {
  const numberOfColumns = mobileFlow ? '1fr' : '1fr 1fr'
  const marginTop = mobileFlow ? 5 : 0
  const height = mobileFlow ? '100%' : '500px'
  const overflowY = mobileFlow ? 'initial' : 'scroll'
  const rowGap = mobileFlow ? '0' : '10px'
  return (
    <Grid
      mt={marginTop}
      rowGap={rowGap}
      gridTemplateColumns={numberOfColumns}
      height={height}
      overflowY={overflowY}
      columnGap="10px"
      gridTemplateRows="auto auto auto"
      width="100%"
      {...rest}
    >
      {children}
    </Grid>
  )
}

export default CardsContainer
