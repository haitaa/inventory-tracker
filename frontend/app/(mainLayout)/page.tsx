"use client";
import { redirect } from "next/navigation";

export default function RootRoute() {
  // Ana sayfaya gelenleri dashboard'a yönlendir
  redirect("/dashboard");
}
