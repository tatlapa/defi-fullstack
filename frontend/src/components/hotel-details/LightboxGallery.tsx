import {
  AspectRatio,
  Carousel,
  CloseButton,
  Dialog,
  IconButton,
  Image,
  Portal,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { CarouselThumbnails } from "./CarouselThumbnails";

/**
 * Carrousel d'images en plein écran (lightbox)
 * Affiche toutes les images avec navigation et miniatures
 */
export function LightboxGallery({
  images,
  hotelName,
}: {
  images: string[];
  hotelName: string;
}) {
  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="transparent" shadow="none">
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" color="white" />
          </Dialog.CloseTrigger>

          <Dialog.Body
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="full"
            p={0}
          >
            <Carousel.Root slideCount={images.length} w="full" h="full">
              <Carousel.Control justifyContent="center" px="4" gap="4">
                <Carousel.PrevTrigger asChild>
                  <IconButton size="lg" variant="ghost" color="white">
                    <LuChevronLeft />
                  </IconButton>
                </Carousel.PrevTrigger>

                <Carousel.ItemGroup width="full">
                  {images.map((src, index) => (
                    <Carousel.Item key={index} index={index}>
                      <AspectRatio ratio={16 / 9} maxH="80vh" w="full">
                        <Image
                          src={src}
                          alt={`${hotelName} ${index + 1}`}
                          objectFit="contain"
                        />
                      </AspectRatio>
                    </Carousel.Item>
                  ))}
                </Carousel.ItemGroup>

                <Carousel.NextTrigger asChild>
                  <IconButton size="lg" variant="ghost" color="white">
                    <LuChevronRight />
                  </IconButton>
                </Carousel.NextTrigger>
              </Carousel.Control>

              <CarouselThumbnails images={images} hotelName={hotelName} />
            </Carousel.Root>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
}
