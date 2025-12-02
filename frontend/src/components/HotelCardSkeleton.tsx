import { Card, Skeleton, SkeletonText } from "@chakra-ui/react";

export default function HotelCardSkeleton() {
  return (
    <Card.Root shadow="sm">
      <Skeleton h="200px" w="100%" />
      <Card.Body>
        <SkeletonText noOfLines={1} mb={3} />
        <SkeletonText noOfLines={2} mb={2} />
        <SkeletonText noOfLines={1} w="60%" />
      </Card.Body>
    </Card.Root>
  );
}
