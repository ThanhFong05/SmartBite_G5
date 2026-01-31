import { Drumstick, Egg, Leaf, Utensils } from "lucide-react"

export function IngredientsList() {
    const ingredients = [
        { name: "White Rice", amount: "150g", icon: Utensils },
        { name: "Chicken Breast", amount: "120g", icon: Drumstick },
        { name: "Steamed Veggies", amount: "80g", icon: Leaf },
        { name: "Egg", amount: "1 unit", icon: Egg },
    ]

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Main Ingredients</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ingredients.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.amount}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
