"use client";

import { useState } from "react";
import { useHotelStore } from "@/stores/hotelStore";
import { Dialog, Button, CloseButton } from "@chakra-ui/react";
import HotelForm from "../HotelForm";
import { toaster } from "@/components/ui/toaster";

interface AddHotelDialogProps {
  onClose: () => void;
}

export default function AddHotelDialog({ onClose }: AddHotelDialogProps) {
  const hotelStore = useHotelStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await hotelStore.createHotel(data);

      // Retour à la page 1 après création pour afficher le nouvel hôtel
      await hotelStore.fetchHotels({ page: 1, per_page: 12 });

      toaster.create({
        title: "Hôtel créé avec succès",
        description: "L'hôtel a été ajouté à la liste",
        type: "success",
        duration: 5000,
      });
      onClose();
    } catch (error) {
      console.error("Error creating hotel:", error);
      toaster.create({
        title: "Erreur lors de la création",
        description: "Impossible de créer l'hôtel. Veuillez réessayer.",
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
        <Dialog.Content maxH="90vh" overflowY="auto">
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
          <Dialog.Header>
            <Dialog.Title>Ajouter un hôtel</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <HotelForm formId="add-hotel-form" onSubmit={handleSubmit} />
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline" onClick={onClose} colorScheme="gray">
                Annuler
              </Button>
            </Dialog.ActionTrigger>
            <Button
              type="submit"
              form="add-hotel-form"
              bg="brand.600"
              color="white"
              loading={loading}
              loadingText="Création..."
              _hover={{ bg: "brand.700" }}
            >
              Créer l&apos;hôtel
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </>
  );
}
