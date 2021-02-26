import * as React from 'react';
import { get } from "lodash";
import { ApolloError } from 'apollo-client';
import { useHistory } from 'react-router-dom';

import EmptyStateComponent from "./NoWishlist";
import DeleteItemsModal from "./DeleteItemsModal";
import DeleteItemsButton from "./DeleteItemsButton";
import ProductCard from "../../components/Card/ProductCard";

import { ERROR_TOAST, SUCCESS_TOAST } from "../../constants";
import { useFetchUsersWhishlistQuery, useRemoveProductsFromWishlistMutation, Product } from "../../generated/graphql";

import { PageWrap } from '../../layouts';
import { H3, Text } from "../../typography";
import { useToast, Spinner, Flex, Button } from '@chakra-ui/core';

const WishlistPage: React.FC = () => {
  const toast = useToast();
  const history = useHistory();
  const [editing, setEditing] = React.useState<boolean | undefined>();
  const [showDeleteItemsModal, setShowDeleteItemsModal] = React.useState<boolean | undefined>();

  const { data: userWishlist, loading, refetch } = useFetchUsersWhishlistQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
  });

  const [removeProductsFromWishlist] = useRemoveProductsFromWishlistMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: ({ removeProductsFromWishlist }) => {
      const itemsRemoved = removeProductsFromWishlist?.payload?.removedItems?.length;
      toast({ description: `Successfully removed ${itemsRemoved} items from wishlist`, ...SUCCESS_TOAST })
      history.push("/wishlist");
      refetch();
      setShowDeleteItemsModal(false);
    },
    awaitRefetchQueries: true
  });

  const products = get(userWishlist, 'findOneWishlist.payload.products', null) as Product[];
  const emptyWishlistProducts = products?.length < 1;
  const numberOfWishlistProducts = products?.length;

  const handleWishlistProductClickedEditing = (id: string) => {
  };
  const handleWishlistProductClickedNormal = (id: string) => {
  };
  const handleEditWishlistClicked = () => {
    setEditing(!editing);
  };

  const setContainerMargin = (numOfProducts: Number) => {
    let mt;
    if(numOfProducts === 1){
      mt = "-320px";
    } else if(numOfProducts === 2){
      mt = "-160px";
    } else if(numOfProducts === 3){
      mt = "0px";
    } else if(numOfProducts > 2){
      mt = "60px";
    }
    return mt;
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
  const handleModalDeleteButtonClicked = async () => {
    // TODO: This is setup for another ticket
    await removeProductsFromWishlist({
        variables: {
          input: {
            productsToRemove: ['4']
          }
        }
      });
  };
  return (
    <PageWrap
        title="My Wishlist"
        align="center"
        backgroundSize="cover"
        justify="center"
        pt={0}
        mt={setContainerMargin(numberOfWishlistProducts)}
    >
        { loading  && <Spinner /> }
        { emptyWishlistProducts && <EmptyStateComponent /> }
        {
          !emptyWishlistProducts && (
            <Flex width="100%" mb={4} justifyContent="space-between">
              <H3 textAlign="left" fontSize={18} fontWeight={600}>My Wishlist</H3>
              <Text onClick={handleEditWishlistClicked} fontSize={12} color="blue"> Edit</Text>
            </Flex>
          )
        }
        {
            products?.map((product: Product) => (
                <ProductCard 
                  key={`${product.id}-${Math.random()}`} 
                  isWishlist 
                  product={product} 
                  handleClick={editing ? handleWishlistProductClickedEditing : handleWishlistProductClickedNormal} 
                  editing={editing} 
                />
            ))
        }
        {
          editing
          ? (
           <DeleteItemsButton handleDeleteButtonClicked={handleDeleteButtonClicked}/>
          )
          : 
          emptyWishlistProducts
          ? ''
          : (
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
    </PageWrap>
  );
};

export default WishlistPage;
