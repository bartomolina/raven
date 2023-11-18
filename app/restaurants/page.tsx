"use client";

import { Page } from "konsta/react";

import { Navigation } from "@/ui/layout";

export default function Restaurants() {
  return (
    <Page>
      <Navigation activeTab="restaurants" />
    </Page>
  );
}
