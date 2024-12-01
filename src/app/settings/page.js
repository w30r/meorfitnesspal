import { Bell, ChevronLeft, ChevronRight, Equal } from "lucide-react";

export default function Settings() {
  return (
    <div className="bg-white h-screen w-screen overflow-auto text-black/75 text-sm font-semibold py-12 px-8">
      <div className="bg-white/30 text-black font-semibold z-10 absolute top-0 backdrop-blur-md left-0  w-full h-[80px] p-4  flex justify-between items-center mb-8">
        <Equal strokeWidth={1.75} size={20} />
        <div className="flex justify-center items-center gap-2">
          <ChevronLeft strokeWidth={1.75} size={20} />
          <p className="text-xs">Today</p>
          <ChevronRight strokeWidth={1.75} size={20} />
        </div>
        <Bell strokeWidth={1.75} size={20} />
      </div>
    </div>
  );
}
