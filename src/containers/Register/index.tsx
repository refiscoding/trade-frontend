import * as Yup from 'yup'
import * as React from 'react'
import { Mail } from 'react-feather'
import { Form, Formik, FormikProps } from 'formik'
import { Link, useHistory } from 'react-router-dom'
import { Button, Flex, Image, Checkbox } from '@chakra-ui/core'
import { useMediaQuery } from "react-responsive"

import { MotionFlex, SideSlider } from '../../components'
import { ConnectedFormGroup, ConnectedPasswordGroup } from '../../components/FormElements'
import { useAuthContext } from '../../context/AuthProvider'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'

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
const terms = "Terms & Conditions";

const Register: React.FC<RegisterProps> = () => {
  const { register, user, logout } = useAuthContext()
  const [termsChecked, setTermsChecked] = React.useState<boolean | null>(false);

  const history = useHistory()
  
  const isWebViewport = useMediaQuery({
    query: "(min-width: 40em)"
  });

  React.useEffect(() => {
    if (user?.confirmed) {
      history.push('/')
    } else if (user) {
      history.push('/confirm-email')
      logout && logout()
    }
    // eslint-disable-next-line
  }, [user]);

  const handleTermsCheckboxClicked = () => {
    setTermsChecked(!termsChecked);
  };

  const logoWidth = isWebViewport ? "50%" : "100%" ;
  const logoMarginBottom = isWebViewport ? 5 : 10 ;
  const logoMarginLeft = isWebViewport ? 70 : 0 ;

  return (
    <PageWrap pt={0} title="Register" align="center" justify="center">
      {
        isWebViewport && (
          <Flex width="100%">
            <Image width="100%" height="100%" src={images['signUpPageBanner']} />
          </Flex>
        )
      }
      <SideSlider>
        <Image justifySelf="center" width={logoWidth} mb={logoMarginBottom} src={images['TradeFedFullLogo']} ml={logoMarginLeft}/>
        <Flex width="100%" align="center" justify="center" mb={4}>
          <H3 textAlign="left">Create an account</H3>
        </Flex>
        <Formik
          validationSchema={RegisterFormValidation}
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={async ({ email, password }, { setStatus, setSubmitting }) => {
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
                <Checkbox name="terms" mr={3} mt={2} onChange={handleTermsCheckboxClicked}/>
                <Flex mb={2} mt={4} align="center" justify="center">
                  <Text>
                    I agree to the {' '}
                    <a style={{ fontWeight: 600, textDecoration: "underline" }} href={`https://tradefed.co.za/about-us`} target="_blank" rel="noopener noreferrer">
                      { terms }
                    </a>
                  </Text>
                </Flex>
              </Flex>
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
      </SideSlider>
    </PageWrap>
  )
}

export default Register
