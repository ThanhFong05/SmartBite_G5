"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
    Flame,
    Plus,
    Search,
    ChevronDown,
    UtensilsCrossed,
    Beef,
    Coffee,
    Cake,
    Leaf,
    Dumbbell,
    Zap,
    Clock,
} from "lucide-react";

// Types
type BalanceType = "Balanced" | "Moderate" | "Indulgent";
type CategoryType = "Main Course" | "Drinks" | "Dessert" | "Healthy Food" | "All";

interface MenuItem {
    id: string;
    title: string;
    desc: string;
    price: string;
    calories: string;
    time: string;
    rating: number;
    image: string;
    category?: string;
    dietaryBalance?: string;
    aiReview?: {
        summary: string;
        tags: string[];
    };
    ingredients?: any[];
    diets?: string[];
    allergies?: string[];
    flavors?: string[];
    foodstatus?: string;
}

function MenuContent() {
    const [dishes, setDishes] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>((categoryParam as CategoryType) || "All");
    const [selectedBalances, setSelectedBalances] = useState<string[]>([]);
    const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
    const [isPersonalized, setIsPersonalized] = useState(false);

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam as CategoryType);
        }
    }, [categoryParam]);

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            const res = await fetch("/api/dishes");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setDishes(data);
        } catch (error) {
            console.error("Error fetching dishes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleBalance = (balance: string) => {
        setSelectedBalances(cur => cur.includes(balance) ? cur.filter(b => b !== balance) : [...cur, balance]);
    };

    const toggleDiet = (diet: string) => {
        setSelectedDiets(cur => cur.includes(diet) ? cur.filter(b => b !== diet) : [...cur, diet]);
    };

    const toggleAllergy = (allergy: string) => {
        setSelectedAllergies(cur => cur.includes(allergy) ? cur.filter(b => b !== allergy) : [...cur, allergy]);
    };

    const toggleFlavor = (flavor: string) => {
        setSelectedFlavors(cur => cur.includes(flavor) ? cur.filter(b => b !== flavor) : [...cur, flavor]);
    };

    const filteredItems = dishes.filter((item) => {
        const itemCategory = item.category || "Food";
        const itemBalance = item.dietaryBalance || "Balanced";

        const matchCategory = selectedCategory === "All" ||
            itemCategory === selectedCategory ||
            (selectedCategory === "Main Course" && (itemCategory === "Food" || itemCategory === "main-course")) ||
            (selectedCategory === "Drinks" && itemCategory === "drinks") ||
            (selectedCategory === "Dessert" && itemCategory === "dessert") ||
            (selectedCategory === "Healthy Food" && (itemCategory === "healthy-food" || itemCategory === "Healthy Food"));
        const matchBalance = selectedBalances.length === 0 || selectedBalances.includes(itemBalance);

        const matchDiets = selectedDiets.length === 0 || selectedDiets.some(d => item.diets?.includes(d));
        // For allergies, typical logic is "Exclude if it contains selected allergy"
        const matchAllergies = selectedAllergies.length === 0 || !selectedAllergies.some(a => item.allergies?.includes(a));
        const matchFlavors = selectedFlavors.length === 0 || selectedFlavors.some(f => item.flavors?.includes(f));

        // Mock personalized logic (e.g., must be Food and < 600 calories)
        let matchPersonalized = true;
        if (isPersonalized) {
            const cals = parseInt((item.calories || "0").replace(/\D/g, '')) || 0;
            matchPersonalized = itemCategory === "Food" && cals > 0 && cals < 600;
        }

        // Filter out Unavailable dishes
        if (item.foodstatus === "Unavailable") return false;

        return matchCategory && matchBalance && matchDiets && matchAllergies && matchFlavors && matchPersonalized;
    });

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans">
            <Navbar />

            {/* Search Header */}
            <div className="bg-white border-b sticky top-16 z-30 shadow-sm hidden md:block">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 w-full max-w-md bg-gray-50 rounded-full px-4 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                        <Search className="w-5 h-5" />
                        <input type="text" placeholder="Find something high protein..." className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder:text-gray-400" />
                        <Zap className="w-4 h-4 text-orange-500" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">

                {/* LEFT SIDEBAR */}
                <div className="w-full lg:w-72 flex-shrink-0 space-y-8">
                    {/* Nutrition Goals Widget */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4 text-orange-600 font-bold tracking-wide text-[10px] uppercase">
                            <Dumbbell className="w-3 h-3" />
                            My Nutrition Goals
                        </div>

                        <div className="mb-2 flex justify-between items-end">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Calories Left</span>
                            <span className="text-3xl font-bold text-gray-900 leading-none">650 <span className="text-xs font-medium text-gray-400">kcal</span></span>
                        </div>

                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 w-[65%]" />
                        </div>

                        <div className="flex justify-between text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                            <span>1350 consumed</span>
                            <span>Goal: 2000</span>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold ${selectedCategory === "All"
                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                                    : "bg-white text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-100"
                                    }`}
                            >
                                <UtensilsCrossed className="w-5 h-5" />
                                <span>All Menu</span>
                            </button>

                            <button
                                onClick={() => setSelectedCategory("Main Course")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${selectedCategory === "Main Course"
                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Beef className="w-5 h-5" />
                                <span>Main Course</span>
                            </button>

                            <button
                                onClick={() => setSelectedCategory("Drinks")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${selectedCategory === "Drinks"
                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Coffee className="w-5 h-5" />
                                <span>Drinks</span>
                            </button>

                            <button
                                onClick={() => setSelectedCategory("Dessert")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${selectedCategory === "Dessert"
                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Cake className="w-5 h-5" />
                                <span>Dessert</span>
                            </button>

                            <button
                                onClick={() => setSelectedCategory("Healthy Food")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${selectedCategory === "Healthy Food"
                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Leaf className="w-5 h-5" />
                                <span>Healthy Food</span>
                            </button>
                        </div>
                    </div>

                    {/* Expandable Filters */}
                    <Accordion type="multiple" defaultValue={["balance", "diet"]} className="space-y-4">
                        <AccordionItem value="balance" className="bg-white rounded-2xl border border-gray-100 px-4 overflow-hidden">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <span className="text-base font-bold text-gray-900">Dietary Balance</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 space-y-3">
                                {["Balanced", "Moderate", "Indulgent"].map((type) => (
                                    <div key={type} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleBalance(type)}>
                                        <Checkbox
                                            id={`balance-${type}`}
                                            checked={selectedBalances.includes(type)}
                                            onCheckedChange={() => toggleBalance(type)}
                                            className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 border-gray-200 w-5 h-5 rounded-md transition-all"
                                        />
                                        <label
                                            htmlFor={`balance-${type}`}
                                            className="text-gray-500 font-medium group-hover:text-orange-500 transition-colors cursor-pointer select-none flex-1"
                                        >
                                            {type}
                                        </label>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="diet" className="bg-white rounded-2xl border border-gray-100 px-4 overflow-hidden">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <span className="text-base font-bold text-gray-900">Diet</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 space-y-3">
                                {["Vegan", "Keto", "Low-carb", "Eat Clean"].map((type) => (
                                    <div key={type} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleDiet(type)}>
                                        <Checkbox
                                            id={`diet-${type}`}
                                            checked={selectedDiets.includes(type)}
                                            onCheckedChange={() => toggleDiet(type)}
                                            className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 border-gray-200 w-5 h-5 rounded-md transition-all"
                                        />
                                        <label
                                            htmlFor={`diet-${type}`}
                                            className="text-gray-500 font-medium group-hover:text-orange-500 transition-colors cursor-pointer select-none flex-1"
                                        >
                                            {type}
                                        </label>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="allergies" className="bg-white rounded-2xl border border-gray-100 px-4 overflow-hidden">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <span className="text-base font-bold text-gray-900">Exclude Allergies</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 space-y-3">
                                {["Seafood", "Peanut", "Milk", "Egg", "Gluten", "Soy", "Wheat", "Nuts"].map((type) => (
                                    <div key={type} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleAllergy(type)}>
                                        <Checkbox
                                            id={`allergy-${type}`}
                                            checked={selectedAllergies.includes(type)}
                                            onCheckedChange={() => toggleAllergy(type)}
                                            className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 border-gray-200 w-5 h-5 rounded-md transition-all"
                                        />
                                        <label
                                            htmlFor={`allergy-${type}`}
                                            className="text-gray-500 font-medium group-hover:text-red-500 transition-colors cursor-pointer select-none flex-1"
                                        >
                                            {type}
                                        </label>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="flavor" className="bg-white rounded-2xl border border-gray-100 px-4 overflow-hidden">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <span className="text-base font-bold text-gray-900">Flavor</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 flex flex-wrap gap-2">
                                {["Sweet", "Sour", "Spicy", "Salty", "Bitter"].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => toggleFlavor(type)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedFlavors.includes(type) ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-bold text-gray-900">Recommended for You</h2>
                                <button
                                    onClick={() => setIsPersonalized(!isPersonalized)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isPersonalized ? 'bg-orange-500' : 'bg-gray-200'}`}
                                >
                                    <span className="sr-only">Enable personalization</span>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPersonalized ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <span className="text-sm font-bold text-orange-600 tracking-wide uppercase">Especially for you</span>
                            </div>
                            <p className="text-gray-500 mt-1">Please choose your food and place your order now!</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sort by:</span>
                            <button className="flex items-center gap-1 font-bold text-gray-900 hover:text-orange-500 transition-colors text-sm">
                                Relevance <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading your menu...</p>
                        </div>
                    )}

                    {/* Grid */}
                    {!isLoading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map((item) => (
                                <Link href={`/dishes/${item.id}`} key={item.id} className="block group h-full">
                                    <Card className={`h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-[2rem] flex flex-col ${item.foodstatus === "Out of Stock" ? "grayscale opacity-60 relative after:absolute after:inset-0 after:bg-white/20 after:z-10" : ""}`}>
                                        {/* Image Area */}
                                        <div className="relative aspect-[5/4] bg-gray-100 overflow-hidden">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                                    <UtensilsCrossed className="w-12 h-12" />
                                                </div>
                                            )}

                                            {/* Top Tag - Using status or first AI tag */}
                                            {item.foodstatus === "Out of Stock" ? (
                                                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md z-10 uppercase tracking-wide">
                                                    <Clock className="w-3 h-3 fill-current" />
                                                    Hết hàng
                                                </div>
                                            ) : item.aiReview?.tags && item.aiReview.tags.length > 0 && (
                                                <div className={`absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-10 uppercase tracking-wide`}>
                                                    <Zap className="w-3 h-3 fill-current" />
                                                    {item.aiReview.tags[0]}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <CardContent className="p-6 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1 leading-tight">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md flex-shrink-0">
                                                    <span className="text-orange-500 text-[10px]">★</span>
                                                    <span className="text-[10px] font-bold text-gray-700">{item.rating}</span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                                                {item.desc}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-2 mb-5">
                                                <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-[10px] font-bold">
                                                    <Flame className="w-3 h-3" />
                                                    {item.calories}
                                                </div>
                                                {item.time && (
                                                    <div className="flex items-center gap-1.5 bg-gray-50 text-gray-500 px-2 py-1 rounded-md text-[10px] font-medium">
                                                        <Clock className="w-3 h-3" />
                                                        {item.time}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-50">
                                                <div className="font-bold text-xl text-orange-600">{item.price}</div>
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    disabled={item.foodstatus === "Out of Stock"}
                                                    className={`h-10 w-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm group-hover:shadow-md ${item.foodstatus === "Out of Stock" ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                <Search className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                {dishes.length === 0
                                    ? " The menu is currently empty. Visit the Admin Panel to add new dishes."
                                    : "We couldn't find any items matching your filters."}
                            </p>
                            {dishes.length > 0 && (
                                <Button
                                    onClick={() => { setSelectedCategory("All"); setSelectedBalances([]) }}
                                    className="rounded-full px-8 bg-black text-white hover:bg-gray-800"
                                >
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default function MenuPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        }>
            <MenuContent />
        </Suspense>
    );
}
