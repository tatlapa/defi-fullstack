"use client";

import { Box, Container, HStack, Button, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuHouse, LuList, LuPlus, LuMoon, LuSun } from "react-icons/lu";
import { useColorMode } from "./ui/color-mode";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const { colorMode, toggleColorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);

  const isActive = (path: string) => {
    if (path === "/hotels") {
      return (
        pathname === "/hotels" ||
        (pathname?.startsWith("/hotels/") && pathname !== "/hotels/edit")
      );
    }
    return pathname === path;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box
      as="header"
      position="fixed"
      top={4}
      left={0}
      right={0}
      zIndex={50}
      px={4}
    >
      <Container maxW="7xl">
        <Box
          bg={{ base: "white/90", _dark: "gray.800/90" }}
          backdropFilter="blur(16px)"
          borderRadius="full"
          borderWidth="1px"
          borderColor={{ base: "gray.200", _dark: "gray.700" }}
          shadow="md"
          px={5}
          py={3}
        >
          <HStack justify="space-between">
            <Link href="/hotels" style={{ textDecoration: "none" }}>
              <Button
                variant="ghost"
                size="sm"
                display={{ base: "flex", sm: "none" }}
                color="blue.600"
              >
                <LuHouse size={20} />
              </Button>
              <Box display={{ base: "none", sm: "block" }}>
                <Box fontWeight="bold" fontSize="xl" color="brand.600">
                  Hotels
                </Box>
                <Box fontSize="xs" color="gray.500">
                  Gestion d&apos;hôtels
                </Box>
              </Box>
            </Link>

            <HStack
              gap={2}
              bg={{ base: "gray.50", _dark: "gray.700" }}
              borderRadius="full"
              px={2}
              py={2}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.600" }}
            >
              <Link href="/hotels" style={{ textDecoration: "none" }}>
                <Button
                  variant={isActive("/hotels") ? "solid" : "ghost"}
                  size="sm"
                  bg={isActive("/hotels") ? "brand.600" : "transparent"}
                  color={
                    isActive("/hotels")
                      ? "white"
                      : { base: "gray.700", _dark: "gray.200" }
                  }
                  borderRadius="full"
                  gap={2}
                  _hover={{
                    bg: isActive("/hotels")
                      ? "brand.700"
                      : { base: "gray.100", _dark: "gray.600" },
                  }}
                  transition="all 0.2s"
                >
                  <LuList size={16} />
                  <Box display={{ base: "none", md: "block" }}>Liste</Box>
                </Button>
              </Link>

              <Link href="/hotels/edit" style={{ textDecoration: "none" }}>
                <Button
                  variant={isActive("/hotels/edit") ? "solid" : "ghost"}
                  size="sm"
                  bg={isActive("/hotels/edit") ? "brand.600" : "transparent"}
                  color={
                    isActive("/hotels/edit")
                      ? "white"
                      : { base: "gray.700", _dark: "gray.200" }
                  }
                  borderRadius="full"
                  gap={2}
                  _hover={{
                    bg: isActive("/hotels/edit")
                      ? "brand.700"
                      : { base: "gray.100", _dark: "gray.600" },
                  }}
                  transition="all 0.2s"
                >
                  <LuPlus size={16} />
                  <Box display={{ base: "none", md: "block" }}>Gestion</Box>
                </Button>
              </Link>
            </HStack>

            <IconButton
              aria-label="Toggle color mode"
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
              ml={2}
              color={{ base: "gray.600", _dark: "gray.300" }}
              _hover={{ bg: { base: "gray.100", _dark: "gray.700" } }}
            >
              {colorMode === "light" ? (
                <LuMoon size={18} />
              ) : (
                <LuSun size={18} />
              )}
            </IconButton>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
}
