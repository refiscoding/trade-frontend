import * as React from 'react';
import {get } from "lodash";
import { ApolloError } from 'apollo-client';
import { useHistory } from 'react-router-dom';
import { useToast, Spinner, Flex, Button, Text, FlexProps } from '@chakra-ui/core';

import EmptyStateComponent from "./NoWishlist";
import DeleteItemsModal from "./DeleteItemsModal";
import DeleteItemsButton from "./DeleteItemsButton";
import ProductCard from "../../components/Card/ProductCard";

import { ERROR_TOAST, SUCCESS_TOAST } from "../../constants";
import {
  useFetchUsersWhishlistQuery,
  useRemoveProductsFromWishlistMutation,
  Product,
  Scalars,
  useFromWishlistToCartMutation,
  useProductQuery
} from "../../generated/graphql";

import { PageWrap } from '../../layouts';
import { H3 } from "../../typography";
import Section from "../../components/Section";
import {useMediaQuery} from "react-responsive";

type WishlistPageHeaderProps = FlexProps & {
  onClick: () => void
  editing: boolean | undefined
  isTabletOrMobile: boolean
};
type ProductRemovalValues = {
  id: string,
  checked: boolean | undefined,
};

const WishlistPageHeader: React.FC<WishlistPageHeaderProps> = ({ onClick, editing, isTabletOrMobile }) => {
  return(
    <Flex width="100%" ml={isTabletOrMobile ? 0 : 5} mb={4} justifyContent="space-between">
      <H3 textAlign="left" fontSize={18} fontWeight={600}>My Wishlist</H3>
      <Text onClick={onClick}
            color="accent.500"
            textDecoration="underline"
            cursor="pointer"
            fontSize="12px">{ editing ? 'Done' : 'Edit' }</Text>
    </Flex>
  );
};

const WishlistPage: React.FC = () => {
  const toast = useToast();
  const history = useHistory();
  const [editing, setEditing] = React.useState<boolean | undefined>();
  const [showDeleteItemsModal, setShowDeleteItemsModal] = React.useState<boolean | undefined>();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  
  const { data: userWishlist, loading, refetch } = useFetchUsersWhishlistQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
  });

  const [removeProductsFromWishlist] = useRemoveProductsFromWishlistMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: ({ removeProductsFromWishlist }) => {
      const itemsRemoved = removeProductsFromWishlist?.payload?.removedItems?.length;
      const message = itemsRemoved === 0 ? "Not items removed from wishlist" : `Successfully removed ${itemsRemoved} items from wishlist`;
      toast({ description: message, ...SUCCESS_TOAST })
      history.push("/wishlist");
      refetch();
      setShowDeleteItemsModal(false);
    },
    awaitRefetchQueries: true
  });
  const [fromWishlistToCart, { loading: movingLoading }] = useFromWishlistToCartMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: ({ fromWishlistToCart }) => {
      const itemMoved = fromWishlistToCart?.payload?.product?.name;
      const message = `Successfully moved "${itemMoved}" to your cart`;
      toast({ description: message, ...SUCCESS_TOAST })
      refetch();
    },
    awaitRefetchQueries: true
  });

  const products = get(userWishlist, 'findOneWishlist.payload.products', null) as Product[];
  const noWishlist = userWishlist?.findOneWishlist?.payload;

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


  const emptyWishlistProducts = products?.length < 1;

  const handleWishlistProductClickedEditing = (id: string) => {
  };

  const handleWishlistProductClickedNormal = async (id: Scalars['ID']) => {
    const itemToRemove = {
      itemToMove: [id]
    };
    await fromWishlistToCart({
      variables: {
        input: itemToRemove
      }
    });
  };

  const handleEditWishlistClicked = () => {
    setEditing(!editing);
  };

  const handleHomeButtonClicked = () => {
    history.push("/");
  };
  const handleDeleteButtonClicked = () => {
    setShowDeleteItemsModal(true);
  };
  const handleCancelButtonClicked = () => {
    setShowDeleteItemsModal(false);
  };
  const existingProducts = localStorage.getItem("remove_from_wishlist");

  const handleModalDeleteButtonClicked = async () => {
    if(existingProducts){
      const existingProductsIds = ((JSON.parse(existingProducts)).filter((product: ProductRemovalValues) => product.checked)).map((product: ProductRemovalValues) => product.id);
      await removeProductsFromWishlist({
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

  return (
    <PageWrap
        title="My Wishlist"
    >
        { 
          loading || movingLoading
          ? (
              <Flex alignSelf="center" justifyContent="center" width="100%" alignItems="center">
                <Spinner />
              </Flex>
            )
          : emptyWishlistProducts || !noWishlist
            ? (<EmptyStateComponent isCart={false} />)
            : (
              <Flex ml={isTabletOrMobile ? 0 : 5} mt={3} alignSelf="center" width={isTabletOrMobile ? "100%" : "80%"} flexDirection="column" alignItems="center">
                <WishlistPageHeader isTabletOrMobile={isTabletOrMobile} onClick={handleEditWishlistClicked} editing={editing} />
                {
                  products?.map((product: Product) => (
                      <ProductCard
                        width={isTabletOrMobile ? "100%" : "70%"}
                        key={`${product.id}-${Math.random()}`}
                        isWishlist
                        product={product}
                        handleClick={editing ? handleWishlistProductClickedEditing : navigateToProduct}
                        editing={editing}
                        handleIconClick={handleWishlistProductClickedNormal}
                      />
                  ))
                }
                {
                  editing
                  ? (<DeleteItemsButton handleDeleteButtonClicked={handleDeleteButtonClicked} />)
                  : isTabletOrMobile && (
                    <Button onClick={handleHomeButtonClicked} mt={4} width="100%" type="submit" variantColor="brand">
                       TAKE ME HOME
                    </Button>
                  )
                }
                {
                  showDeleteItemsModal && <DeleteItemsModal
                                            handleCancelButtonClicked={handleCancelButtonClicked}
                                            handleDeleteButtonClicked={handleModalDeleteButtonClicked} />
                }
              </Flex>
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

export default WishlistPage;
