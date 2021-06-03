import * as React from 'react'

import { Flex } from '@chakra-ui/core'

import { theme } from '../../theme'
import { H3 } from '../../typography'
import { ConnectedFormGroup, ConnectedNumberInput } from '../../components/FormElements'

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
        Personal Information{' '}
      </H3>
      <ConnectedFormGroup label="What is your first name?*" name="firstName" type="text" />
      <ConnectedFormGroup label="What is your last name?*" name="lastName" type="text" />
      <ConnectedFormGroup label="Your Email Address?*" name="email" type="text" isDisabled={true} />
      <ConnectedFormGroup label="Enter your ID Number*" name="idNumber" type="text" placeholder="Enter ID Number" />
      <ConnectedNumberInput label="Enter your phone number*" name="phoneNumber" unit="+27" />
    </Flex>
  )
}

export default PersonalInfo
