"use client";

import { useState } from "react";
import { useHotelStore } from "@/stores/hotelStore";
import { Hotel } from "@/types";
import { Dialog, Button } from "@chakra-ui/react";
import HotelForm from "../HotelForm";
import { toaster } from "@/components/ui/toaster";

interface EditHotelDialogProps {
  hotel: Hotel;
  onClose: () => void;
}

export default function EditHotelDialog({
  hotel,
  onClose,
}: EditHotelDialogProps) {
  const hotelStore = useHotelStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await hotelStore.updateHotel(hotel.id, data);
      await hotelStore.fetchHotels({ per_page: "50" });
      toaster.create({
        title: "Hôtel modifié avec succès",
        description: "Les modifications ont été enregistrées",
        type: "success",
        duration: 5000,
      });
      onClose();
    } catch (error) {
      console.error("Error updating hotel:", error);
      toaster.create({
        title: "Erreur lors de la modification",
        description: "Impossible de modifier l'hôtel. Veuillez réessayer.",
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
          <Dialog.Header>
            <Dialog.Title>Modifier l&apos;hôtel</Dialog.Title>
          </Dialog.Header>
          <Dialog.CloseTrigger />

          <Dialog.Body>
            <HotelForm
              hotel={hotel}
              formId="edit-hotel-form"
              onSubmit={handleSubmit}
            />
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline" onClick={onClose} colorScheme="gray">
                Annuler
              </Button>
            </Dialog.ActionTrigger>
            <Button
              type="submit"
              form="edit-hotel-form"
              bg="brand.600"
              color="white"
              loading={loading}
              loadingText="Modification..."
              _hover={{ bg: "brand.700" }}
            >
              Enregistrer
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </>
  );
}
