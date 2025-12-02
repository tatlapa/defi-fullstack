"use client"

import { ChakraProvider, Box } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { system } from "@/theme"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props}>
        <Box bg="bg.canvas" minH="100vh">
          {props.children}
        </Box>
      </ColorModeProvider>
    </ChakraProvider>
  )
}
