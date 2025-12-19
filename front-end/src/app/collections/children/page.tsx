"use client";
import Header from "@/app/components/Header";
import CollectionPage from "@/app/components/CollectionPage";

export const dynamic = "force-dynamic";

export default function ChildrenCollectionPage() {
  return (
    <>
      <Header />
      <CollectionPage
        category="Children"
        title="Children's Collection"
        description="Fun and comfortable clothing for kids"
      />
    </>
  );
}
