export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-10 py-6 overflow-x-auto">
      <div className="max-w-screen-xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}