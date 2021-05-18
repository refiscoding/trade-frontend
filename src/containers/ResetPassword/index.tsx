import * as Yup from 'yup'
import * as React from 'react'
import { Form, Formik, FormikProps } from 'formik'
import { Button, Flex, useToast, Image, Grid } from '@chakra-ui/core'
import { useHistory, useLocation } from 'react-router-dom'
import { useMediaQuery } from "react-responsive";

import strapiHelpers from '../../utils/strapiHelpers'

import { images, theme } from '../../theme'
import { PageWrap } from '../../layouts'
import { formatError } from '../../utils'
import { H4, Text } from '../../typography'
import { SUCCESS_TOAST } from '../../constants'
import { MotionFlex, SideSlider } from '../../components'
import { ConnectedPasswordGroup } from '../../components/FormElements'

const ResetPasswordFormValidation = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password has to be longer than 6 characters!')
    .required('A password is required'),
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Password does not match')
})

type ResetPasswordProps = {}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const toast = useToast()
  const location = useLocation()
  const history = useHistory()
  const isWebView = useMediaQuery({ query: '(min-width: 40em)' });


  const INITIAL_VALUES = {
    password: '',
    confirmPassword: '',
    code: new URLSearchParams(location.search).get('code') as string
  }

  const logoWidth = isWebView ? "50%" : "80%";
  const logoMarginBottom = isWebView ? 5 : 10;
  const logoMarginLeft = isWebView ? 70 : 8;
  const titleMarginLeft = isWebView ? "45px" : "55px";
  const ctaContainerSize = isWebView ? "164px 164px" : "180px 180px";

  const handleCancelClicked = () => {
    history.push("/login");
  };


  return (
    <PageWrap
      pt={0}
      align="center"
      justify="center"
      title="Reset Password"
    >
      {
        isWebView && (
          <Flex width="100%">
            <Image width="100%" height="100%" src={images.bg} />
          </Flex>
        )
      }
      <SideSlider>
        <Image justifySelf="center" width={logoWidth} mb={logoMarginBottom} src={images['TradeFedFullLogo']} ml={logoMarginLeft} />
        <Flex width="100%">
          <H4 textAlign="left" mb={4} fontWeight={550} ml={titleMarginLeft}>
            Choose New Password
          </H4>
        </Flex>
        <Formik
          validationSchema={ResetPasswordFormValidation}
          initialValues={INITIAL_VALUES}
          onSubmit={async ({ code, password, confirmPassword }, { setSubmitting, setStatus }) => {
            setStatus(null)
            try {
              setSubmitting(true)
              await strapiHelpers.resetPassword(code, password, confirmPassword)
              setSubmitting(false)
              toast({ description: 'Your password was updated.', ...SUCCESS_TOAST })
              history.push('/')
            } catch (error) {
              setStatus(formatError(error))
            }
          }}
        >
          {({ isSubmitting, status }: FormikProps<typeof INITIAL_VALUES>) => (
            <Form style={{ width: '100%' }}>
              <Flex mb={10}>
                <Text textAlign="center" color={theme.colors.dimText}>Please enter and confirm your new account password.</Text>
              </Flex>
              <ConnectedPasswordGroup name="password" placeholder="Password" />
              <ConnectedPasswordGroup
                name="confirmPassword"
                placeholder="Confirm Password"
              />
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
              <Grid gridTemplateColumns={ctaContainerSize}>
                <Button justifySelf="start" mt={10} width="90%" onClick={() => handleCancelClicked()} border={`1px solid ${theme.colors.brand[500]}`} background="white">
                  <Text fontSize="12px">
                    CANCEL
                  </Text>
                </Button>
                <Button isLoading={isSubmitting} type="submit" mt={10} width="90%" variantColor="brand">
                  <Text fontSize="12px">
                    SAVE PASSWORD
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

export default ResetPassword
