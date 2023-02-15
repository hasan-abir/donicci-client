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

  const onRefresh = async () => {
    setRefreshing(true);
    if (currentPage > 1) {
      setCategories([]);
      setCurrentPage(1);
    } else {
      setRefreshing(false);
    }
  };

  const onEndReached = async () => {
    if (!loading && !endOfDataList && !refreshing) {
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchData = async () => {
    setEndOfDataList(false);
    if (!refreshing) {
      setLoading(true);
    }
    const data = await categoryController.fetchCategories(currentPage);
    setCategories([...categories, ...data]);
    if (data.length === 0) {
      setEndOfDataList(true);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);
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
            ) : loading ? (
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
