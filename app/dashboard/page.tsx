"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const router = useRouter();

  // check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login"); // redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-8">
        <h1 className="text-2xl font-bold text-gray-800">learnisle</h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-600 text-lg">
          
        </p>
      </main>
    </div>
  );
}