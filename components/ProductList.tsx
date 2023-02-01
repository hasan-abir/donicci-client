import {Box, Heading, ScrollView} from 'native-base';
import {useState} from 'react';
import type {Product} from './ProductItem';
import ProductItem from './ProductItem';
// temporary
import demoProducts from './demoProducts.json';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>(
    demoProducts.products as Product[],
  );

  return (
    <Box flex={1}>
      <ScrollView>
        <Heading mb={5}>Latest Products</Heading>
        <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between">
          {products.map(item => (
            <ProductItem key={item._id} item={item} />
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
};

export default ProductList;
