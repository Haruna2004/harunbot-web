export default function PageLayout({ children }) {
  return (
    <div className="flex h-screen">
      <div>{/* <LeftSidebar /> */}</div>
      <div className="flex-1 flex flex-col h-screen">{children}</div>
    </div>
  );
}
