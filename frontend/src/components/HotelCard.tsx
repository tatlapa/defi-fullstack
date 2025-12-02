"use client";

import { Hotel } from "@/types";
import {
  Card,
  Image,
  Text,
  HStack,
  Badge,
  Button,
  Box,
} from "@chakra-ui/react";
import { LuPencil, LuTrash2, LuMapPin } from "react-icons/lu";

interface HotelCardProps {
  hotel: Hotel;
  onEdit?: (hotel: Hotel) => void;
  onDelete?: (hotel: Hotel) => void;
  showActions?: boolean;
  onClick?: () => void;
}

export default function HotelCard({
  hotel,
  onEdit,
  onDelete,
  showActions = false,
  onClick,
}: HotelCardProps) {
  const handleCardClick = () => {
    if (showActions) return;
    onClick?.();
  };

  return (
    <Card.Root
      shadow="lg"
      position="relative"
      cursor={!showActions ? "pointer" : "default"}
      onClick={handleCardClick}
      transition="all 0.3s"
      bg={{ base: "white", _dark: "gray.800" }}
      borderRadius="xl"
      overflow="hidden"
      borderWidth="1px"
      borderColor={{ base: "transparent", _dark: "gray.700" }}
      _hover={{
        shadow: !showActions ? "2xl" : "lg",
        transform: !showActions ? "translateY(-4px)" : "none",
        borderColor: { base: "transparent", _dark: "brand.600" },
      }}
    >
      {hotel.pictures?.[0] && (
        <Box position="relative" overflow="hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${hotel.pictures[0].filepath}`}
            alt={hotel.name}
            h="200px"
            w="100%"
            objectFit="cover"
            transition="transform 0.3s"
            _groupHover={{ transform: "scale(1.05)" }}
          />
          <Badge
            position="absolute"
            top={3}
            right={3}
            fontSize="lg"
            px={4}
            py={2}
            borderRadius="full"
            bg="brand.600"
            color="white"
            fontWeight="bold"
            shadow="lg"
          >
            {hotel.price_per_night}€
          </Badge>
        </Box>
      )}

      <Card.Body gap={4} p={5}>
        <Card.Title fontSize="xl" fontWeight="bold" lineClamp={1} color={{ base: "gray.800", _dark: "gray.100" }}>
          {hotel.name}
        </Card.Title>

        <HStack color={{ base: "brand.700", _dark: "brand.400" }} fontSize="sm" gap={1.5}>
          <LuMapPin size={16} />
          <Text lineClamp={1} fontWeight="medium">
            {hotel.city}, {hotel.country}
          </Text>
        </HStack>

        <Card.Description lineClamp={2} fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }} lineHeight="1.6">
          {hotel.description}
        </Card.Description>

        <HStack justify="space-between" align="center" mt={1}>
          <Badge
            colorScheme="green"
            fontSize="xs"
            px={3}
            py={1}
            borderRadius="full"
            fontWeight="semibold"
          >
            {hotel.max_capacity} personnes
          </Badge>
        </HStack>

        {showActions && (
          <HStack mt={4} gap={2}>
            <Button
              size="sm"
              variant="solid"
              bg="brand.600"
              color="white"
              flex={1}
              gap={1.5}
              onClick={() => onEdit?.(hotel)}
              _hover={{ bg: "brand.700" }}
            >
              <LuPencil size={16} />
              Modifier
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              flex={1}
              gap={1.5}
              onClick={() => onDelete?.(hotel)}
              _hover={{ bg: "red.50" }}
            >
              <LuTrash2 size={16} />
              Supprimer
            </Button>
          </HStack>
        )}
      </Card.Body>
    </Card.Root>
  );
}
