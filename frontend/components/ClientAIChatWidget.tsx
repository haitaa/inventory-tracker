"use client";

import dynamic from "next/dynamic";

// Client tarafında yüklenecek AIChatWidget
const AIChatWidget = dynamic(() => import("@/components/AIChatWidget"), {
  ssr: false,
});

export default function ClientAIChatWidget() {
  return <AIChatWidget />;
}
