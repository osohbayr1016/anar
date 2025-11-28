"use client";
import Header from "@/app/components/Header";
import CollectionPage from "@/app/components/CollectionPage";

export const dynamic = "force-dynamic";

export default function FemaleCollectionPage() {
  return (
    <>
      <Header />
      <CollectionPage
        category="Female"
        title="Эмэгтэйчүүдийн цуглуулга"
        description="Эмэгтэйчүүдийн гоё сайхан хувцаслалт"
      />
    </>
  );
}
