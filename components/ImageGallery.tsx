import {Box, HStack, Image, Pressable, Text} from '@gluestack-ui/themed';
import {useEffect, useMemo, useState} from 'react';
import {ImageType} from './ProductItem';
import {Image as NativeImage} from 'react-native';

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
        <Box bgColor="$primary700" borderRadius={20} overflow="hidden">
          <NativeImage
            style={{width: '100%', height: 360, resizeMode: 'contain'}}
            source={{uri: selectedImage.url + '?tr=h-600'}}
            alt={alt}
            testID="gallery-image-main"
          />
        </Box>
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
              <Image
                size="sm"
                source={{uri: image.url + '?tr=h-100'}}
                alt={alt}
              />
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
