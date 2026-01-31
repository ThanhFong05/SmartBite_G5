"use client"

import { useState } from "react"
import { Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Option {
    id: string
    name: string
    price: number
    selected: boolean
}

export function CustomizationOptions() {
    const [options, setOptions] = useState<Option[]>([
        { id: "sauce", name: "Add Teriyaki Sauce", price: 5000, selected: false },
        { id: "rice", name: "Switch to Brown Rice (Healthier)", price: 10000, selected: false },
    ])

    const toggleOption = (id: string) => {
        setOptions(options.map(opt =>
            opt.id === id ? { ...opt, selected: !opt.selected } : opt
        ))
    }

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Add Extras</h3>
            <div className="space-y-3">
                {options.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => toggleOption(option.id)}
                        className={cn(
                            "flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer",
                            option.selected
                                ? "border-primary bg-primary/5"
                                : "border-gray-100 hover:border-gray-200"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                                option.selected ? "bg-primary border-primary text-white" : "border-gray-300"
                            )}>
                                {option.selected && <Check className="w-3 h-3" />}
                            </div>
                            <span className="text-gray-700 font-medium">{option.name}</span>
                        </div>
                        <span className="text-gray-900 font-semibold">
                            +{option.price.toLocaleString()} đ
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
