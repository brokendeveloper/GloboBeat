"use client";

import { Button, HStack } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <HStack>
        <Button colorScheme="teal" size="lg">
          Comprar
        </Button>
        <Button colorScheme="brand" variant="outline">
          Custom Brand
        </Button>
      </HStack>
    </main>
  );
}

