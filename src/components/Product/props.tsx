import * as React from 'react'

import { Product } from '../../generated/graphql'

export type ProductProps = {
  product: Product
  deals: Product[]
  handleAddToWishlistClicked: (id: string) => Promise<void>
  handleAddToCartClicked: (id: string) => Promise<void>
  setProductQuantity: React.Dispatch<React.SetStateAction<number>>
  productPackaging: string
  productImages: string[]
  isPreview: boolean
  productQuantity: number
}
