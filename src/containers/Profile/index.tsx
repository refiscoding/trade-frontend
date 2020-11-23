import { Button, Flex, useToast } from '@chakra-ui/core'
import { Formik } from 'formik'
import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { Card } from '../../components'
import CardFooter from '../../components/Card/CardFooter'
import { ConnectedFormGroup, ConnectedImageUploader } from '../../components/FormElements'
import { Col, Row } from '../../components/ResponsiveGrid'
import { EMPTY_FILE, ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { useAuthContext } from '../../context/AuthProvider'
import { PageWrap } from '../../layouts'
import { H3, H5 } from '../../typography'
import strapiHelpers from '../../utils/strapiHelpers'

type ProfileProps = {}

const Profile: React.FC<ProfileProps> = () => {
  const { user, logout } = useAuthContext()
  const [passwordLoading, setPasswordLoading] = React.useState(false)
  const toast = useToast()
  const history = useHistory()

  const handleLogout = () => {
    logout && logout()
    history.push('/')
  }

  const handleUpdatePassword = async () => {
    setPasswordLoading(true)
    try {
      await strapiHelpers.forgotPassword(user?.email || '')
      setPasswordLoading(false)
      toast({ description: 'Email sent. Please check your inbox.', ...SUCCESS_TOAST })
    } catch (error) {
      toast({ description: 'Something went wrong!', ...ERROR_TOAST })
      setPasswordLoading(false)
    }
  }

  return (
    <PageWrap title="My Account">
      <Formik
        onSubmit={(values) => {
          // handle update mutation here once backend is configured
          console.log(values)
        }}
        initialValues={{ profilePicture: EMPTY_FILE, username: user?.username, email: user?.email }}
      >
        {() => {
          return (
            <Card width="100%">
              <Row>
                <Col md={4}>
                  <ConnectedImageUploader ml={4} mt={4} mr={[4, 4, 0]} name="profilePicture" />
                  <Flex pt={3} pl={5} flexDir="column" justify="center" align="flex-start">
                    <H3 mb={1} fontWeight="bold">
                      {user?.username}
                    </H3>
                    <H5>{user?.email}</H5>
                  </Flex>
                </Col>
                <Col md={8}>
                  <Flex
                    pr={4}
                    my={4}
                    height="100%"
                    pl={[4, 4, 0]}
                    align="center"
                    flexDir="column"
                    justify="flex-start"
                  >
                    <ConnectedFormGroup
                      name="firstName"
                      label="First Name"
                      placeholder="First Name"
                    />
                    <ConnectedFormGroup name="lastName" label="Last Name" placeholder="Last Name" />
                    <ConnectedFormGroup
                      name="cellNumber"
                      label="Cell Number"
                      placeholder="Cell Number"
                    />
                    <ConnectedFormGroup name="username" isDisabled label="Username" />
                    <ConnectedFormGroup name="email" isDisabled label="Email" />
                  </Flex>
                </Col>
              </Row>
              <CardFooter width="100%" justify="space-between" flexDirection="row">
                <Button onClick={handleLogout} type="button" variant="outline" variantColor="gray">
                  Logout
                </Button>
                <Flex>
                  <Button
                    mr={4}
                    type="button"
                    variant="outline"
                    variantColor="gray"
                    isLoading={passwordLoading}
                    onClick={handleUpdatePassword}
                  >
                    Update Password
                  </Button>
                  <Button type="submit" variantColor="brand">
                    Update Details
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
          )
        }}
      </Formik>
    </PageWrap>
  )
}

export default Profile
