import {
  Box,
  Button,
  ButtonText,
  FormControl,
  Text,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
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

  const onSubmit = useCallback(async () => {
    setLoading(true);
    await postReview(formData.description as string);
    setLoading(false);
  }, [formData]);

  return (
    <Box mb="$8">
      <Text mb="$2" fontSize="$md">
        Post a Review
      </Text>
      <FormControl isRequired>
        <Textarea>
          <TextareaInput
            onChangeText={value => setData({...formData, description: value})}
            fontFamily="$body"
            borderWidth="$0"
            backgroundColor="$white"
            borderRadius="$lg"
            placeholder="Review description..."
            testID="review-input"
          />
        </Textarea>
      </FormControl>
      <Button
        py="$2"
        px="$6"
        borderRadius="$lg"
        onPress={onSubmit}
        mt="$4"
        isDisabled={loading || disabled}
        bgColor="$secondary700"
        testID="review-submit">
        <ButtonText fontFamily="$heading" fontWeight="$normal">
          SUBMIT
        </ButtonText>
      </Button>
    </Box>
  );
};

export default PostReview;
