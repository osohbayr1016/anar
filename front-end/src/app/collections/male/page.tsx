"use client";
import Header from "@/app/components/Header";
import CollectionPage from "@/app/components/CollectionPage";

export const dynamic = "force-dynamic";

export default function MaleCollectionPage() {
  return (
    <>
      <Header />
      <CollectionPage
        category="Male"
        title="Men's Collection"
        description="Discover our latest collection of men's fashion"
      />
    </>
  );
}
