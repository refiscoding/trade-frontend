import * as Yup from 'yup';
import * as React from 'react';

import { get } from 'lodash';
import { AxiosResponse } from "axios";
import { useToast } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";

import strapiHelpers from "../../utils/strapiHelpers";
import ProductCreationWebFlow from "./ProductCreationWeb";
import ProductCreationMobileFlow from "./ProductCreationMobile";

import { Options } from '../Seller/businessInfo';
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants';
import {
  Category,
  UploadFile,
  useCategoryQuery,
  useAddProductMutation,
  Enum_Product_Packaging as packagingEnum,
  Enum_Componentproductvariantsvariants_Variants as variantsEnum
} from '../../generated/graphql'


export const ProductFormValidation = Yup.object().shape({
  name: Yup.string().required('A name is required'),
  shortDescription: Yup.string().required('A short description is required').max(200),
  category: Yup.array().of(Yup.string()),
  tags: Yup.string(),
  pricePerUnit: Yup.string().required('A price per unit is required'),
  retailPricePerUnit: Yup.string().required('A retail price per unit is required'),
  availableUnits: Yup.string().required('Units available to sell is required'),
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
  features: string
  variations?: variantsEnum
  height: string
  length: string
  width: string
  weight: string
};

export const initialValues = {
  name: '',
  shortDescription: '',
  category: [''],
  tags: '',
  pricePerUnit: '',
  retailPricePerUnit: '',
  availableUnits: '',
  itemsPerPackage: '',
  description: '',
  features: '',
  height: '',
  length: '',
  width: '',
  weight: ''
};

type PriceItem = {
  currency: string,
  retailPricePerUnit: number,
  pricePerUnit: number
};
type SizeItem = {
  height: number,
  productLength: number,
  width: number,
  weight: number
};
type VariantsItem = {
  variants: variantsEnum | undefined,
  quantity: number
};

type MappedProduct = {
  name: string,
  shortDescription: string,
  description: string,
  tags: string,
  price: PriceItem,
  availableUnits: number,
  packaging: packagingEnum | undefined,
  productPrice: number,
  size: SizeItem,
  features: string,
  variants: VariantsItem,
  categories: string[]
};

export type ProductCreationProps = {
  active: number
  imageValues?: ImageByType 
  formValues: ProductValues
  mappedCategories: Options[]
  uploading: boolean
  setFormValues: React.Dispatch<React.SetStateAction<ProductValues>>
  handleSubmitButton: (items: ProductValues) => void
  handleSetTags: (tags: string[]) => void
  handleImages: (imageFiles: File[], type: string, pop?: boolean) => void
  handleNextButton: () => void
  mapProducts: (values: ProductValues) => MappedProduct
};

export type ImageByType = {
  productImages?: File[],
  coverImage?: File
}

const ProductCreation: React.FC = () => {
  const toast = useToast();
  const history = useHistory();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' });

  const [active, setActive] = React.useState(0);
  const [imageByType, setImageByType] = React.useState<ImageByType>();
  const [tags, setTags] = React.useState<Array<string>>([]);
  const [uploading, setUploading] = React.useState<boolean>(false);
  
  const [formValues, setFormValues] = React.useState<ProductValues>(initialValues);

  const { data } = useCategoryQuery({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST })
  });

  const categories = get(data, 'categories', null) as Category[];

  const mappedCategories = categories?.map((category: Category) => ({
    label: category.name,
    value: category.id
  })) as Options[];

  const [AddProduct] = useAddProductMutation({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async () => {
      toast({ description: 'Product details updated!', ...SUCCESS_TOAST })
      history.push('/upload-product-success')
    }
  });

  const handleUpload = async () => {
    const imagesArray = (imageByType?.productImages && [...imageByType.productImages]) || [];
    const productImages = (imagesArray.map((file: File) => strapiHelpers.upload(file))) || [];
    setUploading(true);
    try {
      const coverImage = imageByType?.coverImage && await strapiHelpers.upload(imageByType.coverImage) as AxiosResponse;
      const uploadArr = await Promise.all(productImages);
      const uploads = uploadArr.map((upload: AxiosResponse) => upload.data[0]);
      setUploading(false);
      return {
        coverImage: coverImage?.data[0],
        productImages: uploads
      };
    } catch (e) {
      setUploading(false);
      console.log("Upload Exception; ", e)
      toast({
        description: 'Something went wrong while uploading your file.',
        ...ERROR_TOAST
      });
      return false;
    }
  };

  const handleImages = (imageFiles: File[], type: string, pop?: boolean) => {
    const imagesArray = Array.from(imageFiles);
    if(pop){
      if(type === 'multi'){
        setImageByType({ ...imageByType, productImages: imagesArray });
      } else {
        setImageByType({ ...imageByType, coverImage: imagesArray[0] });
      }
      return;
    }
    if(type === 'multi'){
      setImageByType((prevState?: ImageByType) => ({ ...imageByType, productImages: prevState?.productImages ? [...prevState.productImages, ...imagesArray] : imagesArray }));
    } else {
      setImageByType({ ...imageByType, coverImage: imagesArray[0] });
    }
  };

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
      tags: tags?.join(","),
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
      features: "", // [...values.features],
      variants: {
        variants: values.variations,
        quantity: 0
      },
      categories: [...values.category]
    }
  };

  const handleSubmitButton = (items: ProductValues) => {
    if (active === 1) {
      setActive(2)
    }
    if (active === 2) {
      const postProduct = async () => {
        const uploadedData = await handleUpload();
        const coverImage = (uploadedData && uploadedData?.coverImage?.id) || "";
        const productImages = (uploadedData && uploadedData?.productImages?.map((image: UploadFile) => image.id)) || [];
        await AddProduct({ variables: { input: {
          ...mapProducts(items),
          coverImage: coverImage,
          productImages: productImages
        }}})
      }
      postProduct()
    }
  };

  return (
    <React.Fragment>
      {
        isTabletOrMobile
        ? (
            <ProductCreationMobileFlow
              active={active}
              uploading={uploading}
              mappedCategories={mappedCategories}
              handleSetTags={handleSetTags}
              handleImages={handleImages}
              imageValues={imageByType}
              mapProducts={mapProducts}
              handleNextButton={handleNextButton}
              formValues={formValues}
              setFormValues={setFormValues}
              handleSubmitButton={handleSubmitButton}
            />
          )
        : (
            <ProductCreationWebFlow 
              active={active}
              uploading={uploading}
              mappedCategories={mappedCategories}
              handleSetTags={handleSetTags}
              handleImages={handleImages}
              imageValues={imageByType}
              mapProducts={mapProducts}
              handleNextButton={handleNextButton}
              formValues={formValues}
              setFormValues={setFormValues}
              handleSubmitButton={handleSubmitButton}
            />
          )
      }
    </React.Fragment>
  )
}

export default ProductCreation
