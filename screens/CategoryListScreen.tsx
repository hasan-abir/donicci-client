import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Box, FlatList, Heading, Spinner, Text, theme} from 'native-base';
import {useEffect, useState} from 'react';
import type {Category} from '../components/CategoryItem';
import CategoryItem from '../components/CategoryItem';
import categoryController from '../controllers/categoryController';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';

type Props = BottomTabScreenProps<
  RootTabParamList & RootStackParamList,
  'Categories'
>;

const CategoryListScreen = ({navigation}: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [endOfDataList, setEndOfDataList] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(currentPage, true);
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (!loading && !endOfDataList && !refreshing && !errorMsg) {
      const page = currentPage + 1;
      setCurrentPage(page);

      await fetchData(page);
    }
  };

  const fetchData = async (page: number, reset?: boolean) => {
    try {
      setLoading(true);
      setErrorMsg(null);

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
    fetchData(currentPage);
  }, []);
  return (
    <Box flex={1} px={3}>
      {errorMsg ? (
        <Text my={3} color={theme.colors.red[600]} fontWeight="bold">
          {errorMsg}
        </Text>
      ) : null}
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
              <Spinner py={3} color={theme.colors.gray[300]} size="lg" />
            ) : null}
          </Box>
        }
        keyExtractor={(item, index) => item._id}
        renderItem={({item}) => <CategoryItem item={item} />}
      />
    </Box>
  );
};

export default CategoryListScreen;
