"use client";

import { useState, useEffect } from "react";
import { useHotelStore } from "@/stores/hotelStore";
import { Hotel } from "@/types";
import { Box, Button, Heading, HStack, Grid, Dialog, Tabs, Table, IconButton, Skeleton } from "@chakra-ui/react";
import { LuPlus, LuGrid3X3, LuTable2, LuPencil, LuTrash2 } from "react-icons/lu";
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
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

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
        <HStack gap={3}>
          <HStack
            bg={{ base: "white", _dark: "gray.800" }}
            borderRadius="lg"
            p={1}
            shadow="sm"
            borderWidth="1px"
            borderColor={{ base: "gray.200", _dark: "gray.700" }}
          >
            <IconButton
              aria-label="Vue grille"
              size="sm"
              variant={viewMode === "grid" ? "solid" : "ghost"}
              bg={viewMode === "grid" ? "brand.600" : "transparent"}
              color={viewMode === "grid" ? "white" : { base: "gray.600", _dark: "gray.400" }}
              _hover={{
                bg: viewMode === "grid" ? "brand.700" : { base: "gray.100", _dark: "gray.700" },
              }}
              onClick={() => setViewMode("grid")}
            >
              <LuGrid3X3 size={18} />
            </IconButton>
            <IconButton
              aria-label="Vue tableau"
              size="sm"
              variant={viewMode === "table" ? "solid" : "ghost"}
              bg={viewMode === "table" ? "brand.600" : "transparent"}
              color={viewMode === "table" ? "white" : { base: "gray.600", _dark: "gray.400" }}
              _hover={{
                bg: viewMode === "table" ? "brand.700" : { base: "gray.100", _dark: "gray.700" },
              }}
              onClick={() => setViewMode("table")}
            >
              <LuTable2 size={18} />
            </IconButton>
          </HStack>

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
      </HStack>

      {viewMode === "grid" ? (
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
      ) : (
        <Box
          bg={{ base: "white", _dark: "gray.800" }}
          borderRadius="xl"
          shadow="lg"
          borderWidth="1px"
          borderColor={{ base: "gray.200", _dark: "gray.700" }}
          overflow="hidden"
        >
          <Table.Root variant="line" size="lg">
            <Table.Header>
              <Table.Row bg={{ base: "gray.50", _dark: "gray.900" }}>
                <Table.ColumnHeader fontWeight="bold">Nom</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Ville</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Pays</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Prix/nuit</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Capacité</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold" textAlign="right">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Table.Row key={index}>
                    <Table.Cell><Skeleton h="20px" w="150px" /></Table.Cell>
                    <Table.Cell><Skeleton h="20px" w="100px" /></Table.Cell>
                    <Table.Cell><Skeleton h="20px" w="100px" /></Table.Cell>
                    <Table.Cell><Skeleton h="20px" w="80px" /></Table.Cell>
                    <Table.Cell><Skeleton h="20px" w="60px" /></Table.Cell>
                    <Table.Cell><Skeleton h="20px" w="100px" /></Table.Cell>
                  </Table.Row>
                ))
              ) : (
                hotels.map((hotel) => (
                  <Table.Row
                    key={hotel.id}
                    _hover={{ bg: { base: "gray.50", _dark: "gray.700" } }}
                    transition="all 0.2s"
                  >
                    <Table.Cell fontWeight="medium" color={{ base: "gray.900", _dark: "gray.100" }}>
                      {hotel.name}
                    </Table.Cell>
                    <Table.Cell color={{ base: "gray.600", _dark: "gray.400" }}>
                      {hotel.city}
                    </Table.Cell>
                    <Table.Cell color={{ base: "gray.600", _dark: "gray.400" }}>
                      {hotel.country}
                    </Table.Cell>
                    <Table.Cell>
                      <Box
                        as="span"
                        fontWeight="bold"
                        color="brand.600"
                      >
                        {hotel.price_per_night}€
                      </Box>
                    </Table.Cell>
                    <Table.Cell color={{ base: "gray.600", _dark: "gray.400" }}>
                      {hotel.max_capacity} pers.
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <HStack justify="end" gap={2}>
                        <IconButton
                          aria-label="Modifier"
                          size="sm"
                          variant="ghost"
                          color="brand.600"
                          _hover={{ bg: { base: "brand.50", _dark: "brand.900/20" } }}
                          onClick={() => handleEditClick(hotel)}
                        >
                          <LuPencil size={16} />
                        </IconButton>
                        <IconButton
                          aria-label="Supprimer"
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDeleteClick(hotel)}
                        >
                          <LuTrash2 size={16} />
                        </IconButton>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

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
