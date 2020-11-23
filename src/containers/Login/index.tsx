import { Button, Flex, theme } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import { LocationDescriptorObject } from 'history'
import * as React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import * as Yup from 'yup'
import { MotionFlex, SideSlider } from '../../components'
import {
  ConnectedCheckbox,
  ConnectedFormGroup,
  ConnectedPasswordGroup
} from '../../components/FormElements'
import { useAuthContext } from '../../context/AuthProvider'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'

const LoginFormValidation = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('An email address is required'),
  password: Yup.string()
    .min(6, 'Password has to be longer than 6 characters')
    .required('A password is required')
})

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
      let to: LocationDescriptorObject = { pathname: '/auth/user-management' }
      if (location.state?.redirectTo) {
        to = { pathname: location.state.redirectTo.pathname }
      }
      history.push(to)
    }
    // eslint-disable-next-line
  }, [isAuthenticated])

  return (
    <PageWrap
      align="center"
      title="Login"
      backgroundSize="cover"
      bgImage={`url(${images.bg})`}
      justify="center"
      pt={0}
    >
      <SideSlider>
        <Flex width="100%">
          <H3 textAlign="left" mb={4}>
            Login
          </H3>
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
              <ConnectedFormGroup name="email" label="Email" placeholder="Email" />
              <ConnectedPasswordGroup name="password" label="Password" placeholder="Password" />
              <ConnectedCheckbox mb={1} name="rememberMe" label="Remember Me" />
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
                SUBMIT
              </Button>
              <Flex mb={2} mt={4} align="center" justify="center">
                <Text>
                  Already have an account?{' '}
                  <Link style={{ color: theme.colors.blue[500] }} to="/register">
                    Sign Up
                  </Link>{' '}
                </Text>
              </Flex>
              <Flex mb={2} align="center" justify="center">
                <Link style={{ color: theme.colors.blue[500] }} to="/forgot-password">
                  Forgot Password
                </Link>{' '}
              </Flex>
            </Form>
          )}
        </Formik>
      </SideSlider>
    </PageWrap>
  )
}

export default Login
