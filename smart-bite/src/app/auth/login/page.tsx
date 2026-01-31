"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login
        localStorage.setItem("user", JSON.stringify({ name: "User" }));
        // Dispatch event for other components to update
        window.dispatchEvent(new Event("authChange"));
        console.log("Login submitted, redirecting...");
        router.push("/");
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FFF8F3] p-4 lg:p-8">
            {/* Main Container Card */}
            <div className="flex w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-xl lg:flex-row flex-col">

                {/* Left Section - Image & Branding */}
                <div className="relative w-full lg:w-1/2 p-12 bg-orange-50 flex flex-col items-center justify-center text-center">
                    {/* Background Gradient Effect - subtle orange glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-transparent"></div>

                    <div className="relative z-10 w-full max-w-md space-y-8">
                        <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-lg border-4 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Healthy Food Bowl"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Eat well, live well <br />
                                <span className="text-orange-500">every day.</span>
                            </h2>
                            <p className="text-gray-600">
                                Login to receive personalized AI menus and track your nutrition today.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section - Login Form */}
                <div className="flex w-full lg:w-1/2 flex-col justify-center p-12 lg:p-16 relative">
                    <div className="mx-auto w-full max-w-md space-y-8">

                        <div className="space-y-2">
                            <div className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600 uppercase tracking-wide">
                                Welcome Back
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Login</h1>
                            <p className="text-gray-500 text-sm">
                                Don't have an account? <Link href="/auth/register" className="font-medium text-orange-500 hover:underline">Sign up for free</Link>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email or Phone Number</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input placeholder="Name@example.com" className="pl-10 h-12 bg-gray-50 border-gray-200" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Password</label>
                                    <Link href="#" className="text-xs font-medium text-orange-500 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg font-medium shadow-orange-200 shadow-lg">
                                Login
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-12 border-gray-200 hover:bg-gray-50 bg-white text-gray-700">
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline" className="h-12 border-gray-200 hover:bg-gray-50 bg-white text-gray-700">
                                <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 right-8 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm text-sm lg:flex hidden">
                <div className="h-4 w-4 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-[8px] text-white">🌙</span>
                </div>
            </div>

            <div className="absolute bottom-4 text-center text-xs text-gray-500 w-full lg:hidden">
                © 2024 SmartBite. All rights reserved.
            </div>
        </div>
    );
}
