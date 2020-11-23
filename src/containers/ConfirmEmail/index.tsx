import { Button, Flex, Image } from '@chakra-ui/core'
import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { Card } from '../../components'
import GridGenerator from '../../components/GridGenerator/index'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'
import { H5, Text } from '../../typography'

type ConfirmEmailProps = {}

type InitialValues = {
  email: string
  password: string
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = () => {
  const history = useHistory()

  return (
    <PageWrap
      title="Confirm Email"
      align="center"
      backgroundSize="cover"
      bgImage={`url(${images.bg})`}
      justify="center"
      pt={0}
    >
      <GridGenerator cols={1}>
        <Flex align="center" justify="center" width="100%">
          <Card maxWidth="350px" alignItems="center" justifyContent="center" p={6}>
            <Image src={images.sovtechLogo} width="150px" />
            <H5 fontWeight="bold" my={4}>
              Confirm Email
            </H5>
            <Text textAlign="center" mb={5}>
              Before you can access the platform please confirm your email.
            </Text>
            <Button onClick={() => history.push('/')} variantColor="brand">
              Back To Login
            </Button>
          </Card>
        </Flex>
      </GridGenerator>
    </PageWrap>
  )
}

export default ConfirmEmail
