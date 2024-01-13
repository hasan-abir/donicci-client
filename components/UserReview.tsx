import {Box, Text} from '@gluestack-ui/themed';

export type Review = {
  _id: string;
  description: string;
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
    <Box mb="$3">
      <Text fontSize="$md" mb="$2" testID={'review-author-' + review._id}>
        {review.author} says,
      </Text>
      <Text color="$coolGray500" testID={'review-description-' + review._id}>
        {review.description}
      </Text>
    </Box>
  );
};

export default UserReview;
