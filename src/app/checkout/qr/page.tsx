"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Headset, ShieldCheck, ReceiptText, Loader2, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function QRPaymentPage() {
    const router = useRouter()
    const [cartItems, setCartItems] = useState<any[]>([])
    const [isMounted, setIsMounted] = useState(false)
    const [timeLeft, setTimeLeft] = useState(599) // 9:59 in seconds
    const [orderId, setOrderId] = useState("")
    const [isCheckingPayment, setIsCheckingPayment] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)

    useEffect(() => {
        setIsMounted(true)

        // Check Auth
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/auth/login");
            return;
        }

        // Load cart items from localStorage
        const cartData = localStorage.getItem('cartItems')
        if (cartData) {
            setCartItems(JSON.parse(cartData))
        }

        // Generate random order ID
        setOrderId(`#SB-${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`)

        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    // Pricing calculation
    const parsePrice = (priceStr: string | number) => {
        if (!priceStr) return 0;
        if (typeof priceStr === 'number') return priceStr;
        const numericStr = priceStr.replace(/[^\d]/g, '')
        return parseInt(numericStr, 10) || 0;
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (parsePrice(item.price) * (item.quantity || 1)), 0)
    const shippingFee = subtotal > 0 ? 15000 : 0
    const total = subtotal + shippingFee

    // Handle "I have paid" click
    const handlePaymentConfirm = () => {
        setIsCheckingPayment(true)

        // Retrieve user address if exists
        let orderAddress = "Pay with VNPay/MoMo";
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                orderAddress = user.address || orderAddress;
            }
        } catch (e) { }

        // Create new order object
        const newOrder = {
            id: orderId,
            customer: "Customer (You)", // Mock customer name
            items: cartItems.map(item => item.title).join(", "),
            cartDetails: cartItems, // Save full cart details for tracking page
            price: formatPrice(total),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "pending",
            address: orderAddress,
            avatar: "/images/avatar-placeholder.jpg"
        }

        // Save to localStorage's allOrders array
        const existingOrders = JSON.parse(localStorage.getItem('allOrders') || '[]')

        // Remove old order with same ID if exists (edge case)
        const updatedOrders = existingOrders.filter((o: any) => o.id !== orderId)
        updatedOrders.unshift(newOrder) // Add to beginning

        localStorage.setItem('allOrders', JSON.stringify(updatedOrders))

        // Dispatch event for other tabs and components tracking orders natively
        window.dispatchEvent(new Event('storage'))
        window.dispatchEvent(new Event('orderUpdate'))

        // Start checking for status updates
        const checkInterval = setInterval(() => {
            const currentOrders = JSON.parse(localStorage.getItem('allOrders') || '[]')
            const thisOrder = currentOrders.find((o: any) => o.id === orderId)

            if (thisOrder && thisOrder.status === 'accepted') {
                clearInterval(checkInterval)
                setPaymentSuccess(true)
                setIsCheckingPayment(false)

                // Clear cart
                localStorage.removeItem('cartItems')
                window.dispatchEvent(new Event('cartUpdate'))

                // Redirect after showing success for 2 seconds
                setTimeout(() => {
                    router.push(`/order/${orderId.replace('#', '')}`)
                }, 2000)
            }
        }, 1000) // Check every second

        // Also clean up interval on unmount
        return () => clearInterval(checkInterval)
    }

    if (!isMounted) return null

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
                {/* Breadcrumb */}
                <div className="text-sm font-medium text-gray-500 mb-8 flex items-center gap-2">
                    <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/cart" className="hover:text-orange-500 transition-colors">Cart</Link>
                    <span>/</span>
                    <span className="text-orange-500 font-bold">QR Payment</span>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column - QR Instructions */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-orange-50/50 flex flex-col items-center flex-grow">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Scan QR to Pay</h1>
                            <p className="text-gray-500 text-center mb-8">Use Momo, VNPay or your Bank app</p>

                            {/* Timer */}
                            <div className="flex items-center justify-center gap-4 mb-10">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center text-2xl font-bold text-orange-500 shadow-sm border border-orange-100">
                                        {minutes.toString().padStart(2, '0')}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">MIN</div>
                                </div>
                                <div className="text-2xl font-bold text-orange-500 pb-6">:</div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center text-2xl font-bold text-orange-500 shadow-sm border border-orange-100">
                                        {seconds.toString().padStart(2, '0')}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">SEC</div>
                                </div>
                            </div>

                            {/* QR Code Area */}
                            <div className="w-64 md:w-72 bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden mb-10 relative">
                                <img
                                    src="/images/bidvqr.jpg"
                                    alt="Payment QR Code"
                                    className="w-full h-auto object-contain"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                                <Button variant="outline" className="flex-1 h-12 rounded-xl border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 font-bold shadow-sm" disabled={isCheckingPayment || paymentSuccess}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download QR code
                                </Button>

                                <Button
                                    className={`flex-1 h-12 rounded-xl font-bold shadow-md transition-all ${paymentSuccess
                                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200'
                                        : isCheckingPayment
                                            ? 'bg-orange-400 cursor-not-allowed text-white'
                                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200'
                                        }`}
                                    onClick={handlePaymentConfirm}
                                    disabled={isCheckingPayment || paymentSuccess || cartItems.length === 0}
                                >
                                    {paymentSuccess ? (
                                        <>
                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                            Transaction Successful
                                        </>
                                    ) : isCheckingPayment ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Checking...
                                        </>
                                    ) : (
                                        "I have paid"
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100 flex items-center gap-4">
                            <ShieldCheck className="w-8 h-8 text-orange-500 flex-shrink-0" />
                            <p className="text-sm text-gray-600 font-medium">Your transaction is completely secured by our integrated payment system.</p>
                        </div>
                    </div>

                    {/* Right Column - Order Summary & Support */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                                <ReceiptText className="w-5 h-5 text-orange-500" />
                                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Order ID:</span>
                                    <span className="font-bold text-gray-900">{orderId}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Status:</span>
                                    <span className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full text-xs font-bold">Pending</span>
                                </div>
                            </div>

                            <Separator className="my-6 border-dashed" />

                            {/* Item List */}
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={item.image || "/images/placeholder.jpg"}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-bold text-sm text-gray-900 truncate">{item.title}</h4>
                                            <div className="text-xs text-gray-500">{item.quantity} x {formatPrice(parsePrice(item.price))}</div>
                                        </div>
                                        <div className="font-bold text-sm text-gray-900 whitespace-nowrap">
                                            {formatPrice(parsePrice(item.price) * (item.quantity || 1))}
                                        </div>
                                    </div>
                                ))}
                                {cartItems.length === 0 && (
                                    <div className="text-center text-sm text-gray-500 py-4">Empty Cart</div>
                                )}
                            </div>

                            <Separator className="my-6 border-dashed" />

                            {/* Pricing Summary */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Delivery Fee</span>
                                    <span className="font-medium text-gray-900">{formatPrice(shippingFee)}</span>
                                </div>

                                <div className="flex justify-between items-center pt-4 mt-2">
                                    <span className="text-base font-bold text-orange-500">Total</span>
                                    <span className="text-xl font-bold text-orange-500">{formatPrice(total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Support Block */}
                        <div className="bg-orange-50/30 rounded-3xl p-6 border border-orange-50">
                            <h3 className="font-bold text-gray-900 mb-2">Need help?</h3>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                                If you encounter any difficulties during the payment process, please contact us.
                            </p>
                            <Button className="w-full bg-[#111827] hover:bg-black text-white rounded-xl h-12 font-bold shadow-md">
                                <Headset className="w-4 h-4 mr-2" />
                                24/7 Support
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
