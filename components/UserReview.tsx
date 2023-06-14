import {Box, Heading, Text, useTheme} from 'native-base';

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
  const {colors} = useTheme();

  return (
    <Box mb={3}>
      <Text fontFamily="body" fontSize="md" mb={2}>
        {review.author} says,
      </Text>
      <Text color={colors.gray[500]} fontFamily="body">
        {review.description}
      </Text>
    </Box>
  );
};

export default UserReview;
