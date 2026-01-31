"use client";

import Link from "next/link"
import { ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check initial state
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    };
    checkAuth();

    // Listen for custom auth events
    window.addEventListener("authChange", checkAuth);
    // Also listen for storage events in case of cross-tab changes (though simpler logic here mostly relies on same-tab)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    // Dispatch event to notify other components if needed
    window.dispatchEvent(new Event("authChange"));
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-white p-1 rounded-lg">
            {/* Using a simple Shield/Fire icon placeholder or similar */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 fill-current"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900">SmartBite</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-primary transition-colors  ">
            Home
          </Link>
          <Link href="/menu" className="hover:text-primary transition-colors">
            Menu
          </Link>
          <Link href="/ai-advisor" className="hover:text-primary transition-colors">
            AI Advisor
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="ghost" className="text-sm font-medium text-gray-600 hover:text-primary gap-2">
                  <User className="h-5 w-5" />
                  Profile
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-sm font-medium text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Log out
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-sm font-medium text-gray-600 hover:text-primary hidden sm:inline-flex">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="rounded-full px-6 font-semibold">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
