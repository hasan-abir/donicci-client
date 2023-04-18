import {Box, Button, FormControl, Heading, Input, Text} from 'native-base';
import {useState, useCallback} from 'react';

interface Props {
  postReview: (description: string) => Promise<void>;
  disabled?: boolean;
}

interface PostReviewFormData {
  description?: string;
}

const PostReview = ({postReview, disabled}: Props) => {
  const [formData, setData] = useState<PostReviewFormData>({});
  const [errors, setErrors] = useState<PostReviewFormData>({});
  const [loading, setLoading] = useState<boolean>(false);

  const validate = useCallback(() => {
    setErrors({});

    if (formData.description === undefined || formData.description === '') {
      setErrors(prevState => ({
        ...prevState,
        description: 'Description is required',
      }));
      return false;
    }

    return true;
  }, [formData]);

  const onSubmit = useCallback(async () => {
    if (validate()) {
      setLoading(true);
      setErrors({});

      await postReview(formData.description as string);
      setLoading(false);
    }
  }, [formData]);

  return (
    <Box mb={8}>
      <Heading mb={2} fontSize="md">
        Post a Review
      </Heading>
      <FormControl isRequired isInvalid={'description' in errors}>
        <FormControl.Label
          _text={{
            bold: true,
          }}>
          Description
        </FormControl.Label>
        <Input
          onChangeText={value => setData({...formData, description: value})}
        />
        {'description' in errors ? (
          <FormControl.ErrorMessage>
            {errors.description}
          </FormControl.ErrorMessage>
        ) : null}
      </FormControl>
      <Button onPress={onSubmit} mt="5" isDisabled={loading || disabled}>
        <Text fontWeight="bold" fontSize="md">
          Post
        </Text>
      </Button>
    </Box>
  );
};

export default PostReview;
