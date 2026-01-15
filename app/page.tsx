import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full max-w-7xl m-auto">
      <Header isLoggedIn={true} creditAmount={100} userName="John Doe" />
    </main>
  );
}
