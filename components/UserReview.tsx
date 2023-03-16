import {Box, Heading, Text} from 'native-base';

export type Review = {
  _id: string;
  description: string;
  product_id: string;
  user_id: string;
  author: string;
  created_at: string;
  updated_at: string;
};

type Props = {
  review: Review;
};

const UserReview = ({review}: Props) => {
  return (
    <Box mb={3}>
      <Heading fontSize={16} mb={2} mr={2}>
        {review.author} -
      </Heading>
      <Text>{review.description}</Text>
    </Box>
  );
};

export default UserReview;
