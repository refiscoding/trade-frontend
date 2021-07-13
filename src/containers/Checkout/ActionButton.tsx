import * as React from 'react'

import { Flex } from '@chakra-ui/core'

import { theme } from '../../theme'

type ActionButtonComponentProps = {
  setActive: (step: number) => void
}

const ActionButtonComponent: React.FC<ActionButtonComponentProps> = ({ children, setActive }) => {
  return (
    <Flex
      p={5}
      mt={5}
      width="100%"
      height="50px"
      cursor="pointer"
      alignItems="center"
      borderRadius="10px"
      justify="space-between"
      onClick={() => setActive(1)}
      boxShadow={theme.boxShadowLight}
      backgroundColor={theme.colors.accent[50]}
    >
      {children}
    </Flex>
  )
}

export default ActionButtonComponent
