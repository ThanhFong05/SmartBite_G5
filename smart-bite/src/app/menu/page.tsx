"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
    Clock,
    Flame,
    Plus,
    Search,
    ChevronDown,
    UtensilsCrossed,
    Coffee,
    IceCream,
    Leaf,
    Dumbbell,
    Zap,
    Filter,
    ArrowRight
} from "lucide-react";

// Types
type BalanceType = "Balanced" | "Moderate" | "Indulgent";
type CategoryType = "Food" | "Drink" | "Dessert";

interface MenuItem {
    id: string;
    title: string;
    description: string;
    price: string;
    calories: string;
    time: string;
    rating: number;
    image: string;
    balance: BalanceType;
    category: CategoryType;
    tag?: string;
    tagColor?: string;
    protein?: string;
}

// Extended Sample Data
const menuItems: MenuItem[] = [
    {
        id: "1",
        title: "Citrus Glazed Salmon Bowl",
        description: "Fresh atlantic salmon glazed with orange zest, served over quinoa and steamed greens.",
        price: "$18.50",
        calories: "650 kcal",
        time: "20 mins",
        rating: 4.9,
        image: "/images/salmon-bowl.jpg",
        balance: "Balanced",
        category: "Food",
        tag: "Muscle Gain Match",
        tagColor: "bg-orange-500",
        protein: "45g Protein",
    },
    {
        id: "2",
        title: "Steak & Asparagus",
        description: "Lean sirloin steak grilled to perfection with roasted garlic asparagus.",
        price: "$22.00",
        calories: "520 kcal",
        time: "25 mins",
        rating: 4.7,
        image: "/images/steak.jpg",
        balance: "Balanced",
        category: "Food",
        tag: "High Protein",
        tagColor: "bg-orange-500",
        protein: "38g Protein",
    },
    {
        id: "3",
        title: "Vegan Buddha Bowl",
        description: "A nutrient-packed bowl with sweet potatoes, chickpeas, tahini, and avocado.",
        price: "$15.00",
        calories: "410 kcal",
        time: "15 mins",
        rating: 4.8,
        image: "/images/buddha-bowl.jpg",
        balance: "Balanced",
        category: "Food",
        tag: "Plant-based",
        tagColor: "bg-green-600",
    },
    {
        id: "4",
        title: "Grilled Chicken Sandwich",
        description: "Herb-marinated chicken breast on artisan whole grain bread with fresh lettuce.",
        price: "$12.50",
        calories: "480 kcal",
        time: "15 mins",
        rating: 4.5,
        image: "/images/chicken-sandwich.jpg",
        balance: "Moderate",
        category: "Food",
        protein: "32g Protein",
    },
    {
        id: "5",
        title: "Super Green Detox",
        description: "Spinach, kale, apple, and ginger blended for a refreshing nutrient boost.",
        price: "$8.00",
        calories: "120 kcal",
        time: "5 mins",
        rating: 4.6,
        image: "/images/green-smoothie.jpg",
        balance: "Balanced",
        category: "Drink",
        tag: "Pre-Workout",
        tagColor: "bg-blue-500",
    },
    {
        id: "6",
        title: "Power Oats",
        description: "Steel-cut oats with whey protein, almond butter, and banana slices.",
        price: "$9.50",
        calories: "380 kcal",
        time: "10 mins",
        rating: 4.9,
        image: "/images/oats.jpg",
        balance: "Balanced",
        category: "Food",
        tag: "Energy",
        tagColor: "bg-yellow-500",
        protein: "20g Protein",
    },
    {
        id: "7",
        title: "Caramel Frappuccino",
        description: "Rich coffee with milk, ice, and caramel syrup topped with whipped cream.",
        price: "$6.50",
        calories: "420 kcal",
        time: "5 mins",
        rating: 4.8,
        image: "/images/frappe.jpg",
        balance: "Indulgent",
        category: "Drink",
    },
    {
        id: "8",
        title: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten center, served with vanilla ice cream.",
        price: "$9.00",
        calories: "550 kcal",
        time: "15 mins",
        rating: 4.9,
        image: "/images/lava-cake.jpg",
        balance: "Indulgent",
        category: "Dessert",
        tag: "Sweet Treat",
        tagColor: "bg-pink-500",
    },
    {
        id: "9",
        title: "Yogurt Parfait",
        description: "Greek yogurt layered with fresh berries, honey, and granola.",
        price: "$7.50",
        calories: "250 kcal",
        time: "5 mins",
        rating: 4.7,
        image: "/images/parfait.jpg",
        balance: "Moderate",
        category: "Dessert",
    },
];

export default function MenuPage() {
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | "All">("All");
    const [selectedBalances, setSelectedBalances] = useState<BalanceType[]>([]);

    const toggleBalance = (balance: BalanceType) => {
        setSelectedBalances((current) =>
            current.includes(balance)
                ? current.filter((b) => b !== balance)
                : [...current, balance]
        );
    };

    const filteredItems = menuItems.filter((item) => {
        const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
        const matchBalance = selectedBalances.length === 0 || selectedBalances.includes(item.balance);
        return matchCategory && matchBalance;
    });

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            {/* Search Header - Optional enhancement */}
            {/* Search Header */}
            <div className="bg-white border-b sticky top-16 z-30 shadow-sm hidden md:block">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 w-full max-w-md bg-gray-100 rounded-full px-4 py-2">
                        <Search className="w-5 h-5" />
                        <input type="text" placeholder="Find something high protein..." className="bg-transparent border-none outline-none w-full text-sm text-gray-700" />
                        <Zap className="w-4 h-4 text-orange-500" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">

                {/* LEFT SIDEBAR */}
                <div className="w-full lg:w-72 flex-shrink-0 space-y-8">
                    {/* Nutrition Goals Widget */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4 text-orange-500 font-bold tracking-wide text-sm">
                            <Dumbbell className="w-4 h-4" />
                            MY NUTRITION GOALS
                        </div>

                        <div className="mb-2 flex justify-between items-end">
                            <span className="text-xs text-gray-500 font-semibold uppercase">Calories Left</span>
                            <span className="text-2xl font-bold text-gray-900">650 <span className="text-sm font-normal text-gray-400">kcal</span></span>
                        </div>

                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 w-[65%]" />
                        </div>

                        <div className="flex justify-between text-xs text-gray-400 mb-6">
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
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all ${selectedCategory === "All"
                                    ? "bg-primary text-white shadow-md shadow-orange-200"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <UtensilsCrossed className="w-5 h-5" />
                                <span className="font-semibold">All Menu</span>
                            </button>

                            <button
                                onClick={() => setSelectedCategory("Food")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all ${selectedCategory === "Food"
                                    ? "bg-primary text-white shadow-md shadow-orange-200"
                                    : "text-gray-600 hover:bg-gray-100/50"
                                    }`}
                            >
                                <Leaf className="w-5 h-5" />
                                <span className="font-medium">Food</span>
                            </button>

                            <button
                                onClick={() => setSelectedCategory("Drink")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all ${selectedCategory === "Drink"
                                    ? "bg-primary text-white shadow-md shadow-orange-200"
                                    : "text-gray-600 hover:bg-gray-100/50"
                                    }`}
                            >
                                <Coffee className="w-5 h-5" />
                                <span className="font-medium">Drinks</span>
                            </button>

                            <button
                                onClick={() => setSelectedCategory("Dessert")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all ${selectedCategory === "Dessert"
                                    ? "bg-primary text-white shadow-md shadow-orange-200"
                                    : "text-gray-600 hover:bg-gray-100/50"
                                    }`}
                            >
                                <IceCream className="w-5 h-5" />
                                <span className="font-medium">Dessert</span>
                            </button>
                        </div>
                    </div>

                    {/* Dietary / Balance Filters */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Dietary Balance</h3>
                        <div className="space-y-3">
                            {(["Balanced", "Moderate", "Indulgent"] as BalanceType[]).map((type) => (
                                <div key={type} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleBalance(type)}>
                                    <Checkbox
                                        id={type}
                                        checked={selectedBalances.includes(type)}
                                        onCheckedChange={() => toggleBalance(type)}
                                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-gray-300 w-5 h-5 rounded-md transition-all"
                                    />
                                    <label
                                        htmlFor={type}
                                        className="text-gray-600 font-medium group-hover:text-primary transition-colors cursor-pointer select-none"
                                    >
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Recommended for You</h2>
                            <p className="text-gray-500 mt-1">Based on your "Muscle Gain" profile</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                            <button className="flex items-center gap-1 font-bold text-gray-900 hover:text-primary transition-colors">
                                Relevance <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <Link href={`/dishes/${item.id}`} key={item.id} className="block group">
                                <Card className="h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white rounded-3xl">
                                    {/* Image Area */}
                                    <div className="relative aspect-[5/4] bg-gray-100 overflow-hidden">
                                        <div className="absolute inset-0 bg-gray-200 group-hover:bg-gray-300 transition-colors" /> {/* Placeholder */}

                                        {/* Tags */}
                                        {item.tag && (
                                            <div className={`absolute top-4 left-4 ${item.tagColor} text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-10`}>
                                                <Zap className="w-3 h-3 fill-current" />
                                                {item.tag}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                                <span className="text-orange-500 text-xs shadow-none">★</span>
                                                <span className="text-xs font-bold text-gray-700">{item.rating}</span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10 leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-3 mb-5">
                                            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                                                <Flame className="w-3.5 h-3.5" />
                                                {item.calories}
                                            </div>
                                            {item.protein && (
                                                <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">
                                                    <Dumbbell className="w-3.5 h-3.5" />
                                                    {item.protein}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="font-bold text-2xl text-orange-600">{item.price}</div>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-10 w-10 rounded-full bg-white border border-gray-200 text-gray-900 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm group-hover:shadow-md"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                                <Search className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">We couldn't find any items matching your filters. Try adjusting your selection.</p>
                            <Button
                                onClick={() => { setSelectedCategory("All"); setSelectedBalances([]) }}
                                className="rounded-full px-8"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
