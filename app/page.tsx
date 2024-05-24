"use client"
import Main from "@/components/pages/main";
import ProtectedRoute from "@/utils/protectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <Main />
    </ProtectedRoute>
  )
}
