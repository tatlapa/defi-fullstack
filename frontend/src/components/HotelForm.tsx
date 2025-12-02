"use client";

import { useState } from "react";
import { Hotel } from "@/types";
import {
  Box,
  Field,
  Input,
  Stack,
  Textarea,
  Heading,
  Grid,
  GridItem,
  Image,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { LuCircleX } from "react-icons/lu";

interface HotelFormProps {
  hotel?: Hotel;
  formId: string;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function HotelForm({ hotel, formId, onSubmit }: HotelFormProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: hotel?.name || "",
    address1: hotel?.address1 || "",
    address2: hotel?.address2 || "",
    zipcode: hotel?.zipcode || "",
    city: hotel?.city || "",
    country: hotel?.country || "",
    lat: hotel?.lat?.toString() || "",
    lng: hotel?.lng?.toString() || "",
    description: hotel?.description || "",
    max_capacity: hotel?.max_capacity || 1,
    price_per_night: hotel?.price_per_night || 0,
    pictures: [] as File[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, pictures: files });

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newPictures = formData.pictures.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    URL.revokeObjectURL(previews[index]);

    setFormData({ ...formData, pictures: newPictures });
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "pictures") {
        (value as File[]).forEach((file) => data.append("pictures[]", file));
      } else {
        data.append(key, value as string);
      }
    });

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} id={formId}>
      <Stack gap={6}>
        <Box>
          <Heading size="sm" mb={4} color="gray.700">
            Informations générales
          </Heading>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={4}
          >
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Field.Root>
                <Field.Label>Nom de l&apos;hôtel</Field.Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Hôtel Paradise"
                  required
                />
              </Field.Root>
            </GridItem>

            <GridItem>
              <Field.Root>
                <Field.Label>Prix par nuit (€)</Field.Label>
                <Input
                  name="price_per_night"
                  type="number"
                  step="0.01"
                  value={formData.price_per_night}
                  onChange={handleChange}
                  placeholder="99.00"
                  required
                />
              </Field.Root>
            </GridItem>

            <GridItem>
              <Field.Root>
                <Field.Label>Capacité maximale</Field.Label>
                <Input
                  name="max_capacity"
                  type="number"
                  value={formData.max_capacity}
                  onChange={handleChange}
                  placeholder="4"
                  required
                />
              </Field.Root>
            </GridItem>

            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Field.Root>
                <Field.Label>Description</Field.Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre hôtel..."
                  rows={3}
                  required
                />
              </Field.Root>
            </GridItem>
          </Grid>
        </Box>

        <Box>
          <Heading size="sm" mb={4} color="gray.700">
            Adresse
          </Heading>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={4}
          >
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Field.Root>
                <Field.Label>Adresse ligne 1</Field.Label>
                <Input
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  placeholder="123 Rue de la Paix"
                  required
                />
              </Field.Root>
            </GridItem>

            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Field.Root>
                <Field.Label>Adresse ligne 2</Field.Label>
                <Input
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  placeholder="Bâtiment A, 3ème étage"
                />
              </Field.Root>
            </GridItem>

            <GridItem>
              <Field.Root>
                <Field.Label>Code postal</Field.Label>
                <Input
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  placeholder="75001"
                  required
                />
              </Field.Root>
            </GridItem>

            <GridItem>
              <Field.Root>
                <Field.Label>Ville</Field.Label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Paris"
                  required
                />
              </Field.Root>
            </GridItem>

            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Field.Root>
                <Field.Label>Pays</Field.Label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="France"
                  required
                />
              </Field.Root>
            </GridItem>
          </Grid>
        </Box>

        <Box>
          <Heading size="sm" mb={4} color="gray.700">
            Coordonnées GPS
          </Heading>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={4}
          >
            <GridItem>
              <Field.Root>
                <Field.Label>Latitude</Field.Label>
                <Input
                  name="lat"
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={handleChange}
                  placeholder="48.8566"
                  required
                />
              </Field.Root>
            </GridItem>

            <GridItem>
              <Field.Root>
                <Field.Label>Longitude</Field.Label>
                <Input
                  name="lng"
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={handleChange}
                  placeholder="2.3522"
                  required
                />
              </Field.Root>
            </GridItem>
          </Grid>
        </Box>

        <Box>
          <Heading size="sm" mb={4} color="gray.700">
            {hotel ? "Nouvelles images" : "Images"}
          </Heading>
          <Field.Root>
            <Field.Label>
              {hotel ? "Remplacer les images (optionnel)" : "Ajouter des images (min. 1, max 5MB chacune)"}
            </Field.Label>
            <Input
              type="file"
              name="pictures"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              pt={1}
            />
            <Field.HelperText>
              {hotel ? "Laissez vide pour conserver les images actuelles" : "Formats acceptés : JPEG, PNG, WEBP"}
            </Field.HelperText>
          </Field.Root>

          {previews.length > 0 && (
            <Grid
              templateColumns="repeat(auto-fill, minmax(120px, 1fr))"
              gap={3}
              mt={3}
            >
              {previews.map((preview, index) => (
                <Box
                  key={index}
                  position="relative"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    objectFit="cover"
                    h="120px"
                    w="100%"
                  />
                  <IconButton
                    aria-label="Supprimer l'image"
                    size="xs"
                    colorScheme="red"
                    position="absolute"
                    top={1}
                    right={1}
                    onClick={() => removeImage(index)}
                  >
                    <LuCircleX />
                  </IconButton>

                  <Text
                    position="absolute"
                    bottom={1}
                    left={1}
                    bg="blackAlpha.700"
                    color="white"
                    px={1.5}
                    py={0.5}
                    borderRadius="md"
                    fontSize="xs"
                  >
                    {index + 1}
                  </Text>
                </Box>
              ))}
            </Grid>
          )}
        </Box>
      </Stack>
    </form>
  );
}
