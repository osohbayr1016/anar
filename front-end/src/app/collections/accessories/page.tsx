"use client";
import Header from "@/app/components/Header";
import CollectionPage from "@/app/components/CollectionPage";

export const dynamic = "force-dynamic";

export default function AccessoriesCollectionPage() {
  return (
    <>
      <Header />
      <CollectionPage
        category="Accessories"
        title="Accessories Collection"
        description="Complete your look with our stylish accessories"
      />
    </>
  );
}
