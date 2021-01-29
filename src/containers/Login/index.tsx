import { Button, Flex, Image } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import { LocationDescriptorObject } from 'history'
import * as React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import * as Yup from 'yup'
import { Mail } from 'react-feather'

import { MotionFlex, SideSlider } from '../../components'
import { ConnectedFormGroup, ConnectedPasswordGroup } from '../../components/FormElements'
import { useAuthContext } from '../../context/AuthProvider'
import { PageWrap } from '../../layouts'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'
import { images } from '../../theme'

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

  const history = useHistory()
  const location = useLocation<{ email?: string; redirectTo?: LocationDescriptorObject }>()

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

  return (
    <PageWrap align="center" title="Login" justify="center" pt={0} color="colors.white">
      <Flex width="100%" align="center" justify="center" mt={4} mb={4}>
        <Image width="90%" src={images['TradeFedFullLogo']} />
      </Flex>
      <SideSlider>
        <Flex width="100%" align="center" justify="center" mb={4}>
          <H3 fontSize="20px">Login To Your Account</H3>
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
                await login(email, password, rememberMe)
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
