/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'
import * as Yup from 'yup'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

import {
  Category,
  Country,
  Enum_Componentlocationaddress_Type,
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
import DispatchAddress from './dispatchAddress'
import PersonalInfo from './personalInfo'
import DispatchSecondaryContact from './dispatchSecondaryContact'

const SellerFormValidation = Yup.object().shape({
  beeStatus: Yup.string().required('BEE status is required'),
  businessPhoneNumber: Yup.string().required('Business/ work phone number is required'),
  categories: Yup.array().required('Business category is required'),
  city: Yup.string().required('City is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  firstName: Yup.string().required('Name is required'),
  hazChem: Yup.string(),
  headQuater: Yup.string().required('Head office is required'),
  isHazChem: Yup.boolean().required('Haz Chem status is required'),
  isVatRegistered: Yup.boolean().required('VAT Registration Status is required'),
  lastName: Yup.string().required('Surname is required'),
  name: Yup.string().required('Address name is required'),
  phoneNumber: Yup.string().required('Cell phone number is required'),
  position: Yup.string().required('Company position is required'),
  postalCode: Yup.string().required('Postal code is required'),
  products: Yup.string().required('Product description is required'),
  province: Yup.string().required('Province is required'),
  registrationNumber: Yup.string().required('Business registration number is required'),
  revenue: Yup.string().required('Annual turnover is required'),
  street: Yup.string().required('Street address is required'),
  suburb: Yup.string().required('Suburb is required'),
  dispatchSecondaryFirstName: Yup.string().required('Name is required'),
  dispatchSecondarySurname: Yup.string().required('Surname is required'),
  dispatchSecondaryPhoneNumber: Yup.string().required('Cell phone number is required'),
  dispatchSecondaryEmailAddress: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  vatNumber: Yup.string().when('isVatRegistered', {
    is: (isVatRegistered) => isVatRegistered === true,
    then: Yup.string().required('VAT number is required')
  }),
  yearsInOperation: Yup.string().required('Number of years in operation is required')
})

export type ErrorsObject = {
  beeStatus?: string | undefined
  city: string | undefined
  hazChem?: string | undefined
  headQuater: string | undefined
  isHazChem?: boolean | undefined
  isVatRegistered?: boolean | undefined
  position?: string | undefined
  postalCode: string | undefined
  province: string | undefined
  registrationNumber?: string | undefined
  revenue?: string | undefined
  street: string | undefined
  suburb: string | undefined
}

export type TouchedErrors = {
  beeStatus?: boolean | undefined
  city: boolean | undefined
  headQuater?: boolean | undefined
  isHazChem?: boolean | undefined
  isVatRegistered?: boolean | undefined
  position?: boolean | undefined
  postalCode: boolean | undefined
  province: boolean | undefined
  registrationNumber?: boolean | undefined
  revenue?: boolean | undefined
  street: boolean | undefined
  suburb: boolean | undefined
  hazChem?: boolean | undefined
}

export type SellerValues = {
  beeStatus: string
  building: string
  businessPhoneNumber: string
  businessWebsite?: string
  categories: string[]
  city: string
  countries: string[]
  email: string
  errors?: ErrorsObject
  firstName: string
  hazChem: string
  headQuater: string
  hubCode: string
  isHazChem: boolean
  isVatRegistered: boolean
  lastName: string
  location: string
  name: string
  phoneNumber?: string
  position: string
  postalCode: string
  products: Maybe<Maybe<string>> | undefined
  province: string
  registrationNumber: string
  revenue: string
  street: string
  suburb: string
  suppliedBrands: string
  vatNumber: string
  yearsInOperation: string
}

const initialValues = {
  building: '',
  city: '',
  hubCode: '',
  location: '',
  postalCode: '',
  products: '' || undefined,
  province: '',
  street: '',
  suburb: '',
  suppliedBrands: ''
}

const Seller: React.FC = () => {
  const { user, setUser } = useAuthContext()
  const history = useHistory()
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const [selectedHub, setSelectedHub] = useState('')

  const { data } = useCategoryQuery({
    onError: (err: any) => formatError(err)
  })
  const { data: countriesData } = useFetchCountriesQuery()

  const autofillDetails = {
    ...initialValues,
    beeStatus: user?.business?.beeStatus || '',
    businessPhoneNumber: user?.business?.phoneNumber || '',
    companyRelated: user?.business?.companyRelated || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    hazChem: user?.business?.hazChem || '',
    headQuater: user?.business?.headQuater || '',
    isHazChem: user?.business?.isHazChem || false,
    isVatRegistered: user?.business?.isVatRegistered || false,
    lastName: user?.lastName || '',
    name: user?.business?.companyName || '',
    phoneNumber: user?.phoneNumber || '',
    position: user?.business?.position || '',
    registrationNumber: user?.business?.registrationNumber || '',
    revenue: user?.business?.revenue || '',
    vatNumber: user?.business?.vatNumber || '',
    websiteAddress: user?.business?.websiteAddress || '',
    yearsInOperation: user?.business?.yearsInOperation || '',
    countries: [],
    categories: []
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
      beeStatus,
      building,
      businessPhoneNumber,
      businessWebsite,
      categories,
      city,
      countries,
      email,
      firstName,
      hazChem,
      headQuater,
      isHazChem,
      isVatRegistered,
      lastName,
      phoneNumber,
      postalCode,
      products,
      province,
      registrationNumber,
      revenue,
      street,
      suburb,
      suppliedBrands,
      vatNumber,
      yearsInOperation
    } = values
    const businessInput = {
      revenue,
      hazChem,
      beeStatus,
      vatNumber,
      headQuater,
      suppliedBrands,
      yearsInOperation,
      registrationNumber,
      countries: countries,
      categories: categories,
      productsSummary: products,
      isHazChem: Boolean(isHazChem),
      websiteAddress: businessWebsite,
      phoneNumber: businessPhoneNumber,
      isVatRegistered: Boolean(isVatRegistered),
      dispatchAddress: {
        street,
        building,
        province,
        city,
        suburb,
        postalCode,
        hubCode: selectedHub,
        type: Enum_Componentlocationaddress_Type.Business
      }
    }

    const userDetails = {
      firstName,
      lastName,
      email,
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
              <DispatchAddress setFieldValue={setFieldValue} setSelectedHub={setSelectedHub} />
              <DispatchSecondaryContact />
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
