import type {StackScreenProps} from '@react-navigation/stack';
import {RefreshControl} from 'react-native';
import {
  AspectRatio,
  Button,
  Box,
  Heading,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  theme,
} from 'native-base';
import {useCallback, useContext, useEffect, useState} from 'react';
import type {Product} from '../components/ProductItem';
import type {RootStackParamList} from '../stacks/RootStack';
import type {ImageType} from '../components/ProductItem';
import {RootContext} from '../context/RootContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import productController from '../controllers/productController';
import categoryController from '../controllers/categoryController';
import type {Category} from '../components/CategoryItem';

type Props = StackScreenProps<RootStackParamList, 'ProductDetails'>;

const truncate = (str: string, n: number, useWordBoundary?: boolean) => {
  if (str.length <= n) {
    return str;
  }
  const subString = str.slice(0, n - 1);
  return (
    (useWordBoundary
      ? subString.slice(0, subString.lastIndexOf(' '))
      : subString) + '...'
  );
};

const ProductDetailsScreen = ({route, navigation}: Props) => {
  const {addItemToCart, removeItemFromCart, inCart} = useContext(RootContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryPage, setCategoryPage] = useState<number>(1);
  const [imageSelected, setImageSelected] = useState<ImageType | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addQuantity = () => {
    if (product && product.quantity && selectedQuantity < product.quantity) {
      setSelectedQuantity(selectedQuantity + 1);
    }
  };
  const deductQuantity = () => {
    if (product && product.quantity && selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const productData = await productController.fetchSingleProduct(
        route.params.productId,
      );
      setProduct(productData);

      if (productData) {
        navigation.setOptions({title: truncate(productData.title, 30, true)});

        setImageSelected(productData.images[0]);
        if (productData.category_ids) {
          const categoriesData = await categoryController.fetchCategories(
            categoryPage,
            productData.category_ids,
          );
          setCategories(categoriesData);
        }
      }
    } catch (error: any) {
      const status = error.response.status;
      const data = error.response.data;

      setErrorMsg(data.msg);

      if (status === 500) {
        setErrorMsg('Something went wrong, try refreshing');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Box flex={1} py={5} px={3}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {errorMsg ? (
          <Text my={3} color={theme.colors.red[600]} fontWeight="bold">
            {errorMsg}
          </Text>
        ) : null}

        {loading && !refreshing ? (
          <Box justifyContent="center">
            <Spinner color={theme.colors.gray[300]} size="lg" />
          </Box>
        ) : product ? (
          <Box>
            {imageSelected ? (
              <AspectRatio
                backgroundColor={theme.colors.yellow[50]}
                borderRadius={5}
                ratio={{base: 1 / 1}}>
                <Image
                  resizeMode="contain"
                  source={{uri: imageSelected.url}}
                  alt={product.title}
                />
              </AspectRatio>
            ) : null}
            <HStack space={2} mt={3} mb={4} flexWrap="wrap">
              {product.images.map(image => {
                return (
                  <Pressable
                    key={image.url}
                    borderColor={
                      imageSelected && image.url === imageSelected.url
                        ? 'yellow.400'
                        : null
                    }
                    borderWidth={
                      imageSelected && image.url === imageSelected.url
                        ? 2
                        : null
                    }
                    onPress={() => setImageSelected(image)}>
                    <Image
                      size="sm"
                      source={{uri: image.url}}
                      alt={product.title}
                    />
                  </Pressable>
                );
              })}
            </HStack>
            <HStack space={1} mb={6} flexWrap="wrap">
              {categories.map(category => {
                return (
                  <Box
                    key={category._id}
                    backgroundColor={theme.colors.yellow[200]}
                    py={1}
                    px={2}
                    borderRadius={10}>
                    <Text fontSize={12} color={theme.colors.yellow[700]}>
                      {category.name}
                    </Text>
                  </Box>
                );
              })}
            </HStack>
            <Heading mb={6}>{product.title}</Heading>
            <Text fontWeight="bold" fontSize={14} mb={3}>
              Price - ${product.price / 100}
            </Text>
            {product.quantity && product.quantity > 0 ? (
              <Box>
                {inCart(product._id) ? (
                  <Button
                    py={2}
                    mb={6}
                    onPress={() => removeItemFromCart(product._id)}>
                    <Text fontWeight="bold">Remove from Cart</Text>
                  </Button>
                ) : (
                  <Box mb={6}>
                    <HStack space={2} mb={3}>
                      <Text fontWeight="bold" fontSize={14}>
                        Quantity -
                      </Text>
                      <Ionicons
                        name={'chevron-back-outline'}
                        size={24}
                        color={theme.colors.black}
                        onPress={() => deductQuantity()}
                      />
                      <Text fontSize={14}>
                        {selectedQuantity} / {product.quantity}
                      </Text>
                      <Ionicons
                        name={'chevron-forward-outline'}
                        size={24}
                        color={theme.colors.black}
                        onPress={() => addQuantity()}
                      />
                    </HStack>
                    <Button
                      py={2}
                      onPress={() =>
                        addItemToCart({...product, selectedQuantity})
                      }>
                      <Text fontWeight="bold">Add to Cart</Text>
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <Heading
                mb={3}
                fontSize={14}
                style={{color: theme.colors.red[500]}}>
                Out of stock
              </Heading>
            )}

            <Heading mb={1} fontSize={14}>
              Description
            </Heading>
            <Text>{product.description}</Text>
          </Box>
        ) : null}
      </ScrollView>
    </Box>
  );
};

export default ProductDetailsScreen;
