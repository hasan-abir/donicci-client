import {
  AspectRatio,
  Box,
  HStack,
  Image,
  Pressable,
  useTheme,
} from 'native-base';
import {useEffect, useState} from 'react';
import {ImageType} from './ProductItem';

type Props = {
  images: ImageType[];
  alt: string;
};

const ImageGallery = ({images, alt}: Props) => {
  const {colors} = useTheme();

  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, []);
  return (
    <Box>
      {selectedImage ? (
        <AspectRatio
          backgroundColor={colors.primary[50]}
          borderRadius={5}
          ratio={{base: 1 / 1}}>
          <Image
            resizeMode="contain"
            source={{uri: selectedImage.url}}
            alt={alt}
          />
        </AspectRatio>
      ) : null}
      <HStack space={2} mt={3} mb={4} flexWrap="wrap">
        {images.map(image => {
          return (
            <Pressable
              key={image.url}
              borderColor={
                selectedImage && image.url === selectedImage.url
                  ? colors.primary[400]
                  : null
              }
              borderWidth={
                selectedImage && image.url === selectedImage.url ? 2 : null
              }
              onPress={() => setSelectedImage(image)}>
              <Image size="sm" source={{uri: image.url}} alt={alt} />
            </Pressable>
          );
        })}
      </HStack>
    </Box>
  );
};

export default ImageGallery;
