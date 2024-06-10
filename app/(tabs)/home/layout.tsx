import TabBar from "@/components/tab-bar";

export default function ProductsLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
      {/* <TabBar /> */}
    </>
  );
}
