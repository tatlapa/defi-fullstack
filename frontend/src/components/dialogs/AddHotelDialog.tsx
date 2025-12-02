"use client";

import { useState } from "react";
import { useHotelStore } from "@/stores/hotelStore";
import { Dialog, Button } from "@chakra-ui/react";
import HotelForm from "../HotelForm";

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
      await hotelStore.fetchHotels({ per_page: "50" });
      onClose();
    } catch (error) {
      console.error("Error creating hotel:", error);
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
            <Dialog.Title>Ajouter un hôtel</Dialog.Title>
          </Dialog.Header>
          <Dialog.CloseTrigger />

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
