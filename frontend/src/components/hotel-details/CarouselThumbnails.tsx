import { AspectRatio, Carousel, HStack, Image } from "@chakra-ui/react";
import { useCarouselContext } from "@chakra-ui/react";

/**
 * Barre de miniatures pour le carrousel
 * Permet de naviguer directement vers une image spécifique
 */
export function CarouselThumbnails({
  images,
  hotelName,
}: {
  images: string[];
  hotelName: string;
}) {
  const carousel = useCarouselContext();

  return (
    <HStack justify="center" mt={4}>
      <Carousel.ProgressText mr="4" color="white" fontWeight="bold" />
      {images.map((src, index) => (
        <AspectRatio
          key={index}
          ratio={1}
          w="16"
          cursor="button"
          onClick={() => carousel.scrollTo(index)}
        >
          <Image
            src={src}
            alt={`${hotelName} ${index + 1}`}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </AspectRatio>
      ))}
    </HStack>
  );
}
