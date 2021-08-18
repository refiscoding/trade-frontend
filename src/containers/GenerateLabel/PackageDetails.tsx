import * as React from 'react'

import { Flex } from '@chakra-ui/core'

import { theme } from '../../theme'
import { H3 } from '../../typography'
import { ConnectedFormGroup } from '../../components/FormElements'
import ConnectedDatePicker from '../../components/FormElements/ConnectedDatePicker'

const PackageDetails: React.FC = () => {
  return (
    <Flex
      flexDirection="column"
      borderBottomColor="accent.600"
      p={4}
      marginTop="0.5rem"
      borderRadius={5}
      background={theme.colors.accent[50]}
      boxShadow={theme.boxShadowMedium}
    >
      <H3 mb={4} fontWeight={550} textAlign="left">
        Package Details
      </H3>
      <ConnectedDatePicker width="50%" name="date" label="Date*" placeholder="Select a Date" />
      <ConnectedFormGroup label="Order Number*" name="orderNumber" type="text" />
      <ConnectedFormGroup label="Parcel Number*" name="parcelNumber" type="text" />
      <ConnectedFormGroup label="Package Weight*" name="weight" type="text" isDisabled={true} />
      <ConnectedFormGroup label="Package Height*" name="height" type="text" isDisabled={true} />
      <ConnectedFormGroup label="Package Length*" name="length" type="text" isDisabled={true} />
      <ConnectedFormGroup label="Package Width*" name="width" type="text" isDisabled={true} />
    </Flex>
  )
}

export default PackageDetails
