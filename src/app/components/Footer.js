import {
  ChartColumnDecreasing,
  CircleUser,
  House,
  NotebookPen,
  Plus,
} from "lucide-react";

export default function Footer() {
  return (
    <div
      id="FOOTER"
      className="bg-white/1 backdrop-blur-sm absolute bottom-0 left-0 w-full h-[70px] flex justify-around items-center"
    >
      <House color="#1671e8" />
      <NotebookPen color="#1671e8" />
      <div className="bg-[#197cff] rounded-lg w-[50px] h-[50px] flex justify-center items-center">
        <Plus size={30} color="white" />
      </div>
      <ChartColumnDecreasing color="#1671e8" />
      <CircleUser color="#1671e8" />
    </div>
  );
}
