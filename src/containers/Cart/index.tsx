import { get } from "lodash";
import * as React from 'react';
import { useHistory } from "react-router-dom";
import { ApolloError } from 'apollo-client';
import { Flex, Grid, GridProps, useToast, Button, Spinner } from '@chakra-ui/core';

import DeleteItemsModal from "../Wishlist/DeleteItemsModal";
import EmptyStateComponent from "../Wishlist/NoWishlist";
import ProductCard from "../../components/Card/ProductCard";
import DeleteItemsButton from "../Wishlist/DeleteItemsButton";

import { PageWrap } from '../../layouts';
import { H3, Text } from "../../typography";
import { ERROR_TOAST, SUCCESS_TOAST } from "../../constants";
import {
  Product,
  useFetchUsersCartQuery,
  useRemoveProductsFromCartMutation,
  useFromCartToWishlistMutation,
  Scalars,
  useProductQuery
} from "../../generated/graphql";
import Section from "../../components/Section";
import {useMediaQuery} from "react-responsive";

type CartProduct = {
  quantity: number
  product: Product
}

type CartPageHeaderProps = GridProps & {
  onClick: () => void
  editing: boolean | undefined
  isTabletOrMobile: boolean
};

type ProductRemovalValues = {
  id: string,
  checked: boolean | undefined,
};

const CartPageHeader: React.FC<CartPageHeaderProps> = ({ onClick, editing, isTabletOrMobile  }) => {
  return(
    <Grid gridTemplateRows="1fr 1fr" width={isTabletOrMobile ? "100%" : "80%"} ml={isTabletOrMobile ? 0 : 5}>
      <Flex width="100%" mb={3} justifyContent="space-between">
        <H3 textAlign="left" fontSize={18} fontWeight={600}>My Cart</H3>
        <Text onClick={onClick} fontSize={12} color="blue">{ editing ? 'Done' : 'Edit' }</Text>
      </Flex>
    </Grid>
  );
};

const CartPage: React.FC = () => {
  const toast = useToast();
  const history = useHistory();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const [editing, setEditing] = React.useState<boolean | undefined>();
  const [showDeleteItemsModal, setShowDeleteItemsModal] = React.useState<boolean | undefined>();

  const handleEditCartClicked = () => {
    setEditing(!editing);
  };
  const { data: userCart, refetch, loading } = useFetchUsersCartQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
  });
  const [removeProductsFromCart] = useRemoveProductsFromCartMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: ({ removeProductsFromCart }) => {
      const itemsRemoved = removeProductsFromCart?.payload?.removedItems?.length;
      const message = itemsRemoved === 0 ? "No items removed from cart" : `Successfully removed ${itemsRemoved} items from cart`;
      toast({ description: message, ...SUCCESS_TOAST })
      history.push("/cart");
      refetch();
      setShowDeleteItemsModal(false);
    },
    awaitRefetchQueries: true
  });
  const [fromWishlistToCart, { loading: movingLoading }] = useFromCartToWishlistMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: ({ fromCartToWishlist }) => {
      const itemMoved = fromCartToWishlist?.payload?.product?.name;
      const message = `Successfully moved "${itemMoved}" to your wishlist`;
      toast({ description: message, ...SUCCESS_TOAST })
      refetch();
    },
    awaitRefetchQueries: true
  });
  const products = get(userCart, 'findCart.payload.productsQuantities', null) as CartProduct[];
  const noCart = get(userCart, 'findCart.payload', null);
  const productsOnly = products?.map((entry: CartProduct) => entry.product);
  const cartTotal = get(userCart, 'findCart.payload.total', null);
  const emptyCartProducts = productsOnly?.length < 1;


  const { data: discountData } = useProductQuery({
    variables: {
      limit: 3,
      where: {
        productPrice_lt: 30,
      }
    },
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  });
  const discountDeals = get(discountData, 'products', null) as Product[]

  const { data: productData } = useProductQuery({
    variables: {
      limit: 3,
    },
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  });
  const deals = get(productData, 'products', null) as Product[]


  const handleCartProductClickedEditing = (id: string) => {};
  const handleCartProductClickedNormal = async (id: Scalars['ID']) => {
    const productToRemove = {
      productToMove: [id]
    };
    await fromWishlistToCart({
      variables: {
        input: productToRemove
      }
    });
  };

  const handleDeleteButtonClicked = () => {
    setShowDeleteItemsModal(true);
  };
  const handleCheckoutButtonClicked = () => {
    history.push("/checkout");
  };
  const handleCancelButtonClicked = () => {
    setShowDeleteItemsModal(false);
  };
  const existingProducts = localStorage.getItem("remove_from_wishlist");

  const handleModalDeleteButtonClicked = async () => {
    if(existingProducts){
      const existingProductsIds = ((JSON.parse(existingProducts)).filter((product: ProductRemovalValues) => product.checked)).map((product: ProductRemovalValues) => product.id);
      await removeProductsFromCart({
        variables: {
          input: {
            productsToRemove: existingProductsIds
          }
        }
      });
      localStorage.removeItem("remove_from_wishlist");
    };
  };

  const navigateToProduct = (id: string) => {
    history.push(`/product/${id}`)
  }


  const itemsCount = products?.reduce((accumulator: number, currentValue: CartProduct) => {
    const productQuantity = currentValue?.quantity;
    return productQuantity + accumulator;
  }, 0);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <PageWrap
      title="My Cart"
      align="center"
      backgroundSize="cover"
      justify="center"
    >
      {
        loading || movingLoading
          ? (<Spinner />)
          : emptyCartProducts || !noCart
          ? (< EmptyStateComponent isCart />)
          : (
            <React.Fragment>
              <CartPageHeader isTabletOrMobile={isTabletOrMobile} onClick={handleEditCartClicked} editing={editing} />
              <Flex ml={5} width="80%" justifyContent="space-between">
                <Flex width="75%" flexDirection="column">
                  {
                    productsOnly?.map((product: Product) => (
                      <ProductCard
                        width={"100%"}
                        key={`${product?.id}-${Math.random()}`}
                        isWishlist={false}
                        isCart
                        product={product}
                        handleClick={editing ? handleCartProductClickedEditing : navigateToProduct }
                        editing={editing}
                        handleIconClick={handleCartProductClickedNormal}
                      />
                    ))
                  }
                </Flex>
                <Flex m={2} borderRadius={5} p={3} flexDirection="column" width="250px" height="150px" background="white">
                  <H3 textAlign="left" fontSize={16} fontWeight={600}>Cart Summary</H3>
                  <Text fontSize={10} mt={4} color="blue">{ `Cart Total (${itemsCount}): R ${cartTotal}.00`}</Text>
                  <Button alignSelf="center" onClick={handleCheckoutButtonClicked} mt={4} width="95%" type="submit" variantColor="brand">
                    CHECKOUT
                  </Button>
                </Flex>
              </Flex>
              {
                editing && (<DeleteItemsButton handleDeleteButtonClicked={handleDeleteButtonClicked} />)
              }
              {
                showDeleteItemsModal && <DeleteItemsModal
                  isCart
                  handleCancelButtonClicked={handleCancelButtonClicked}
                  handleDeleteButtonClicked={handleModalDeleteButtonClicked} />
              }
            </React.Fragment>
          )
      }
      {
        !isTabletOrMobile &&
        <Flex ml={5} mt={3} width="100%" flexDirection="column" alignItems="center">
          <Section title="Today’s Best Deals">
            {discountDeals?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct}/>
            ))}
          </Section>
          <Section title="Deals For You">
            {deals?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct}/>
            ))}
            <Button mt={4} width="100%" variantColor="brand">
              VIEW MORE
            </Button>
          </Section>
        </Flex>
      }
    </PageWrap>
  );
};

export default CartPage;
