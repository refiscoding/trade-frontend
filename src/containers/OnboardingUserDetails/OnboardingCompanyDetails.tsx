import * as React from 'react'
import * as Yup from 'yup'

import { Button, Flex, useToast } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'

import { BEESTATUS, ERROR_TOAST, INDUSTRIES, SUCCESS_TOAST, TURNOVER } from '../../constants'
import { ConnectedFormGroup, ConnectedSelect } from '../../components/FormElements'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { MotionFlex } from '../../components'
import { useCreateBusinessOnSignUpMutation } from '../../generated/graphql'

type NameProps = {
  handleUserDetails: (details: any) => void
}

const NameFormValidation = Yup.object().shape({
  annualTurn: Yup.string().required('Annual turnover of the business is required'),
  beeStatus: Yup.string().required('BEE Status is required'),
  businessType: Yup.string().required('The industry of the business is required'),
  phoneNumber: Yup.string().required('Business phone number is required'),
  registrationNumber: Yup.string().required('A registration number is required'),
  yearsInOperation: Yup.number().required('Years in operation is required'),
  vatNumber: Yup.string().when('isVatRegistered', {
    is: (isVatRegistered) => isVatRegistered === 'true',
    then: Yup.string().required('A VAT number is required if your business is VAT registered')
  })
})

type CompanyValues = {
  annualTurn: string
  beeStatus: string
  businessType: string
  companyRelated: string
  isVatRegistered: boolean
  phoneNumber: string
  registrationNumber: string
  vatNumber: string
  websiteAddress: string
  yearsInOperation: number
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
      companyRelated,
      phoneNumber,
      registrationNumber,
      vatNumber,
      websiteAddress,
      yearsInOperation
    } = values
    const businessInput = {
      annualTurn,
      beeStatus,
      companyRelated,
      isVatRegistered: vatChecked,
      phoneNumber,
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
        <H3 textAlign="left">Company Details</H3>
        <Text textAlign="left" fontSize="14px">
          Fill out some information about your company to get started.
        </Text>
      </Flex>
      <Formik
        validationSchema={NameFormValidation}
        initialValues={{
          beeStatus: '',
          phoneNumber: '',
          websiteAddress: '',
          registrationNumber: '',
          isVatRegistered: false,
          yearsInOperation: 0,
          vatNumber: '',
          businessType: '',
          companyRelated: '',
          annualTurn: ''
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
            <ConnectedFormGroup
              label="Business/Work phone number*"
              name="phoneNumber"
              type="text"
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
              label="Related/Associated company/Group"
              name="relatedCompany"
              type="text"
            />
            <ConnectedSelect
              label="Select BEE status*"
              placeholder="Select BEE status"
              name="beeStatus"
              onChange={(e) => setFieldValue('beeStatus', e.target.value)}
              options={BEESTATUS}
            />
            <ConnectedSelect
              label="Select annual turnover (R)*"
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
              <ConnectedFormGroup
                label="If yes, please provide VAT number*"
                placeholder="Please provide VAT number"
                name="vatNumber"
                type="text"
              />
            )}
            <ConnectedSelect
              label="Which industry does your business operate in*"
              placeholder="Select an Industry"
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
