import { Button, Flex, useToast } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import { BEESTATUS, ERROR_TOAST, INDUSTRIES, SUCCESS_TOAST, TURNOVER } from '../../constants'
import * as React from 'react'
import * as Yup from 'yup'
import { MotionFlex } from '../../components'
import { ConnectedFormGroup, ConnectedSelect } from '../../components/FormElements'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'
import { useCreateMyBusinessMutation } from '../../generated/graphql'

type NameProps = {
  handleUserDetails: (details: any) => void
}

const NameFormValidation = Yup.object().shape({
  name: Yup.string().required('A business name is required'),
  beeStatus: Yup.string().required('BEE Status is required'),
  yearsInOperation: Yup.number().required('Years in operation is required'),
  phoneNumber: Yup.string().required('Business phone number is required'),
  registrationNumber: Yup.string().required('A registration number is required'),
  annualTurnover: Yup.string().required('Annual turnover of the business is required'),
  businessType: Yup.string().required('The industry of the business is required')
})

type CompanyValues = {
  name: string
  beeStatus: string
  vatNumber: string
  phoneNumber: string
  websiteAddress: string
  registrationNumber: string
  yearsInOperation: number
  relatedCompany: string
  annualTurnover: string
  businessType: string
  isVatRegistered: boolean
}

const CompanyDetails: React.FC<NameProps> = ({ handleUserDetails }) => {
  const toast = useToast()
  const [vatChecked, setVatChecked] = React.useState(false)

  const [createMyBusiness] = useCreateMyBusinessMutation({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async () => {
      toast({ description: 'Business details updated!', ...SUCCESS_TOAST })
    }
  })

  const handleSubmit = async (values: CompanyValues) => {
    const {
      name,
      beeStatus,
      phoneNumber,
      isVatRegistered,
      websiteAddress,
      registrationNumber,
      yearsInOperation,
      vatNumber,
      relatedCompany,
      annualTurnover
    } = values
    const businessInput = {
      name,
      phoneNumber,
      websiteAddress,
      registrationNumber,
      yearsInOperation,
      vatNumber,
      relatedCompany,
      annualTurnover,
      beeStatus,
      isVatRegistered: vatChecked
    }
    await createMyBusiness({ variables: { input: businessInput } })
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
          name: '',
          beeStatus: '',
          phoneNumber: '',
          websiteAddress: '',
          registrationNumber: '',
          isVatRegistered: false,
          yearsInOperation: 0,
          vatNumber: '',
          businessType: '',
          relatedCompany: '',
          annualTurnover: ''
        }}
        onSubmit={async (businessInput, { setSubmitting, setStatus }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            // create the business then continue
            await handleSubmit(businessInput)
            handleUserDetails({})
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status, setFieldValue }: FormikProps<CompanyValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup label="Business Name*" name="name" type="text" />
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
              label="Select BEE status *"
              placeholder="select BEE status"
              name="beeStatus"
              onChange={(e) => setFieldValue('beeStatus', e.target.value)}
              options={BEESTATUS}
            />
            <ConnectedSelect
              label="Select annual turnover (R) *"
              placeholder="select Annual turnover"
              name="annualTurnover"
              onChange={(e) => setFieldValue('annualTurnover', e.target.value)}
              options={TURNOVER}
            />
            <ConnectedSelect
              label="Are you VAT registered? *"
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
                label="If yes, please provide VAT number *"
                placeholder="please provide VAT number"
                name="vatNumber"
                type="text"
              />
            )}
            <ConnectedSelect
              label="Which industry does your business operate in *"
              placeholder="select an Industry"
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
