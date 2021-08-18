import * as React from 'react'
import * as Yup from 'yup'
import styled from '@emotion/styled'
import { useMediaQuery } from 'react-responsive'
import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'

import { Button, Flex } from '@chakra-ui/core'
import { Form, Formik } from 'formik'
import { H3, Text } from '../../typography'
import { theme } from '../../theme'
import { PageWrap } from '../../layouts'

import SenderInfo from './SenderInfo'
import ReceiverInfo from './ReceiverInfo'
import PackageDetails from './PackageDetails'
import PrintLabelComponent from './PrintLabelComponent'

const PrintOutFlex = styled(Flex)`
  @media screen {
    display: none;
  }
`

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

const initialValues = {
  senderCompanyName: 'TradeFed',
  senderAddress: 'Pretoria',
  senderNumber: '7343334456',
  receiverName: 'New User',
  receiverAddress: 'New Address',
  receiverNumber: '7343334567',
  date: '',
  orderNumber: 'TSA0001',
  parcelNumber: '1234567',
  weight: '2kg',
  height: '40cm',
  length: '100cm',
  width: '50cm'
}

const GenerateLabel: React.FC = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const autofillDetails = {
    ...initialValues
  }

  const printLabel = useRef(null)

  const reactToPrintContent = React.useCallback(() => {
    return printLabel.current
    // eslint-disable-next-line
  }, [printLabel.current])

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: 'Print Label'
  })

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
        onSubmit={() => {}}
      >
        {() => {
          return (
            <Form style={{ width: '100%' }}>
              <SenderInfo />
              <ReceiverInfo />
              <PackageDetails
              // values={values} touched={touched} errors={errors}
              />
              <Button mt={4} width="100%" type="submit" variantColor="brand" onClick={handlePrint}>
                GENERATE & DOWNLOAD
              </Button>
              <PrintOutFlex ref={printLabel}>
                <PrintLabelComponent />
              </PrintOutFlex>
            </Form>
          )
        }}
      </Formik>
    </PageWrap>
  )
}

export default GenerateLabel
