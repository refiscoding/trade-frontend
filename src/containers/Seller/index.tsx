import * as React from 'react'
import * as Yup from 'yup'
import { get } from 'lodash'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

import {
  Category,
  Country,
  // eslint-disable-next-line @typescript-eslint/camelcase
  Enum_Business_Businesstype,
  Maybe,
  useCategoryQuery,
  useCreateMyBusinessMutation,
  useFetchCountriesQuery,
  useUpdateSelfMutation
} from '../../generated/graphql'
import { Button, Flex, useToast, Image } from '@chakra-ui/core'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { Form, Formik, FormikProps } from 'formik'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { images, theme } from '../../theme'
import { MotionFlex } from '../../components'
import { PageWrap } from '../../layouts'
import { useAuthContext } from '../../context/AuthProvider'

import BusinessInfo from './businessInfo'
import PersonalInfo from './personalInfo'

const SellerFormValidation = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Please enter a valid email address').required('An email is required'),
  idNumber: Yup.string().required('ID Number is required').length(13),
  phoneNumber: Yup.string().required('Phone Number is required'),
  businessPhoneNumber: Yup.string().required('Business Phone Number is required'),
  yearsOfOperation: Yup.string().required('Years Of Operation is required'),
  name: Yup.string().required('Business Name is required'),
  category: Yup.string().required('Business Category is required'),
  isVatRegistered: Yup.boolean().required('VAT Registration Status is required'),
  vatNumber: Yup.string(),
  uniqueProducts: Yup.string().required('Number of Unique Products is required'),
  products: Yup.string().required('Product Description is required'),
  hasPhysicalStore: Yup.string().required('Physical Presence is required'),
  isRetailSupplier: Yup.string().required('Retail Supplier Status is required'),
  businessType: Yup.string().required('Business Type is required'),
  revenue: Yup.string().required('Revenue Range is required'),
  registrationNumber: Yup.string().required('Registration Number is required'),
  beeStatus: Yup.string().required('BEE Status is required'),
  hazChem: Yup.string().required('Has Chem Status is required')
})

export type ErrorsObject = {
  isVatRegistered?: string | undefined
  businessType?: string | undefined
  hasPhysicalStore?: string | undefined
  isRetailSupplier?: string | undefined
  revenue?: string | undefined
  registrationNumber?: string | undefined
  beeStatus?: string | undefined
  hazChem?: string | undefined
}

export type TouchedErrors = {
  isVatRegistered?: boolean | undefined
  businessType?: boolean | undefined
  hasPhysicalStore?: boolean | undefined
  isRetailSupplier?: boolean | undefined
  revenue?: boolean | undefined
  registrationNumber?: boolean | undefined
  beeStatus?: boolean | undefined
  hazChem?: boolean | undefined
}

export type SellerValues = {
  firstName: string
  lastName: string
  email: string
  idNumber: string
  phoneNumber?: string
  name: string
  registrationNumber: string
  businessPhoneNumber: string
  businessWebsite?: string
  yearsOfOperation: string
  category: string
  location: string
  isVatRegistered: string
  vatNumber: string
  revenue: string
  beeStatus: string
  uniqueProducts: string
  products: Maybe<Maybe<string>> | undefined
  hasPhysicalStore: string
  isRetailSupplier: string
  hazChem: string
  errors?: ErrorsObject
  // eslint-disable-next-line @typescript-eslint/camelcase
  businessType?: Enum_Business_Businesstype
}

const initialValues = {
  name: '',
  businessPhoneNumber: '',
  yearsOfOperation: '',
  location: '',
  beeStatus: '',
  hazChem: '',
  registrationNumber: '',
  category: '',
  isVatRegistered: '',
  vatNumber: '',
  revenue: '',
  uniqueProducts: '',
  products: '' || undefined,
  hasPhysicalStore: '',
  isRetailSupplier: ''
}

const Seller: React.FC = () => {
  const { user, setUser } = useAuthContext()
  const history = useHistory()
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const { data } = useCategoryQuery({
    onError: (err: any) => formatError(err)
  })
  const { data: countriesData } = useFetchCountriesQuery()

  const autofillDetails = {
    ...initialValues,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    idNumber: user?.idNumber || '',
    phoneNumber: user?.phoneNumber || ''
  }

  useEffect(() => {
    if (user?.isSeller === 'pending') {
      history.push('/seller-approval')
    }
  }, [history, user])

  const categories: any = get(data, 'categories', [])
  const countries: any = get(countriesData, 'countries', [])

  const mappedCategories = categories.map((category: Category) => ({
    label: category.name,
    value: category.id
  }))
  const mappedCountries = countries.map((country: Country) => ({
    label: country.name,
    value: country.id
  }))

  const [updateSelf] = useUpdateSelfMutation({
    onError: (err: any) => formatError(err),
    onCompleted: async ({ updateSelf }) => {
      if (updateSelf?.profileCompleted && setUser) {
        setUser(updateSelf)
        if (updateSelf?.isSeller === 'pending') {
          history.push('/seller-approval')
        }
      }
    }
  })

  const [createMyBusiness] = useCreateMyBusinessMutation({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async () => {
      toast({ description: 'Business details updated!', ...SUCCESS_TOAST })
    }
  })

  const handleSubmit = async (values: SellerValues) => {
    const {
      name,
      email,
      revenue,
      hazChem,
      category,
      products,
      location,
      idNumber,
      lastName,
      beeStatus,
      firstName,
      vatNumber,
      phoneNumber,
      businessType,
      uniqueProducts,
      isVatRegistered,
      businessWebsite,
      isRetailSupplier,
      hasPhysicalStore,
      yearsOfOperation,
      registrationNumber,
      businessPhoneNumber
    } = values
    const businessInput = {
      name,
      revenue,
      beeStatus,
      vatNumber,
      businessType,
      uniqueProducts,
      registrationNumber,
      countries: [location],
      categories: [category],
      productsSummary: products,
      hazChem: Boolean(hazChem),
      websiteAddress: businessWebsite,
      phoneNumber: businessPhoneNumber,
      isVatRegistered: Boolean(isVatRegistered),
      hasPhysicalStore: Boolean(hasPhysicalStore),
      isRetailSupplier: Boolean(isRetailSupplier),
      yearsInOperation: parseInt(yearsOfOperation)
    }

    const userDetails = {
      firstName,
      lastName,
      email,
      idNumber,
      phoneNumber
    }
    await createMyBusiness({ variables: { input: businessInput } })
    await updateSelf({ variables: { input: { ...userDetails } } })
  }

  return (
    <PageWrap
      pt={0}
      title="Seller Details"
      mt={10}
      width={isTabletOrMobile ? '100%' : '40%'}
      alignSelf="center"
    >
      <Flex width="100%" my={4} flexDirection="column" borderRadius={3}>
        <H3 textAlign="center">Apply to sell on TradeFed.</H3>
        <Flex
          mt={3}
          background={theme.colors.info}
          p={2}
          width="100%"
          height="40px"
          alignItems="center"
          justifyItems="space-between"
        >
          <Image src={images.infoIcon} height="50%" />
          <Text fontSize={12} ml={3}>
            To continue to be a seller, you need to go through a credit check process as well.
          </Text>
        </Flex>
      </Flex>
      <Formik
        validationSchema={SellerFormValidation}
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
        {({ isSubmitting, status, errors, values, touched }: FormikProps<SellerValues>) => {
          return (
            <Form style={{ width: '100%' }}>
              <PersonalInfo />
              <BusinessInfo
                categories={mappedCategories}
                countries={mappedCountries}
                values={values}
                touched={touched}
                errors={errors}
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
                SUBMIT
              </Button>
            </Form>
          )
        }}
      </Formik>
    </PageWrap>
  )
}

export default Seller
