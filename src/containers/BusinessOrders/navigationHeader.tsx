import React from 'react'
import { Flex, Box, Text } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'

import { theme } from '../../theme'

export type NavigationItemProps = FlexProps & {
  activeTab: string
  tabName: string
  setActiveTab: Function
}

interface NavigationHeaderProps {
  activeTab: string
  setActiveTab: Function
}

const Tabs = ['confirmation', 'processing', 'ready', 'dispatched']

const NavigationItem: React.FC<NavigationItemProps> = ({ activeTab, setActiveTab, tabName }) => {
  const handleTabChange = () => {
    setActiveTab(tabName)
  }

  return (
    <Flex onClick={handleTabChange}>
      <Text
        textTransform="capitalize"
        cursor="pointer"
        pr={{ base: 0, sm: 4 }}
        pl={{ base: 0, sm: 4 }}
        display="block"
        borderBottom={activeTab === tabName ? `3px solid ${theme.colors.brand[500]}` : 'none'}
      >
        {tabName}
      </Text>
    </Flex>
  )
}

const NavigationHeader: React.FC<NavigationHeaderProps> = (props) => {
  return (
    <Flex p={8} as="nav" align="center" justify="space-between" wrap="wrap" w="100%">
      <Box display={{ base: 'block', md: 'block' }} flexBasis={{ base: '100%', md: 'auto' }}>
        <Flex
          align="center"
          justify={['center', 'space-between', 'flex-end', 'flex-end']}
          direction={['column', 'row', 'row', 'row']}
          pt={[4, 4, 0, 0]}
          borderBottom={`1px solid ${theme.colors.accent[600]}`}
        >
          {Tabs.map((tab: string) => (
            <NavigationItem
              key={tab}
              tabName={tab}
              setActiveTab={props.setActiveTab}
              activeTab={props.activeTab}
            />
          ))}
        </Flex>
      </Box>
    </Flex>
  )
}

export default NavigationHeader
