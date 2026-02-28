import Link from "next/link"
import Image from "next/image"
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
                    <div className="relative flex justify-center items-center h-full min-h-[400px]">
                        {/* Animated Glowing Aura Behind the Image */}
                        <div className="absolute inset-[-20px] bg-gradient-to-tr from-[#FF5733]/30 to-orange-400/30 blur-3xl rounded-[3rem] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] z-0" />

                        {/* Enhanced Hero Image with Hover Effects */}
                        <div className="relative w-full max-w-[550px] aspect-[4/3] rounded-[2rem] overflow-hidden border-[8px] border-white shadow-[0_0_80px_rgba(255,87,51,0.5)] z-10 transition-all duration-700 ease-out hover:scale-105 hover:shadow-[0_0_120px_rgba(255,87,51,0.8)] hover:-translate-y-2 cursor-pointer group">
                            <Image
                                src="/images/hero-image.jpg"
                                alt="SmartBite Healthy Food"
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                priority
                            />

                            {/* Inner subtle gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
