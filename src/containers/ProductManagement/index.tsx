import * as React from 'react'
import { PageWrap } from '../../layouts'
import ProductManagementCard from '../../components/Card/ProductMangementCard'
import { Button } from '@chakra-ui/core'
import { useHistory } from 'react-router-dom'

const productManagementItems = [
  {
    title: 'Total Units Sold',
    caption: 'No data available yet.'
  },
  {
    title: 'Active Product Progress',
    caption: 'No data available yet.'
  },
  {
    title: 'Active Products ',
    caption: 'No data available yet.'
  }
]

type ProductManagementProps = {}

const ProductManagement: React.FC<ProductManagementProps> = () => {
  const history = useHistory()

  return (
    <PageWrap alignItems="center" title="Product Management" >
      {productManagementItems.map((item, key) => (
        <ProductManagementCard key={key} caption={item.caption} title={item.title} />
      ))}
    </PageWrap>
  )
}

export default ProductManagement
