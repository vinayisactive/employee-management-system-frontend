import { ReactNode } from "react";
import Navbar from "./navbar";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-900 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
