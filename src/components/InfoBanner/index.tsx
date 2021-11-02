import { Flex, Text } from '@chakra-ui/core'
import * as React from 'react'
import { ColorProps } from 'styled-system'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'

type InfoBannerProps = ColorProps & {
  caption?: string
}

const InfoBanner: React.FC<InfoBannerProps> = ({ caption }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <Flex
      width="100vw"
      minHeight={isTabletOrMobile ? '5px' : '5px'}
      bg="brand.700"
      mr="16px"
      flexDirection="column"
      alignItems="center"
    >
      <Text fontSize={13} mt={3} color="accent.50">
        <Link to={{ pathname: 'https://www.sacoronavirus.co.za' }}>
          For official Government information about COVID-19, please visit www.sacoronavirus.co.za
        </Link>{' '}
      </Text>
    </Flex>
  )
}

export default InfoBanner
