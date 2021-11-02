import * as React from 'react'
import * as Yup from 'yup'

import { Button, Flex, useToast } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'

import { BEESTATUS, ERROR_TOAST, INDUSTRIES, SUCCESS_TOAST, TURNOVER } from '../../constants'
import {
  ConnectedFormGroup,
  ConnectedNumberInput,
  ConnectedSelect
} from '../../components/FormElements'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { MotionFlex } from '../../components'
import { POSITIONS } from '../../constants'
import { useCreateBusinessOnSignUpMutation } from '../../generated/graphql'

type NameProps = {
  handleUserDetails: (details: any) => void
}

const NameFormValidation = Yup.object().shape({
  annualTurn: Yup.string().required('Annual turnover is required'),
  beeStatus: Yup.string().required('BEE status is required'),
  businessType: Yup.string().required('Industry is required'),
  companyName: Yup.string().required('Company name is required'),
  phoneNumber: Yup.string().required('Business phone number is required'),
  position: Yup.string().required('Position is required'),
  registrationNumber: Yup.string().required('Business registration number is required'),
  yearsInOperation: Yup.string().required('Years in operation is required'),
  vatNumber: Yup.string().when('isVatRegistered', {
    is: (isVatRegistered) => isVatRegistered === 'true',
    then: Yup.string().required('VAT number is required')
  })
})

type CompanyValues = {
  annualTurn: string
  beeStatus: string
  businessType: string
  companyName: string
  companyRelated: string
  isVatRegistered: boolean
  otherPosition: string
  phoneNumber: string
  position: string
  registrationNumber: string
  vatNumber: string
  websiteAddress: string
  yearsInOperation: string
}

const CompanyDetails: React.FC<NameProps> = ({ handleUserDetails }) => {
  const toast = useToast()
  const [vatChecked, setVatChecked] = React.useState(false)

  const [createBusinessOnSignUp, { data }] = useCreateBusinessOnSignUpMutation({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async () => {
      toast({ description: 'Business details updated!', ...SUCCESS_TOAST })
    }
  })

  const businessId = data?.createBusinessOnSignUp?.id

  const handleSubmit = async (values: CompanyValues) => {
    const {
      annualTurn,
      beeStatus,
      companyName,
      companyRelated,
      otherPosition,
      phoneNumber,
      position,
      registrationNumber,
      vatNumber,
      websiteAddress,
      yearsInOperation
    } = values
    const businessInput = {
      annualTurn,
      beeStatus,
      companyName,
      companyRelated,
      isVatRegistered: vatChecked,
      otherPosition,
      phoneNumber,
      position,
      registrationNumber,
      vatNumber,
      websiteAddress,
      yearsInOperation
    }
    await createBusinessOnSignUp({ variables: { input: businessInput } })

    handleUserDetails({
      business: businessId
    })
  }

  return (
    <React.Fragment>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Company details</H3>
      </Flex>
      <Formik
        validationSchema={NameFormValidation}
        initialValues={{
          annualTurn: '',
          beeStatus: '',
          businessType: '',
          companyName: '',
          companyRelated: '',
          isVatRegistered: false,
          otherPosition: '',
          phoneNumber: '',
          position: '',
          registrationNumber: '',
          vatNumber: '',
          websiteAddress: '',
          yearsInOperation: ''
        }}
        onSubmit={async (businessInput, { setSubmitting, setStatus }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            // create the business then continue
            await handleSubmit(businessInput)
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status, setFieldValue }: FormikProps<CompanyValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup label="Company name*" name="companyName" type="text" />
            <ConnectedSelect
              label="Position*"
              placeholder="Select position"
              onChange={(e) => setFieldValue('position', e.target.value)}
              name="position"
              options={POSITIONS}
            />
            <ConnectedFormGroup label="If other, please specify" name="otherPosition" type="text" />
            <ConnectedNumberInput
              label="Business/ work phone number*"
              name="phoneNumber"
              unit="+27"
            />
            <ConnectedFormGroup
              label="Business website address"
              name="websiteAddress"
              type="text"
            />
            <ConnectedFormGroup
              label="Business registration number*"
              name="registrationNumber"
              type="text"
            />
            <ConnectedFormGroup
              label="Number of years in operation*"
              name="yearsInOperation"
              type="number"
            />
            <ConnectedFormGroup
              label="Related/ associated company/ group"
              name="relatedCompany"
              type="text"
            />
            <ConnectedSelect
              label="BEE status*"
              placeholder="Select BEE status"
              name="beeStatus"
              onChange={(e) => setFieldValue('beeStatus', e.target.value)}
              options={BEESTATUS}
            />
            <ConnectedSelect
              label="Annual turnover (R)*"
              placeholder="Select annual turnover"
              name="annualTurn"
              onChange={(e) => setFieldValue('annualTurn', e.target.value)}
              options={TURNOVER}
            />
            <ConnectedSelect
              label="Are you VAT registered?*"
              name="isVatRegistered"
              onChange={(name) => {
                setFieldValue('isVatRegistered', name.target.value)
                if (name.target.value === 'true') {
                  setVatChecked(true)
                } else {
                  setVatChecked(false)
                }
              }}
              options={[
                {
                  label: 'No',
                  value: false
                },
                {
                  label: 'Yes',
                  value: true
                }
              ]}
            />
            {vatChecked === true && (
              <ConnectedFormGroup label="Please provide VAT number*" name="vatNumber" type="text" />
            )}
            <ConnectedSelect
              label="Which industry does your business operate in?*"
              placeholder="Select industry"
              name="businessType"
              onChange={(name) => {
                setFieldValue('businessType', name.target.value)
              }}
              options={INDUSTRIES}
            />
            {status && (
              <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} mb={2} width="100%">
                <Text textAlign="right" color="red.500">
                  {status}
                </Text>
              </MotionFlex>
            )}
            <Button mt={4} width="100%" type="submit" variantColor="brand" isLoading={isSubmitting}>
              NEXT
            </Button>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}

export default CompanyDetails
