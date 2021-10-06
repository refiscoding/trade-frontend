import * as React from 'react'
import { get } from 'lodash'
import { ApolloError } from 'apollo-client'
import { useHistory } from 'react-router-dom'
import { useToast, Spinner, Flex, Button, Text, FlexProps } from '@chakra-ui/core'

import EmptyStateComponent from './NoWishlist'
import DeleteItemsModal from '../../components/DeleteItemsModal'
import DeleteItemsButton from './DeleteItemsButton'
import ProductCard from '../../components/Card/ProductCard'

import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import {
  Product,
  useProductQuery,
  useFetchUsersWhishlistQuery,
  useRemoveProductsFromWishlistMutation,
  useFromWishlistToCartMutation,
  Maybe
} from '../../generated/graphql'

import { PageWrap } from '../../layouts'
import { H3 } from '../../typography'
import Section from '../../components/Section'
import { useMediaQuery } from 'react-responsive'
import { theme } from '../../theme'

type WishlistPageHeaderProps = FlexProps & {
  onClick: () => void
  editing: boolean | undefined
  isTabletOrMobile: boolean
}
type ProductRemovalValues = {
  id: string
  checked: boolean | undefined
}

const WishlistPageHeader: React.FC<WishlistPageHeaderProps> = ({
  onClick,
  editing,
  isTabletOrMobile
}) => {
  return (
    <Flex m={10} width="100%" ml={isTabletOrMobile ? 0 : 5} mb={4} justifyContent="space-between">
      <H3 textAlign="left" fontSize={18} fontWeight={600}>
        My Wishlist
      </H3>
      {!editing ? (
        <Button
          justifySelf="end"
          width="70px"
          onClick={onClick}
          border={`1px solid ${theme.colors.brand[500]}`}
          background="white"
        >
          <Text fontSize="12px">EDIT</Text>
        </Button>
      ) : (
        <Button width="70px" variantColor="brand" onClick={onClick}>
          <Text fontSize="12px">DONE</Text>
        </Button>
      )}
    </Flex>
  )
}

const WishlistPage: React.FC = () => {
  const discountedPriceMarker = 4000
  const toast = useToast()
  const history = useHistory()
  const [editing, setEditing] = React.useState<boolean | undefined>()
  const [showDeleteItemsModal, setShowDeleteItemsModal] = React.useState<boolean | undefined>()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const { data: userWishlist, loading, refetch } = useFetchUsersWhishlistQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const [removeProductsFromWishlist] = useRemoveProductsFromWishlistMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: ({ removeProductsFromWishlist }) => {
      const itemsRemoved = removeProductsFromWishlist?.payload?.removedItems?.length
      const message =
        itemsRemoved === 0
          ? 'Not items removed from wishlist'
          : `Successfully removed ${itemsRemoved} items from wishlist`
      toast({ description: message, ...SUCCESS_TOAST })
      history.push('/wishlist')
      refetch()
      setShowDeleteItemsModal(false)
    },
    awaitRefetchQueries: true
  })
  const [fromWishlistToCart, { loading: movingLoading }] = useFromWishlistToCartMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: ({ fromWishlistToCart }) => {
      const itemMoved = fromWishlistToCart?.payload?.product?.name
      const message = `Successfully moved "${itemMoved}" to your cart`
      toast({ description: message, ...SUCCESS_TOAST })
      refetch()
    },
    awaitRefetchQueries: true
  })

  const products = get(userWishlist, 'findOneWishlist.payload.products', null) as Product[]
  const noWishlist = userWishlist?.findOneWishlist?.payload

  const { data: discountData } = useProductQuery({
    variables: {
      limit: 3,
      where: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        tradeFedCost_lt: discountedPriceMarker
      }
    },
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })
  const discountDeals = get(discountData, 'products', null) as Product[]

  const { data: productData } = useProductQuery({
    variables: {
      limit: 3
    },
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })
  const deals = get(productData, 'products', null) as Product[]

  const emptyWishlistProducts = products?.length < 1

  const handleWishlistProductClickedEditing = (id: Maybe<string> | undefined) => {
    // Nothing is to be done
    return
  }

  const handleWishlistProductClickedNormal = async (id: Maybe<string> | undefined) => {
    const itemToRemove = {
      itemToMove: [id?.toString() || '']
    }
    await fromWishlistToCart({
      variables: {
        input: itemToRemove
      }
    })
  }

  const handleEditWishlistClicked = () => {
    setEditing(!editing)
  }

  const handleHomeButtonClicked = () => {
    history.push('/')
  }
  const handleDeleteButtonClicked = () => {
    setShowDeleteItemsModal(true)
  }
  const handleCancelButtonClicked = () => {
    setShowDeleteItemsModal(false)
  }
  const existingProducts = localStorage.getItem('remove_from_wishlist')

  const handleModalDeleteButtonClicked = async () => {
    if (existingProducts) {
      const existingProductsIds = JSON.parse(existingProducts)
        .filter((product: ProductRemovalValues) => product.checked)
        .map((product: ProductRemovalValues) => product.id)
      await removeProductsFromWishlist({
        variables: {
          input: {
            productsToRemove: existingProductsIds
          }
        }
      })
      localStorage.removeItem('remove_from_wishlist')
    }
  }

  const navigateToProduct = (id: Maybe<string> | undefined) => {
    const modifiedId = id?.toLowerCase()
    history.push(`/product/${modifiedId}`)
  }

  React.useEffect(() => {
    refetch()
  }, [refetch])

  const confirmationText = `You are about to delete these items in your wishlist? Once they are removed, you’ll have to re-add them to your wishlist manually.`

  return (
    <PageWrap title="My Wishlist">
      {loading || movingLoading ? (
        <Flex alignSelf="center" justifyContent="center" width="100%" alignItems="center">
          <Spinner />
        </Flex>
      ) : emptyWishlistProducts || !noWishlist ? (
        <EmptyStateComponent isCart={false} />
      ) : (
        <Flex
          ml={isTabletOrMobile ? 0 : 5}
          mt={3}
          alignSelf="center"
          width={isTabletOrMobile ? '100%' : '80%'}
          flexDirection="column"
          alignItems="center"
        >
          <WishlistPageHeader
            isTabletOrMobile={isTabletOrMobile}
            onClick={handleEditWishlistClicked}
            editing={editing}
          />
          {products?.map((product: Product) => (
            <ProductCard
              width={isTabletOrMobile ? '100%' : '100%'}
              key={`${product.id}-${Math.random()}`}
              isWishlist
              product={product}
              handleClick={editing ? handleWishlistProductClickedEditing : navigateToProduct}
              editing={editing || false}
              handleIconClick={handleWishlistProductClickedNormal}
            />
          ))}
          {editing ? (
            <DeleteItemsButton handleDeleteButtonClicked={handleDeleteButtonClicked} />
          ) : (
            isTabletOrMobile && (
              <Button
                onClick={handleHomeButtonClicked}
                mt={4}
                width="100%"
                type="submit"
                variantColor="brand"
              >
                TAKE ME HOME
              </Button>
            )
          )}
          {showDeleteItemsModal && (
            <DeleteItemsModal
              confirmationText={confirmationText}
              handleCancelButtonClicked={handleCancelButtonClicked}
              handleDeleteButtonClicked={handleModalDeleteButtonClicked}
            />
          )}
        </Flex>
      )}
      {!isTabletOrMobile && (
        <Flex ml={5} mt={3} width="100%" flexDirection="column" alignItems="center">
          <Section card title="Today’s Best Deals">
            {discountDeals?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
            ))}
          </Section>
          <Section card title="Deals For You">
            {deals?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
            ))}
            <Button mt={4} width="100%" variantColor="brand">
              VIEW MORE
            </Button>
          </Section>
        </Flex>
      )}
    </PageWrap>
  )
}

export default WishlistPage
