"use client";

import { useState, useRef } from "react";
import { Hotel, HotelsPicture } from "@/types";
import {
  Box,
  Field,
  Input,
  Stack,
  VStack,
  Textarea,
  Heading,
  Grid,
  GridItem,
  Image,
  IconButton,
  Text,
} from "@chakra-ui/react";
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

interface ImageItem {
  id: string;
  preview: string;
  isExisting: boolean;
  file?: File;
  existingPicture?: HotelsPicture;
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

export default function HotelForm({ hotel, formId, onSubmit }: HotelFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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
  const [deletedPictureIds, setDeletedPictureIds] = useState<number[]>([]);

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
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      addFiles(files);
    }
  };

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

    if (imageToRemove.isExisting && imageToRemove.existingPicture) {
      setDeletedPictureIds([...deletedPictureIds, imageToRemove.existingPicture.id]);
    } else if (!imageToRemove.isExisting) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    setImages(images.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value as string);
    });

    images.forEach((image, index) => {
      if (image.isExisting && image.existingPicture) {
        data.append(`existing_pictures[${index}][id]`, image.existingPicture.id.toString());
        data.append(`existing_pictures[${index}][position]`, index.toString());
      } else if (!image.isExisting && image.file) {
        data.append("pictures[]", image.file);
      }
    });

    deletedPictureIds.forEach((id) => {
      data.append("deleted_pictures[]", id.toString());
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
            <Text fontSize="sm" fontWeight="medium" mb={2} color={{ base: "gray.700", _dark: "gray.300" }}>
              {hotel ? "Ajouter de nouvelles images" : "Ajouter des images"}
            </Text>

            <Box
              borderWidth="2px"
              borderStyle="dashed"
              borderColor={isDragging ? "brand.600" : { base: "gray.300", _dark: "gray.600" }}
              borderRadius="lg"
              p={8}
              textAlign="center"
              bg={isDragging ? { base: "brand.50", _dark: "brand.900/20" } : { base: "gray.50", _dark: "gray.800" }}
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
                <Text fontSize="lg" fontWeight="medium" color={{ base: "gray.700", _dark: "gray.300" }}>
                  {isDragging ? "Déposez vos images ici" : "Glissez-déposez vos images"}
                </Text>
                <Text fontSize="sm" color={{ base: "gray.500", _dark: "gray.400" }}>
                  ou cliquez pour sélectionner
                </Text>
                <Text fontSize="xs" color={{ base: "gray.400", _dark: "gray.500" }}>
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
