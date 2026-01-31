"use client"

import { ProductGallery } from "@/components/sections/dish/product-gallery"
import { ProductInfo } from "@/components/sections/dish/product-info"
import { CustomizationOptions } from "@/components/sections/dish/customization-options"
import { IngredientsList } from "@/components/sections/dish/ingredients-list"
import { AddToCart } from "@/components/sections/dish/add-to-cart"
import { RelatedDishes } from "@/components/sections/dish/related-dishes"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data for dishes
const dishesData: Record<string, any> = {
    "healthy-teriyaki-chicken-rice": {
        title: "Teriyaki Chicken Rice",
        price: "75.000 đ",
        originalPrice: "95.000 đ",
        rating: 4.8,
        reviewCount: 128,
        time: "25-30 mins",
        calories: "520 kcal",
        description: "Fragrant white rice combined with savory Teriyaki grilled chicken, served with broccoli, carrots and soft-boiled egg. A nutritionist-balanced choice, high in protein and low in fat. The dish is prepared from fresh ingredients daily, ensuring food safety. SmartBite's exclusive Teriyaki sauce brings an irresistible flavor while remaining healthy.",
        images: [
            "/images/pieces-chicken-fillet-with-mushrooms-stewed-tomato-sauce-with-boiled-broccoli-rice-proper-nutrition-healthy-lifestyle-dietetic-menu-top-view.jpg",
            "/images/bunchahanoi.jpg",
            "/images/tiramisu.jpg",
            "/images/saladcangu.jpg",
        ],
        aiAnalysis: {
            text: "This dish is <span class=\"text-green-600 font-bold\">Highly Suitable</span> for your \"Weight Loss\" goal. High protein content (32g) helps keep you full longer and supports muscle building, while calories are within the allowable limit for lunch.",
            tags: [
                { text: "High Protein", color: "blue", check: true },
                { text: "Low Fat", color: "yellow", check: true },
                { text: "Balanced Carbs", color: "green", check: true }
            ]
        }
    },
    "bun-cha-ha-noi": {
        title: "Bun Cha Ha Noi",
        price: "50.000 đ",
        originalPrice: "65.000 đ",
        rating: 4.9,
        reviewCount: 256,
        time: "20-25 mins",
        calories: "580 kcal",
        description: "The essence of Hanoi cuisine. Succulent minced pork patties and pork belly slices are marinated in traditional spices and charcoal-grilled to smoky perfection. Served with fresh vermicelli noodles, a basket of fresh herbs (perilla, lettuce, cilantro), and a dipping sauce balancing sweet, sour, and savory flavors with papaya and carrot slices.",
        images: [
            "/images/bunchahanoi.jpg",
            "/images/pieces-chicken-fillet-with-mushrooms-stewed-tomato-sauce-with-boiled-broccoli-rice-proper-nutrition-healthy-lifestyle-dietetic-menu-top-view.jpg",
            "/images/tiramisu.jpg",
            "/images/saladcangu.jpg",
        ],
        aiAnalysis: {
            text: "This dish is <span class=\"text-yellow-600 font-bold\">Moderately Suitable</span> for \"Weight Loss\". It is high in protein but the dipping sauce contains sugar. Consider using less sauce or adding more greens to increase fiber and satiety.",
            tags: [
                { text: "High Protein", color: "blue", check: true },
                { text: "Rich in Fiber", color: "green", check: true },
                { text: "Moderate Sugar", color: "yellow", check: false }
            ]
        }
    }
}

export default function DishPage() {
    const params = useParams()
    const id = params?.id as string
    const dish = dishesData[id] || dishesData["healthy-teriyaki-chicken-rice"] // Fallback or 404 handling

    if (!dishesData[id] && id) {
        // Simple handling for now implies if ID doesn't exist we might want to show not found, 
        // but for this demo I'll fallback to the first dish or just show a text
        // actually let's just let it fallback for now or show a header
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Breadcrumb / Back button */}
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Menu
                    </Link>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 mb-12">
                    {/* Left Column - Gallery */}
                    <div className="lg:col-span-7">
                        <ProductGallery images={dish.images} />
                    </div>

                    {/* Right Column - Info & Options */}
                    <div className="lg:col-span-5 space-y-8">
                        <ProductInfo
                            title={dish.title}
                            price={dish.price}
                            originalPrice={dish.originalPrice}
                            rating={dish.rating}
                            reviewCount={dish.reviewCount}
                            time={dish.time}
                            calories={dish.calories}
                            description={dish.description}
                            aiAnalysis={dish.aiAnalysis}
                        />

                        <Separator />

                        <IngredientsList />

                        <Separator />

                        <CustomizationOptions />

                        {/* Mobile Add to Cart Placeholder - The actual component is fixed at bottom on mobile */}
                        <div className="hidden md:block">
                            <AddToCart />
                        </div>
                    </div>
                </div>

                {/* Add To Cart - Fixed on Mobile, Static on Desktop handled above but we need to render it for mobile somewhere fixed */}
                <div className="md:hidden">
                    <AddToCart />
                </div>

                <Separator className="my-12" />

                <RelatedDishes />
            </main>

            <Footer />
        </div>
    )
}
