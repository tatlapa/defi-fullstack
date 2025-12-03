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
  Dialog,
  HStack,
  VStack,
  Badge,
  Separator,
  Card,
} from "@chakra-ui/react";
import { LuMapPin, LuUsers } from "react-icons/lu";
import { LightboxGallery } from "@/components/hotel-details/LightboxGallery";

export default function HotelPage() {
  const params = useParams();
  const { currentHotel, fetchHotel, loading, error } = useHotelStore();

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
