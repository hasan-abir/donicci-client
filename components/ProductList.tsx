import {Box, FlatList, Heading} from 'native-base';
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
      <FlatList
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        data={products}
        ListHeaderComponent={<Heading my={5}>Latest Products</Heading>}
        keyExtractor={(item, index) => item._id}
        renderItem={({item}) => <ProductItem item={item} />}
      />
    </Box>
  );
};

export default ProductList;
