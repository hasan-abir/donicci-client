import type {StackScreenProps} from '@react-navigation/stack';
import {Box, Button, Spinner, Text, VStack, useTheme} from 'native-base';
import {useContext, useEffect, useState, useCallback} from 'react';
import type {Category} from '../components/CategoryItem';
import ProductList from '../components/ProductList';
import {ErrorType, RootContext} from '../context/RootContext';
import categoryController from '../controllers/categoryController';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';

type Props = StackScreenProps<
  RootStackParamList & RootTabParamList,
  'CategoryProducts'
>;

const CategoryProductsScreen = ({navigation, route}: Props) => {
  const {clearError, handleError} = useContext(RootContext);

  const {colors} = useTheme();

  const [category, setCategory] = useState<Category | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      clearError(ErrorType.Fetch);

      const data = await categoryController.fetchSingleCategory(
        route.params.categoryId,
      );
      setCategory(data);

      if (data) {
        navigation.setOptions({title: data.name});
      }
    } catch (error: any) {
      handleError(error, route.name, ErrorType.Fetch);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [navigation]);
  return (
    <Box flex={1}>
      {loading ? (
        <Spinner color={colors.gray[300]} size="lg" />
      ) : category ? (
        <ProductList
          categoryId={route.params.categoryId}
          headerTitle={category?.name}
        />
      ) : (
        <Box mt={6} mx={6}>
          <Text
            mb={3}
            textAlign="center"
            fontSize="xl"
            fontFamily="body"
            testID="not-found-text">
            Category not found
          </Text>
          <Button
            py={2}
            px={6}
            borderRadius={20}
            onPress={() => navigation.navigate('Categories')}
            bgColor={colors.secondary[500]}
            _text={{fontFamily: 'body', fontWeight: 'bold'}}
            testID="backtocategories-btn">
            BACK TO CATEGORIES
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CategoryProductsScreen;
