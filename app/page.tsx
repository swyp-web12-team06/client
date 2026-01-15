import Searching from "@/components/Searching";
import Gallery from "@/components/Gallery";
import Lookbook from "@/components/Lookbook";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const view = resolvedSearchParams.view || "lookbook";

  return (
    <main>
      <Searching />
      {view === "gallery" ? <Gallery /> : <Lookbook />}
    </main>
  );
}
