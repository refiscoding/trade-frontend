import * as React from 'react';

import { isEmpty } from 'lodash';
import { Button, Flex } from '@chakra-ui/core';
import { Form, Formik, FormikProps } from 'formik';

import ProductInfo from './productInfo';
import ProductDetails from './productDetails';
import ProductComponent from '../ProductView/ProductComponent';

import { PageWrap } from '../../layouts';
import { formatError } from '../../utils';
import { H3, Text } from '../../typography';
import { MotionFlex, Stepper } from '../../components';

import { ProductFormValidation, initialValues, ProductValues, ProductCreationProps } from ".";

const ProductCreationMobileFlow: React.FC<ProductCreationProps> = ({
  active,
  uploading,
  mapProducts,
  handleImages,
  handleSetTags,
  handleNextButton,
  mappedCategories,
  handleSubmitButton,
  imageValues: imageByType
}) => {

  return (
    <PageWrap title="Add Product" alignSelf="center" width={'100%'}>
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
        {({ isSubmitting, status, values, errors }: FormikProps<ProductValues>) => (
          <Form style={{ width: '100%' }}>
            <Stepper activeStep={active}>
              <ProductInfo packagingError={errors?.packaging} values={values} categories={mappedCategories} handleSetTags={handleSetTags}/>
              <ProductDetails values={values} setImage={handleImages} imageValues={imageByType}/>
              <Flex
                position="relative"
                left={0}
                flexDirection="column"
                alignItems="center"
                width={"100%"}
              >
                <ProductComponent
                  product={{
                    ...mapProducts(values),
                    coverImage: {
                      preview: true,
                      url: imageByType?.coverImage ? window.URL.createObjectURL(imageByType?.coverImage) : ""
                    }
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

export default ProductCreationMobileFlow
