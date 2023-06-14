import {
  AspectRatio,
  Box,
  HStack,
  Image,
  Pressable,
  Text,
  useTheme,
} from 'native-base';
import {useEffect, useMemo, useState} from 'react';
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
          overflow="hidden"
          backgroundColor={colors.white}
          borderRadius={20}
          ratio={{base: 1 / 1}}>
          <Image
            testID="gallery-image-main"
            resizeMode="contain"
            source={{uri: selectedImage.url}}
            alt={alt}
          />
        </AspectRatio>
      ) : null}
      <HStack space={2} mt={4} mb={4} flexWrap="wrap">
        {images.map((image, index) => {
          const active = useMemo(
            () => selectedImage && image.url === selectedImage.url,
            [selectedImage, image],
          );

          return (
            <Pressable
              testID={'gallery-image-' + (index + 1)}
              key={image.url}
              borderRadius={10}
              overflow="hidden"
              onPress={() => setSelectedImage(image)}>
              <Image size="sm" source={{uri: image.url}} alt={alt} />
              {active ? (
                <Box
                  position="absolute"
                  width="full"
                  height="full"
                  zIndex={20}
                  backgroundColor={colors.primary[500]}
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
