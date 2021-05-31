import * as React from 'react'
import { get } from 'lodash'

import { PageWrap } from '../../layouts'
import { MotionFlex } from '../../components'
import {
  useUpdateSelfMutation,
  useCategoryQuery,
  useCreateMyBusinessMutation,
  // eslint-disable-next-line @typescript-eslint/camelcase
  Enum_Business_Businesstype,
  Maybe
} from '../../generated/graphql'
import { formatError } from '../../utils'
import { useHistory } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthProvider'
import { Button, Flex, useToast } from '@chakra-ui/core'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { Form, Formik, FormikProps } from 'formik'
import { H3, Text } from '../../typography'
import * as Yup from 'yup'
import PersonalInfo from './personalInfo'
import BusinessInfo from './businessInfo'
import { useEffect } from 'react'
import { useMediaQuery } from "react-responsive";

const SellerFormValidation = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Please enter a valid email address').required('An email is required'),
  idNumber: Yup.string().required('ID Number is required').length(13),
  phoneNumber: Yup.string().required('Phone Number is required'),
  name: Yup.string().required('Business Name is required'),
  category: Yup.string().required('Business Category is required'),
  isVatRegistered: Yup.boolean().required('VAT Registration Status is required'),
  vatNumber: Yup.string().required('VAT Number is required'),
  uniqueProducts: Yup.string().required('Number of Unique Products is required'),
  products: Yup.string().required('Product Description is required'),
  hasPhysicalStore: Yup.string().required('Physical Presence is required'),
  isRetailSupplier: Yup.string().required('Retail Supplier Status is required'),
  businessType: Yup.string().required('Business Type is required'),
  carryStock: Yup.string().required('Stock Carriage Status is required'),
  revenue: Yup.string().required('Revenue Range is required'),
  registrationNumber: Yup.string().required('Registration Number is required'),
});

export type ErrorsObject = {
  isVatRegistered?: string | undefined
  businessType?: string | undefined
  carryStock?: string | undefined
  hasPhysicalStore?: string | undefined
  isRetailSupplier?: string | undefined
  revenue?: string | undefined
  registrationNumber?: string | undefined
};

type SellerValues = {
  firstName: string
  lastName: string
  email: string
  idNumber: string
  name: string
  category: string
  isVatRegistered: string
  phoneNumber?: string
  revenue: string
  vatNumber: string
  uniqueProducts: string
  products: Maybe<Maybe<string>[]> | undefined
  hasPhysicalStore: string
  isRetailSupplier: string
  // eslint-disable-next-line @typescript-eslint/camelcase
  businessType?: Enum_Business_Businesstype
  carryStock: string
  errors?: ErrorsObject
}

const initialValues = {
  name: '',
  category: '',
  isVatRegistered: '',
  vatNumber: '',
  revenue: '',
  uniqueProducts: '',
  products: '' || undefined,
  hasPhysicalStore: '',
  isRetailSupplier: '',
  carryStock: ''
}

const valuesMapper = (value: string): boolean => {
  return value === 'true'
}

const Seller: React.FC = () => {
  const { user, setUser } = useAuthContext()
  const history = useHistory()
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const { data } = useCategoryQuery({
    onError: (err: any) => formatError(err)
  })
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

  const mappedCategories = categories.map((category: any) => ({
    label: category.name,
    value: category.id
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
      category,
      vatNumber,
      uniqueProducts,
      products,
      hasPhysicalStore,
      isRetailSupplier,
      businessType,
      revenue,
      isVatRegistered,
      firstName,
      lastName,
      email,
      idNumber,
      phoneNumber
    } = values

    const businessValues = {
      name,
      category,
      isVatRegistered: valuesMapper(isVatRegistered),
      vatNumber,
      uniqueProducts: uniqueProducts,
      products,
      revenue,
      hasPhysicalStore: valuesMapper(hasPhysicalStore),
      isRetailSupplier: valuesMapper(isRetailSupplier),
      businessType: businessType
    }
    const userDetails = {
      firstName,
      lastName,
      email,
      idNumber,
      phoneNumber
    }
    await createMyBusiness({ variables: { input: businessValues } })
    await updateSelf({ variables: { input: { ...userDetails } } })
  }

  return (
    <PageWrap pt={0} title="Seller Details" mt={10} width={isTabletOrMobile ? '100%' : '40%'} alignSelf="center">
      <Flex width="100%" my={4} flexDirection="column">
        <H3 textAlign="left">Apply to sell on TradeFed.</H3>
        <Text textAlign="left" fontSize="14px">
          To continue to be a seller, you need to go through a credit check process as well.
        </Text>
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
        {({ isSubmitting, status, errors }: FormikProps<SellerValues>) => {
          return (
            <Form style={{ width: '100%' }}>
              <PersonalInfo />
              <BusinessInfo categories={mappedCategories} errors={errors} />
              {status && (
                <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} mb={2} width="100%">
                  <Text textAlign="right" color="red.500">
                    {status}
                  </Text>
                </MotionFlex>
              )}
              <Button mt={4} width="100%" type="submit" variantColor="brand" isLoading={isSubmitting}>
                SUBMIT
              </Button>
            </Form>
          )
        }
        }
      </Formik>
    </PageWrap>
  )
}

export default Seller
