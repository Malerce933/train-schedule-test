"use client"; 

import AuthForm from "@/components/AuthForm";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams(); 
  const formMode: "login" | "signup" = (searchParams?.get("mode") as "login" | "signup") ?? "login"; 

  return <AuthForm mode={formMode} />;
}
