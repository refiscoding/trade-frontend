import { Image, Text } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'
import * as React from 'react'
import CardFooter from '../CardFooter'
import { Card } from '../../index'
import { Category } from '../../../generated/graphql'

type CategoryCardProps = FlexProps & {
  category: Category
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Card m={2} width="45%" height="130px">
      <Image
        mr={5}
        width="100%"
        height="100px"
        src={`${process.env.REACT_APP_API_HOST}${category.categoryImage?.url}`}
      />
      <CardFooter bg="white" height="30px" alignItems="center" justifyContent="center">
        <Text fontSize="12px">{category.name}</Text>
      </CardFooter>
    </Card>
  )
}

export default CategoryCard
