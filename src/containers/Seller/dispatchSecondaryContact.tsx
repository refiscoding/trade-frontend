import * as React from 'react'
import { Flex } from '@chakra-ui/core'

import { ConnectedFormGroup, ConnectedNumberInput } from '../../components/FormElements'
import { H3, Text } from '../../typography'
import { theme } from '../../theme'

const DispatchSecondaryContact: React.FC = () => {
  return (
    <Flex
      flexDirection="column"
      borderBottomColor="accent.600"
      p={4}
      mt={3}
      borderRadius={5}
      background={theme.colors.accent[50]}
      boxShadow={theme.boxShadowMedium}
    >
      <H3 mb={4} fontWeight={550} textAlign="left">
        Secondary contact for dispatch
      </H3>
      <Text textAlign="left" fontSize="14px" mb={2}>
        In the case of not being able to get hold of you, please provide a secondary individual whom
        we can contact at your dispatch center for pick-up purposes
      </Text>
      <ConnectedFormGroup label="Name*" name="dispatchSecondaryFirstName" type="text" />
      <ConnectedFormGroup label="Surname*" name="dispatchSecondarySurname" type="text" />
      <ConnectedNumberInput
        label="Cell phone number*"
        name="dispatchSecondaryPhoneNumber"
        unit="+27"
      />
      <ConnectedFormGroup label="Email address*" name="dispatchSecondaryEmailAddress" type="text" />
    </Flex>
  )
}

export default DispatchSecondaryContact
