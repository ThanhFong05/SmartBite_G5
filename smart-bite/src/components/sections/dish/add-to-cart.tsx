"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AddToCart() {
    const [quantity, setQuantity] = useState(1)

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1)
    }

    const increaseQuantity = () => {
        setQuantity(quantity + 1)
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

                <Button className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-orange-600 text-white shadow-lg shadow-orange-200 rounded-xl">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                </Button>

                <div className="w-12 h-12 flex items-center justify-center bg-orange-50 rounded-xl text-orange-500 cursor-pointer hover:bg-orange-100 transition-colors">
                    <Info className="w-6 h-6" />
                </div>
            </div>
        </div>
    )
}
