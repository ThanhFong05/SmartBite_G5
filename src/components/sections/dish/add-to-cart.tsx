"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AddToCartProps {
    price?: string
    dish?: any
    selectedExtras?: Record<number, boolean>
}

export function AddToCart({ price, dish, selectedExtras }: AddToCartProps) {
    const [quantity, setQuantity] = useState(1)
    const router = useRouter()

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1)
    }

    const increaseQuantity = () => {
        setQuantity(quantity + 1)
    }

    const handleAddToCart = () => {
        if (!dish) return;

        const userStr = localStorage.getItem("user");
        if (!userStr) {
            alert("Please login to add items to your cart.");
            router.push("/auth/login");
            return;
        }

        const cartData = localStorage.getItem('cartItems');
        let cart = cartData ? JSON.parse(cartData) : [];

        // Determine which extras were selected
        const selectedExtrasArray = dish.extras
            ? dish.extras.filter((_: any, idx: number) => selectedExtras?.[idx])
            : [];

        // Calculate total extra price
        let extraPrice = 0;
        selectedExtrasArray.forEach((extra: any) => {
            const num = parseInt(extra.price.replace(/[^\d]/g, ''), 10) || 0;
            extraPrice += num;
        });

        const basePrice = parseInt((dish.price || "0").replace(/[^\d]/g, ''), 10) || 0;
        const totalPrice = basePrice + extraPrice;
        const formattedTotalPrice = totalPrice.toLocaleString('vi-VN') + ' đ';

        // Append extras to desc for cart display
        let newDesc = dish.desc || "";
        if (selectedExtrasArray.length > 0) {
            const extraNames = selectedExtrasArray.map((e: any) => e.name).join(", ");
            newDesc = newDesc ? `${newDesc} (Thêm: ${extraNames})` : `Thêm: ${extraNames}`;
        }

        // Differentiate cart items by their extra combinations
        const sortedExtraIndices = Object.keys(selectedExtras || {})
            .filter(k => selectedExtras![Number(k)])
            .sort()
            .join('-');

        const cartItemId = sortedExtraIndices ? `${dish.id}-${sortedExtraIndices}` : dish.id;

        const existingItemIndex = cart.findIndex((item: any) => item.id === cartItemId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                ...dish,
                id: cartItemId,
                price: formattedTotalPrice,
                desc: newDesc,
                quantity: quantity,
                extras: selectedExtrasArray
            });
        }

        localStorage.setItem('cartItems', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdate'));

        // Optional: show a small toast or notification here
        alert(`Đã thêm ${quantity} phần ${dish.title} vào giỏ hàng`);
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 md:static md:bg-transparent md:border-t-0 md:p-0">
            <div className="flex items-center gap-4 container mx-auto md:px-0">
                <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                    <button
                        onClick={decreaseQuantity}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900">{quantity}</span>
                    <button
                        onClick={increaseQuantity}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <Button onClick={handleAddToCart} className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-orange-600 text-white shadow-lg shadow-orange-200 rounded-xl">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart {price ? `• ${price}` : ''}
                </Button>

                <div className="w-12 h-12 flex items-center justify-center bg-orange-50 rounded-xl text-orange-500 cursor-pointer hover:bg-orange-100 transition-colors">
                    <Info className="w-6 h-6" />
                </div>
            </div>
        </div>
    )
}
