import * as React from 'react'
import * as Yup from 'yup'
import { get } from 'lodash'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

import { Button, Flex, useToast, Image } from '@chakra-ui/core'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { Form, Formik, FormikProps } from 'formik'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { images, theme } from '../../theme'
import { MotionFlex } from '../../components'
import { PageWrap } from '../../layouts'

import SenderInfo from './SenderInfo'
import ReceiverInfo from './ReceiverInfo'
import PackageDetails from './PackageDetails'

const GenerateLabelFormValidation = Yup.object().shape({
  senderCompanyName: Yup.string().required('Company Name is required'),
  senderAddress: Yup.string().required('Physical Address(Origin) is required'),
  senderNumber: Yup.string().required('Contact Number is required'),
  receiverName: Yup.string().required('Receiver Name is required'),
  receiverAddress: Yup.string().required('Physical Address(Destination) is required'),
  receiverNumber: Yup.string().required('Contact Number is required'),
  date: Yup.string().required('Date is required'),
  orderNumber: Yup.string().required('Order Number is required'),
  parcelNumber: Yup.string().required('Parcel Number is required'),
  weight: Yup.string().required('Weight is required'),
  height: Yup.string().required('Height is required'),
  length: Yup.string().required('Length is required'),
  width: Yup.string().required('Width is required')
})

export type ErrorsObject = {
  senderCompanyName?: string | undefined
  senderAddress?: string | undefined
  senderNumber?: string | undefined
  receiverName?: string | undefined
  receiverAddress?: string | undefined
  receiverNumber?: string | undefined
  date?: string | undefined
  orderNumber?: string | undefined
  parcelNumber?: boolean | string
  weight?: boolean | string
  height?: boolean | string
  length?: boolean | string
  width?: boolean | string
}

export type TouchedErrors = {
  senderCompanyName?: boolean | undefined
  senderAddress?: boolean | undefined
  senderNumber?: boolean | undefined
  receiverName?: boolean | undefined
  receiverAddress?: boolean | undefined
  receiverNumber?: boolean | undefined
  date?: boolean | undefined
  orderNumber?: boolean | undefined
  parcelNumber?: boolean | string
  weight?: boolean | string
  height?: boolean | string
  length?: boolean | string
  width?: boolean | string
}

export type GenerateLabelValues = {
  senderCompanyName: string
  senderAddress: string
  senderNumber: string
  receiverName: string
  receiverAddress: string
  receiverNumber: string
  date: string
  orderNumber: string
  parcelNumber: string
  weight: string
  height: string
  length: string
  width: string
}

const initialValues = {
  senderCompanyName: '',
  senderAddress: '',
  senderNumber: '',
  receiverName: '',
  receiverAddress: '',
  receiverNumber: '',
  date: '',
  orderNumber: '',
  parcelNumber: '',
  weight: '',
  height: '',
  length: '',
  width: ''
}

const GenerateLabel: React.FC = () => {
  const history = useHistory()
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const autofillDetails = {
    ...initialValues
  }
  const handleSubmit = async (values: GenerateLabelValues) => {
    const {
      senderCompanyName,
      senderAddress,
      senderNumber,
      receiverName,
      receiverAddress,
      receiverNumber,
      date,
      orderNumber,
      parcelNumber,
      weight,
      height,
      length,
      width
    } = values
  }

  return (
    <PageWrap
      pt={0}
      title="Generate Label"
      mt={10}
      width={isTabletOrMobile ? '100%' : '40%'}
      alignSelf="center"
    >
      <Flex width="100%" my={4} flexDirection="column" borderRadius={3}>
        <H3 textAlign="center">Generate Shipping Label</H3>
        <Flex
          mt={3}
          background={theme.colors.info}
          p={2}
          width="100%"
          height="40px"
          alignItems="center"
          justifyItems="space-between"
        >
          <Text fontSize={12} ml={3}>
            This can be filled in and printed out to go with your parcel delivery if you don’t have
            your own system yet.
          </Text>
        </Flex>
      </Flex>
      <Formik
        validationSchema={GenerateLabelFormValidation}
        initialValues={autofillDetails}
        onSubmit={async (items, { setStatus, setSubmitting }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            await handleSubmit(items)
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status, errors, values, touched }: FormikProps<GenerateLabelValues>) => {
          return (
            <Form style={{ width: '100%' }}>
              <SenderInfo />
              <ReceiverInfo />
              <PackageDetails 
              // values={values} touched={touched} errors={errors}
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
                GENERATE & DOWNLOAD
              </Button>
            </Form>
          )
        }}
      </Formik>
    </PageWrap>
  )
}

export default GenerateLabel
