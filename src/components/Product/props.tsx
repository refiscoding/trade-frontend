import { Product } from "../../generated/graphql";

export type ProductProps = {
    product: Product
    deals: Product[]
    handleAddToWishlistClicked: (id: string) => Promise<void>
    handleAddToCartClicked: (id: string) => Promise<void>
    productPackaging: string
    productImages: string[]
    isPreview: boolean
};