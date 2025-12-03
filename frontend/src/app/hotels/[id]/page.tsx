"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useHotelStore } from "@/stores/hotelStore";
import {
  Box,
  Grid,
  Heading,
  Text,
  Image,
  Skeleton,
  SkeletonText,
  AspectRatio,
  Dialog,
  CloseButton,
  Portal,
  Carousel,
  IconButton,
  HStack,
  VStack,
  Badge,
  Separator,
  Card,
} from "@chakra-ui/react";
import { useCarouselContext } from "@chakra-ui/react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuMapPin,
  LuUsers,
} from "react-icons/lu";

/**
 * Page de détails d'un hôtel
 * Affiche les informations complètes et le carrousel d'images
 */
export default function HotelPage() {
  const params = useParams();
  const { currentHotel, fetchHotel, loading, error } = useHotelStore();

  // Chargement des détails de l'hôtel via l'ID dans l'URL
  useEffect(() => {
    if (params.id) {
      fetchHotel(params.id as string);
    }
  }, [params.id, fetchHotel]);

  if (loading || !currentHotel) {
    return (
      <Box maxW="6xl" mx="auto" p={4}>
        <VStack align="stretch" gap={4} mb={6}>
          <HStack justify="space-between" align="start">
            <Box flex={1}>
              <Skeleton h="40px" w="60%" mb={2} />
              <HStack gap={4}>
                <Skeleton h="20px" w="150px" />
                <Skeleton h="20px" w="200px" />
              </HStack>
            </Box>
            <Skeleton h="60px" w="150px" />
          </HStack>
        </VStack>

        <Grid
          templateColumns={{ base: "1fr", md: "2fr 1fr" }}
          templateRows={{ base: "repeat(3, 200px)", md: "repeat(2, 250px)" }}
          gap={2}
          borderRadius="lg"
          overflow="hidden"
          mb={8}
        >
          <Skeleton gridRow={{ base: "1", md: "1 / 3" }} />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Grid>

        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
          <VStack align="stretch" gap={6}>
            <Box>
              <Skeleton h="30px" w="150px" mb={3} />
              <SkeletonText noOfLines={4} />
            </Box>
            <Box>
              <Skeleton h="30px" w="100px" mb={3} />
              <SkeletonText noOfLines={3} />
            </Box>
          </VStack>
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            bg="gray.50"
            h="fit-content"
          >
            <Skeleton h="25px" w="120px" mb={4} />
            <SkeletonText noOfLines={3} />
          </Box>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxW="6xl" mx="auto" p={4}>
        <Box p={4} bg="red.50" borderRadius="md">
          <Text color="red.600" fontWeight="medium">
            {error}
          </Text>
        </Box>
      </Box>
    );
  }

  const images =
    currentHotel.pictures?.map(
      (pic) => `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${pic.filepath}`
    ) || [];

  return (
    <Box maxW="7xl" mx="auto" p={6}>
      <VStack align="stretch" gap={4} mb={6}>
        <HStack justify="space-between" align="start">
          <Box>
            <Heading as="h1" size="2xl" mb={2}>
              {currentHotel.name}
            </Heading>
            <HStack color="gray.600" gap={4}>
              <HStack>
                <LuMapPin />
                <Text>
                  {currentHotel.city}, {currentHotel.country}
                </Text>
              </HStack>
              <HStack>
                <LuUsers />
                <Text>Capacité : {currentHotel.max_capacity} personnes</Text>
              </HStack>
            </HStack>
          </Box>
          <Badge colorScheme="blue" fontSize="2xl" p={3} borderRadius="lg">
            {currentHotel.price_per_night} € / nuit
          </Badge>
        </HStack>
      </VStack>

      {images.length > 0 && (
        <Box mb={8}>
          <Dialog.Root size="full">
            <Grid
              templateColumns={{ base: "1fr", md: "2fr 1fr" }}
              templateRows={{
                base: "repeat(3, 200px)",
                md: "repeat(2, 250px)",
              }}
              gap={2}
              borderRadius="lg"
              overflow="hidden"
            >
              <Dialog.Trigger asChild>
                <Box
                  gridRow={{ base: "1", md: "1 / 3" }}
                  cursor="pointer"
                  position="relative"
                  overflow="hidden"
                  _hover={{ "& > img": { transform: "scale(1.05)" } }}
                  transition="all 0.3s"
                >
                  <Image
                    src={images[0]}
                    alt={currentHotel.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    transition="transform 0.3s"
                  />
                </Box>
              </Dialog.Trigger>

              {images.slice(1, 5).map((img, index) => (
                <Dialog.Trigger key={index} asChild>
                  <Box
                    cursor="pointer"
                    position="relative"
                    overflow="hidden"
                    _hover={{ "& > img": { transform: "scale(1.05)" } }}
                    transition="all 0.3s"
                  >
                    <Image
                      src={img}
                      alt={`${currentHotel.name} ${index + 2}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      transition="transform 0.3s"
                    />
                    {index === 3 && images.length > 5 && (
                      <Box
                        position="absolute"
                        inset={0}
                        bg="blackAlpha.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text color="white" fontSize="xl" fontWeight="bold">
                          +{images.length - 5} photos
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Dialog.Trigger>
              ))}
            </Grid>

            <LightboxGallery images={images} hotelName={currentHotel.name} />
          </Dialog.Root>
        </Box>
      )}

      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
        <VStack align="stretch" gap={6}>
          <Box>
            <Heading size="lg" mb={3}>
              Description
            </Heading>
            <Text color="gray.700" lineHeight="tall">
              {currentHotel.description}
            </Text>
          </Box>

          <Separator />

          <Box>
            <Heading size="lg" mb={3}>
              Adresse
            </Heading>
            <VStack align="start" gap={1}>
              <Text>{currentHotel.address1}</Text>
              {currentHotel.address2 && <Text>{currentHotel.address2}</Text>}
              <Text>
                {currentHotel.zipcode} {currentHotel.city}
              </Text>
              <Text>{currentHotel.country}</Text>
            </VStack>
          </Box>
        </VStack>

        <Card.Root>
          <Card.Body>
            <Card.Title>Informations</Card.Title>
            <Card.Description>
              Coordonnées GPS
              <br />
              Lat: {currentHotel.lat}
              <br />
              Lng: {currentHotel.lng}
            </Card.Description>
          </Card.Body>
        </Card.Root>
      </Grid>
    </Box>
  );
}

function LightboxGallery({
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

function CarouselThumbnails({
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
