import * as React from 'react'

import { isEmpty } from 'lodash'
import { useHistory } from 'react-router-dom'
import { Form, Formik, FormikProps } from 'formik'
import { Button, Flex, Grid, Image } from '@chakra-ui/core'

import ProductInfo from './productInfo'
import Footer from '../../components/Footer'
import ProductDetails from './productDetails'
import ProductComponent from '../ProductView/ProductComponent'

import { images, theme } from '../../theme'
import { PageWrap } from '../../layouts'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { MotionFlex, Stepper } from '../../components'
import { ProductFormValidation, initialValues, ProductValues, ProductCreationProps } from '.'

const ProductCreationWebFlow: React.FC<ProductCreationProps> = ({
  active,
  uploading,
  formValues,
  mapProducts,
  imageValues,
  handleImages,
  handleSetTags,
  setFormValues,
  handleSubmitButton,
  mappedCategories,
  handleNextButton,
  imageValues: imageByType
}) => {
  const history = useHistory()

  const productInfoStage = active === 0
  const productDetailsStage = active === 1
  const productConfirmStage = active === 2

  const productInfoStageImage = images.productInfoStep
  const productDetailsStageImage = images.productDetailsStep
  const productInfoStageAdImage = images.adPlaceholder
  const productDetailsStageAdImage = images.adPlaceholder2

  const currentImage = productInfoStage ? productInfoStageImage : productDetailsStageImage
  const currentAdImage = productInfoStage ? productInfoStageAdImage : productDetailsStageAdImage
  const currentTitle = productInfoStage
    ? 'This is your first step to adding your new product on TradeFed.'
    : 'This is your second step that targets the expected audience'
  const currentText = productInfoStage
    ? 'This is the most important information to be displayed for potential buyers.'
    : 'Target the audience with images and tags to make it eaiser for them to understand the purchase.'

  const handleCancelClicked = () => {
    history.push('/product-management')
  }

  return (
    <React.Fragment>
      <PageWrap title="Add Product" alignSelf="center" width="75%" mt={20} pt={0} p={0}>
        <Grid gridTemplateRows="130px 1fr">
          <Grid
            p={5}
            mt={5}
            width="76vw"
            borderRadius={5}
            background="#fff"
            boxShadow="0 1px 2px 0 rgba(0,0,0,0.17)"
            gridTemplateRows="100px 30px"
          >
            <Grid gridTemplateRows="20px 45px">
              <Flex justify="space-between">
                <H3 textAlign="left" fontSize={18} fontWeight={600}>
                  Add Basic Product Information
                </H3>
                <Text
                  fontSize="12px"
                  color={theme.colors.blueText}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={handleCancelClicked}
                >
                  Cancel
                </Text>
              </Flex>
              <div style={{ marginTop: 15 }}>
                <Stepper activeStep={active} background="red">
                  <div>.</div>
                  <div>.</div>
                  <div>.</div>
                </Stepper>
              </div>
            </Grid>
          </Grid>
          <Grid mt={5} gridTemplateColumns="400px 693px">
            <Flex
              p={4}
              mr={5}
              borderRadius={5}
              background="#fff"
              boxShadow="0 1px 2px 0 rgba(0,0,0,0.17)"
            >
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
                {({ isSubmitting, status, values, errors }: FormikProps<ProductValues>) => {
                  setFormValues(values)
                  return (
                    <Form style={{ width: '100%', marginTop: 20 }}>
                      {productInfoStage && (
                        <ProductInfo
                          packagingError={errors?.packaging || ''}
                          values={values}
                          categories={mappedCategories}
                          handleSetTags={handleSetTags}
                        />
                      )}
                      {productDetailsStage && (
                        <ProductDetails
                          values={values}
                          setImage={handleImages}
                          imageValues={imageByType}
                        />
                      )}
                      {status && (
                        <MotionFlex
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          mb={2}
                          width="100%"
                        >
                          <Text textAlign="right" color="red.500">
                            {status}
                          </Text>
                        </MotionFlex>
                      )}
                      <Flex mt={active === 0 ? 10 : active === 1 ? 20 : 0}>
                        <Button
                          isDisabled={uploading}
                          mt={-5}
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
                            mt={-5}
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
                  )
                }}
              </Formik>
            </Flex>
            {!productConfirmStage && (
              <Grid gridTemplateRows="640px 400px" width="48vw">
                <Grid
                  background="#fff"
                  borderRadius={5}
                  boxShadow="0 1px 2px 0 rgba(0,0,0,0.17)"
                  justifyItems="center"
                  gridTemplateRows="20px 20px 500px"
                >
                  <Flex mt={10}>
                    <Text fontSize="16px" fontWeight="bold">
                      {currentTitle}
                    </Text>
                  </Flex>
                  <Flex mt={20}>
                    <Text fontSize="14px" color={theme.colors.dimText}>
                      {currentText}
                    </Text>
                  </Flex>
                  <Flex justify="center" align="center" mt={40}>
                    <Image width="70%" height="90%" src={currentImage} />
                  </Flex>
                </Grid>
                <Flex
                  mt={8}
                  borderRadius={5}
                  boxShadow="0 1px 2px 0 rgba(0,0,0,0.17)"
                  backgroundSize="cover"
                  bgImage={`url(${currentAdImage})`}
                />
              </Grid>
            )}
            {productConfirmStage && (
              <Flex backgroundColor={theme.colors.info} p={5} height="65%" mt={4} borderRadius={3}>
                <Flex>
                  <Image src={images.infoIcon} />
                </Flex>
                <Text ml={2} mt={0} fontSize={11}>
                  This is how your product will be displayed to the public. You can make changes in
                  the “Product Management” section.
                </Text>
              </Flex>
            )}
            {productConfirmStage && (
              <Flex
                mt={5}
                position="relative"
                left={'-34%'}
                flexDirection="column"
                alignItems="center"
                width="95vw"
              >
                <ProductComponent
                  product={{
                    ...mapProducts(formValues),
                    coverImage: {
                      preview: true,
                      url: imageByType?.coverImage
                        ? window.URL.createObjectURL(imageByType?.coverImage)
                        : ''
                    },
                    productImages: imageByType?.productImages?.map((file: File) => ({
                      url: window.URL.createObjectURL(file)
                    }))
                  }}
                  setShowAddToCartModal={() => {
                    return
                  }}
                />
              </Flex>
            )}
          </Grid>
        </Grid>
      </PageWrap>
      <Footer removePadding />
    </React.Fragment>
  )
}

export default ProductCreationWebFlow
