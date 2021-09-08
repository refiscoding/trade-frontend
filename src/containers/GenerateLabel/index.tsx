import * as React from 'react'
import dayjs from 'dayjs'
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
  senderStreetAddress: Yup.string().required('Sender Street Address(Origin) is required'),
  senderNumber: Yup.string().required('Contact Number is required'),
  senderSuburb: Yup.string().required('Sender Suburb is required'),
  senderTown: Yup.string().required('Sender Town is required'),
  receiverName: Yup.string().required('Receiver Name is required'),
  receiverStreetAddress: Yup.string().required('Receiver Street Address(Destination) is required'),
  receiverSuburb: Yup.string().required('Receiver Suburb is required'),
  receiverTown: Yup.string().required('Receiver Town is required'),
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
  senderStreetAddress?: string | undefined
  senderSuburb?: string | undefined
  senderTown?: string | undefined
  senderNumber?: string | undefined
  receiverName?: string | undefined
  receiverStreetAddress?: string | undefined
  receiverSuburb?: string | undefined
  receiverTown?: string | undefined
  receiverNumber?: string | undefined
  date?: string | undefined
  orderNumber?: string | undefined
  parcelNumber?: string | string
  weight?: string | string
  height?: string | string
  length?: string | string
  width?: string | string
}

export type TouchedErrors = {
  senderCompanyName?: string | undefined
  senderStreetAddress?: string | undefined
  senderSuburb?: string | undefined
  senderTown?: string | undefined
  senderNumber?: string | undefined
  receiverName?: string | undefined
  receiverStreetAddress?: string | undefined
  receiverSuburb?: string | undefined
  receiverTown?: string | undefined
  receiverNumber?: string | undefined
  date?: string | undefined
  orderNumber?: string | undefined
  parcelNumber?: string | string
  weight?: string | string
  height?: string | string
  length?: string | string
  width?: string | string
}

export type labelValues = {
  senderCompanyName?: string
  senderStreetAddress?: string
  senderSuburb?: string
  senderTown?: string
  senderNumber?: string
  receiverName?: string
  receiverStreetAddress?: string
  receiverSuburb?: string
  receiverTown?: string
  receiverNumber?: string
  date?: string
  orderNumber?: string
  parcelNumber?: string
  weight?: string
  height?: string
  length?: string
  width?: string
}

const GenerateLabel: React.FC = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const orderDetails = JSON.parse(localStorage.getItem('generated_label') || '')
  const { deliveryAddress, orderNumber, deliveryDate } = orderDetails
  const addressData = deliveryAddress.address.split(',')

  const autofillDetails = {
    senderCompanyName: '-',
    senderStreetAddress: '-',
    senderSuburb: '-',
    senderTown: '-',
    senderNumber: '-',
    receiverName: deliveryAddress.name,
    receiverStreetAddress: addressData[3] && addressData[3].trim(),
    receiverSuburb: addressData[2] && addressData[2].trim(),
    receiverTown: addressData[0] && addressData[0].trim(),
    receiverNumber: '-',
    date: dayjs(deliveryDate).format('DD.MM.YYYY'),
    orderNumber: orderNumber,
    parcelNumber: '-',
    weight: '-',
    height: '-',
    length: '-',
    width: '-'
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
              <PackageDetails />
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
