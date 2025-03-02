import "@/css/loading.css";

export function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-transparent border-t-yellow-500 border-r-yellow-500 rounded-full animate-spin-clockwise"></div>
        <div className="absolute inset-2 border-4 border-transparent border-b-white border-l-white rounded-full animate-spin-counterclockwise"></div>
      </div>
    </div>
  );
}