import * as Yup from 'yup'
import * as React from 'react';
import { Mail } from 'react-feather';
import { useHistory } from "react-router";
import { useMediaQuery } from "react-responsive";
import { Form, Formik, FormikProps } from 'formik'
import { Button, Flex, useToast, Image, Grid } from '@chakra-ui/core'

import strapiHelpers from '../../utils/strapiHelpers'

import { PageWrap } from '../../layouts'
import { formatError } from '../../utils'
import { images, theme } from '../../theme'
import { Text, H3 } from '../../typography'
import { SUCCESS_TOAST } from '../../constants'
import { MotionFlex, SideSlider } from '../../components'
import { ConnectedFormGroup } from '../../components/FormElements'

const ForgotPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('An email address is required')
})

type ForgotPasswordProps = {}

type InitialValues = {
  email: string
}

const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const toast = useToast();
  const history = useHistory();
  const isWebView = useMediaQuery({ query: '(min-width: 40em)' });
  const ctaContainerSize = isWebView ? "164px 164px" : "180px 180px";

  const handleCancelClicked = () => {
    history.push("/login");
  };
  return (
    <PageWrap
      align="center"
      title="Login"
      backgroundSize="contain"
      backgroundRepeat="no-repeat"
      bgImage={`url(${images.bg})`}
      justify="center"
      pt={0}
    >
      <SideSlider>
        <Flex width="100%" flexDirection="column" pb={4}>
          <H3 textAlign="center" mb={4} fontWeight="bold" color={theme.colors.brand[500]}>
            Forgot Password
          </H3>
        </Flex>
        <Formik
          validationSchema={ForgotPasswordValidation}
          initialValues={{
            email: ''
          }}
          onSubmit={async ({ email }, { setSubmitting, setStatus }) => {
            setStatus(null)
            try {
              setSubmitting(true)
              await strapiHelpers.forgotPassword(email)
              setSubmitting(false)
              toast({ description: 'Email sent. Please check your inbox.', ...SUCCESS_TOAST })
            } catch (error) {
              setStatus(formatError(error))
            }
          }}
        >
          {({ isSubmitting, status }: FormikProps<InitialValues>) => (
            <Form style={{ width: '100%' }}>
              <Flex mb={4}>
                <Text textAlign="center" color={theme.colors.dimText} mb={10}>
                  Enter your email address below and we&apos;ll send you a link to reset your
                  password.
                </Text>
              </Flex>
              <ConnectedFormGroup icon={Mail} name="email" placeholder="Email" />
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
              <Flex width="100%" justify="center" mb={10} mt={10}>
                <Image width="50%" height="50%" src={images.MailBox} />
              </Flex>
              <Grid gridTemplateColumns={ctaContainerSize} justifyContent="center" justifyItems="center" justifySelf="center">
                <Button justifySelf="start" mt={4} width="95%" onClick={() => handleCancelClicked()} border={`1px solid ${theme.colors.brand[500]}`} background="white">
                    <Text fontSize="12px">
                      CANCEL
                    </Text>
                </Button>
                <Button isLoading={isSubmitting} type="submit" mt={4} width="95%" variantColor="brand">
                    <Text fontSize="12px">
                      NEXT
                    </Text>
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </SideSlider>
    </PageWrap>
  )
}

export default ForgotPassword;
