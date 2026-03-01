"use client"

import { useState, useEffect, useMemo } from "react"
import { ProductGallery } from "@/components/sections/dish/product-gallery"
import { ProductInfo } from "@/components/sections/dish/product-info"
import { CustomizationOptions } from "@/components/sections/dish/customization-options"
import { IngredientsList } from "@/components/sections/dish/ingredients-list"
import { AddToCart } from "@/components/sections/dish/add-to-cart"
import { RelatedDishes } from "@/components/sections/dish/related-dishes"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { DishReviews } from "@/components/sections/dish/dish-reviews"
import { ReviewDialog } from "@/components/shared/ReviewDialog"
import { ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function DishPage() {
    const params = useParams()
    const id = params?.id as string
    const [dish, setDish] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedExtras, setSelectedExtras] = useState<Record<number, boolean>>({})
    const [eligibility, setEligibility] = useState<{ eligible: boolean, orderId: string | null, orderItems: any[] }>({ eligible: false, orderId: null, orderItems: [] })
    const [isMounted, setIsMounted] = useState(false)
    const [reviewRefreshKey, setReviewRefreshKey] = useState(0)

    const handleToggleExtra = (idx: number) => {
        setSelectedExtras(prev => ({ ...prev, [idx]: !prev[idx] }))
    }

    const currentTotalPrice = useMemo(() => {
        if (!dish || !isMounted) return dish?.price || "";
        let extraPrice = 0;
        if (dish.extras) {
            dish.extras.forEach((extra: any, idx: number) => {
                if (selectedExtras[idx]) {
                    const num = parseInt(extra.price.replace(/[^\d]/g, ''), 10) || 0;
                    extraPrice += num;
                }
            })
        }
        const basePrice = parseInt((dish.price || "0").replace(/[^\d]/g, ''), 10) || 0;
        const total = basePrice + extraPrice;
        return total > 0 ? total.toLocaleString('vi-VN') + ' đ' : dish.price;
    }, [dish, selectedExtras, isMounted]);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!id) return;

        const fetchDish = async () => {
            try {
                const res = await fetch(`/api/dishes/${id}`);
                if (!res.ok) {
                    throw new Error("Dish not found");
                }
                const data = await res.json();
                setDish(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load dish details.");
            } finally {
                setIsLoading(false);
            }
        };

        const checkEligibility = async () => {
            try {
                const res = await fetch(`/api/reviews?action=check-eligibility&foodid=${dish?.foodid || id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.eligible) {
                        setEligibility({
                            eligible: true,
                            orderId: data.orderId,
                            orderItems: data.orderItems?.map((oi: any) => ({
                                foodid: oi.foodid,
                                quantity: oi.quantity,
                                fooditems: {
                                    foodname: oi.fooditems?.foodname,
                                    foodimageurl: oi.fooditems?.foodimageurl
                                }
                            })) || []
                        });
                    }
                }
            } catch (err) {
                console.error("Eligibility check error:", err);
            }
        };

        const fetchData = async () => {
            await fetchDish();
            await checkEligibility();
        };

        fetchData();
    }, [id, reviewRefreshKey]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </main>
                <Footer />
            </div>
        )
    }

    if (error || !dish || dish.foodstatus === 'Unavailable') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">{dish?.foodstatus === 'Unavailable' ? 'Món ăn đã ngừng kinh doanh' : 'Dish Not Found'}</h2>
                    <Link href="/menu">
                        <span className="text-orange-500 hover:underline">Back to Menu</span>
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    // Map new data model to components
    // Create an AI Analysis object from the review data
    const aiAnalysis = dish.aiReview ? {
        text: dish.aiReview.summary,
        tags: dish.aiReview.tags?.map((tag: string) => ({
            text: tag,
            color: "green", // Default color, logic could be added
            check: true
        })) || []
    } : undefined;

    // Use specific images or fallback
    const images = dish.images && dish.images.length > 0 ? dish.images : [dish.image];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className={`flex-grow container mx-auto px-4 py-8 transition-all duration-500 ${dish.foodstatus === "Out of Stock" ? "grayscale opacity-60 pointer-events-none" : ""}`}>
                {dish.foodstatus === "Out of Stock" && (
                    <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-6 text-sm font-medium border border-red-100 flex items-center justify-center">
                        Thông báo: Món ăn này hiện đang tạm hết hàng. Quý khách vui lòng chọn món khác.
                    </div>
                )}
                {/* Breadcrumb / Back button */}
                <div className="mb-6">
                    <Link href="/menu" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Menu
                    </Link>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 mb-12">
                    {/* Left Column - Gallery */}
                    <div className="lg:col-span-7">
                        <ProductGallery images={images} />
                    </div>

                    {/* Right Column - Info & Options */}
                    <div className="lg:col-span-5 space-y-8">
                        <ProductInfo
                            title={dish.title}
                            price={dish.price}
                            originalPrice={null} // Not in new model currently
                            rating={dish.rating}
                            reviewCount={dish.reviewCount || 0}
                            time={dish.time}
                            calories={dish.calories}
                            description={dish.desc} // mapped from desc
                            aiAnalysis={aiAnalysis}
                        />

                        <Separator />

                        <IngredientsList ingredients={dish.ingredients} />

                        <Separator />

                        <CustomizationOptions extras={dish.extras} selectedExtras={selectedExtras} onToggleExtra={handleToggleExtra} />

                        {/* Mobile Add to Cart Placeholder */}
                        <div className="hidden md:block">
                            <AddToCart price={currentTotalPrice} dish={dish} selectedExtras={selectedExtras} />
                        </div>
                    </div>
                </div>

                {/* Mobile Add To Cart */}
                <div className="md:hidden">
                    <AddToCart price={currentTotalPrice} dish={dish} selectedExtras={selectedExtras} />
                </div>

                <Separator className="my-12" />

                {isMounted && eligibility.eligible && (
                    <div className="mb-12 bg-gradient-to-r from-orange-50 to-white p-8 rounded-[40px] border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md">
                                <Star className="w-8 h-8 text-orange-400 fill-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Món ăn này rất tuyệt, đúng không?</h3>
                                <p className="text-gray-500">Bạn đã thưởng thức món này, hãy chia sẻ cảm nhận với mọi người nhé!</p>
                            </div>
                        </div>
                        <ReviewDialog
                            orderId={eligibility.orderId!}
                            type="dish"
                            orderItems={eligibility.orderItems}
                            triggerElement={
                                <div className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-orange-100 transition-all active:scale-95 flex items-center gap-2 cursor-pointer">
                                    <Star className="w-5 h-5 fill-white" />
                                    Viết đánh giá ngay
                                </div>
                            }
                            onReviewSubmitted={() => {
                                setEligibility({ eligible: false, orderId: null, orderItems: [] });
                                setReviewRefreshKey(prev => prev + 1);
                            }}
                        />
                    </div>
                )}

                <DishReviews foodId={dish.foodid} refreshKey={reviewRefreshKey} />

                <Separator className="my-12" />

                <RelatedDishes currentDishId={dish.id} />
            </main>

            <Footer />
        </div>
    )
}
