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
  const [errors, setErrors] = useState<PostReviewFormData>({});
  const [loading, setLoading] = useState<boolean>(false);

  const {colors} = useTheme();

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
      <Text mb={2} fontSize="md" fontFamily="body">
        Post a Review
      </Text>
      <FormControl isRequired isInvalid={'description' in errors}>
        <TextArea
          autoCompleteType={true}
          onChangeText={value => setData({...formData, description: value})}
          fontFamily="body"
          borderWidth={0}
          backgroundColor={colors.white}
          placeholder="Review description..."
        />
        {'description' in errors ? (
          <FormControl.ErrorMessage color={colors.danger[600]}>
            {errors.description}
          </FormControl.ErrorMessage>
        ) : null}
      </FormControl>
      <Button
        py={2}
        px={6}
        borderRadius={10}
        onPress={onSubmit}
        mt="4"
        isDisabled={loading || disabled}
        bgColor={colors.secondary[500]}
        _text={{fontFamily: 'body', fontWeight: 'bold'}}>
        SUBMIT
      </Button>
    </Box>
  );
};

export default PostReview;
