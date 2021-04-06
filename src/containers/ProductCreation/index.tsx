import * as React from 'react'
import { get, isEmpty } from 'lodash'

import { PageWrap } from '../../layouts'
import { MotionFlex, Stepper } from '../../components'
import {
  Category,
  Enum_Product_Packaging as packagingEnum,
  Enum_Componentproductvariantsvariants_Variants as variantsEnum,
  useCategoryQuery,
  useAddProductMutation, UploadFile
} from '../../generated/graphql'
import { formatError } from '../../utils'
import { Button, Flex, useToast } from '@chakra-ui/core'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { H3, Text } from '../../typography'
import { Form, Formik, FormikProps } from 'formik'
import ProductInfo from './productInfo'
import ProductDetails from './productDetails'
import { Options } from '../Seller/businessInfo'
import * as Yup from 'yup'
import ProductComponent from '../ProductView/ProductComponent'
import { useHistory } from 'react-router-dom'
import {useMediaQuery} from "react-responsive";
import strapiHelpers from "../../utils/strapiHelpers";
import {File} from "react-feather";
import { AxiosResponse } from "axios";

const ProductFormValidation = Yup.object().shape({
  name: Yup.string().required('A name is required'),
  shortDescription: Yup.string().required('A short description is required').max(200),
  category: Yup.array().of(Yup.string()),
  tags: Yup.string(),
  pricePerUnit: Yup.string().required('A price per unit is required'),
  retailPricePerUnit: Yup.string().required('A retail price per unit is required'),
  availableUnits: Yup.string().required('A Units available to sell is required'),
  packaging: Yup.string().required('Packaging is required'),
  itemsPerPackage: Yup.string().required('Items per package is required'),
  description: Yup.string().required('Products description is required'),
  features: Yup.array().of(Yup.string()),
  variations: Yup.string(),
  height: Yup.string().required('A height is required'),
  length: Yup.string().required('A length is required'),
  width: Yup.string().required('A width is required'),
  weight: Yup.string().required('A weight is required')
})

export type ProductValues = {
  name: string
  shortDescription: string
  category: string[]
  tags: string
  pricePerUnit: string
  retailPricePerUnit: string
  availableUnits: string
  packaging?: packagingEnum
  itemsPerPackage: string
  description: string
  features: string[]
  variations?: variantsEnum
  height: string
  length: string
  width: string
  weight: string
}

const initialValues = {
  name: '',
  shortDescription: '',
  category: [''],
  tags: '',
  pricePerUnit: '',
  retailPricePerUnit: '',
  availableUnits: '',
  itemsPerPackage: '',
  description: '',
  features: [''],
  height: '',
  length: '',
  width: '',
  weight: ''
}

export type ImageByType = {
  productImages?: File[],
  coverImage?: File
}

const ProductCreation: React.FC = () => {
  const [active, setActive] = React.useState(0)
  const [imagebyType, setImageBytype] = React.useState<ImageByType>();
  const [tags, setTags] = React.useState<Array<string>>([]);
  const [uploading, setUploading] = React.useState(false)
  const toast = useToast()
  const history = useHistory()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const { data } = useCategoryQuery({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const categories = get(data, 'categories', null) as Category[]

  const mappedCategories = categories?.map((category: Category) => ({
    label: category.name,
    value: category.id
  })) as Options[]

  const [AddProduct] = useAddProductMutation({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async () => {
      toast({ description: 'Product details updated!', ...SUCCESS_TOAST })
      history.push('/upload-product-success')
    }
  })

  const handleUpload = async () => {
    const imagesArray = (imagebyType?.productImages && [...imagebyType.productImages]) || []
    const productImages = (imagesArray.map((file: File) => strapiHelpers.upload(file))) || []
    setUploading(true)
    try {
      const coverImage = imagebyType?.coverImage && await strapiHelpers.upload(imagebyType.coverImage) as AxiosResponse
      const uploadArr = await Promise.all(productImages)
      const uploads = uploadArr.map((upload:AxiosResponse) => upload.data[0])
      setUploading(false)
      return {
        coverImage: coverImage?.data[0],
        productImages: uploads
      }
    } catch (e) {
      setUploading(false)
      console.log("Upload Exception; ", e)
      toast({
        description: 'Something went wrong while uploading your file.',
        ...ERROR_TOAST
      })
      return false
    }
  }

  const handleImages = (imageFiles: File[], type: string, pop?: boolean) => {
    const imagesArray = Array.from(imageFiles)
    if(pop) {
      if(type === 'multi'){
        setImageBytype({...imagebyType, productImages: imagesArray})
      } else {
        setImageBytype({...imagebyType, coverImage: imagesArray[0]})
      }
      return;
    }
    if(type === 'multi'){
      setImageBytype((prevState?: ImageByType) =>
        ({...imagebyType, productImages: prevState?.productImages ? [...prevState.productImages, ...imagesArray] : imagesArray}
        ))
    } else {
      setImageBytype({...imagebyType, coverImage: imagesArray[0]})
    }
  }

  const handleNextButton = () => {
    if (active === 0) {
      setActive(1)
    }
    if (active === 1) {
      setActive(0)
    }
    if (active === 2) {
      setActive(1)
    }
  };
  const handleSetTags = (tags: string[]) => {
    setTags(tags);
  };

  const mapProducts = (values: ProductValues) => {
    return {
      name: values.name,
      shortDescription: values.shortDescription,
      description: values.description,
      tags: [...tags],
      price: {
        currency: 'R',
        retailPricePerUnit: parseInt(values.retailPricePerUnit),
        pricePerUnit: parseInt(values.pricePerUnit)
      },
      availableUnits: parseInt(values.availableUnits),
      packaging: values.packaging,
      productPrice: parseInt(values.pricePerUnit),
      size: {
        height: parseInt(values.height),
        productLength: parseInt(values.length),
        width: parseInt(values.width),
        weight: parseInt(values.weight)
      },
      features: [...values.features],
      variants: {
        variants: values.variations,
        quantity: 0
      },
      categories: [...values.category]
    }
  }

  const handleSubmitButton = (items: ProductValues) => {
    if (active === 1) {
      setActive(2)
    }
    if (active === 2) {
      const postProduct = async () => {
        const uploadedData = await handleUpload()
        const coverImage = (uploadedData && uploadedData?.coverImage?.id) || ''
        const productImages = (uploadedData && uploadedData.productImages.map((image: UploadFile) => image.id) )|| []
        await AddProduct({ variables: { input: {
              ...mapProducts(items),
              coverImage: coverImage,
              productImages: productImages
        } } })
      }
      postProduct()
    }
  }

  return (
    <PageWrap title="Add Product" alignSelf="center" width={isTabletOrMobile ? '100%' : '40%'}>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left" fontSize={18} fontWeight={600}>
          Add Basic Product Information
        </H3>
      </Flex>
      <Formik
        validationSchema={ProductFormValidation}
        initialValues={initialValues}
        onSubmit={async (items, { setStatus, setSubmitting }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            handleSubmitButton(items)
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status, values, errors}: FormikProps<ProductValues>) => (
          <Form style={{ width: '100%' }}>
            <Stepper activeStep={active}>
              <ProductInfo packagingError={errors?.packaging} values={values} categories={mappedCategories} handleSetTags={handleSetTags}/>
              <ProductDetails imageValues={imagebyType} values={values} setImage={handleImages} />
              <Flex
                position="relative"
                left={isTabletOrMobile ? 0 : "-80%"}
                flexDirection="column"
                alignItems="center"
                width={isTabletOrMobile ? "100%" : "100vw"}
              >
                <ProductComponent
                  product={{
                    ...mapProducts(values),
                    coverImage: {
                      preview: true,
                      url: imagebyType?.coverImage ? window.URL.createObjectURL(imagebyType?.coverImage) : ''
                    },
                    productImages: imagebyType?.productImages?.map((file: any) => ({url: window.URL.createObjectURL(file)}))
                  }}
                  setShowAddToCartModal={() => {}}
                />
              </Flex>
            </Stepper>
            {status && (
              <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} mb={2} width="100%">
                <Text textAlign="right" color="red.500">
                  {status}
                </Text>
              </MotionFlex>
            )}
            <Flex>
              <Button
                isDisabled={uploading}
                mt={4}
                width="100%"
                type="button"
                variantColor={active === 0 ? 'brand' : 'gray'}
                variant={active === 0 ? 'solid' : 'outline'}
                onClick={handleNextButton}
              >
                {active === 0 ? 'NEXT' : 'BACK'}
              </Button>
              {active > 0 && (
                <Button
                  isDisabled={!isEmpty(errors) || uploading}
                  mt={4}
                  mx={2}
                  width="100%"
                  type="submit"
                  variantColor="brand"
                  isLoading={isSubmitting}
                >
                  {active === 1 ? 'NEXT' : 'SUBMIT'}
                </Button>
              )}
            </Flex>
          </Form>
        )}
      </Formik>
    </PageWrap>
  )
}

export default ProductCreation
