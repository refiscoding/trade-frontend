import * as React from 'react';
import { useHistory } from 'react-router';
import { useToast } from '@chakra-ui/core';
import { ApolloError } from 'apollo-client'
import { useMediaQuery } from "react-responsive";
import { sortBy, reverse, slice, get } from 'lodash'

import { ProductMobile, ProductWeb } from "../../components/Product";
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants/index';
import { useAddProductToWishlistMutation, useAddProductToCartMutation, Product, useProductQuery, UploadFile } from "../../generated/graphql";

type ProductProps = {
  product?: any
  setShowAddToCartModal: () => void
};

const ProductComponent: React.FC<ProductProps> = ({ product, setShowAddToCartModal }) => {
  const toast = useToast();
  const history = useHistory();
  const isWebViewport = useMediaQuery({
    query: "(min-width: 40em)"
  });
  const [addProductToWishlist] = useAddProductToWishlistMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async () => {
      toast({
        description: 'Item successfully added to your wish list!',
        ...SUCCESS_TOAST
      })
      history.push("/wishlist");
    }
  });
  const [addProductToCart, { loading }] = useAddProductToCartMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async () => {
      toast({
        description: 'Item successfully added to your cart!',
        ...SUCCESS_TOAST
      })
    }
  });
  const { data: productData } = useProductQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  });
  const products = get(productData, 'products', null) as Product[]
  const deals: Product[] = slice(
    reverse(sortBy(products, [(product) => product?.discount?.discountPercentage])),
    0,
    3
  )
  const handleAddToWishlistClicked = async (id: string) => {
    await addProductToWishlist({ variables: { input: { productToAdd: id } } });
    window.location.href = '/wishlist';
  };
  const handleAddToCartClicked = async (id: string) => {
    await addProductToCart({ variables: { input: { productToAdd: id } } });
    !loading && setShowAddToCartModal();
  };
  const productPackagingType = (product?.packaging?.split("per")) ?? [];
  const productPackaging = productPackagingType?.length > 1 ? "pack" : product?.packaging;
  const productImages = product?.productImages?.map((image: UploadFile) => image?.url);

  return (
    <React.Fragment>
      {
        isWebViewport
        ? (
          <ProductWeb
            product={product}
              handleAddToWishlistClicked={handleAddToWishlistClicked}
              handleAddToCartClicked={handleAddToCartClicked}
              deals={deals}
              productPackaging={productPackaging}
              productImages={productImages}
          />
        )
        : (
            <ProductMobile 
              product={product} 
              handleAddToWishlistClicked={handleAddToWishlistClicked}
              handleAddToCartClicked={handleAddToCartClicked}
              deals={deals}
              productPackaging={productPackaging}
              productImages={productImages}
            />
          )
      }
    </React.Fragment>
  )
}

export default ProductComponent
