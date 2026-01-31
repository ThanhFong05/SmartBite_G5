import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Star, Utensils } from "lucide-react"

export function Hero() {
    return (
        <section className="bg-primary pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden relative">
            {/* Decorative background elements if any */}

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <div className="space-y-8 relative z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                            <Sparkles className="h-4 w-4" />
                            <span>Smart AI Nutrition Advisor</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                            Eat well, live well <br />
                            <span className="text-white/90">with SmartBite</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg text-white/80 max-w-lg">
                            Discover diverse menus, track calories, and get AI nutrition advice - all in one app.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link href="/menu">
                                <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full h-12 px-8 font-semibold">
                                    <Utensils className="mr-2 h-5 w-5" />
                                    View Menu
                                </Button>
                            </Link>
                            <Link href="/ai-advisor">
                                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/10 rounded-full h-12 px-8 font-semibold">
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    AI Advisor
                                </Button>
                            </Link>
                            {/* Added Profile Link for easy access as requested */}
                            <a href="/profile">
                                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/10 rounded-full h-12 px-8 font-semibold">
                                    <span className="mr-2 not-italic">👤</span>
                                    My Profile
                                </Button>
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-12 pt-4">
                            <div>
                                <div className="text-3xl font-bold text-white">50+</div>
                                <div className="text-sm text-white/70">Dishes</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">1,500+</div>
                                <div className="text-sm text-white/70">Customers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white flex items-center gap-1">
                                    4.9 <Star className="h-4 w-4 fill-white" />
                                </div>
                                <div className="text-sm text-white/70">Reviews</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Visual */}
                    <div className="relative flex justify-center items-center">
                        {/* Main Circle Background */}
                        <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white rounded-full opacity-20 blur-3xl" />

                        <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-white rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in duration-500">
                            {/* Main Image Placeholder */}
                            <div className="text-center p-8">
                                <div className="w-48 h-32 bg-orange-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-primary text-4xl">🥗</span>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-4 -right-4 md:top-10 md:right-0 bg-white p-3 rounded-2xl shadow-lg animate-bounce duration-[3000ms]">
                                <span className="text-2xl">🥤</span>
                            </div>

                            <div className="absolute -bottom-4 -left-4 md:bottom-10 md:left-0 bg-white p-3 rounded-2xl shadow-lg animate-bounce duration-[3000ms] delay-700">
                                <span className="text-2xl">🍰</span>
                            </div>

                            <div className="absolute bottom-20 -right-8 bg-white py-2 px-4 rounded-xl shadow-lg flex items-center gap-3">
                                <div className="bg-green-100 p-1 rounded-full">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Calories</div>
                                    <div className="text-sm font-bold text-gray-900">180 kcal</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
