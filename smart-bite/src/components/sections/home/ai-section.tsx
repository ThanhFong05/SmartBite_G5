import { Button } from "@/components/ui/button"
import { Bot, Sparkles, Send } from "lucide-react"
import Link from "next/link"

export function AISection() {
    return (
        <section className="py-24 bg-[#2D2424] overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 px-4 py-1.5 rounded-full text-sm font-medium">
                            <Sparkles className="h-4 w-4" />
                            <span>Powered by AI</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Smart Nutrition Advice <br />
                            <span className="text-primary">with AI</span>
                        </h2>

                        <p className="text-gray-400 text-lg max-w-lg">
                            Let our AI help you choose dishes that fit your health goals - weight loss, muscle gain, or maintaining weight.
                        </p>

                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12">
                            <Link href="/ai-advisor">
                                <Bot className="mr-2 h-5 w-5" />
                                Chat with AI
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {/* Right Content - Chat UI */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-orange-500/20 blur-3xl rounded-full" />

                        <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-md mx-auto">
                            {/* Chat Header */}
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-primary">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">SmartBite AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <span className="text-xs text-green-600 font-medium">Active now</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="space-y-4 mb-6">
                                {/* Bot Message */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 text-primary mt-1">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-600">
                                        Hello! I'm SmartBite AI. What kind of dish are you looking for today?
                                    </div>
                                </div>

                                {/* User Message */}
                                <div className="flex gap-3 justify-end">
                                    <div className="bg-primary p-3 rounded-2xl rounded-tr-none text-sm text-white">
                                        I want to lose weight, suggest low-calorie dishes.
                                    </div>
                                </div>

                                {/* Bot Message with recommendation */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 text-primary mt-1">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-600">
                                        Great! I suggest <span className="font-bold text-orange-600">Avocado Quinoa Salad</span> (280 kcal) - rich in protein and healthy! 🥑
                                    </div>
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="AI is suggesting more..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-full py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-orange-50 rounded-full transition-colors">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
