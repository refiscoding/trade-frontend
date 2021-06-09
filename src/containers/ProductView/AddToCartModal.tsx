import * as React from 'react'
import styled from '@emotion/styled'

import { get } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import { Image, Grid, Button, Flex, FlexProps } from '@chakra-ui/core'

import { Text } from '../../typography'
import { theme } from '../../theme'
import { ModalWrap } from '../../components'

const QuantityButton = styled.div`
  border: 1px solid ${theme.colors.background};
  border-radius: 5px;
  cursor: pointer;
  padding: 0 8px;
  font-weight: 550;
  align-self: start;
  margin-top: 5px;
  user-select: none;

  :hover {
    border: 1px solid ${theme.colors.brand[500]};
  }
`

type AddToCartModalProps = FlexProps & {
  handleContinueShoppingButtonClicked: () => void
  handleGoToCartButtonClicked: () => void
  handleCancelButtonClicked: () => void
  product: any
}
type CartModalProductComponentProps = FlexProps & {
  product: any
  noTitle?: boolean
}
type QuantityComponentProps = FlexProps & {
  count: number | undefined
  available?: number | undefined
}

const CartModalProductComponent: React.FC<CartModalProductComponentProps> = ({ product }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const maxSellCost = get(product, 'maxSellCost') as number
  const tradeFedCost = get(product, 'tradeFedCost') as number
  const discount = Math.round(((maxSellCost - tradeFedCost) / maxSellCost) * 100)

  return (
    <Flex border={`1px solid ${theme.colors.background}`} borderRadius={5} position="relative">
      <Image
        width={isTabletOrMobile ? '50%' : '40%'}
        borderBottomLeftRadius={3}
        borderTopLeftRadius={3}
        src={product?.coverImage?.url}
      />
      {discount ? (
        <Flex
          alignItems="center"
          justifyContent="center"
          width="50px"
          height="50px"
          position="absolute"
          bg="accent.700"
          flexDirection="column"
          top={0}
          left={isTabletOrMobile ? '95px' : '150px'}
        >
          <Text color="white" fontSize="14px">
            Save
          </Text>
          <Text color="white" fontSize="14px" fontWeight={600}>
            {`${discount}%`}
          </Text>
        </Flex>
      ) : null}
      <Flex flexDirection="column" ml={3}>
        <Flex mt={2}>
          <Text fontSize="14px" fontWeight="bold">
            {product?.name}
          </Text>
        </Flex>
        <Flex mb={2}>
          <Text fontSize="12px">{product?.shortDescription}</Text>
        </Flex>
        <Flex width="100%">
          <Text
            fontSize="12px"
            fontWeight="bold"
          >{`${product?.currency} ${product?.tradeFedCost}.00`}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export const QuantitySelectComponent: React.FC<QuantityComponentProps> = ({ count, available }) => {
  const [currentNumber, setCurrentNumber] = React.useState<number>(1)
  const increment = () => {
    if (available) {
      const outOfStock = currentNumber >= available
    }
    setCurrentNumber((currentNumber || 1) + 1)
  }
  const decrement = () => {
    setCurrentNumber((currentNumber === 1 ? 2 : currentNumber) - 1)
  }

  React.useEffect(() => {
    if (count) {
      setCurrentNumber(count as number)
    }
  }, [count])

  return (
    <React.Fragment>
      <QuantityButton onClick={decrement}>-</QuantityButton>
      <Text
        mx={3}
        mt={2}
        color={theme.colors.blueText}
        fontSize={12}
        fontWeight={600}
      >{`${currentNumber}`}</Text>
      <QuantityButton onClick={increment}>+</QuantityButton>
    </React.Fragment>
  )
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  handleContinueShoppingButtonClicked,
  handleGoToCartButtonClicked,
  handleCancelButtonClicked,
  product
}) => {
  return (
    <ModalWrap
      title="Item added to cart"
      isOpen={true}
      onClose={handleCancelButtonClicked}
      isCentered
    >
      <Flex padding={5} pb={0}>
        <Grid gridTemplateRows="150px 1fr 1fr 1fr">
          <CartModalProductComponent product={product} />
          {/* <QuantitySelectComponent count={quantity} /> */}
          <Button
            width="100%"
            mt={4}
            variantColor="brand"
            onClick={handleContinueShoppingButtonClicked}
          >
            CONTINUE SHOPPING
          </Button>
          <Button
            justifySelf="start"
            mt={4}
            width="100%"
            onClick={handleGoToCartButtonClicked}
            border={`1px solid ${theme.colors.brand[500]}`}
            background="white"
          >
            <Text>GO TO CART</Text>
          </Button>
        </Grid>
      </Flex>
    </ModalWrap>
  )
}

export default AddToCartModal
