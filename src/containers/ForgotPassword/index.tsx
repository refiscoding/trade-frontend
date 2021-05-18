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
import { H4, Text } from '../../typography'
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
  const logoWidth = isWebView ? "50%" : "80%" ;
  const logoMarginBottom = isWebView ? 5 : 10 ;
  const logoMarginLeft = isWebView ? 70 : 8 ;
  const titleMarginLeft = isWebView ? "65px" : "85px";
  const ctaContainerSize = isWebView ? "164px 164px" : "180px 180px";

  const handleCancelClicked = () => {
    history.push("/login");
  };
  return (
    <PageWrap
      pt={0}
      align="center"
      justify="center"
      title="Forgot Password"
    >
      {
        isWebView && (
            <Flex width="100%">
              <Image width="100%" height="100%" src={images.bg} />
            </Flex>
        )
      }
      <SideSlider>
        <Image justifySelf="center" width={logoWidth} mb={logoMarginBottom} src={images['TradeFedFullLogo']} ml={logoMarginLeft}/>
        <Flex width="100%">
          <H4 textAlign="center" mb={4} fontWeight={550} ml={titleMarginLeft}>
            Forgot Password
          </H4>
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
              <Grid gridTemplateColumns={ctaContainerSize}>
                <Button justifySelf="start" mt={4} width="90%" onClick={() => handleCancelClicked()} border={`1px solid ${theme.colors.brand[500]}`} background="white">
                    <Text fontSize="12px">
                      CANCEL
                    </Text>
                </Button>
                <Button isLoading={isSubmitting} type="submit" mt={4} width="90%" variantColor="brand">
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
