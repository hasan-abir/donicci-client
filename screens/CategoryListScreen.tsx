import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Box, FlatList, Heading, Spinner, Text, useTheme} from 'native-base';
import {memo, useCallback, useContext, useEffect, useState} from 'react';
import type {Category} from '../components/CategoryItem';
import CategoryItem from '../components/CategoryItem';
import {ErrorType, RootContext} from '../context/RootContext';
import categoryController from '../controllers/categoryController';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';

interface Props extends BottomTabScreenProps<RootTabParamList, 'Categories'> {}

const areEqual = (prevProps: {item: Category}, nextProps: {item: Category}) =>
  prevProps.item === nextProps.item;
const PureCategoryItem = memo(CategoryItem, areEqual);

const CategoryListScreen = () => {
  const {colors} = useTheme();
  const route = useRoute<RouteProp<RootStackParamList & RootTabParamList>>();

  const {error, handleError, clearError} = useContext(RootContext);

  const [categories, setCategories] = useState<Category[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [endOfDataList, setEndOfDataList] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(lastUpdatedAt, true);
    setRefreshing(false);
  }, [lastUpdatedAt]);

  const onEndReached = useCallback(async () => {
    if (!loading && !endOfDataList && !refreshing && !error) {
      await fetchData(lastUpdatedAt);
    }
  }, [loading, endOfDataList, refreshing, error, lastUpdatedAt]);

  const fetchData = useCallback(
    async (next: string | undefined, reset?: boolean) => {
      try {
        setLoading(true);
        clearError(ErrorType.Fetch);

        let prevCategories = [...categories];

        if (reset) {
          prevCategories = [];
          next = undefined;

          setCategories(prevCategories);
          setLastUpdatedAt(next);
          setEndOfDataList(false);
        }

        const data = await categoryController.fetchCategories(next);
        setCategories([...prevCategories, ...data]);

        if (data.length > 0) {
          setLastUpdatedAt(data[data.length - 1].updated_at);
        } else {
          setEndOfDataList(true);
        }
      } catch (error: any) {
        handleError(error, route.name, ErrorType.Fetch);
      } finally {
        setLoading(false);
      }
    },
    [categories],
  );

  useEffect(() => {
    fetchData(lastUpdatedAt, true);
  }, []);
  return (
    <Box flex={1}>
      <FlatList
        px={6}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        data={categories}
        testID="flat-list"
        ListHeaderComponent={
          <Heading
            fontFamily="body"
            fontWeight="semibold"
            mt={6}
            mb={4}
            fontSize="3xl"
            testID="main-heading">
            Latest Categories
          </Heading>
        }
        ListFooterComponent={() => (
          <Box justifyContent="center" mb={6}>
            {loading && !refreshing ? (
              <Spinner color={colors.gray[300]} size="lg" />
            ) : categories.length < 1 ? (
              <Text textAlign="center" testID="no-data-text">
                No categories found...
              </Text>
            ) : endOfDataList ? (
              <Text textAlign="center" testID="end-of-data-text">
                That's all for now!
              </Text>
            ) : null}
          </Box>
        )}
        keyExtractor={(item, index) => item._id}
        renderItem={({item, index}) => (
          <Box testID="flat-list-item">
            <PureCategoryItem item={item} index={index} />
          </Box>
        )}
      />
    </Box>
  );
};

export default CategoryListScreen;
