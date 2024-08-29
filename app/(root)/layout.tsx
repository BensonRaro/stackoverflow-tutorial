import Header from "@/components/navigation/Header";
import LeftSidebar from "@/components/navigation/LeftSidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative background-light850_dark100">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <section className="flex max-h-screen flex-1 flex-col px-6 pb-6 pt-32 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        RightSidebar
      </div>
    </div>
  );
};

export default RootLayout;
