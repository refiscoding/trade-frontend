import { Button, Flex, Image } from "@chakra-ui/core";
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
import { Mail } from "react-feather";

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
    >
      <Flex width="100%" align="center" justify="center" mt={4} mb={4}>
        <Image
          width="90%"
          src={images['TradeFedFullLogo']}
        />
      </Flex>
      <SideSlider>
        <Flex width="100%" align="center" justify="center" mb={4}>
          <H3 textAlign="left">
            Create an account
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
              <ConnectedFormGroup icon={Mail} name="email" placeholder="Email" type="email" />
              <ConnectedPasswordGroup name="password" placeholder="Password" />
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
                SIGN UP
              </Button>
              <Flex mb={2} mt={4} align="center" justify="center" flexDirection="column">
                <Text my={4} fontSize="14px">
                  Or continue with social media
                </Text>
                <Flex width="100%" justifyContent="space-evenly" my={5}>
                  <Image
                    mb={6}
                    src={images['Facebook']}
                  />
                  <Image
                    mb={6}
                    src={images['LinkedIn']}
                  />
                  <Image
                    mb={6}
                    src={images['GooglePlus']}
                  />
                </Flex>
              </Flex>
              <Flex mb={2} mt={4} align="center" justify="center">
                <Text>
                  Already have an account? {' '}
                  <Link style={{ fontWeight: 600 }} to="/login">
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
