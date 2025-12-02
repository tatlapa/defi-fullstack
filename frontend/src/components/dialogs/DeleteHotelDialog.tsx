"use client";

import { useState } from "react";
import { useHotelStore } from "@/stores/hotelStore";
import { Hotel } from "@/types";
import { Dialog, Button, VStack, Text, Box } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

interface DeleteHotelDialogProps {
  hotel: Hotel;
  onClose: () => void;
}

export default function DeleteHotelDialog({
  hotel,
  onClose,
}: DeleteHotelDialogProps) {
  const hotelStore = useHotelStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await hotelStore.deleteHotel(hotel.id);
      await hotelStore.fetchHotels({ per_page: "50" });
      toaster.create({
        title: "Hôtel supprimé avec succès",
        description: "L'hôtel a été retiré de la liste",
        type: "success",
        duration: 5000,
      });
      onClose();
    } catch (error) {
      console.error("Error deleting hotel:", error);
      toaster.create({
        title: "Erreur lors de la suppression",
        description: "Impossible de supprimer l'hôtel. Veuillez réessayer.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Confirmer la suppression</Dialog.Title>
          </Dialog.Header>
          <Dialog.CloseTrigger />

          <Dialog.Body>
            <VStack align="start" gap={3}>
              <Text>Êtes-vous sûr de vouloir supprimer cet hôtel ?</Text>
              <Box
                p={4}
                bg="gray.50"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.200"
                w="100%"
              >
                <Text fontWeight="bold" fontSize="lg">
                  {hotel.name}
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {hotel.city}, {hotel.country}
                </Text>
              </Box>
              <Text fontSize="sm" color="red.600" fontWeight="medium">
                Cette action est irréversible.
              </Text>
            </VStack>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
            </Dialog.ActionTrigger>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              loading={loading}
              loadingText="Suppression..."
            >
              Supprimer
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </>
  );
}
