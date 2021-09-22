import { Button, Flex, useToast } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import { ERROR_TOAST, INDUSTRIES, SUCCESS_TOAST } from '../../constants'
import * as React from 'react'
import * as Yup from 'yup'
import { MotionFlex } from '../../components'
import { ConnectedFormGroup, ConnectedSelect } from '../../components/FormElements'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'
import {
  useCreateMyBusinessMutation
  // eslint-disable-next-line @typescript-eslint/camelcase
  //Enum_Business_Businesstype
} from '../../generated/graphql'

type NameProps = {
  handleUserDetails: (details: any) => void
}

const NameFormValidation = Yup.object().shape({
  name: Yup.string().required('A business name is required'),
  vatNumbeer: Yup.string().required('VAT number is required'),
  yearsInOperation: Yup.number().required('Years in operation is required'),
  phoneNumber: Yup.string().required('Business phone number is required'),
  registrationNumber: Yup.string().required('A registration number is required'),
  description: Yup.string().required('Description of the business is required'),
  relatedCompany: Yup.string().required('Related company is required'),
  annualTurnover: Yup.number().required('Annual turnover of the business is required'),
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
  businessType: string
}

const CompanyDetails: React.FC<NameProps> = ({ handleUserDetails }) => {
  const toast = useToast()
  const [currentBeeStatus, setCurrentBeeStatus] = React.useState('')
  const [selectedBusinessType, setSelectedBusinessType] = React.useState('')
  console.log('selectedBusinessType', selectedBusinessType)
  const [selectedVatNumber, setSelectedVatNumber] = React.useState('')
  console.log('selectedVatNumber', selectedVatNumber)

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
          businessType: '',
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

            <ConnectedSelect
              label="Select annual turnover (R) *"
              placeholder="select Annual turnover"
              name={'AnnualTurnover'}
              options={[
                {
                  label: '< 1 Million',
                  value: '< 1 Million'
                },
                {
                  label: '1-2 Million',
                  value: '1-2 Million'
                },
                {
                  label: '2-5 Million',
                  value: '2-5 Million'
                },
                {
                  label: '5-10 Million',
                  value: '5-10 Million'
                },
                {
                  label: '> 10 Million',
                  value: '> 10 Million'
                }
              ]}
            />
            <ConnectedSelect
              label="Are you VAT registered? *"
              name="vatNumber"
              onChange={(name) => {
                setSelectedVatNumber(name.target.value)
                setFieldValue('vatNumber', name.target.value)
              }}
              options={[
                {
                  label: 'Yes',
                  value: 'Yes'
                },
                {
                  label: 'No',
                  value: 'No'
                }
              ]}
            />
            <ConnectedFormGroup
              label="If yes, please provide VAT number *"
              name="vatNumber"
              type="text"
            />
            <ConnectedSelect
              label="Which industry does your business operate in *"
              placeholder="select an Industry"
              name="businessType"
              onChange={(name) => {
                setSelectedBusinessType(name.target.value)
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
              {'NEXT'}
            </Button>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}

export default CompanyDetails
