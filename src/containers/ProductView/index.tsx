import * as React from 'react'
import { get } from 'lodash'

import { PageWrap } from '../../layouts'
import { useToast } from '@chakra-ui/core'
import { useParams } from 'react-router-dom'
import { useFindProductQuery, Product } from '../../generated/graphql'
import { ERROR_TOAST } from '../../constants'
import Footer from '../../components/Footer'
import ProductComponent from './ProductComponent'

const ProductView: React.FC = () => {
  const { id } = useParams()
  const toast = useToast()

  const { data } = useFindProductQuery({
    variables: { id: id.toString() },
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const product = get(data, 'findProduct', null) as Product

  return (
    <PageWrap title="Product">
      <ProductComponent product={product} />
      <Footer />
    </PageWrap>
  )
}

export default ProductView
