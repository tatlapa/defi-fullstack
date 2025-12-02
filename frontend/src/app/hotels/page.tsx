"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHotelStore } from "@/stores/hotelStore";
import { Box, Heading, Grid } from "@chakra-ui/react";
import HotelCard from "@/components/HotelCard";
import HotelCardSkeleton from "@/components/HotelCardSkeleton";

export default function HotelsPage() {
  const router = useRouter();
  const { hotels, fetchHotels, loading } = useHotelStore();

  useEffect(() => {
    fetchHotels({ per_page: "50" });
  }, [fetchHotels]);

  return (
    <Box maxW="7xl" mx="auto" p={6}>
      <Box mb={10}>
        <Heading as="h1" size="2xl" mb={2} color={{ base: "gray.800", _dark: "gray.100" }}>
          Nos hôtels
        </Heading>
        <Heading as="h2" size="md" fontWeight="normal" color={{ base: "gray.500", _dark: "gray.400" }}>
          Découvrez notre sélection d&apos;établissements
        </Heading>
      </Box>

      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <HotelCardSkeleton key={index} />
            ))
          : hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onClick={() => router.push(`/hotels/${hotel.id}`)}
              />
            ))}
      </Grid>
    </Box>
  );
}
