import * as React from 'react'
import { get } from 'lodash'
import { useHistory } from 'react-router-dom';


import { PageWrap } from '../../layouts'
import { Flex, useToast } from '@chakra-ui/core'
import { useParams } from 'react-router-dom'
import { useFindProductQuery, Product } from '../../generated/graphql'
import { ERROR_TOAST } from '../../constants'
import Footer from '../../components/Footer'
import ProductComponent from './ProductComponent'
import AddToCartModal from "./AddToCartModal";

const ProductView: React.FC = () => {
  const { id } = useParams()
  const toast = useToast()
  const history = useHistory();

  const [showAddToCartModal, setShowAddToCartModal] = React.useState<boolean | undefined>();

  const { data } = useFindProductQuery({
    variables: { id: id.toString() },
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const product = get(data, 'findProduct', null) as Product

  const handleContinueShoppingButtonClicked = () => {
    history.push("/");
  };
  const handleGoToCartButtonClicked = () => {
    history.push("/cart");
  };
  const handleCancelButtonClicked = () => {
    setShowAddToCartModal(false);
  };
  const setShowAddCartModal = () => {
    setShowAddToCartModal(true);
  };

  return (
    <PageWrap alignItems="center" title="Product" bg="white">
      <ProductComponent product={product} setShowAddToCartModal={setShowAddCartModal}/>
      <Flex ml="1rem">
        <Footer />
      </Flex>
      { showAddToCartModal && (
          <AddToCartModal 
            handleContinueShoppingButtonClicked={handleContinueShoppingButtonClicked}
            handleGoToCartButtonClicked={handleGoToCartButtonClicked}
            handleCancelButtonClicked={handleCancelButtonClicked}
            product={product}
        />)
      }
    </PageWrap>
  )
}

export default ProductView
