export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen w-screen bg-linearGradient overflow-y-hidden overflow-x-hidden sm:py-20 relative">
      <div className="w-full h-full sm:flex items-center justify-center">
        <div className="bg-[#FFFFFF42] w-auto shadow-lg h-fit rounded-none sm:rounded-[20px] 2xl:pl-[4.313rem] 2xl:pr-[4.313rem] 2xl:pb-[5rem] 2xl:pt-[2rem] px-5 sm:px-10 py-8">
          {children}
        </div>
      </div>
    </section>
  );
}