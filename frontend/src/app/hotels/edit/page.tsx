"use client";

import { useState, useEffect } from "react";
import { useHotelStore } from "@/stores/hotelStore";
import { Hotel } from "@/types";
import { Box, Button, Heading, HStack, Grid, Dialog } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import HotelCard from "@/components/HotelCard";
import HotelCardSkeleton from "@/components/HotelCardSkeleton";
import AddHotelDialog from "@/components/dialogs/AddHotelDialog";
import EditHotelDialog from "@/components/dialogs/EditHotelDialog";
import DeleteHotelDialog from "@/components/dialogs/DeleteHotelDialog";

export default function HotelManagement() {
  const { hotels, fetchHotels, loading } = useHotelStore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    fetchHotels({ per_page: "50" });
  }, [fetchHotels]);

  const handleEditClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setDeleteDialogOpen(true);
  };

  return (
    <Box maxW="7xl" mx="auto" p={6}>
      <HStack justify="space-between" align="center" mb={10}>
        <Box>
          <Heading as="h1" size="2xl" mb={2} color={{ base: "gray.800", _dark: "gray.100" }}>
            Gestion des hôtels
          </Heading>
          <Heading as="h2" size="md" fontWeight="normal" color={{ base: "gray.500", _dark: "gray.400" }}>
            Créez, modifiez et gérez vos établissements
          </Heading>
        </Box>
        <Dialog.Root
          open={addDialogOpen}
          onOpenChange={(e) => setAddDialogOpen(e.open)}
          size="xl"
        >
          <Dialog.Trigger asChild>
            <Button
              bg="brand.600"
              color="white"
              size="lg"
              gap={2}
              shadow="lg"
              _hover={{ bg: "brand.700", transform: "translateY(-2px)", shadow: "xl" }}
              transition="all 0.2s"
            >
              <LuPlus size={20} />
              Ajouter un hôtel
            </Button>
          </Dialog.Trigger>
          <AddHotelDialog onClose={() => setAddDialogOpen(false)} />
        </Dialog.Root>
      </HStack>

      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <HotelCardSkeleton key={index} />
            ))
          : hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                showActions
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
      </Grid>

      <Dialog.Root
        open={editDialogOpen}
        onOpenChange={(e) => setEditDialogOpen(e.open)}
        size="xl"
      >
        {selectedHotel && (
          <EditHotelDialog
            hotel={selectedHotel}
            onClose={() => {
              setEditDialogOpen(false);
              setSelectedHotel(null);
            }}
          />
        )}
      </Dialog.Root>

      <Dialog.Root
        open={deleteDialogOpen}
        onOpenChange={(e) => setDeleteDialogOpen(e.open)}
      >
        {selectedHotel && (
          <DeleteHotelDialog
            hotel={selectedHotel}
            onClose={() => {
              setDeleteDialogOpen(false);
              setSelectedHotel(null);
            }}
          />
        )}
      </Dialog.Root>
    </Box>
  );
}
