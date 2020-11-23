import { Button, Flex } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import { Link, useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { MotionFlex, SideSlider } from '../../components'
import { ConnectedFormGroup, ConnectedPasswordGroup } from '../../components/FormElements'
import { useAuthContext } from '../../context/AuthProvider'
import { PageWrap } from '../../layouts'
import { images, theme } from '../../theme'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'

type RegisterProps = {}

const RegisterFormValidation = Yup.object().shape({
  username: Yup.string().required('A username is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('An email address is required'),
  password: Yup.string()
    .min(8, 'Password has to be longer than 8 characters')
    .required('A password is required'),
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Password does not match')
})

type RegisterValues = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const Register: React.FC<RegisterProps> = () => {
  const { register, user, logout } = useAuthContext()
  const history = useHistory()

  React.useEffect(() => {
    if (user?.confirmed) {
      history.push('/auth/user-management')
    } else if (user) {
      history.push('/confirm-email')
      logout && logout()
    }
    // eslint-disable-next-line
  }, [user])

  return (
    <PageWrap
      pt={0}
      title="Register"
      align="center"
      justify="center"
      backgroundSize="cover"
      bgImage={`url(${images.bg})`}
    >
      <SideSlider>
        <Flex width="100%">
          <H3 textAlign="left" mb={4}>
            Register
          </H3>
        </Flex>
        <Formik
          validationSchema={RegisterFormValidation}
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
          }}
          onSubmit={async ({ username, email, password }, { setStatus, setSubmitting }) => {
            setStatus(null)
            try {
              setSubmitting(true)
              if (register) {
                await register(username, email, password)
              }
              setSubmitting(false)
            } catch (error) {
              setStatus(formatError(error))
            }
          }}
        >
          {({ isSubmitting, status }: FormikProps<RegisterValues>) => (
            <Form style={{ width: '100%' }}>
              <ConnectedFormGroup name="username" label="Username" placeholder="Username" />
              <ConnectedFormGroup name="email" label="Email" placeholder="Email" type="email" />
              <ConnectedPasswordGroup name="password" label="Password" placeholder="Password" />
              <ConnectedPasswordGroup
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm Password"
              />
              {status && (
                <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} mb={2} width="100%">
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
              <Flex mt={4} align="center" justify="center">
                <Text>
                  Already signed up?{' '}
                  <Link style={{ color: theme.colors.blue[500] }} to="/">
                    Login
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

export default Register
