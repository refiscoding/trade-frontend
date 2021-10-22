import * as React from 'react'

import { Grid, GridProps } from '@chakra-ui/core'

export type AddressesContainerProps = GridProps & {
  mobileFlow: boolean
}

const AddressesContainer: React.FC<AddressesContainerProps> = ({
  children,
  mobileFlow,
  ...rest
}) => {
  const numberOfColumns = mobileFlow ? '1fr' : '1fr 1fr'
  const marginTop = mobileFlow ? 5 : 0
  const height = mobileFlow ? '100%' : '550px'
  const overflowY = mobileFlow ? 'initial' : 'scroll'
  const rowGap = mobileFlow ? '30px' : '90px'
  return (
    <Grid
      mt={marginTop}
      rowGap={rowGap}
      columnGap="10px"
      gridTemplateRows="auto auto auto"
      gridTemplateColumns={numberOfColumns}
      width="100%"
      height={height}
      overflowY={overflowY}
      {...rest}
    >
      {children}
    </Grid>
  )
}

export default AddressesContainer
