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
import { Product, useFetchUsersCartQuery, useRemoveProductsFromCartMutation, useFromCartToWishlistMutation, Scalars } from "../../generated/graphql";

type CartProduct = {
    quantity: number
    product: Product
}

type CartPageHeaderProps = GridProps & {
    onClick: () => void
    editing: boolean | undefined
    total: number
    products: CartProduct[]
};

type ProductRemovalValues = {
    id: string,
    checked: boolean | undefined,
  };

const CartPageHeader: React.FC<CartPageHeaderProps> = ({ onClick, editing, total, products }) => {
    const reducer = (accumulator: number, currentValue: CartProduct) => {
        const productQuantity = currentValue?.quantity;
        return productQuantity + accumulator;
    };
    const itemsCount = products?.reduce(reducer, 0);
    const noOfItems = itemsCount === 1 ? `${itemsCount} item` : `${itemsCount} items`;
    return(
        <Grid gridTemplateRows="1fr 1fr" width="100%">
            <Flex width="100%" mb={3} justifyContent="space-between">
                <H3 textAlign="left" fontSize={18} fontWeight={600}>My Cart</H3>
                <Text onClick={onClick} fontSize={12} color="blue">{ editing ? 'Done' : 'Edit' }</Text>
            </Flex>
            <Text fontSize={12} color="blue">{ `Cart Total (${noOfItems}): R ${total}.00`}</Text>
        </Grid>
    );
};

const CartPage: React.FC = () => {
  const toast = useToast();
  const history = useHistory();

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
          const message = itemsRemoved === 0 ? "Not items removed from cart" : `Successfully removed ${itemsRemoved} items from cart`;
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
    const setContainerMargin = (numOfProducts: Number) => {
        let mt;
        if(numOfProducts === 1){
          mt = "-290px";
        } else if(numOfProducts === 2){
          mt = "-115px";
        } else if(numOfProducts === 3){
          mt = "20px";
        } else if(numOfProducts > 2){
          mt = "60px";
        }
        return mt;
    };
    const numberOfCartProducts = products?.length;

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

    return (
        <PageWrap
            title="My Cart"
            align="center"
            backgroundSize="cover"
            justify="center"
            pt={0}
            mt={setContainerMargin(numberOfCartProducts)}
            >
                {
                    loading || movingLoading
                    ? (<Spinner />)
                    : emptyCartProducts || !noCart
                        ? (< EmptyStateComponent isCart />)
                        : (
                            <React.Fragment>
                                <CartPageHeader onClick={handleEditCartClicked} editing={editing} total={cartTotal} products={products}/>
                                {
                                    productsOnly?.map((product: Product) => (
                                        <ProductCard 
                                        key={`${product.id}-${Math.random()}`} 
                                        isWishlist={false} 
                                        isCart
                                        product={product} 
                                        handleClick={editing ? handleCartProductClickedEditing : handleCartProductClickedNormal } 
                                        editing={editing}
                                        />
                                    ))
                                }
                                {
                                    editing 
                                    ? (<DeleteItemsButton handleDeleteButtonClicked={handleDeleteButtonClicked} />)
                                    : (
                                    <Button onClick={handleCheckoutButtonClicked} mt={4} width="100%" type="submit" variantColor="brand">
                                        CHECKOUT
                                    </Button>
                                    )
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
        </PageWrap>
    );
};

export default CartPage;
