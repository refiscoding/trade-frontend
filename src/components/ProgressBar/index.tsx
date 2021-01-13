import { Flex, FlexProps, Spinner } from '@chakra-ui/core'
import styled from '@emotion/styled'
import React from 'react'

const Wrapper = styled(Flex)`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  position: absolute;
  align-items: center;
  background-size: cover;
  justify-content: center;
`

const Loader: React.FC<FlexProps> = (props) => {
  return (
    <Wrapper {...props}>
      <Spinner color={props.color} size="lg">
        <span />
      </Spinner>
    </Wrapper>
  )
}

export default Loader
