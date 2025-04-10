"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white px-12 py-16 rounded-2xl shadow-lg text-center w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Real-time GS</h1>
        <p className="text-lg text-gray-600 mb-8">Connect your Google Sheets seamlessly.</p>

        <div className="flex space-x-6 justify-center">
       
            Login
     
         
            Register
         
        </div>
      </div>
    </div>
  );
}
