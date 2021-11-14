import * as Yup from 'yup'
import * as React from 'react'

import { Mail } from 'react-feather'
import { ApolloError } from 'apollo-boost'
import { Form, Formik, FormikProps } from 'formik'
import { Link, useHistory } from 'react-router-dom'
import { Button, Flex, Image, useToast, Box } from '@chakra-ui/core'

import Input from '../../components/Input'

import { PageWrap } from '../../layouts'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { images, theme } from '../../theme'
import { ERROR_TOAST } from '../../constants'
import { MotionFlex, SideSlider } from '../../components'
import { useAuthContext } from '../../context/AuthProvider'
import { useFetchLegalitiesQuery } from '../../generated/graphql'
import { ConnectedFormGroup, ConnectedPasswordGroup } from '../../components/FormElements'

type RegisterProps = {}

const RegisterFormValidation = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('An email address is required'),
  password: Yup.string()
    .min(8, 'Password has to be longer than 8 characters')
    .required('A password is required')
})

type RegisterValues = {
  email: string
  password: string
}

const baseUrl = process.env.REACT_APP_API_HOST
const terms = 'Terms & Conditions'

const Register: React.FC<RegisterProps> = () => {
  const toast = useToast()
  const { register, user, logout } = useAuthContext()
  const [showError, setShowError] = React.useState<boolean | null>(false)
  const [termsChecked, setTermsChecked] = React.useState<boolean | null>(false)

  const { data: legalities } = useFetchLegalitiesQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const history = useHistory()

  React.useEffect(() => {
    if (user?.confirmed) {
      history.push('/')
    } else if (user) {
      history.push('/confirm-email')
      logout && logout()
    }
    // eslint-disable-next-line
  }, [user])

  const handleTermsCheckboxClicked = () => {
    setShowError(!termsChecked)
    setTermsChecked(!termsChecked)
  }
  const termsAndConditionsLink = legalities?.legality?.termsAndConditionsFile?.url
  return (
    <PageWrap
      align="center"
      title="Login"
      backgroundSize="contain"
      backgroundRepeat="no-repeat"
      bgImage={`url(${images.tradeFedBg})`}
      justify="center"
      pt={0}
    >
      <SideSlider>
        {/* <Box p="4" bg="#FFFAFA"> */}
        <Flex width="100%" flexDirection="column" pb={4} color="white">
          <H3 textAlign="center" mb={4} fontWeight="bold" color={theme.colors.brand[700]}>
            Register
          </H3>
          <Text textAlign="center" fontSize="18px" color="gray.500">
            Hi there! Welcome to tradeFed.
          </Text>
        </Flex>
        <Box p="4" bg="gray.300">
          <Formik
            validationSchema={RegisterFormValidation}
            initialValues={{
              email: '',
              password: ''
            }}
            onSubmit={async ({ email, password }, { setStatus, setSubmitting }) => {
              if (!termsChecked) {
                setShowError(true)
                return
              } else {
                setStatus(null)
                try {
                  setSubmitting(true)
                  if (register) {
                    await register(email, password)
                  }
                  setSubmitting(false)
                } catch (error) {
                  setStatus(formatError(error))
                }
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
                <Flex mb={5}>
                  <Flex mt={5} mr={3}>
                    <Input type="checkbox" name="terms" onChange={handleTermsCheckboxClicked} />
                  </Flex>
                  <Flex
                    mb={2}
                    mt={4}
                    align="center"
                    justify="center"
                    color={theme.colors.brand[700]}
                  >
                    <Text>
                      I agree to the{' '}
                      <a
                        style={{ fontWeight: 600, textDecoration: 'underline' }}
                        href={termsAndConditionsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {terms}
                      </a>
                    </Text>
                  </Flex>
                </Flex>
                {showError && !termsChecked && (
                  <Text fontSize={12} color="red.500">
                    Kindly read and accept the terms and conditions
                  </Text>
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
                <Flex mb={2} mt={4} align="center" justify="center">
                  <Text>
                    Already have an account?{' '}
                    <Link style={{ fontWeight: 600 }} to="/login">
                      Login
                    </Link>{' '}
                  </Text>
                </Flex>
              </Form>
            )}
          </Formik>
        </Box>
      </SideSlider>
    </PageWrap>
  )
}

export default Register
