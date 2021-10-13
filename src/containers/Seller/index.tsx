import * as React from 'react'
import * as Yup from 'yup'
import { get } from 'lodash'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

import {
  Category,
  Country,
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
  beeStatus: Yup.string().required('BEE Status is required'),
  businessPhoneNumber: Yup.string().required('Business Phone Number is required'),
  businessType: Yup.string().required('Business Type is required'),
  category: Yup.string().required('Business Category is required'),
  companyName: Yup.string().required('Company Name is required'),
  email: Yup.string().email('Please enter a valid email address').required('An email is required'),
  firstName: Yup.string().required('First Name is required'),
  hasPhysicalStore: Yup.string().required('Physical Presence is required'),
  hazChem: Yup.string(),
  idNumber: Yup.string().required('ID Number is required').length(13),
  isHazChem: Yup.boolean().required('Haz Chem status is required'),
  isRetailSupplier: Yup.boolean().required('Retail Supplier Status is required'),
  isVatRegistered: Yup.boolean().required('VAT Registration Status is required'),
  lastName: Yup.string().required('Last Name is required'),
  name: Yup.string().required('Business Name is required'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  position: Yup.string().required('Company Position is required'),
  products: Yup.string().required('Product Description is required'),
  registrationNumber: Yup.string().required('Registration Number is required'),
  revenue: Yup.string().required('Revenue Range is required'),
  suppliedBrands: Yup.string().required('List of brands is required'),
  uniqueProducts: Yup.string().required('Number of Unique Products is required'),
  vatNumber: Yup.string(),
  yearsInOperation: Yup.number().required('Years Of Operation is required')
})

export type ErrorsObject = {
  beeStatus?: string | undefined
  businessType?: string | undefined
  companyName?: string | undefined
  hasPhysicalStore?: string | undefined
  hazChem?: string | undefined
  isHazChem?: boolean | undefined
  isRetailSupplier?: boolean | undefined
  isVatRegistered?: boolean | undefined
  position?: string | undefined
  registrationNumber?: string | undefined
  revenue?: string | undefined
}

export type TouchedErrors = {
  beeStatus?: boolean | undefined
  businessType?: boolean | undefined
  companyName?: boolean | undefined
  hasPhysicalStore?: boolean | undefined
  isHazChem?: boolean | undefined
  isRetailSupplier?: boolean | undefined
  isVatRegistered?: boolean | undefined
  position?: boolean | undefined
  registrationNumber?: boolean | undefined
  revenue?: boolean | undefined
  //hazChem?: boolean | undefined
}

export type SellerValues = {
  beeStatus: string
  businessPhoneNumber: string
  businessType?: string
  businessWebsite?: string
  category: string
  companyName: string
  email: string
  errors?: ErrorsObject
  firstName: string
  hasPhysicalStore: string
  hazChem: string
  idNumber: string
  isHazChem: boolean
  isRetailSupplier: boolean
  isVatRegistered: boolean
  lastName: string
  location: string
  name: string
  phoneNumber?: string
  position: string
  products: Maybe<Maybe<string>> | undefined
  registrationNumber: string
  revenue: string
  suppliedBrands: string
  uniqueProducts: string
  vatNumber: string
  yearsInOperation: number
}

const initialValues = {
  category: '',
  hasPhysicalStore: '',
  location: '',
  products: '' || undefined,
  suppliedBrands: '',
  uniqueProducts: ''
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
    beeStatus: user?.business?.beeStatus || '',
    businessPhoneNumber: user?.business?.phoneNumber || '',
    businessType: user?.business?.businessType || '',
    companyName: user?.companyName || '',
    companyRelated: user?.business?.companyRelated || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    hazChem: user?.business?.hazChem || '',
    idNumber: user?.idNumber || '',
    isHazChem: user?.business?.isHazChem || false,
    isRetailSupplier: user?.business?.isRetailSupplier || false,
    isVatRegistered: user?.business?.isVatRegistered || false,
    lastName: user?.lastName || '',
    name: user?.business?.name || '',
    phoneNumber: user?.phoneNumber || '',
    position: user?.position || '',
    registrationNumber: user?.business?.registrationNumber || '',
    revenue: user?.business?.annualTurn || '',
    vatNumber: user?.business?.vatNumber || '',
    websiteAddress: user?.business?.websiteAddress || '',
    yearsInOperation: user?.business?.yearsInOperation || 0
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
      companyName,
      isHazChem,
      beeStatus,
      firstName,
      vatNumber,
      phoneNumber,
      businessType,
      uniqueProducts,
      suppliedBrands,
      isVatRegistered,
      businessWebsite,
      isRetailSupplier,
      hasPhysicalStore,
      yearsInOperation,
      registrationNumber,
      businessPhoneNumber
    } = values
    const businessInput = {
      name,
      revenue,
      hazChem,
      beeStatus,
      vatNumber,
      businessType,
      suppliedBrands,
      uniqueProducts,
      companyName,
      registrationNumber,
      countries: [location],
      categories: [category],
      productsSummary: products,
      isHazChem: Boolean(isHazChem),
      websiteAddress: businessWebsite,
      phoneNumber: businessPhoneNumber,
      isVatRegistered: Boolean(isVatRegistered),
      hasPhysicalStore: Boolean(hasPhysicalStore),
      isRetailSupplier: Boolean(isRetailSupplier),
      yearsInOperation
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
      mt={20}
      width={isTabletOrMobile ? '100%' : '40%'}
      alignSelf="center"
    >
      <Flex width="100%" my={4} flexDirection="column" borderRadius={3}>
        <H3 textAlign="center">Apply to sell on TradeFed</H3>
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
        {({ isSubmitting, status, values, setFieldValue }: FormikProps<SellerValues>) => {
          return (
            <Form style={{ width: '100%' }}>
              <PersonalInfo />
              <BusinessInfo
                categories={mappedCategories}
                countries={mappedCountries}
                values={values}
                setFieldValue={setFieldValue}
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
