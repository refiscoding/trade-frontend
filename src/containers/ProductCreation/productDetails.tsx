import * as React from 'react'
import { Field, FieldArray } from 'formik'
import { useMediaQuery } from "react-responsive";
import { Flex, FormLabel, Grid } from '@chakra-ui/core'
import { PlusSquare, XCircle, Upload} from 'react-feather'

import {
  ConnectedFormGroup,
  ConnectedNumberInput,
  ConnectedTextArea,
  ConnectedFileUploader
} from '../../components/FormElements'
import { Text } from '../../typography'
import { Options } from '../Seller/businessInfo'
import { ProductValues, ImageByType } from './index'

type ProductDetailsTypes = {
  values: ProductValues
  setImage: (value: File[], type: string) => void
  imageValues?: ImageByType
}

const options: Options[] = [
  { label: 'Per Colour', value: 'color' },
  { label: 'Per Size', value: 'size' }
]

const weightUnits = [
  { label: 'gms', value: 'gms' },
  { label: 'kgs', value: 'kgs' },
  { label: 'tonnes', value: 'tonnes' },
]
const dimensionUnits = [
  { label: 'mm', value: 'mm' },
  { label: 'cm', value: 'cm' },
  { label: 'inches', value: 'inches' },
  { label: 'ft', value: 'ft' },
]

const ProductDetails: React.FC<ProductDetailsTypes> = ({ values, setImage, imageValues }) => {
  const coverArray = imageValues?.coverImage ? [imageValues?.coverImage] as File[] : undefined;
  const isWebView = useMediaQuery({ query: '(min-width: 40em)' });

  const imageCount = imageValues?.productImages?.length ? imageValues?.productImages?.length + 1 : 0;

  return (
    <Flex flexDirection="column">
      <FormLabel htmlFor="packaging">{`Add Product Images (${imageCount}/5)`}</FormLabel>
      {
        isWebView
        ? (
            <Grid
              height="160px"
              width="100%"
              p={5}
              border="1px dashed #a7a7a7"
              borderRadius={5}
              backgroundColor="#EDF2F7"
              gridTemplateRows="1fr 1fr"
              textAlign="center"
              mb={5}
            >
              <Flex justifySelf="center" alignSelf="center" mb={3}>
                <Upload />
              </Flex>
              <Flex justifySelf="center" alignSelf="center">
                <ConnectedFileUploader imageValues={coverArray} isImage placeholder="Upload Cover Image" name="coverImage" setImages={setImage} />
              </Flex>
            </Grid>
          )
        : (
            <ConnectedFileUploader imageValues={coverArray} isImage placeholder="Cover Image" name="coverImage" setImages={setImage} />
          )
      }
      <ConnectedFileUploader
        isImage
        isMulti
        imageValues={imageValues?.productImages}
        placeholder="Add Another Image"
        name="productImages"
        setImages={setImage}
      />
      <ConnectedTextArea label="Product Description" name="description" handleSetTags={() => {}}/>
      <FormLabel htmlFor="features">List Product Features</FormLabel>
      <FieldArray
        name="features"
        render={(arrayHelpers) => {
          const features = values.features
          console.log("Feature==>", values)
          console.log("Feature==>", values.features)
          return (
            <Flex flexDirection="column">
              {/* <Flex alignItems="center">
                <ConnectedFormGroup name={`features`} type="text" />
                <Flex
                  ml={2}
                  mb={4}
                // onClick={() => arrayHelpers.remove(index)}
                >
                  <XCircle />
                </Flex>
              </Flex> */}
              {features?.split(",")?.map((feature: string, index: number) => (
                <Flex key={index} alignItems="center">
                  <ConnectedFormGroup name={`features.[${index}]`} type="text" />
                  <Flex
                    ml={2}
                    mb={4}
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    <XCircle />
                  </Flex>
                </Flex>
              ))}
              <Flex onClick={() => arrayHelpers.push('')} mb={2} alignItems="center">
                <PlusSquare size={15} />
                <Text ml={2} fontSize={14}>
                  Add another feature
                </Text>
              </Flex>
            </Flex>
          )
        }}
      />

      <FormLabel htmlFor="variations">Product Variations (Optional)</FormLabel>
      {options.map((item: Options, i: number) => (
        <Flex key={i} alignItems="center">
          <Field key={i} type="radio" name="variations" value={item.value} />
          <Text ml={2}>{item.label}</Text>
        </Flex>
      ))}
      <ConnectedNumberInput label="Product Height" name="height" unit={dimensionUnits} />
      <ConnectedNumberInput label="Product Length" name="length" unit={dimensionUnits} />
      <ConnectedNumberInput label="Product Width" name="width" unit={dimensionUnits} />
      <ConnectedNumberInput label="Product Weight" name="weight" unit={weightUnits} />
    </Flex>
  )
}

export default ProductDetails
