/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'
import * as Yup from 'yup'
import styled from '@emotion/styled'
import { useMediaQuery } from 'react-responsive'
import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'

import { Button, Flex } from '@chakra-ui/core'
// import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { Form, Formik } from 'formik'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { MotionFlex } from '../../components'
import { PageWrap } from '../../layouts'
import { theme } from '../../theme'
// import { useCreateWaybillMutation } from '../../generated/graphql'

import SenderInfo from './SenderInfo'
import ReceiverInfo from './ReceiverInfo'
import PackageDetails from './PackageDetails'
import PrintLabelComponent from './PrintLabelComponent'
import strapiHelpers from '../../utils/strapiHelpers'

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
  orderNumber?: string
  parcelNumber?: string
  weight?: string
  height?: string
  length?: string
  width?: string
}

const GenerateLabel: React.FC = () => {
  // const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const orderDetails = JSON.parse(localStorage.getItem('generated_label') || '')
  const { deliveryAddress, orderNumber, items, owner } = orderDetails

  const autofillDetails = {
    senderCompanyName: items[0].product.business.address[0].name,
    senderStreetAddress: items[0].product.business.address[0].postalCode,
    senderSuburb: items[0].product.business.address[0].suburb,
    senderTown: items[0].product.business.address[0].city,
    senderNumber: items[0].product.business.phoneNumber,
    receiverName: deliveryAddress.name,
    receiverStreetAddress: deliveryAddress.postalCode,
    receiverSuburb: deliveryAddress.suburb,
    receiverTown: deliveryAddress.city,
    receiverNumber: owner.phoneNumber,
    orderNumber: orderNumber,
    parcelNumber: ' ',
    weight: items[0].product.weight || '-',
    height: items[0].product.height || '-',
    length: items[0].product.length || '-',
    width: items[0].product.width || '-'
  }
  // const date = new Date().toLocaleDateString()

  // const [createWaybill] = useCreateWaybillMutation({
  //   onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
  //   onCompleted: async () => {
  //     toast({ description: 'Waybill successfully created', ...SUCCESS_TOAST })
  //   }
  // })

  const handleSubmit = async () => {
    // const createWaybillInput = {
    //   Waybill: orderNumber,
    //   dateWay: date,
    //   branch: autofillDetails.senderCompanyName,
    //   accNum: autofillDetails.senderNumber,
    //   custName: autofillDetails.receiverName,
    //   sendArea: autofillDetails.receiverName,
    //   shipAdres1: items[0].product.business.address[0].province,
    //   shipAdres2: autofillDetails.senderTown,
    //   shipAdres3: autofillDetails.senderSuburb,
    //   shipAdres4: autofillDetails.senderStreetAddress,
    //   consigName: autofillDetails.orderNumber,
    //   conAddr1: deliveryAddress.province,
    //   conAddr2: autofillDetails.receiverTown,
    //   conAddr3: autofillDetails.receiverSuburb,
    //   conAddr4: autofillDetails.receiverStreetAddress,
    //   destArea: deliveryAddress.province,
    //   conName: owner.firstName,
    //   conTelNo: owner.phoneNumber,
    //   serv_c: 'ECO',
    //   numParcel: items.length,
    //   massKg: autofillDetails.weight
    // }
    // await createWaybill({
    //   variables: {
    //     input: createWaybillInput
    //   }
    // })
    // console.log('jere now')
    strapiHelpers.sendReadyForPickUpEmail(orderDetails)
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
        // onSubmit={()=> {}}
        onSubmit={async () => {
          try {
            await handleSubmit()
          } catch (error) {
            formatError(error)
          }
        }}
      >
        {({ isSubmitting, status }) => {
          return (
            <Form style={{ width: '100%' }}>
              <SenderInfo />
              <ReceiverInfo />
              <PackageDetails />
              <Button
                mt={4}
                width="100%"
                type="submit"
                variantColor="brand"
                onClick={handlePrint}
                isLoading={isSubmitting}
              >
                GENERATE & DOWNLOAD
              </Button>
              {status && (
                <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} mb={2} width="100%">
                  <Text textAlign="right" color="red.500">
                    {status}
                  </Text>
                </MotionFlex>
              )}
              <PrintOutFlex ref={printLabel}>
                <PrintLabelComponent
                  deliveryAddress={deliveryAddress}
                  orderNumber={orderNumber}
                  items={items}
                  owner={owner}
                />
              </PrintOutFlex>
            </Form>
          )
        }}
      </Formik>
    </PageWrap>
  )
}

export default GenerateLabel
