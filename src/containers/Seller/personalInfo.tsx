import * as React from 'react'

import { Flex } from '@chakra-ui/core'

import { theme } from '../../theme'
import { H3 } from '../../typography'
import { ConnectedFormGroup, ConnectedNumberInput } from '../../components/FormElements'
import ConnectedSelect from '../../components/FormElements/ConnectedSelect'
import { POSITIONS } from '../../constants'

const PersonalInfo: React.FC = () => {
  return (
    <Flex
      flexDirection="column"
      borderBottomColor="accent.600"
      p={4}
      borderRadius={5}
      background={theme.colors.accent[50]}
      boxShadow={theme.boxShadowMedium}
    >
      <H3 mb={4} fontWeight={550} textAlign="left">
        Personal Information
      </H3>
      <ConnectedFormGroup label="What is your first name?*" name="firstName" type="text" />
      <ConnectedFormGroup label="What is your last name?*" name="lastName" type="text" />
      <ConnectedNumberInput label="Enter your phone number*" name="phoneNumber" unit="+27" />
      <ConnectedFormGroup label="What is your company name?*" name="name" type="text" />
      <ConnectedSelect
        placeholder="Select Position"
        label="Select Position* "
        name="position"
        options={POSITIONS}
      />
      <ConnectedFormGroup label="Your Email Address?*" name="email" type="text" isDisabled={true} />
    </Flex>
  )
}

export default PersonalInfo
