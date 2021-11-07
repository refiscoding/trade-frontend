import * as React from 'react'

import { Product } from '../../generated/graphql'

export type ProductProps = {
  deals: Product[]
  handleAddToCartClicked: (id: string) => Promise<void>
  handleAddToWishlistClicked: (id: string) => Promise<void>
  isPreview: boolean
  product: Product
  productImages: string[]
  productPackaging: string
  productQuantity: number
  setProductQuantity: React.Dispatch<React.SetStateAction<number>>
}
