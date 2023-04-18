import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Box, FlatList, Heading, Spinner, Text, useTheme} from 'native-base';
import {useContext, useEffect, useState, useCallback, memo} from 'react';
import type {Category} from '../components/CategoryItem';
import CategoryItem from '../components/CategoryItem';
import {RootContext} from '../context/RootContext';
import categoryController from '../controllers/categoryController';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';

interface Props
  extends BottomTabScreenProps<
    RootTabParamList & RootStackParamList,
    'Categories'
  > {}

const areEqual = (prevProps: {item: Category}, nextProps: {item: Category}) =>
  prevProps.item === nextProps.item;
const PureCategoryItem = memo(CategoryItem, areEqual);

const CategoryListScreen = ({}: Props) => {
  const {colors} = useTheme();
  const route = useRoute<RouteProp<RootStackParamList & RootTabParamList>>();

  const {error, handleError, clearError} = useContext(RootContext);

  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [endOfDataList, setEndOfDataList] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(currentPage, true);
    setRefreshing(false);
  }, [currentPage]);

  const onEndReached = useCallback(async () => {
    if (!loading && !endOfDataList && !refreshing && !error) {
      const page = currentPage + 1;
      setCurrentPage(page);

      await fetchData(page);
    }
  }, [loading, endOfDataList, refreshing, error, currentPage]);

  const fetchData = useCallback(
    async (page: number, reset?: boolean) => {
      try {
        setLoading(true);
        clearError();

        let prevCategories = [...categories];

        if (reset) {
          prevCategories = [];
          page = 1;

          setCategories(prevCategories);
          setCurrentPage(page);
          setEndOfDataList(false);
        }

        const data = await categoryController.fetchCategories(page);
        setCategories([...prevCategories, ...data]);

        if (data.length === 0) {
          setEndOfDataList(true);
        }
      } catch (error: any) {
        handleError(error, route.name);
      } finally {
        setLoading(false);
      }
    },
    [categories],
  );

  useEffect(() => {
    fetchData(currentPage);
  }, []);
  return (
    <Box flex={1} px={3}>
      <FlatList
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        data={categories}
        ListHeaderComponent={<Heading my={5}>Latest Categories</Heading>}
        ListFooterComponent={
          <Box justifyContent="center">
            {endOfDataList ? (
              <Text py={3} textAlign="center">
                You have reached the end of the list...
              </Text>
            ) : loading && !refreshing ? (
              <Spinner py={3} color={colors.gray[300]} size="lg" />
            ) : categories.length < 1 ? (
              <Text py={3} textAlign="center">
                No categories found...
              </Text>
            ) : null}
          </Box>
        }
        keyExtractor={(item, index) => item._id}
        renderItem={({item}) => <PureCategoryItem item={item} />}
      />
    </Box>
  );
};

export default CategoryListScreen;
