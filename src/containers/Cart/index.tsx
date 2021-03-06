import { get } from 'lodash'
import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { ApolloError } from 'apollo-client'
import { useMediaQuery } from 'react-responsive'
import { Flex, Grid, GridProps, useToast, Button, Spinner } from '@chakra-ui/core'

import DeleteItemsModal from '../../components/DeleteItemsModal'

import Section from '../../components/Section'
import EmptyStateComponent from '../Wishlist/NoWishlist'
import ProductCard from '../../components/Card/ProductCard'
import DeleteItemsButton from '../Wishlist/DeleteItemsButton'

import { theme } from '../../theme'
import { PageWrap } from '../../layouts'
import { H3, Text } from '../../typography'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import {
  Product,
  useProductQuery,
  useFetchUsersCartQuery,
  useFromCartToWishlistMutation,
  useRemoveProductsFromCartMutation,
  Maybe
} from '../../generated/graphql'
import CartCard from '../../components/Card/CartCard'
// import { useScript } from '../../hooks'

export type CartProduct = {
  quantity: number
  product: Product
}

type CartPageHeaderProps = GridProps & {
  isTabletOrMobile: boolean
  editing: boolean | undefined
  numberOfItems: number
  cartTotal: number
  onClick: () => void
}

type ProductRemovalValues = {
  id: string
  checked: boolean | undefined
}

const CartPageHeader: React.FC<CartPageHeaderProps> = ({
  isTabletOrMobile,
  onClick,
  editing,
  numberOfItems,
  cartTotal
}) => {
  return (
    <Grid
      gridTemplateRows="1fr 1fr"
      width={isTabletOrMobile ? '100%' : '80%'}
      ml={isTabletOrMobile ? 0 : 5}
    >
      <Flex width="100%" ml={isTabletOrMobile ? 0 : 3} justifyContent="space-between">
        {isTabletOrMobile && !editing ? (
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
          isTabletOrMobile && (
            <Button width="70px" variantColor="brand" onClick={onClick}>
              <Text fontSize="12px">DONE</Text>
            </Button>
          )
        )}
      </Flex>
      {isTabletOrMobile && (
        <Flex width="100%" mb={3} justifyContent="space-between">
          <Text>{`Cart Total (${numberOfItems}): R ${cartTotal
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</Text>
        </Flex>
      )}
    </Grid>
  )
}

const CartPage: React.FC = () => {
  const discountedPriceMarker = 4000
  const toast = useToast()
  const history = useHistory()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  // useScript(mapsScriptUrl)

  const [editing, setEditing] = React.useState<boolean | undefined>()
  const [showDeleteItemsModal, setShowDeleteItemsModal] = React.useState<boolean | undefined>()

  const handleEditCartClicked = () => {
    setEditing(!editing)
  }
  const { data: userCart, refetch, loading } = useFetchUsersCartQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })
  const [removeProductsFromCart] = useRemoveProductsFromCartMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: ({ removeProductsFromCart }) => {
      const itemsRemoved = removeProductsFromCart?.payload?.removedItems?.length
      const message =
        itemsRemoved === 0
          ? 'No items removed from cart'
          : `Successfully removed ${itemsRemoved} items from cart`

      toast({ description: message, ...SUCCESS_TOAST })
      history.push('/cart')
      refetch()
      setShowDeleteItemsModal(false)
    },
    awaitRefetchQueries: true
  })
  const [fromCartToWishlist, { loading: movingLoading }] = useFromCartToWishlistMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: ({ fromCartToWishlist }) => {
      const itemMoved = fromCartToWishlist?.payload?.product?.name
      if (itemMoved) {
        const message = `Successfully moved "${itemMoved}" to your wishlist`
        toast({ description: message, ...SUCCESS_TOAST })
        refetch()
      }
    },
    awaitRefetchQueries: true
  })

  const products = get(userCart, 'findCart.payload.products', null)
  const noCart = get(userCart, 'findCart.payload', null)
  const productsOnly = products?.map((entry: CartProduct) => entry.product)
  const cartTotal = get(userCart, 'findCart.payload.total', null)
  const emptyCartProducts = productsOnly?.length < 1

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

  const handleCartProductClickedEditing = (id: Maybe<string> | undefined) => {
    return null
  }
  const handleCartProductClickedNormal = async (id: Maybe<string> | undefined) => {
    const productToRemove = {
      productToMove: [id?.toString() || '']
    }
    await fromCartToWishlist({
      variables: {
        input: productToRemove
      }
    })
  }

  const handleDeleteButtonClicked = () => {
    setShowDeleteItemsModal(true)
  }
  const handleCheckoutButtonClicked = async () => {
    history.push('/checkout')
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
      await removeProductsFromCart({
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

  const itemsCount = products?.reduce((accumulator: number, currentValue: CartProduct) => {
    const productQuantity = currentValue?.quantity
    return productQuantity + accumulator
  }, 0)

  React.useEffect(() => {
    refetch()
  }, [refetch])

  const confirmationText = `You are about to delete these items in your cart? Once they are removed, you???ll have to re-add them to your cart manually.`

  return (
    <PageWrap mt={10} title="My Cart" align="center" backgroundSize="cover" justify="center">
      {loading || movingLoading ? (
        <Spinner />
      ) : emptyCartProducts || !noCart ? (
        <EmptyStateComponent isCart />
      ) : (
        <React.Fragment>
          <CartPageHeader
            isTabletOrMobile={isTabletOrMobile}
            onClick={handleEditCartClicked}
            editing={editing}
            numberOfItems={itemsCount}
            cartTotal={cartTotal}
          />
          <Flex flexDirection="row" ml={8} mt={3} width="80%">
            <Section card title="My Cart">
              {productsOnly
                ?.sort((a: Product, b: Product) => parseInt(a.id) - parseInt(b.id))
                .map((product: Product) => (
                  <CartCard
                    width={'100%'}
                    key={`${product?.id}`}
                    isWishlist={false}
                    isCart
                    product={product}
                    products={products}
                    handleClick={editing ? handleCartProductClickedEditing : navigateToProduct}
                    editing={editing || false}
                    handleIconClick={handleCartProductClickedNormal}
                  />
                ))}
            </Section>
            {!isTabletOrMobile && (
              <Flex
                m={4}
                borderRadius={5}
                p={3}
                flexDirection="column"
                width="250px"
                height="180px"
                background="white"
                boxShadow={theme.boxShadowMedium}
              >
                <H3 textAlign="left" fontSize={16} fontWeight={600}>
                  Cart Summary
                </H3>
                <Text
                  fontSize={14}
                  mt={4}
                  color="blue"
                >{`Cart Total (${itemsCount}): BWP ${cartTotal
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</Text>
                <Button
                  alignSelf="center"
                  onClick={handleEditCartClicked}
                  mt={4}
                  width="95%"
                  type="submit"
                  border={`1px solid ${theme.colors.brand[700]}`}
                  background="white"
                >
                  {editing ? 'DONE' : 'EDIT'}
                </Button>
                <Button
                  alignSelf="center"
                  onClick={handleCheckoutButtonClicked}
                  mt={4}
                  width="95%"
                  variantColor="brand"
                >
                  CHECKOUT
                </Button>
              </Flex>
            )}
          </Flex>
          {isTabletOrMobile && (
            <Button
              alignSelf="center"
              onClick={handleCheckoutButtonClicked}
              mt={4}
              width="95%"
              variantColor="brand"
            >
              CHECKOUT
            </Button>
          )}
          {editing && <DeleteItemsButton handleDeleteButtonClicked={handleDeleteButtonClicked} />}
          {showDeleteItemsModal && (
            <DeleteItemsModal
              isCart
              confirmationText={confirmationText}
              handleCancelButtonClicked={handleCancelButtonClicked}
              handleDeleteButtonClicked={handleModalDeleteButtonClicked}
            />
          )}
        </React.Fragment>
      )}
      {!isTabletOrMobile && (
        <Flex ml={5} mt={3} width="100%" flexDirection="column" alignItems="center">
          <Section card title="Today???s Best Deals">
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

export default CartPage
