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
        title="Эрэгтэйчүүдийн цуглуулга"
        description="Эрэгтэйчүүдийн шинэ хувцаслалтын цуглуулга"
      />
    </>
  );
}
