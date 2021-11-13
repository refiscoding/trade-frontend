import * as Yup from 'yup'
import * as React from 'react'

import { Mail } from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import { Form, Formik, FormikProps } from 'formik'
import { LocationDescriptorObject } from 'history'
import { Button, Flex, Image, Grid } from '@chakra-ui/core'
import { Link, useHistory, useLocation } from 'react-router-dom'

import Input from '../../components/Input'

import { images, theme } from '../../theme'
import { PageWrap } from '../../layouts'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { MotionFlex, SideSlider } from '../../components'
import { useAuthContext } from '../../context/AuthProvider'
import { ConnectedFormGroup, ConnectedPasswordGroup } from '../../components/FormElements'

const LoginFormValidation = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('An email address is required'),
  password: Yup.string()
    .min(6, 'Password has to be longer than 6 characters')
    .required('A password is required')
})

const baseUrl = process.env.REACT_APP_API_HOST

type LoginProps = {}

type InitialValues = {
  email: string
  password: string
}

const Login: React.FC<LoginProps> = () => {
  const { login, isAuthenticated } = useAuthContext()
  const [rememberMeChecked, setRememberMeChecked] = React.useState<boolean>(false)

  const history = useHistory()
  const location = useLocation<{ email?: string; redirectTo?: LocationDescriptorObject }>()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  React.useEffect(() => {
    if (isAuthenticated) {
      let to: LocationDescriptorObject = { pathname: '/' }
      if (location.state?.redirectTo) {
        to = { pathname: location.state.redirectTo.pathname }
      }
      history.push(to)
    }
    // eslint-disable-next-line
  }, [isAuthenticated])

  const handleRememberMeClicked = () => {
    setRememberMeChecked(!rememberMeChecked)
  }

  const rememberMeContainer = isTabletOrMobile ? '170px 165px' : '145px 165px'

  return (
    <PageWrap
      align="center"
      title="Login"
      backgroundSize="contain"
      backgroundRepeat="no-repeat"
      bgImage={`url(${images.MoverBg})`}
      justify="center"
      pt={0}
    >
      <SideSlider>
        <Flex width="100%" flexDirection="column" pb={4}>
          <H3 textAlign="center" mb={4} fontWeight="bold" color={theme.colors.brand[700]}>
            Login
          </H3>
          <Text textAlign="center" fontSize="18px" color="gray.500">
            Hi there! Welcome back to Mover.
          </Text>
        </Flex>
        <Formik
          validationSchema={LoginFormValidation}
          initialValues={{
            email: location.state?.email || '',
            password: '',
            rememberMe: false
          }}
          onSubmit={async ({ email, password, rememberMe }, { setSubmitting, setStatus }) => {
            setStatus(null)
            try {
              setSubmitting(true)
              if (login) {
                await login(email, password, rememberMeChecked)
              }
              setSubmitting(false)
            } catch (error) {
              setStatus(formatError(error))
            }
          }}
        >
          {({ isSubmitting, status }: FormikProps<InitialValues>) => (
            <Form style={{ width: '100%' }}>
              <ConnectedFormGroup icon={Mail} name="email" placeholder="Email" />
              <ConnectedPasswordGroup mb={4} name="password" placeholder="Password" />
              {status && (
                <MotionFlex
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  justify="center"
                  mb={2}
                  width="100%"
                >
                  <Text textAlign="right" color="red.500">
                    {status}
                  </Text>
                </MotionFlex>
              )}
              <Flex mb={3}>
                <Grid gridTemplateColumns={rememberMeContainer}>
                  <Flex>
                    <Flex mt={1} mr={2}>
                      <Input type="checkbox" name="rememberMe" onChange={handleRememberMeClicked} />
                    </Flex>
                    <Flex align="center" justify="center">
                      <Text>Remember Me</Text>
                    </Flex>
                  </Flex>
                  <Flex justifySelf="end">
                    <a style={{ fontWeight: 600 }} href={`/forgot-password`}>
                      Forgot Password?
                    </a>
                  </Flex>
                </Grid>
              </Flex>
              <Button
                mt={4}
                width="100%"
                type="submit"
                variantColor="brand"
                isLoading={isSubmitting}
              >
                LOGIN
              </Button>
              <Flex mb={2} mt={3} align="center" justify="center" flexDirection="column">
                <Text fontSize="14px">Or continue with social media</Text>
                <Flex width="100%" justifyContent="space-evenly" my={5}>
                  <a href={`${baseUrl}/connect/facebook`}>
                    <Image src={images['Facebook']} />
                  </a>
                  <a href={`${baseUrl}/connect/linkedin`}>
                    <Image src={images['LinkedIn']} />
                  </a>
                  <a href={`${baseUrl}/connect/google`}>
                    <Image src={images['GooglePlus']} />
                  </a>
                </Flex>
              </Flex>
              <Flex mt={4} align="center" justify="center">
                <Text>
                  Don’t have an account yet?{' '}
                  <Link style={{ fontWeight: 600 }} to="/register">
                    Sign Up
                  </Link>{' '}
                </Text>
              </Flex>
            </Form>
          )}
        </Formik>
      </SideSlider>
    </PageWrap>
  )
}

export default Login
