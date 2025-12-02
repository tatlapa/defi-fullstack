"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/hotels"); // redirige automatiquement vers la liste des hôtels
  }, [router]);
}
