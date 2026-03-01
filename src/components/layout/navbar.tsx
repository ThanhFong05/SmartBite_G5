"use client";

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, User, ReceiptText, History, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");

  // Helper to get initials (e.g., "Thanh Phong" -> "TP")
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    // Check initial state
    const checkAuth = async () => {
      let userStr = localStorage.getItem("user");

      if (!userStr) {
        // Nếu không có trong local storage, thử kiểm tra session của Supabase (dành cho OAuth Google/Facebook)
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Lấy metadata từ OAuth
            const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "User";
            const newUserObj = {
              userid: user.id,
              fullname: name,
              email: user.email,
              role: 'user',
            };
            localStorage.setItem("user", JSON.stringify(newUserObj));
            userStr = JSON.stringify(newUserObj);
          }
        } catch (e) {
          console.error("Lỗi khi fetch Supabase User:", e);
        }
      }

      if (userStr) {
        setIsLoggedIn(true);
        try {
          const user = JSON.parse(userStr);
          const name = user.fullname || user.FullName || user.name || "User";
          setUserName(name);
        } catch (e) {
          // fallback
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    const checkCart = async () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const userId = user.UserId || user.userid || user.id;
          if (userId) {
            const res = await fetch(`/api/cart?userId=${userId}`);
            if (res.ok) {
              const data = await res.json();
              const items = data.items || [];
              // Ép kiểu quantity về số để tránh nối chuỗi
              const count = items.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0);

              setCartCount(count);
              return;
            }
          }
        } catch (e) {
          console.error("Lỗi khi fetch giỏ hàng Navbar:", e);
        }
      }
      setCartCount(0);
    };

    const checkActiveOrder = async () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const userId = user.UserId || user.userid || user.id;
          if (userId) {
            const res = await fetch(`/api/orders?userid=${userId}`);
            if (res.ok) {
              const data = await res.json();
              const orders = data.orders || [];
              // Tìm đơn hàng mới nhất chưa hoàn thành (status < 5)
              const activeOrder = orders.find((o: any) => Number(o.orderstatus) < 5);
              if (activeOrder) {
                setActiveOrderId(activeOrder.orderid);
              } else {
                setActiveOrderId(null);
              }
            }
          }
        } catch (e) {
          console.error("Lỗi khi fetch active order Navbar:", e);
        }
      }
    };

    checkAuth();
    checkCart();
    checkActiveOrder();

    // Listen for custom auth events
    window.addEventListener("authChange", checkAuth);
    window.addEventListener("cartUpdate", checkCart);
    window.addEventListener("orderUpdate", checkActiveOrder);
    // Also listen for storage events in case of cross-tab changes
    window.addEventListener("storage", () => {
      checkAuth();
      checkCart();
      checkActiveOrder();
    });

    return () => {
      window.removeEventListener("authChange", checkAuth);
      window.removeEventListener("cartUpdate", checkCart);
      window.removeEventListener("orderUpdate", checkActiveOrder);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Lỗi khi đăng xuất khỏi server:', error);
    }
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    // Dispatch event to notify other components if needed
    window.dispatchEvent(new Event("authChange"));
    router.push('/'); // hoặc router.push('/auth/login')
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="SmartBite Logo"
            width={56}
            height={56}
            className="rounded-full object-contain"
          />
          <span className="text-2xl font-bold text-primary">SmartBite</span>
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
          {isLoggedIn && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-primary relative"
                title="My Orders"
                onClick={() => {
                  if (activeOrderId) {
                    router.push(`/order/${activeOrderId}`);
                  } else {
                    router.push('/profile/history');
                  }
                }}
              >
                <ReceiptText className="h-5 w-5" />
                {activeOrderId && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500 border border-white"></span>
                )}
              </Button>

              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </>
          )}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 p-0 rounded-full border border-gray-200 bg-gray-50 focus-visible:ring-0">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                    {getInitials(userName)}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-gray-900">{userName}</p>
                    <p className="text-xs leading-none text-gray-500">SmartBite User</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4 text-gray-500" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/history" className="cursor-pointer flex items-center">
                    <History className="mr-2 h-4 w-4 text-gray-500" />
                    <span>History & Calories</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
