import Sidebar from "./components/Sidebar";

export default function DashboardLayout({
  children
}) {
  return (
    <div>
      <main className="flex h-[86vh] min-h-[86vh]">
        <Sidebar />
        <section className="bg-slate-100 w-[calc(100vw-280px)] p-10 overflow-y-auto">
          {children}
        </section>
      </main>
    </div>
  );
}
