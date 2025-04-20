
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 200)
    }
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])
  
  if (!visible) return null
  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-16 left-6 z-50 size-10 rounded-full bg-indigo-600 text-white p-3 shadow-lg hover:bg-indigo-700 transition"
      aria-label="Scroll to top"
    >
      <ArrowUp /> 
    </Button>
  );
}