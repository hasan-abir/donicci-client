import {Box, Button, FormControl, Text, TextArea, useTheme} from 'native-base';
import {useCallback, useState} from 'react';

interface Props {
  postReview: (description: string) => Promise<void>;
  disabled?: boolean;
}

interface PostReviewFormData {
  description?: string;
}

const PostReview = ({postReview, disabled}: Props) => {
  const [formData, setData] = useState<PostReviewFormData>({});
  const [loading, setLoading] = useState<boolean>(false);

  const {colors} = useTheme();

  const onSubmit = useCallback(async () => {
    setLoading(true);
    await postReview(formData.description as string);
    setLoading(false);
  }, [formData]);

  return (
    <Box mb={8}>
      <Text mb={2} fontSize="md" fontFamily="body">
        Post a Review
      </Text>
      <FormControl isRequired>
        <TextArea
          autoCompleteType={true}
          onChangeText={value => setData({...formData, description: value})}
          fontFamily="body"
          borderWidth={0}
          backgroundColor={colors.white}
          borderRadius={10}
          placeholder="Review description..."
          testID="review-input"
        />
      </FormControl>
      <Button
        py={2}
        px={6}
        borderRadius={10}
        onPress={onSubmit}
        mt="4"
        isDisabled={loading || disabled}
        bgColor={colors.secondary[500]}
        _text={{fontFamily: 'body', fontWeight: 'bold'}}
        testID="review-submit">
        SUBMIT
      </Button>
    </Box>
  );
};

export default PostReview;
