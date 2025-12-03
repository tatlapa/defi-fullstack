"use client";

import { useState } from "react";
import { useHotelStore } from "@/stores/hotelStore";
import { Hotel } from "@/types";
import { Dialog, Button, CloseButton } from "@chakra-ui/react";
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

  const handleSubmit = async (data: FormData) => {
    try {
      await hotelStore.updateHotel(hotel.id, data);

      toaster.create({
        title: "Hôtel modifié avec succès",
        description: "Les modifications ont été enregistrées",
        type: "success",
        duration: 5000,
      });
      onClose();
    } catch (error: any) {
      toaster.create({
        title: "Erreur lors de la modification",
        description:
          error.response?.data?.message ||
          "Impossible de modifier l'hôtel. Veuillez réessayer.",
        type: "error",
        duration: 5000,
      });
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
              loading={hotelStore.loading}
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
