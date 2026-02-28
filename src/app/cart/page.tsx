"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import {
    Trash2, Minus, Plus, MapPin,
    Banknote, QrCode, Info,
    Flame, Clock, ShoppingBag, Sparkles, AlertCircle, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
    const [cartItems, setCartItems] = useState<any[]>([])
    const [isMounted, setIsMounted] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("momo")
    const [isEditingAddress, setIsEditingAddress] = useState(false)
    const [addressTitle, setAddressTitle] = useState("Bitexco Office")
    const [addressDetails, setAddressDetails] = useState("Floor 15, No 2 Hai Trieu, D.1, HCMC")
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        loadCart()

        // Default address configuration from user profile
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                setIsLoggedIn(true);
                const user = JSON.parse(userStr);
                if (user.address) {
                    setAddressTitle("Registered Address");
                    setAddressDetails(user.address);
                }
            } else {
                setIsLoggedIn(false);
            }
        } catch (e) {
            console.error("Failed to parse user profile: ", e);
        }

        window.addEventListener('cartUpdate', loadCart)
        return () => window.removeEventListener('cartUpdate', loadCart)
    }, [])

    const loadCart = () => {
        const cartData = localStorage.getItem('cartItems')
        if (cartData) {
            setCartItems(JSON.parse(cartData))
        }
    }

    const saveCart = (items: any[]) => {
        localStorage.setItem('cartItems', JSON.stringify(items))
        setCartItems(items)
        window.dispatchEvent(new Event('cartUpdate'))
    }

    const updateQuantity = (id: string, delta: number) => {
        const newCart = cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(0, item.quantity + delta)
                return { ...item, quantity: newQuantity }
            }
            return item
        }).filter(item => item.quantity > 0)

        saveCart(newCart)
    }

    const clearCart = () => {
        saveCart([])
    }

    // Parse price string like "85.000 đ" or "85000" to number
    const parsePrice = (priceStr: string | number) => {
        if (!priceStr) return 0;
        if (typeof priceStr === 'number') return priceStr;
        const numericStr = priceStr.replace(/[^\d]/g, '')
        return parseInt(numericStr, 10) || 0;
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (parsePrice(item.price) * (item.quantity || 1)), 0)
    const shippingFee = subtotal > 0 ? 15000 : 0
    const discount = subtotal >= 200000 ? 10000 : 0
    const total = subtotal + shippingFee - discount

    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)

    // Rough nutrition estimate (could parse from string or just placeholder for demo)
    const totalCalories = cartItems.reduce((sum, item) => {
        const cal = parseInt((item.calories || "0").replace(/\D/g, '')) || 0;
        return sum + (cal * (item.quantity || 1));
    }, 0)

    if (!isMounted) return null

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex items-center gap-3 mb-8">
                    <ShoppingBag className="w-8 h-8 text-orange-500" />
                    <h1 className="text-3xl font-bold text-gray-900">Cart & Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column - Cart Items & Suggestions */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Cart Items Box */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-gray-900">Your Order</h2>
                                    <span className="bg-orange-100 text-orange-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                        {totalItems} items
                                    </span>
                                </div>
                                {cartItems.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="text-gray-500 hover:text-red-500 text-sm flex items-center gap-1 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Empty Cart</h3>
                                    <p className="text-gray-500 mb-6">Bạn chưa chọn items ăn nào. Hãy khám phá thực đơn nhé!</p>
                                    <Link href="/menu">
                                        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
                                            View Menu
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-start">
                                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                                <img
                                                    src={item.image || "/images/placeholder.jpg"}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                {item.rating && (
                                                    <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm text-xs px-1.5 py-0.5 rounded-md font-medium flex items-center gap-1 shadow-sm">
                                                        <span className="text-yellow-400 text-[10px]">★</span>
                                                        {item.rating}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-semibold text-lg text-gray-900 truncate pr-4">{item.title}</h3>
                                                    <div className="font-bold text-orange-500 whitespace-nowrap">
                                                        {formatPrice(parsePrice(item.price))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.desc || item.title}</p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-wrap items-center gap-3 text-xs">
                                                        {item.calories && (
                                                            <div className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded-md font-medium">
                                                                <Flame className="w-3.5 h-3.5 mr-1" />
                                                                {item.calories}
                                                            </div>
                                                        )}
                                                        {item.time && (
                                                            <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded-md font-medium">
                                                                <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                                                {item.time}
                                                            </div>
                                                        )}
                                                        {item.category === "Food" && (
                                                            <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-md font-medium hidden sm:flex">
                                                                <Sparkles className="w-3.5 h-3.5 mr-1" />
                                                                Healthy
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-l-lg transition-colors"
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="w-8 text-center font-medium text-gray-900 text-sm">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-r-lg transition-colors"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* AI Suggestions Box */}
                        {cartItems.length > 0 && (
                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-orange-500" />
                                        <h2 className="text-xl font-bold text-gray-900">AI Suggestions</h2>
                                    </div>
                                    <span className="text-xs text-gray-400">Based on your calorie goals</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {/* Mock suggestions */}
                                    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm relative group cursor-pointer hover:border-orange-200 transition-colors">
                                        <div className="h-28 bg-gradient-to-br from-orange-100 to-orange-50 relative">
                                            <img src="/images/bunchahanoi.jpg" className="w-full h-full object-cover mix-blend-multiply opacity-80" alt="Salad" />
                                            <button className="absolute bottom-2 right-2 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-semibold text-sm text-gray-900 truncate">Fruit Salad</h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-500">150 kcal</span>
                                                <span className="text-sm font-bold text-orange-500">35k</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm relative group cursor-pointer hover:border-orange-200 transition-colors">
                                        <div className="h-28 bg-gradient-to-br from-orange-100 to-orange-50 relative">
                                            <img src="/images/bunchahanoi.jpg" className="w-full h-full object-cover mix-blend-multiply opacity-50" alt="Yogurt" />
                                            <button className="absolute bottom-2 right-2 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-semibold text-sm text-gray-900 truncate">Greek Yogurt</h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-500">110 kcal</span>
                                                <span className="text-sm font-bold text-orange-500">45k</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Payment & Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>

                            {/* Address */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">Delivery Address</span>
                                    <button
                                        onClick={() => {
                                            if (isEditingAddress) {
                                                // Target save action
                                                try {
                                                    const userStr = localStorage.getItem("user");
                                                    if (userStr) {
                                                        const user = JSON.parse(userStr);
                                                        user.address = addressDetails;
                                                        localStorage.setItem("user", JSON.stringify(user));

                                                        const registeredUsersStr = localStorage.getItem("registeredUsers");
                                                        if (registeredUsersStr && user.email) {
                                                            const registeredUsers = JSON.parse(registeredUsersStr);
                                                            if (registeredUsers[user.email]) {
                                                                registeredUsers[user.email].address = addressDetails;
                                                                localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
                                                            }
                                                        }
                                                    }
                                                } catch (e) { }
                                                setIsEditingAddress(false);
                                            } else {
                                                setIsEditingAddress(true);
                                            }
                                        }}
                                        className="text-orange-500 text-xs font-medium hover:underline"
                                    >
                                        {isEditingAddress ? "Save" : "Change"}
                                    </button>
                                </div>
                                <div className="flex gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        {isEditingAddress ? (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={addressTitle}
                                                    onChange={(e) => setAddressTitle(e.target.value)}
                                                    className="w-full bg-white border border-orange-200 rounded px-2 py-1 text-sm font-semibold text-gray-900 focus:outline-none focus:border-orange-500"
                                                    placeholder="Location name (e.g., Home)"
                                                />
                                                <input
                                                    type="text"
                                                    value={addressDetails}
                                                    onChange={(e) => setAddressDetails(e.target.value)}
                                                    className="w-full bg-white border border-orange-200 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-orange-500"
                                                    placeholder="Address details"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm mb-0.5">{addressTitle}</div>
                                                <div className="text-xs text-gray-500">{addressDetails}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="mb-6">
                                <span className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3 block">Payment Method</span>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'bankqr' ? 'border-orange-400 bg-orange-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <div className={`relative flex items-center justify-center content-center w-5 h-5 rounded-full border-2 ${paymentMethod === 'bankqr' ? 'border-orange-400' : 'border-gray-300'}`}>
                                            {paymentMethod === 'bankqr' && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                                        </div>
                                        <input type="radio" className="hidden" name="payment" value="bankqr" checked={paymentMethod === 'bankqr'} onChange={() => setPaymentMethod('bankqr')} />
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <QrCode className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="font-medium text-gray-900 text-sm flex-1">Bank QR</span>
                                    </label>

                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-orange-400 bg-orange-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <div className={`relative flex items-center justify-center content-center w-5 h-5 rounded-full border-2 ${paymentMethod === 'cash' ? 'border-orange-400' : 'border-gray-300'}`}>
                                            {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                                        </div>
                                        <input type="radio" className="hidden" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <Banknote className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="font-medium text-gray-900 text-sm flex-1">Cash</span>
                                    </label>
                                </div>
                            </div>

                            <Separator className="my-6 border-dashed" />

                            {/* Summary */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                                    <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping Fee</span>
                                    <span className="font-medium text-gray-900">{formatPrice(shippingFee)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Discount</span>
                                        <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Nutrition Box */}
                            {cartItems.length > 0 && (
                                <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 mb-6 flex gap-3">
                                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-semibold text-blue-800 mb-1">Total Nutrition</div>
                                        <div className="text-xs text-blue-600 leading-relaxed font-medium">
                                            {totalCalories} kcal • {Math.round(totalCalories * 0.05)}g pr • {Math.round(totalCalories * 0.12)}g cb
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Total Container */}
                            <div className="pt-2 mb-6 text-right">
                                <div className="text-2xl font-bold text-orange-500">
                                    {formatPrice(total)}
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">
                                    (VAT Included)
                                </div>
                            </div>

                            <Link href={isLoggedIn ? "/checkout/qr" : "/auth/login"} className="block w-full">
                                <Button
                                    className="w-full h-14 rounded-2xl text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-200"
                                    disabled={cartItems.length === 0}
                                >
                                    {isLoggedIn ? "Place Order Now" : "Login to Order"}
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
