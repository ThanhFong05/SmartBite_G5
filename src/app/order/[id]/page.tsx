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
import { ReviewDialog } from "@/components/shared/ReviewDialog"

export default function OrderTrackingPage() {
    const params = useParams()
    const [isMounted, setIsMounted] = useState(false)
    const [orderStatus, setOrderStatus] = useState<string | null>(null)
    const [currentOrder, setCurrentOrder] = useState<any>(null)
    const [notFound, setNotFound] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsMounted(true)

        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${params.id}`, { cache: 'no-store' });
                if (res.status === 404) {
                    setNotFound(true);
                    setIsLoading(false);
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    if (data.order) {
                        setNotFound(false);
                        setIsLoading(false);
                        const o = data.order;
                        const statusMap: Record<number, string> = {
                            1: 'pending',
                            2: 'accepted',
                            3: 'preparing',
                            4: 'delivering',
                            5: 'completed'
                        };

                        setOrderStatus(statusMap[o.orderstatus] || 'pending');

                        // Map DB format sang format cũ của UI để tránh sửa quá nhiều code render
                        const paymentInfo = Array.isArray(o.payments) ? o.payments[0] : o.payments;
                        setCurrentOrder({
                            id: o.orderid,
                            time: o.ordertime ? new Date(o.ordertime).toISOString() : "",
                            displayTime: o.ordertime ? new Date(o.ordertime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--",
                            price: new Intl.NumberFormat('vi-VN').format(o.finalamount) + ' đ',
                            status: statusMap[o.orderstatus] || 'pending',
                            address: o.deliveryaddress,
                            paymentMethod: paymentInfo?.paymentmethod || 'Unknown',
                            paymentStatus: paymentInfo?.paymentstatus || 'pending',
                            cartDetails: o.orderitems?.map((oi: any) => {
                                const toppingObj: any = {};
                                const toppingsStr = oi.orderitemtoppings?.map((t: any) => t.toppingoptions?.toppingname).filter(Boolean).join(", ");
                                if (toppingsStr) toppingObj["Thêm"] = toppingsStr;

                                return {
                                    id: oi.foodid,
                                    title: oi.fooditems?.foodname,
                                    image: oi.fooditems?.foodimageurl,
                                    price: oi.unitprice,
                                    extraPrice: oi.orderitemtoppings?.reduce((sum: number, t: any) => sum + (Number(t.price) || 0), 0) || 0,
                                    quantity: oi.quantity,
                                    options: toppingObj
                                };
                            }) || []
                        });
                    }
                }
            } catch (error) {
                console.error("Fetch Order Error:", error);
            }
        }

        fetchOrder()
        const interval = setInterval(fetchOrder, 5000) // Poll every 5s

        return () => clearInterval(interval)
    }, [params.id])

    const handleCompleteOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'completed' })
            });
            if (res.ok) {
                setOrderStatus('completed');
            }
        } catch (error) {
            console.error("Complete Order Error:", error);
        }
    };

    if (!isMounted) return null

    const currentStatus = orderStatus || 'pending'

    // Nếu ID là mã mock cũ thì mới hiện trang 404 thực sự
    if (notFound && (params.id as string)?.startsWith('SB-')) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-sans">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-20 max-w-2xl text-center">
                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HelpCircle className="w-10 h-10 text-orange-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Order Not Found</h1>
                        <p className="text-gray-500 mb-10 leading-relaxed text-lg">
                            We couldn't find any information for order <span className="font-bold text-orange-600 block sm:inline">#{params.id}</span>.
                        </p>
                        <Link href="/">
                            <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 px-8">
                                Return to Home
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

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
                        <p className="text-gray-500 mt-1">Order Time: <span className="font-bold text-orange-500">{currentOrder?.displayTime || currentOrder?.time || "--:--"}</span></p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                        {currentStatus !== 'completed' && (
                            <Button
                                onClick={handleCompleteOrder}
                                className="rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-sm"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Mark as Completed
                            </Button>
                        )}
                        <div className="flex items-center gap-3">
                            <a href="https://www.facebook.com/tfonghjhj" target="_blank" rel="noopener noreferrer" className="hidden sm:flex">
                                <Button variant="outline" className="rounded-xl border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-medium w-full">
                                    <HelpCircle className="w-4 h-4 mr-2" />
                                    Help
                                </Button>
                            </a>
                            {currentStatus === 'completed' && params.id && (
                                <ReviewDialog
                                    orderId={params.id as string}
                                    type="order"
                                    orderItems={currentOrder?.cartDetails?.map((item: any) => ({
                                        foodid: item.id,
                                        quantity: item.quantity,
                                        fooditems: {
                                            foodname: item.title,
                                            foodimageurl: item.image
                                        }
                                    }))}
                                />
                            )}
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
                                    className={`absolute top-6 left-[10%] h-1 rounded-full -z-10 transition-all duration-700 ease-in-out ${['pending', 'accepted'].includes(currentStatus) ? 'w-0' :
                                        currentStatus === 'preparing' ? 'w-[40%] bg-orange-400' :
                                            ['delivering', 'completed'].includes(currentStatus) ? 'w-[80%] bg-green-500' : 'w-0'
                                        }`}
                                ></div>

                                {/* Step 1: Confirmed */}
                                <div className="flex flex-col items-center w-1/3 z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-white transition-all ${currentStatus === 'pending' ? 'bg-orange-100 text-orange-500 shadow-orange-50' :
                                        'bg-green-500 text-white shadow-green-200'
                                        }`}>
                                        {currentStatus === 'pending' ? <Clock className="w-6 h-6" /> : <Check className="w-6 h-6" />}
                                    </div>
                                    <h3 className={`font-bold text-center transition-colors ${currentStatus === 'pending' ? 'text-orange-500' : 'text-gray-900'
                                        }`}>
                                        {currentStatus === 'pending' ? 'Awaiting Confirmation' : 'Confirmed'}
                                    </h3>
                                    <p className="text-xs text-gray-500 text-center mt-1">{currentOrder?.time || "--:--"}</p>
                                </div>

                                {/* Step 2: Preparing */}
                                <div className="flex flex-col items-center w-1/3 z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border-4 border-white relative transition-all duration-500 ${['pending', 'accepted'].includes(currentStatus) ? 'bg-gray-100 text-gray-400' :
                                        currentStatus === 'preparing' ? 'bg-orange-200 text-orange-600 shadow-lg shadow-orange-100' :
                                            'bg-green-500 text-white shadow-lg shadow-green-200'
                                        }`}>
                                        {['delivering', 'completed'].includes(currentStatus) ? <Check className="w-6 h-6" /> : <ChefHat className="w-6 h-6" />}
                                        {currentStatus === 'preparing' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                                    </div>
                                    <h3 className={`font-bold text-center transition-colors ${currentStatus === 'preparing' ? 'text-orange-600' :
                                        ['pending', 'accepted'].includes(currentStatus) ? 'text-gray-400' :
                                            'text-gray-900'
                                        }`}>Prepared</h3>
                                    {currentStatus === 'preparing' && (
                                        <>
                                            <p className="text-xs text-orange-500/80 text-center mt-1 font-medium select-none">In Progress</p>
                                        </>
                                    )}
                                </div>

                                {/* Step 3: Delivering */}
                                <div className="flex flex-col items-center w-1/3 z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border-4 border-white relative transition-all duration-500 ${['pending', 'accepted', 'preparing'].includes(currentStatus) ? 'bg-gray-100 text-gray-400' :
                                        currentStatus === 'delivering' ? 'bg-blue-200 text-blue-600 shadow-lg shadow-blue-100' :
                                            'bg-green-500 text-white shadow-lg shadow-green-200'
                                        }`}>
                                        {currentStatus === 'completed' ? <Check className="w-6 h-6" /> : <Bike className="w-6 h-6" />}
                                        {currentStatus === 'delivering' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                                    </div>
                                    <h3 className={`font-bold text-center transition-colors ${currentStatus === 'delivering' ? 'text-blue-600' :
                                        ['pending', 'accepted', 'preparing'].includes(currentStatus) ? 'text-gray-400' :
                                            'text-gray-900'
                                        }`}>
                                        {currentStatus === 'completed' ? 'Delivered' : 'Delivering'}
                                    </h3>
                                    {['pending', 'accepted', 'preparing'].includes(currentStatus) && <p className="text-xs text-gray-400 text-center mt-1">Waiting</p>}
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
                                                    {new Intl.NumberFormat('vi-VN').format((parseInt(item.price?.toString().replace(/[^\d]/g, '')) || 0) * (item.quantity || 1) + (parseInt(item.extraPrice?.toString().replace(/[^\d]/g, '')) || 0))} đ
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
                                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-widest flex items-center gap-1 transition-colors ${currentStatus === 'delivering' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
                                    {currentStatus === 'delivering' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse"></span>}
                                    {currentStatus === 'delivering' ? 'Live' : currentStatus === 'completed' ? 'Completed' : 'Offline'}
                                </span>
                            </div>

                            {/* Map Placeholder */}
                            <div className="relative h-48 bg-orange-100 flex items-center justify-center overflow-hidden transition-opacity duration-1000">
                                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\' fill=\'%23f97316\' fill-opacity=\'0.4\' fill-rule=\'nonzero\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                                {/* Route line Mock */}
                                <svg className={`absolute w-full h-full drop-shadow-md transition-colors ${currentStatus === 'delivering' ? 'text-orange-300' : 'text-gray-300 opacity-50'}`} viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M20,80 Q40,40 80,20" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="5,5" className={currentStatus === 'delivering' ? 'animate-[dash_2s_linear_infinite]' : ''} />
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
                                            <p className="text-sm font-semibold text-gray-900">{currentOrder?.paymentMethod === 'momo' ? 'MoMo Wallet' : (currentOrder?.paymentMethod === 'vnpay' ? 'VNPay' : 'Cash/Bank')}</p>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm ${currentOrder?.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {currentOrder?.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                                            </span>
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
