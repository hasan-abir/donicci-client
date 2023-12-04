import {Box, HStack, Image, Pressable} from '@gluestack-ui/themed';
import {useEffect, useMemo, useState} from 'react';
import {ImageType} from './ProductItem';

type Props = {
  images: ImageType[];
  alt: string;
};

const ImageGallery = ({images, alt}: Props) => {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, []);
  return (
    <Box>
      {selectedImage ? (
        <Image
          size="md"
          w="$full"
          resizeMode="contain"
          h="$80"
          borderRadius={20}
          mb="$3"
          backgroundColor="$secondary700"
          source={{uri: selectedImage.url}}
          alt={alt}
          testID="gallery-image-main"
        />
      ) : null}
      <HStack space="xs" mt="$4" mb="$4" flexWrap="wrap">
        {images.map((image, index) => {
          const active = useMemo(
            () => selectedImage && image.url === selectedImage.url,
            [selectedImage, image],
          );

          return (
            <Pressable
              testID={'gallery-image-' + (index + 1)}
              key={image.url}
              borderRadius="$lg"
              overflow="hidden"
              onPress={() => setSelectedImage(image)}>
              <Image size="sm" source={{uri: image.url}} alt={alt} />
              {active ? (
                <Box
                  position="absolute"
                  w="$full"
                  h="$full"
                  zIndex={20}
                  backgroundColor="$primary700"
                  opacity={0.5}
                />
              ) : null}
            </Pressable>
          );
        })}
      </HStack>
    </Box>
  );
};

export default ImageGallery;
