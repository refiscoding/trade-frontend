import * as React from 'react'
import { get } from 'lodash'
//import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { Flex, useToast } from '@chakra-ui/core'

import { PageWrap } from '../../layouts'
import Footer from '../../components/Footer'
import { ERROR_TOAST } from '../../constants'
import AddToCartModal from './AddToCartModal'
import ProductComponent from './ProductComponent'
import { useFindProductQuery, Product } from '../../generated/graphql'

import { theme } from '../../theme'

const ProductView: React.FC = () => {
  //const { id } = useParams()
  const toast = useToast()
  const history = useHistory()

  const [currentNumber, setCurrentNumber] = React.useState<number>(1)
  const [showAddToCartModal, setShowAddToCartModal] = React.useState<boolean | undefined>()

  const { data } = useFindProductQuery({
    //variables: { uniqueIdentifier: id },
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const product = get(data, 'findProduct', null) as Product

  const handleContinueShoppingButtonClicked = () => {
    history.push('/')
  }
  const handleGoToCartButtonClicked = () => {
    history.push('/cart')
  }
  const handleCancelButtonClicked = () => {
    setShowAddToCartModal(false)
  }
  const setShowAddCartModal = () => {
    setShowAddToCartModal(true)
  }

  return (
    <PageWrap alignItems="center" title="Product" bg={theme.colors.background}>
      <ProductComponent
        product={product}
        setShowAddToCartModal={setShowAddCartModal}
        setCurrentNumber={setCurrentNumber}
        currentNumber={currentNumber}
      />
      <Flex ml="1rem">
        <Footer />
      </Flex>
      {showAddToCartModal && (
        <AddToCartModal
          handleContinueShoppingButtonClicked={handleContinueShoppingButtonClicked}
          handleGoToCartButtonClicked={handleGoToCartButtonClicked}
          handleCancelButtonClicked={handleCancelButtonClicked}
          product={product}
          productQuantity={currentNumber}
          setProductQuantity={setCurrentNumber}
        />
      )}
    </PageWrap>
  )
}

export default ProductView
