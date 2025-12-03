"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { Hotel, HotelsPicture } from "@/types";
import {
  Box,
  Input,
  Stack,
  VStack,
  Heading,
  Grid,
  GridItem,
  Image,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { FormField } from "./FormField";
import { hotelSchema, HotelFormData } from "@/schemas/hotelSchema";
import { useHotelStore } from "@/stores/hotelStore";
import { LuCircleX, LuGripVertical } from "react-icons/lu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface HotelFormProps {
  hotel?: Hotel;
  formId: string;
  onSubmit: (data: FormData) => Promise<void>;
}



/**
 * Représente une image dans le formulaire
 * Unifie les images existantes (déjà stockées) et les nouvelles (fichiers à uploader)
 */
interface ImageItem {
  id: string;
  preview: string; // URL pour affichage
  isExisting: boolean; // true = image déjà en BDD, false = nouveau fichier
  file?: File; // Fichier source si nouvelle image
  existingPicture?: HotelsPicture; // Données BDD si image existante
}

interface SortableImageProps {
  id: string;
  preview: string;
  index: number;
  onRemove: (index: number) => void;
}

function SortableImage({ id, preview, index, onRemove }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      position="relative"
      borderRadius="md"
      overflow="hidden"
      bg={{ base: "white", _dark: "gray.800" }}
      borderWidth="2px"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      _hover={{
        borderColor: { base: "brand.600", _dark: "brand.500" },
      }}
    >
      <Image
        src={preview}
        alt={`Preview ${index + 1}`}
        objectFit="cover"
        h="120px"
        w="100%"
      />

      <IconButton
        aria-label="Faire glisser pour réorganiser"
        size="xs"
        position="absolute"
        top={1}
        left={1}
        bg="blackAlpha.700"
        color="white"
        cursor="grab"
        _active={{ cursor: "grabbing" }}
        {...listeners}
        {...attributes}
      >
        <LuGripVertical />
      </IconButton>

      <IconButton
        aria-label="Supprimer l'image"
        size="xs"
        colorScheme="red"
        position="absolute"
        top={1}
        right={1}
        onClick={() => onRemove(index)}
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
        fontWeight="bold"
      >
        {index + 1}
      </Text>
    </Box>
  );
}

export default function HotelForm({
  hotel,
  formId,
  onSubmit,
}: HotelFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Chargement des images existantes triées par position
  const initialImages: ImageItem[] = hotel?.pictures
    ? [...hotel.pictures]
        .sort((a, b) => a.position - b.position)
        .map((pic) => ({
          id: `existing-${pic.id}`,
          preview: `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${pic.filepath}`,
          isExisting: true,
          existingPicture: pic,
        }))
    : [];

  const [images, setImages] = useState<ImageItem[]>(initialImages);
  // Track des IDs des images à supprimer (envoyé au backend)
  const [deletedPictureIds, setDeletedPictureIds] = useState<number[]>([]);

  // Récupération des erreurs API Laravel depuis le store
  const apiErrors = useHotelStore((state) => state.apiErrors);

  // Configuration React Hook Form avec zodResolver
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addFiles = (files: File[]) => {
    const newImages: ImageItem[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      preview: URL.createObjectURL(file),
      isExisting: false,
      file,
    }));

    setImages([...images, ...newImages]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // Filtrage pour accepter uniquement les images
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      addFiles(files);
    }
  };

  // Gestion du réordonnancement des images par drag & drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setImages(arrayMove(images, oldIndex, newIndex));
      }
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];

    // Si image existante, on l'ajoute à la liste de suppression
    if (imageToRemove.isExisting && imageToRemove.existingPicture) {
      setDeletedPictureIds([
        ...deletedPictureIds,
        imageToRemove.existingPicture.id,
      ]);
    } else if (!imageToRemove.isExisting) {
      // Libération mémoire pour les blob URLs
      URL.revokeObjectURL(imageToRemove.preview);
    }

    setImages(images.filter((_, i) => i !== index));

    // Reset de l'input pour permettre de re-sélectionner les mêmes fichiers
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onFormSubmit = handleFormSubmit(async (formData) => {
    const data = new FormData();

    // Ajout des données du formulaire
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    // Gestion des images : position basée sur l'ordre dans le tableau
    images.forEach((image, index) => {
      if (image.isExisting && image.existingPicture) {
        // Images existantes : envoi de l'ID et nouvelle position
        data.append(
          `existing_pictures[${index}][id]`,
          image.existingPicture.id.toString()
        );
        data.append(`existing_pictures[${index}][position]`, index.toString());
      } else if (!image.isExisting && image.file) {
        // Nouvelles images : envoi des fichiers
        data.append("pictures[]", image.file);
      }
    });

    // Envoi des IDs des images à supprimer
    deletedPictureIds.forEach((id) => {
      data.append("deleted_pictures[]", id.toString());
    });

    await onSubmit(data);
  });

  return (
    <form onSubmit={onFormSubmit} id={formId}>
      <Stack gap={6}>
        <Box>
          <Heading size="sm" mb={4} color="gray.700">
            Informations générales
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormField
                label="Nom de l'hôtel"
                placeholder="Hôtel Paradise"
                error={errors.name?.message || apiErrors.name?.[0]}
                {...register("name")}
              />
            </GridItem>

            <GridItem>
              <FormField
                label="Prix par nuit (€)"
                type="number"
                placeholder="99.00"
                error={errors.price_per_night?.message || apiErrors.price_per_night?.[0]}
                {...register("price_per_night", { valueAsNumber: true })}
              />
            </GridItem>

            <GridItem>
              <FormField
                label="Capacité maximale"
                type="number"
                placeholder="4"
                error={errors.max_capacity?.message || apiErrors.max_capacity?.[0]}
                {...register("max_capacity", { valueAsNumber: true })}
              />
            </GridItem>

            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormField
                label="Description"
                placeholder="Décrivez votre hôtel..."
                isTextarea
                rows={3}
                error={errors.description?.message || apiErrors.description?.[0]}
                {...register("description")}
              />
            </GridItem>
          </Grid>
        </Box>

        <Box>
          <Heading size="sm" mb={4} color="gray.700">
            Adresse
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormField
                label="Adresse ligne 1"
                placeholder="123 Rue de la Paix"
                error={errors.address1?.message || apiErrors.address1?.[0]}
                {...register("address1")}
              />
            </GridItem>

            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormField
                label="Adresse ligne 2"
                placeholder="Bâtiment A, 3ème étage"
                error={errors.address2?.message || apiErrors.address2?.[0]}
                {...register("address2")}
              />
            </GridItem>

            <GridItem>
              <FormField
                label="Code postal"
                placeholder="75001"
                error={errors.zipcode?.message || apiErrors.zipcode?.[0]}
                {...register("zipcode")}
              />
            </GridItem>

            <GridItem>
              <FormField
                label="Ville"
                placeholder="Paris"
                error={errors.city?.message || apiErrors.city?.[0]}
                {...register("city")}
              />
            </GridItem>

            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormField
                label="Pays"
                placeholder="France"
                error={errors.country?.message || apiErrors.country?.[0]}
                {...register("country")}
              />
            </GridItem>
          </Grid>
        </Box>

        <Box>
          <Heading size="sm" mb={4} color="gray.700">
            Coordonnées GPS
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            <GridItem>
              <FormField
                label="Latitude"
                type="text"
                placeholder="48.8566"
                error={errors.lat?.message || apiErrors.lat?.[0]}
                {...register("lat")}
              />
            </GridItem>

            <GridItem>
              <FormField
                label="Longitude"
                type="text"
                placeholder="2.3522"
                error={errors.lng?.message || apiErrors.lng?.[0]}
                {...register("lng")}
              />
            </GridItem>
          </Grid>
        </Box>

        <Box>
          <Heading size="sm" mb={4} color="gray.700">
            Images
          </Heading>

          {images.length > 0 && (
            <Box mb={4}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={images.map((img) => img.id)}
                  strategy={rectSortingStrategy}
                >
                  <Grid
                    templateColumns="repeat(auto-fill, minmax(120px, 1fr))"
                    gap={3}
                  >
                    {images.map((image, index) => (
                      <SortableImage
                        key={image.id}
                        id={image.id}
                        preview={image.preview}
                        index={index}
                        onRemove={removeImage}
                      />
                    ))}
                  </Grid>
                </SortableContext>
              </DndContext>
            </Box>
          )}

          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              mb={2}
              color={{ base: "gray.700", _dark: "gray.300" }}
            >
              {hotel ? "Ajouter de nouvelles images" : "Ajouter des images"}
            </Text>

            <Box
              borderWidth="2px"
              borderStyle="dashed"
              borderColor={
                isDragging
                  ? "brand.600"
                  : { base: "gray.300", _dark: "gray.600" }
              }
              borderRadius="lg"
              p={8}
              textAlign="center"
              bg={
                isDragging
                  ? { base: "brand.50", _dark: "brand.900/20" }
                  : { base: "gray.50", _dark: "gray.800" }
              }
              transition="all 0.2s"
              cursor="pointer"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              _hover={{
                borderColor: "brand.600",
                bg: { base: "brand.50", _dark: "brand.900/20" },
              }}
            >
              <Input
                ref={fileInputRef}
                type="file"
                name="pictures"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                display="none"
              />

              <VStack gap={2}>
                <Text
                  fontSize="lg"
                  fontWeight="medium"
                  color={{ base: "gray.700", _dark: "gray.300" }}
                >
                  {isDragging
                    ? "Déposez vos images ici"
                    : "Glissez-déposez vos images"}
                </Text>
                <Text
                  fontSize="sm"
                  color={{ base: "gray.500", _dark: "gray.400" }}
                >
                  ou cliquez pour sélectionner
                </Text>
                <Text
                  fontSize="xs"
                  color={{ base: "gray.400", _dark: "gray.500" }}
                >
                  JPEG, PNG, WEBP (max 5MB par image)
                </Text>
              </VStack>
            </Box>
          </Box>
        </Box>
      </Stack>
    </form>
  );
}
