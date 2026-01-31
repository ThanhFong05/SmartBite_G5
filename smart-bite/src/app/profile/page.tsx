"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Sparkles, MessageCircle } from "lucide-react";

export default function ProfilePage() {
    const [gender, setGender] = useState<"male" | "female">("male");
    const [activityLevel, setActivityLevel] = useState("moderate");
    const [goal, setGoal] = useState<"loss" | "maintain" | "gain">("maintain");
    const [diets, setDiets] = useState<string[]>(["Keto"]);
    const [allergies, setAllergies] = useState<string[]>([]);

    const toggleDiet = (item: string) => {
        if (diets.includes(item)) {
            setDiets(diets.filter(i => i !== item));
        } else {
            setDiets([...diets, item]);
        }
    };

    const toggleAllergy = (item: string) => {
        if (allergies.includes(item)) {
            setAllergies(allergies.filter(i => i !== item));
        } else {
            setAllergies([...allergies, item]);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="container mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI Powered
                        </span>
                        <span className="text-gray-500 text-sm font-medium tracking-wide">PROFILE SETUP</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Profile & Health Stats</h1>
                    <p className="text-gray-500 max-w-3xl">
                        Provide your health information so SmartBite&apos;s AI can design the optimal nutrition menu just for you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Form */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. Basic Info */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                    <span className="text-sm font-bold">👤</span>
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
                            </div>

                            <div className="space-y-6">
                                {/* Gender */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600 block">Gender</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setGender("male")}
                                            className={`relative flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${gender === "male"
                                                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                                                }`}
                                        >
                                            <span>♂ Male</span>
                                            {gender === "male" && <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-r-[12px] border-t-orange-500 border-r-transparent rounded-tl-sm transform rotate-0" />}
                                        </button>
                                        <button
                                            onClick={() => setGender("female")}
                                            className={`relative flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${gender === "female"
                                                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                                                }`}
                                        >
                                            <span>♀ Female</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Height & Weight */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-600 block">Height (cm)</label>
                                        <Input defaultValue="170" className="h-12 text-lg active:ring-orange-500 focus-visible:ring-orange-500 border-gray-200 bg-gray-50/30" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-600 block">Weight (kg)</label>
                                        <Input defaultValue="65" className="h-12 text-lg active:ring-orange-500 focus-visible:ring-orange-500 border-gray-200 bg-gray-50/30" />
                                    </div>
                                </div>

                                {/* Year & Activity */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-600 block">Year of Birth</label>
                                        <Input defaultValue="1995" className="h-12 text-lg active:ring-orange-500 focus-visible:ring-orange-500 border-gray-200 bg-gray-50/30" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-600 block">Activity Level</label>
                                        <div className="relative">
                                            <select
                                                value={activityLevel}
                                                onChange={(e) => setActivityLevel(e.target.value)}
                                                className="w-full h-12 pl-3 pr-10 text-base border border-gray-200 rounded-lg bg-gray-50/30 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                            >
                                                <option value="sedentary">Sedentary</option>
                                                <option value="moderate">Moderate (1-3 days/week)</option>
                                                <option value="active">Active (3-5 days/week)</option>
                                                <option value="athlete">Athlete</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Goals */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                    <span className="text-sm font-bold">🎯</span>
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Your Goals</h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                {[
                                    { id: "loss", title: "Weight Loss", desc: "Lose fat, gain muscle", icon: "📉" },
                                    { id: "maintain", title: "Maintain", desc: "Healthy, balanced", icon: "⚖️" },
                                    { id: "gain", title: "Muscle Gain", desc: "Build strength", icon: "💪" },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setGoal(item.id as any)}
                                        className={`relative p-4 rounded-xl border transition-all text-center h-full flex flex-col items-center justify-center gap-2 ${goal === item.id
                                            ? "border-orange-500 bg-orange-50/50 ring-1 ring-orange-500"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                            }`}
                                    >
                                        {goal === item.id && (
                                            <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full" />
                                        )}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 text-xl ${goal === item.id ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                                            <div className="text-xs text-gray-500 line-clamp-1">{item.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Diet & Allergies */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                    <span className="text-sm font-bold">🚫</span>
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Diet & Allergies</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-600 block mb-3">Special Diet</label>
                                    <div className="flex flex-wrap gap-2">
                                        {["Vegan", "Vegetarian", "Keto", "Low-carb", "Eat Clean"].map(item => (
                                            <button
                                                key={item}
                                                onClick={() => toggleDiet(item)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${diets.includes(item)
                                                    ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600 block mb-3">Food Allergies</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {["Seafood", "Peanut", "Milk", "Egg", "Gluten", "Soy", "Wheat", "Nuts"].map(item => (
                                            <button
                                                key={item}
                                                onClick={() => toggleAllergy(item)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${allergies.includes(item)
                                                    ? "border-red-200 bg-red-50 text-red-700 font-medium"
                                                    : "border-gray-100 bg-gray-50/50 text-gray-600 hover:bg-gray-100"
                                                    }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${allergies.includes(item) ? "border-red-500 bg-white" : "border-gray-300"}`}>
                                                    {allergies.includes(item) && <div className="w-2 h-2 rounded-full bg-red-500" />}
                                                </div>
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end items-center gap-4 pt-4">
                            <Button variant="ghost" className="text-gray-500 hover:text-gray-900 font-medium px-6">
                                Skip
                            </Button>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-6 text-base font-bold shadow-lg shadow-orange-500/20">
                                Create AI Menu →
                            </Button>
                        </div>

                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* AI Stats Card */}
                        <div className="bg-[#FFF8F3] rounded-2xl p-6 border border-orange-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">SmartBite AI</h3>
                                    <div className="text-xs text-orange-600 font-medium animate-pulse">Analyzing data...</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* BMI */}
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-50/50">
                                    <div className="text-sm text-gray-500 mb-1">Estimated BMI</div>
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-3xl font-extrabold text-gray-900">22.5</span>
                                        <span className="text-sm font-semibold text-green-500 mb-1.5">Normal</span>
                                    </div>
                                    {/* Fake Progress Bar */}
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                                        <div className="w-[60%] h-full bg-green-500 rounded-full" />
                                    </div>
                                </div>

                                {/* Kal */}
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-50/50">
                                    <div className="text-sm text-gray-500 mb-1">Recommended Calories / day</div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-extrabold text-orange-500">~2,100</span>
                                        <span className="text-sm font-medium text-gray-400 mb-1.5">kcal</span>
                                    </div>
                                </div>

                                {/* Nutrition Dist */}
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-50/50">
                                    <div className="text-sm text-gray-500 mb-3">Nutrition Distribution</div>
                                    <div className="grid grid-cols-3 gap-2 h-16 items-end">
                                        <div className="space-y-1 text-center">
                                            <div className="w-full bg-red-100 rounded-t-sm h-10 relative group">
                                                <div className="absolute inset-0 bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm" />
                                            </div>
                                            <div className="text-[10px] font-medium text-gray-500">Protein</div>
                                        </div>
                                        <div className="space-y-1 text-center">
                                            <div className="w-full bg-yellow-100 rounded-t-sm h-14 relative group">
                                                <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm" />
                                                {/* Active state simulation */}
                                                <div className="absolute inset-x-0 bottom-0 top-6 bg-yellow-400 rounded-t-sm" />
                                            </div>
                                            <div className="text-[10px] font-medium text-gray-900 font-bold">Carbs</div>
                                        </div>
                                        <div className="space-y-1 text-center">
                                            <div className="w-full bg-blue-100 rounded-t-sm h-8 relative group">
                                                <div className="absolute inset-0 bg-blue-200 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm" />
                                                <div className="absolute inset-x-0 bottom-0 top-4 bg-blue-400 rounded-t-sm" />
                                            </div>
                                            <div className="text-[10px] font-medium text-gray-500">Fat</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm mb-1">Need Support?</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                        Our nutrition experts are always ready to help.
                                    </p>
                                    <button className="text-sm font-bold text-orange-500 hover:text-orange-600 hover:underline">
                                        Chat Now
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
