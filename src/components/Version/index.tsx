import { Flex, FlexProps } from '@chakra-ui/core'
import * as React from 'react'
import * as packageJson from '../../../package.json'
import { Text } from '../../typography'

const Version: React.FC<FlexProps> = (props) => {
  return (
    <Flex {...props}>
      <Text>v{packageJson.version}</Text>
    </Flex>
  )
}

export default Version

Version.defaultProps = {
  width: '100%',
  p: 3,
  justify: 'center',
  align: 'center'
}
