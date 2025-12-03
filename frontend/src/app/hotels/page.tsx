"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHotelStore } from "@/stores/hotelStore";
import { Box, Heading, Grid, Text, Pagination, ButtonGroup, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import HotelCard from "@/components/HotelCard";
import HotelCardSkeleton from "@/components/HotelCardSkeleton";

/**
 * Page publique d'affichage des hôtels
 * Affiche une grille paginée avec 12 hôtels par page
 */
export default function HotelsPage() {
  const router = useRouter();
  const { hotels, fetchHotels, loading, pagination } = useHotelStore();
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  // Chargement des hôtels à chaque changement de page
  useEffect(() => {
    fetchHotels({ page: currentPage, per_page: perPage });
  }, [currentPage, fetchHotels]);

  const handlePageChange = (details: { page: number }) => {
    setCurrentPage(details.page);
    // Scroll vers le haut pour une meilleure UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          ? Array.from({ length: perPage }).map((_, index) => (
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

{pagination && pagination.last_page > 1 && (
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          gap={4}
          mt={8}
          p={4}
          bg={{ base: "white", _dark: "gray.800" }}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={{ base: "gray.200", _dark: "gray.700" }}
        >
          <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>
            Affichage de{" "}
            <Text as="span" fontWeight="medium">
              {(pagination.current_page - 1) * pagination.per_page + 1}
            </Text>{" "}
            à{" "}
            <Text as="span" fontWeight="medium">
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
            </Text>{" "}
            sur{" "}
            <Text as="span" fontWeight="medium">
              {pagination.total}
            </Text>{" "}
            résultats
          </Text>

          <Pagination.Root
            count={pagination.total}
            pageSize={perPage}
            page={currentPage}
            onPageChange={handlePageChange}
          >
            <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                <IconButton>
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(page) => (
                  <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                    {page.value}
                  </IconButton>
                )}
              />

              <Pagination.NextTrigger asChild>
                <IconButton>
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Box>
      )}
    </Box>
  );
}
