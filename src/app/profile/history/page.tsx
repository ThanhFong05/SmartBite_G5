"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import {
    ChevronRight,
    Flame,
    Leaf,
    Coffee,
    Pizza,
    ArrowRight
} from "lucide-react"
import Link from "next/link"
import { ReviewDialog } from "@/components/shared/ReviewDialog"

export default function OrderHistoryPage() {
    const [activeTab, setActiveTab] = useState("All")
    const [isMounted, setIsMounted] = useState(false)
    const [history, setHistory] = useState<any[]>([])

    useEffect(() => {
        setIsMounted(true)
        const fetchHistory = async () => {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    const userId = user.UserId || user.userid || user.id;
                    if (userId) {
                        const res = await fetch(`/api/orders?userid=${userId}`);
                        if (res.ok) {
                            const data = await res.json();
                            const allOrders = data.orders || [];

                            const statusMap: Record<number, string> = {
                                1: 'Confirmed', // Pending in DB is confirmed for user
                                2: 'Confirmed',
                                3: 'Preparing',
                                4: 'Delivering',
                                5: 'Completed'
                            };

                            const formatted = allOrders.map((o: any) => ({
                                id: o.orderid,
                                title: (o.orderitems || []).map((oi: any) => oi.fooditems?.foodname).filter(Boolean).join(", ") || "Order",
                                time: o.ordertime ? new Date(o.ordertime).toISOString() : "",
                                displayTime: o.ordertime ? new Date(o.ordertime).toLocaleString() : "",
                                price: new Intl.NumberFormat('vi-VN').format(o.foodamount + o.shippingfee) + ' đ',
                                calories: o.orderitems ? `${o.orderitems.reduce((sum: number, oi: any) => sum + ((oi.fooditems?.calories || 0) * (oi.quantity || 1)), 0)} kcal` : "-- kcal",
                                protein: "--g",
                                status: statusMap[Number(o.orderstatus)] || 'Confirmed',
                                type: "general",
                                icon: Pizza,
                                originalOrder: o
                            }));
                            setHistory(formatted);
                        }
                    }
                } catch (e) {
                    console.error("Lỗi khi fetch history:", e);
                }
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 5000);

        return () => clearInterval(interval);
    }, [])

    if (!isMounted) return null

    const filteredOrders = activeTab === "All"
        ? history
        : history.filter(o => o.status === activeTab)

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div className="max-w-2xl">
                        <span className="inline-block bg-orange-100 text-orange-600 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                            Personalized
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">History & Calorie Log</h1>
                        <p className="text-gray-500 text-lg">
                            Track your eating journey. Our AI analyzes nutrition from your order history to help you live healthier every day.
                        </p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 flex-1 md:flex-none">
                            <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Average / day</p>
                                <p className="text-xl font-bold text-gray-900">1,850 <span className="text-sm font-normal text-gray-500">kcal</span></p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 flex-1 md:flex-none">
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                <Pizza className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Orders this week</p>
                                <p className="text-xl font-bold text-gray-900">5 <span className="text-sm font-normal text-gray-500">orders</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column - Order List */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Tabs */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            {['All', 'Delivering', 'Completed', 'Cancelled'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab
                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Order List */}
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                                                <order.icon className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{order.title}</h3>
                                                <p className="text-sm text-gray-500">{order.displayTime || order.time}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Completed' || order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'Delivering' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-50">
                                        <div className="flex gap-8">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Total amount</p>
                                                <p className="font-bold text-gray-900">{order.price}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Calories</p>
                                                <p className="font-bold text-orange-500">{order.calories}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-xs text-gray-400 mb-1">Protein</p>
                                                <p className="font-bold text-gray-900">{order.protein}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                                            {order.status === 'Completed' && (
                                                <div className="flex-1 sm:flex-none">
                                                    <ReviewDialog
                                                        orderId={order.id}
                                                        type="order"
                                                        orderItems={order.originalOrder?.orderitems || []}
                                                    />
                                                </div>
                                            )}
                                            <Link href={`/order/${order.id}`} className="flex-1 sm:flex-none">
                                                <Button variant="outline" className="w-full rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50">
                                                    Details
                                                </Button>
                                            </Link>
                                            <Button className="flex-1 sm:flex-none rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold">
                                                Reorder
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Dashboards */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Calorie Chart Mock */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-orange-500 rounded-full inline-block"></span>
                                    Calorie Chart
                                </h3>
                                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">This week</span>
                            </div>

                            <div className="relative h-48 w-full">
                                {/* Simple SVG representation of a line chart */}
                                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                    {/* Grid Lines */}
                                    {[10, 20, 30, 40].map(y => (
                                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f3f4f6" strokeWidth="0.5" />
                                    ))}
                                    {/* Area Fill */}
                                    <path
                                        d="M0,40 L15,20 L30,30 L50,15 L65,40 L85,5 L100,35 L100,50 L0,50 Z"
                                        fill="url(#orange-gradient)"
                                        opacity="0.2"
                                    />
                                    {/* Line */}
                                    <path
                                        d="M0,40 L15,20 L30,30 L50,15 L65,40 L85,5 L100,35"
                                        fill="none"
                                        stroke="#f97316"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    {/* Points */}
                                    <circle cx="0" cy="40" r="2" fill="white" stroke="#f97316" strokeWidth="1" />
                                    <circle cx="15" cy="20" r="2" fill="white" stroke="#f97316" strokeWidth="1" />
                                    <circle cx="30" cy="30" r="2" fill="white" stroke="#f97316" strokeWidth="1" />
                                    <circle cx="50" cy="15" r="2" fill="white" stroke="#f97316" strokeWidth="1" />
                                    <circle cx="65" cy="40" r="2" fill="white" stroke="#f97316" strokeWidth="1" />
                                    <circle cx="85" cy="5" r="2" fill="white" stroke="#f97316" strokeWidth="1" />
                                    <circle cx="100" cy="35" r="2" fill="white" stroke="#f97316" strokeWidth="1" />

                                    <defs>
                                        <linearGradient id="orange-gradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f97316" />
                                            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Labels */}
                                <div className="absolute inset-0 flex justify-between items-end pb-[-20px] pt-48 px-1 text-[10px] text-gray-400">
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span>Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                    <span>Sat</span>
                                    <span>Sun</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-50">
                                <span className="text-xs font-medium text-gray-500">Goal: 2000 kcal</span>
                                <span className="text-xs font-bold text-green-500 tracking-wide">Reached 85%</span>
                            </div>
                        </div>

                        {/* AI Advice Box */}
                        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-6 shadow-lg shadow-orange-200 text-white border border-orange-400 relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full translate-x-8 -translate-y-8"></div>

                            <div className="flex items-center gap-2 mb-4 relative z-10">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <Leaf className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="font-bold text-xs tracking-widest uppercase opacity-90">SmartBite AI Analysis</h3>
                            </div>
                            <h4 className="text-xl font-bold mb-3 relative z-10">This week's advice</h4>
                            <p className="text-orange-50 text-sm leading-relaxed mb-6 font-medium relative z-10">
                                "Hello! Based on your eating history, you consumed a bit too many carbs at night this week. Try replacing them with Salads or grilled chicken breast for dinner today to balance things out!"
                            </p>
                            <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl h-11 relative z-10">
                                View suggested menu
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>

                        {/* Nutrition Bars */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-6">Nutrition Intake</h3>

                            <div className="space-y-6">
                                {/* Protein */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500 font-medium">Protein</span>
                                        <span className="font-bold text-gray-900">120g <span className="text-gray-400 font-normal">/ 150g</span></span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                </div>

                                {/* Carbs */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500 font-medium">Carbs</span>
                                        <span className="font-bold text-gray-900">210g <span className="text-gray-400 font-normal">/ 250g</span></span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>

                                {/* Fat */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500 font-medium">Fat</span>
                                        <span className="font-bold text-gray-900">45g <span className="text-gray-400 font-normal">/ 65g</span></span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-400 rounded-full" style={{ width: '69%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
