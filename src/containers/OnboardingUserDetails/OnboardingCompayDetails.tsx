import { Button, Flex, useToast } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import * as React from 'react'
import * as Yup from 'yup'
import { MotionFlex } from '../../components'
import { ConnectedFormGroup, ConnectedSelect } from '../../components/FormElements'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'
import {
  useCreateMyBusinessMutation,
  // eslint-disable-next-line @typescript-eslint/camelcase
  Enum_Business_Businesstype
} from '../../generated/graphql'

type NameProps = {
  handleUserDetails: (details: any) => void
}

const NameFormValidation = Yup.object().shape({
  name: Yup.string().required('A business name is required'),
  phoneNumber: Yup.string().required('Business phone number is required'),
  websiteAddress: Yup.string().required('Website is required'),
  registrationNumber: Yup.string().required('A registration number is required'),
  yearsInOperation: Yup.string().required('Business years in operation are required'),
  description: Yup.string().required('Description of the business is required'),
  vatNumber: Yup.string().required('VAT number is required'),
  relatedCompany: Yup.string().required('Related company is required'),
  annualTurnover: Yup.string().required('Annual turnover of the business is required'),
  businessType: Yup.string().required('The industry of the business is required')
})

type CompanyValues = {
  name: string
  phoneNumber: string
  websiteAddress: string
  registrationNumber: string
  yearsInOperation: number
  description: string
  vatNumber: string
  relatedCompany: string
  annualTurnover: number
  // eslint-disable-next-line @typescript-eslint/camelcase
  businessType?: Enum_Business_Businesstype
}

const CompanyDetails: React.FC<NameProps> = ({ handleUserDetails }) => {
  const toast = useToast()
  const [currentBeeStatus, setCurrentBeeStatus] = React.useState('')

  const handleBeeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.persist()
    const value = event?.target?.value
    setCurrentBeeStatus(value)
  }

  const [createMyBusiness] = useCreateMyBusinessMutation({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async () => {
      toast({ description: 'Business details updated!', ...SUCCESS_TOAST })
    }
  })

  const handleSubmit = async (values: CompanyValues) => {
    const {
      name,
      phoneNumber,
      websiteAddress,
      registrationNumber,
      yearsInOperation,
      description,
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
      description,
      vatNumber,
      relatedCompany,
      annualTurnover,
      beeStatus: currentBeeStatus,
      isVatRegistered: Boolean(vatNumber.length > 0 ? true : false),
      hasPhysicalStore: Boolean(true)
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
          phoneNumber: '',
          websiteAddress: '',
          registrationNumber: '',
          yearsInOperation: 0,
          description: '',
          vatNumber: '',
          relatedCompany: '',
          annualTurnover: 0
        }}
        onSubmit={async (
          {
            name,
            phoneNumber,
            websiteAddress,
            registrationNumber,
            yearsInOperation,
            description,
            annualTurnover,
            vatNumber,
            relatedCompany,
            businessType
          },
          { setStatus, setSubmitting }
        ) => {
          setStatus(null)
          try {
            console.log('we are failing here')
            setSubmitting(true)
            // create the business then continue
            await handleSubmit({
              name,
              phoneNumber,
              websiteAddress,
              registrationNumber,
              yearsInOperation,
              description,
              annualTurnover,
              vatNumber,
              relatedCompany,
              businessType
            })
            handleUserDetails({})
            setSubmitting(false)
          } catch (error) {
            console.log('this is the error: ', error)
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status }: FormikProps<CompanyValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup label="Company name?*" name="name" type="text" />

            <ConnectedFormGroup
              label="Business/Work phone number*"
              name="phoneNumber"
              type="text"
            />
            <ConnectedFormGroup
              label="Business website address*"
              name="websiteAddress"
              type="text"
            />
            <ConnectedFormGroup
              label="Business registration number*"
              name="registrationNumber"
              type="text"
            />
            <ConnectedFormGroup
              label="Number of years in operation"
              name="yearsInOperation"
              type="number"
            />
            <ConnectedFormGroup
              label="Related/Associated company/Group*"
              name="relatedCompany"
              type="text"
            />
            <ConnectedSelect
              label="Select BEE status *"
              onChange={handleBeeStatus}
              name={'BeeStatus'}
              options={[
                {
                  label: 'Level 1',
                  value: 'Level 1'
                },
                {
                  label: 'Level 2',
                  value: 'Level 2'
                },
                {
                  label: 'Level 3',
                  value: 'Level 3'
                },
                {
                  label: 'Level 4',
                  value: 'Level 4'
                },
                {
                  label: 'Level 5',
                  value: 'Level 5'
                },
                {
                  label: 'Level 6',
                  value: 'Level 6'
                },
                {
                  label: 'Level 7',
                  value: 'Level 7'
                },
                {
                  label: 'Level 8',
                  value: 'Level 8'
                },
                {
                  label: 'None',
                  value: 'None'
                }
              ]}
            />

            <ConnectedFormGroup label="Annual Turnover *" name="annualTurnover" type="number" />
            <ConnectedFormGroup
              label="Vat registration number (if applicable)"
              name="vatNumber"
              type="text"
            />
            <ConnectedFormGroup
              label="Which industry does your business operate in *"
              name="businessType"
              type="text"
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
