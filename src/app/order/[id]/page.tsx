"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import {
    ChevronRight,
    HelpCircle,
    ReceiptText,
    Check,
    ChefHat,
    Bike,
    MessageSquare,
    PhoneCall,
    MapPin,
    Clock,
    CreditCard,
    Lightbulb,
    Flame,
    Leaf
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function OrderTrackingPage() {
    const params = useParams()
    const [isMounted, setIsMounted] = useState(false)
    const [orderStatus, setOrderStatus] = useState("accepted")
    const [currentOrder, setCurrentOrder] = useState<any>(null)

    useEffect(() => {
        setIsMounted(true)

        const checkStatus = () => {
            const allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]')
            const order = allOrders.find((o: any) => o.id === `#${params.id}`)
            if (order) {
                if (order.status) setOrderStatus(order.status)
                setCurrentOrder(order)
            }
        }

        checkStatus()

        window.addEventListener('storage', checkStatus)
        window.addEventListener('orderUpdate', checkStatus)
        const interval = setInterval(checkStatus, 2000)

        return () => {
            window.removeEventListener('storage', checkStatus)
            window.removeEventListener('orderUpdate', checkStatus)
            clearInterval(interval)
        }
    }, [params.id])

    const handleCompleteOrder = () => {
        const allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
        const updatedOrders = allOrders.map((o: any) => {
            if (o.id === `#${params.id}`) {
                return { ...o, status: 'completed' };
            }
            return o;
        });
        localStorage.setItem('allOrders', JSON.stringify(updatedOrders));
        setOrderStatus('completed');
        window.dispatchEvent(new Event('orderUpdate'));
    };

    if (!isMounted) return null

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
                {/* Breadcrumb */}
                <div className="text-sm font-medium text-gray-500 mb-6 flex items-center gap-2">
                    <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900">Order Tracking</span>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Order {params.id ? `#${params.id}` : ''}</h1>
                        <p className="text-gray-500 mt-1">Order Time: <span className="font-bold text-orange-500">{currentOrder?.time || "--:--"}</span></p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                        {orderStatus !== 'completed' && (
                            <Button
                                onClick={handleCompleteOrder}
                                className="rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-sm"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Mark as Completed
                            </Button>
                        )}
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="rounded-xl border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-medium">
                                <HelpCircle className="w-4 h-4 mr-2" />
                                Help
                            </Button>
                            <Button className="rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 font-bold shadow-sm">
                                <ReceiptText className="w-4 h-4 mr-2" />
                                Receipt Details
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column - Order Status & Items */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Status Stepper */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span>
                                Order Status
                            </h2>

                            <div className="relative flex justify-between items-start">
                                {/* Line connector */}
                                <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-gray-100 rounded-full -z-10"></div>
                                <div
                                    className={`absolute top-6 left-[10%] h-1 rounded-full -z-10 transition-all duration-700 ease-in-out ${orderStatus === 'accepted' ? 'w-0' :
                                        orderStatus === 'preparing' ? 'w-[40%] bg-orange-400' :
                                            'w-[80%] bg-green-500'
                                        }`}
                                ></div>

                                {/* Step 1: Confirmed */}
                                <div className="flex flex-col items-center w-1/3 z-10">
                                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-200 mb-3 border-4 border-white transition-all">
                                        <Check className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-center transition-colors">Confirmed</h3>
                                    <p className="text-xs text-gray-500 text-center mt-1">{currentOrder?.time || "--:--"}</p>
                                </div>

                                {/* Step 2: Preparing */}
                                <div className="flex flex-col items-center w-1/3 z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border-4 border-white relative transition-all duration-500 ${orderStatus === 'accepted' ? 'bg-gray-100 text-gray-400' :
                                        orderStatus === 'preparing' ? 'bg-orange-200 text-orange-600 shadow-lg shadow-orange-100' :
                                            'bg-green-500 text-white shadow-lg shadow-green-200'
                                        }`}>
                                        {['delivering', 'completed'].includes(orderStatus) ? <Check className="w-6 h-6" /> : <ChefHat className="w-6 h-6" />}
                                        {orderStatus === 'preparing' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                                    </div>
                                    <h3 className={`font-bold text-center transition-colors ${orderStatus === 'preparing' ? 'text-orange-600' :
                                        orderStatus === 'accepted' ? 'text-gray-400' :
                                            'text-gray-900'
                                        }`}>Prepared</h3>
                                    {orderStatus === 'preparing' && (
                                        <>
                                            <p className="text-xs text-orange-500/80 text-center mt-1 font-medium select-none">In Progress</p>
                                            <p className="text-xs text-gray-500 text-center mt-1 select-none">The kitchen is preparing your order.</p>
                                        </>
                                    )}
                                </div>

                                {/* Step 3: Delivering */}
                                <div className="flex flex-col items-center w-1/3 z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border-4 border-white relative transition-all duration-500 ${['accepted', 'preparing'].includes(orderStatus) ? 'bg-gray-100 text-gray-400' :
                                        orderStatus === 'delivering' ? 'bg-blue-200 text-blue-600 shadow-lg shadow-blue-100' :
                                            'bg-green-500 text-white shadow-lg shadow-green-200'
                                        }`}>
                                        {orderStatus === 'completed' ? <Check className="w-6 h-6" /> : <Bike className="w-6 h-6" />}
                                        {orderStatus === 'delivering' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                                    </div>
                                    <h3 className={`font-bold text-center transition-colors ${orderStatus === 'delivering' ? 'text-blue-600' :
                                        ['accepted', 'preparing'].includes(orderStatus) ? 'text-gray-400' :
                                            'text-gray-900'
                                        }`}>
                                        {orderStatus === 'completed' ? 'Delivered' : 'Delivering'}
                                    </h3>
                                    {['accepted', 'preparing'].includes(orderStatus) && <p className="text-xs text-gray-400 text-center mt-1">Waiting</p>}
                                </div>
                            </div>
                        </div>

                        {/* Ordered Items */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Ordered Items</h2>

                            <div className="space-y-6">
                                {currentOrder?.cartDetails && currentOrder.cartDetails.length > 0 ? currentOrder.cartDetails.map((item: any, index: number) => (
                                    <div key={item.id || index} className="flex gap-4 items-start pb-6 border-b border-gray-50">
                                        <div className="w-20 h-20 rounded-2xl bg-orange-50 flex-shrink-0 overflow-hidden">
                                            <img src={item.image || "/images/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                                <span className="font-bold text-orange-500">
                                                    {new Intl.NumberFormat('vi-VN').format((parseInt(item.price.toString().replace(/[^\d]/g, '')) || 0) * (item.quantity || 1))} đ
                                                </span>
                                            </div>
                                            {item.options && Object.keys(item.options).length > 0 && (
                                                <p className="text-sm text-gray-500 mb-2">
                                                    {Object.entries(item.options).map(([key, val]) => `${key}: ${val}`).join(', ')}
                                                </p>
                                            )}
                                            {item.note && (
                                                <p className="text-sm text-gray-500 italic mb-2">
                                                    Note: {item.note}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-bold">x{item.quantity || 1}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-gray-500 text-sm py-4">
                                        <span className="font-medium text-gray-900">Details: </span>
                                        {currentOrder?.items || "No information available."}
                                    </div>
                                )}
                            </div>

                            {/* Pricing summary */}
                            <div className="space-y-3 pt-6 w-full max-w-sm ml-auto">
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                                    <span className="text-xl font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-orange-500">{currentOrder?.price || "0 đ"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Delivery Info & Map */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Driver Map Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5 flex justify-between items-center bg-white border-b border-gray-50 z-10 relative">
                                <h3 className="font-bold text-gray-900">Driver Location</h3>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-widest flex items-center gap-1 transition-colors ${orderStatus === 'delivering' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
                                    {orderStatus === 'delivering' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse"></span>}
                                    {orderStatus === 'delivering' ? 'Live' : orderStatus === 'completed' ? 'Completed' : 'Offline'}
                                </span>
                            </div>

                            {/* Map Placeholder */}
                            <div className="relative h-48 bg-orange-100 flex items-center justify-center overflow-hidden transition-opacity duration-1000">
                                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\' fill=\'%23f97316\' fill-opacity=\'0.4\' fill-rule=\'nonzero\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                                {/* Route line Mock */}
                                <svg className={`absolute w-full h-full drop-shadow-md transition-colors ${orderStatus === 'delivering' ? 'text-orange-300' : 'text-gray-300 opacity-50'}`} viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M20,80 Q40,40 80,20" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="5,5" className={orderStatus === 'delivering' ? 'animate-[dash_2s_linear_infinite]' : ''} />
                                </svg>
                                {/* Driver Pin Mock */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                    <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 drop-shadow-md">2.5km</div>
                                    <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center shadow-lg">
                                        <Bike className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Driver Details */}
                            <div className="p-5 flex items-center gap-4 bg-white relative z-10 border-t border-gray-100">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                                        <img src="/images/avatar-placeholder.jpg" alt="Driver" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-gray-900 text-sm">Nguyen Van A</h4>
                                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                        <span className="text-yellow-500">★ 4.9</span>
                                        <span>(120+ orders)</span>
                                        <span>•</span>
                                        <span>Honda Wave</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                    <button className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors">
                                        <PhoneCall className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Information Block */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-5">Delivery Information</h3>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Delivery Address</div>
                                        <p className="text-sm font-semibold text-gray-900 leading-snug">
                                            {currentOrder?.address || "Pick up at counter / Not updated"}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 italic">According to the selected method at checkout.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order Time</div>
                                        <p className="text-sm font-semibold text-gray-900">{currentOrder?.time || "--:--"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CreditCard className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Payment Method</div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-gray-900">MoMo Wallet</p>
                                            <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">Paid</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Suggestion Box */}
                        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-6 shadow-lg shadow-orange-200 text-white border border-orange-400">
                            <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="w-5 h-5 text-yellow-300" />
                                <h3 className="font-bold text-lg">SmartBite AI Tips</h3>
                            </div>
                            <p className="text-orange-50 text-sm leading-relaxed mb-5 font-medium">
                                "Your lunch today has 850kcal. To balance your nutrition, try adding a bottle of celery juice for your afternoon snack!"
                            </p>
                            <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl h-11">
                                See drink suggestions
                            </Button>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
