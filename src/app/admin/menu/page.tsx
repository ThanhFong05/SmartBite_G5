"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Utensils,
    Beef,
    Carrot,
    Egg,
    Fish,
    Wheat,
    Leaf,
    Drumstick,
    Coffee,
    Cake,
    Apple,
    Upload
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"

// Define icons map
const INGREDIENT_ICONS = [
    { label: "General", value: "box", icon: Utensils },
    { label: "Meat", value: "meat", icon: Beef },
    { label: "Fruit", value: "fruit", icon: Apple },
    { label: "Veggie", value: "leaf", icon: Leaf },
    { label: "Egg", value: "egg", icon: Egg },
    { label: "Fish", value: "fish", icon: Fish },
    { label: "Grain", value: "wheat", icon: Wheat },
]

interface Ingredient {
    name: string
    amount: string
    icon: string
}

interface Extra {
    name: string
    price: string
}

interface Category {
    categoryid: string
    categoryname: string
}

interface Dish {
    id: string
    title: string
    desc: string
    rating: number
    calories: string
    time: string
    price: string
    slug: string
    image: string
    category: string
    dietaryBalance: string
    aiReview: {
        summary: string
        tags: string[]
    }
    ingredients: Ingredient[]
    extras: Extra[]
    diets: string[]
    allergies: string[]
    flavors: string[]
    foodstatus: string
}

const DEFAULT_DISH: Partial<Dish> = {
    title: "",
    desc: "",
    price: "",
    time: "",
    calories: "",
    image: "/images/bunchahanoi.jpg",
    rating: 5,
    category: "",
    dietaryBalance: "Balanced",
    aiReview: { summary: "", tags: [] },
    ingredients: [],
    extras: [],
    diets: [],
    allergies: [],
    flavors: [],
    foodstatus: "Available"
}

const FLAVORS = ["Sweet", "Sour", "Spicy", "Salty", "Bitter"]
const DIETARY_BALANCE = ["Balanced", "Moderate", "Indulgent"]
const DIETS = ["Vegan", "Keto", "Low-carb", "Eat Clean"]
const ALLERGIES = ["Seafood", "Peanut", "Milk", "Egg", "Gluten", "Soy", "Wheat", "Nuts"]
const PREDEFINED_TAGS = ["High Protein", "Low Fat", "Balanced Carbs", "High Fiber", "Low Sugar", "Low Calorie"]

const CATEGORY_ICON_MAP: Record<string, any> = {
    "Main Course": Beef,
    "Healthy Food": Leaf,
    "Drinks": Coffee,
    "Dessert": Cake,
    "Default": Utensils
}

export default function MenuManagement() {
    const [dishes, setDishes] = useState<Dish[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newDish, setNewDish] = useState<Partial<Dish>>(DEFAULT_DISH)
    const [categories, setCategories] = useState<Category[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadError, setUploadError] = useState("")
    const [editingDishId, setEditingDishId] = useState<string | null>(null)

    const supabase = createClient()

    useEffect(() => {
        const initData = async () => {
            setIsLoading(true);
            await Promise.all([fetchDishes(), fetchCategories()]);
            setIsLoading(false);
        };
        initData();
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories")
            if (res.ok) {
                const data: Category[] = await res.json()
                setCategories(data)
                // Set default category if not set
                if (data.length > 0 && !newDish.category) {
                    setNewDish(prev => ({ ...prev, category: data[0].categoryid }))
                }
            }
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    const fetchDishes = async () => {
        try {
            const res = await fetch("/api/dishes")
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setDishes(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewDish(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
            setUploadError("")
        }
    }

    const handleAiReviewChange = (field: 'summary' | 'tags', value: any) => {
        setNewDish(prev => ({
            ...prev,
            aiReview: { ...prev.aiReview, [field]: value } as any
        }))
    }

    const toggleTag = (tag: string) => {
        const currentTags = newDish.aiReview?.tags || []
        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag]
        handleAiReviewChange('tags', newTags)
    }

    // Ingredients Handlers
    const addIngredient = () => {
        setNewDish(prev => ({
            ...prev,
            ingredients: [...(prev.ingredients || []), { name: "", amount: "", icon: "box" }]
        }))
    }

    const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
        const updatedIngredients = [...(newDish.ingredients || [])]
        updatedIngredients[index] = { ...updatedIngredients[index], [field]: value }
        setNewDish(prev => ({ ...prev, ingredients: updatedIngredients }))
    }

    const removeIngredient = (index: number) => {
        const updatedIngredients = [...(newDish.ingredients || [])]
        updatedIngredients.splice(index, 1)
        setNewDish(prev => ({ ...prev, ingredients: updatedIngredients }))
    }

    // Extras Handlers
    const addExtra = () => {
        setNewDish(prev => ({
            ...prev,
            extras: [...(prev.extras || []), { name: "", price: "" }]
        }))
    }

    const updateExtra = (index: number, field: keyof Extra, value: string) => {
        const updatedExtras = [...(newDish.extras || [])]
        updatedExtras[index] = { ...updatedExtras[index], [field]: value }
        setNewDish(prev => ({ ...prev, extras: updatedExtras }))
    }

    const removeExtra = (index: number) => {
        const updatedExtras = [...(newDish.extras || [])]
        updatedExtras.splice(index, 1)
        setNewDish(prev => ({ ...prev, extras: updatedExtras }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setUploadError("")

        if (!newDish.category) {
            alert("Vui lòng chọn danh mục cho món ăn!");
            setIsSubmitting(false);
            return;
        }

        try {
            let imageUrl = newDish.image

            // Nếu người dùng chọn file mới, upload lên Supabase Storage
            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop()
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
                const filePath = `${fileName}`

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('food-images')
                    .upload(filePath, selectedFile)

                if (uploadError) {
                    console.error("Lỗi upload ảnh chi tiết:", uploadError)
                    setUploadError(`Lỗi tải ảnh: ${uploadError.message || JSON.stringify(uploadError)}`)
                    setIsSubmitting(false)
                    return
                }

                // Lấy URL Public của ảnh vừa up
                const { data: publicUrlData } = supabase.storage
                    .from('food-images')
                    .getPublicUrl(filePath)

                imageUrl = publicUrlData.publicUrl
            }

            // Gắn URL ảnh vào thông tin món trước khi lưu
            const finalDish = { ...newDish, image: imageUrl }

            const url = editingDishId ? `/api/dishes/${editingDishId}` : "/api/dishes"
            const method = editingDishId ? "PUT" : "POST"

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalDish)
            })

            if (res.ok) {
                alert(editingDishId ? "Cập nhật món ăn thành công!" : "Lưu món ăn thành công!");
                await fetchDishes()
                setIsDialogOpen(false)
                setNewDish(DEFAULT_DISH)
                setEditingDishId(null)
                setSelectedFile(null)
            } else {
                const errorData = await res.json();
                alert(`Lỗi khi lưu món ăn: ${errorData.error || "Không xác định"}`);
            }
        } catch (error: any) {
            console.error("Error adding dish:", error)
            alert(`Đã xảy ra lỗi: ${error.message || "Không thể kết nối với máy chủ"}`);
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/dishes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ foodstatus: newStatus })
            })
            if (res.ok) {
                setDishes(prev => prev.map(dish =>
                    dish.id === id ? { ...dish, foodstatus: newStatus } : dish
                ))
            } else {
                const errorData = await res.json()
                alert(`Lỗi: ${errorData.error || "Không thể cập nhật trạng thái"}`)
            }
        } catch (error) {
            console.error("Error updating dish status:", error)
            alert("Đã xảy ra lỗi khi kết nối với máy chủ")
        }
    }

    const handleDelete = async (id: string) => {
        // Hàm này giữ lại để tương thích nếu cần, nhưng logic chính đã chuyển sang handleUpdateStatus
        await handleUpdateStatus(id, 'Unavailable');
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Menu Management</h1>
                    <p className="text-gray-500">Manage your restaurant menu items</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200"
                            onClick={() => {
                                setNewDish(DEFAULT_DISH);
                                setEditingDishId(null);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add New Dish
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>{editingDishId ? "Edit Dish" : "Add New Dish"}</DialogTitle>
                            <DialogDescription>
                                {editingDishId ? "Update dish details, ingredients and extras." : "Create a new menu item with filters, detailed ingredients and extras."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                            {/* Basic Info */}
                            <div className="grid gap-4">
                                <h3 className="font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Dish Name</Label>
                                    <Input id="title" name="title" value={newDish.title} onChange={handleInputChange} required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="desc">Description</Label>
                                    <Input id="desc" name="desc" value={newDish.desc} onChange={handleInputChange} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input id="price" name="price" value={newDish.price} onChange={handleInputChange} placeholder="e.g. 50.000 đ" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="image">Dish Image</Label>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id="image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="cursor-pointer file:cursor-pointer file:bg-orange-50 file:text-orange-700 file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2 hover:file:bg-orange-100"
                                                />
                                                {selectedFile && <span className="text-xs text-green-600 block shrink-0 flex items-center gap-1"><Upload className="w-3 h-3" /> Selected</span>}
                                            </div>
                                            {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
                                            {!selectedFile && newDish.image && (
                                                <p className="text-xs text-gray-400 mt-1 truncate">Current: {newDish.image}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="time">Time</Label>
                                        <Input id="time" name="time" value={newDish.time} onChange={handleInputChange} placeholder="20m" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="calories">Calories</Label>
                                        <Input id="calories" name="calories" value={newDish.calories} onChange={handleInputChange} placeholder="500 kcal" />
                                    </div>
                                </div>
                            </div>

                            {/* Categories & Dietary Balance */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Categories</Label>
                                    <div className="space-y-2">
                                        {categories.length > 0 ? (
                                            categories.map(cat => {
                                                const isSelected = newDish.category === cat.categoryid
                                                const Icon = CATEGORY_ICON_MAP[cat.categoryname] || CATEGORY_ICON_MAP["Default"]
                                                return (
                                                    <div
                                                        key={cat.categoryid}
                                                        onClick={() => setNewDish(prev => ({ ...prev, category: cat.categoryid }))}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected
                                                            ? 'bg-orange-50 border-orange-500 text-orange-700'
                                                            : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <Icon className={`h-5 w-5 ${isSelected ? 'text-orange-500' : 'text-gray-400'}`} />
                                                        <span className="font-medium">{cat.categoryname}</span>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <p className="text-sm text-gray-500 italic pb-2">No categories found in DB. Please add them in Supabase.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Dietary Balance</Label>
                                    <div className="space-y-2">
                                        {DIETARY_BALANCE.map(balance => (
                                            <div key={balance} className="flex items-center space-x-2 p-2">
                                                <Checkbox
                                                    id={`balance-${balance}`}
                                                    checked={newDish.dietaryBalance === balance}
                                                    onCheckedChange={() => setNewDish(prev => ({ ...prev, dietaryBalance: balance }))}
                                                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 rounded-full h-5 w-5"
                                                />
                                                <label htmlFor={`balance-${balance}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                                    {balance}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {editingDishId && (
                                    <div className="space-y-3">
                                        <Label className="text-base font-semibold">Status (Trạng thái hiển thị)</Label>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant={newDish.foodstatus === "Available" ? "default" : "outline"}
                                                className={newDish.foodstatus === "Available" ? "bg-green-600 hover:bg-green-700" : ""}
                                                onClick={() => setNewDish(prev => ({ ...prev, foodstatus: "Available" }))}
                                            >
                                                Còn món
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={newDish.foodstatus === "Out of Stock" ? "default" : "outline"}
                                                className={newDish.foodstatus === "Out of Stock" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                                                onClick={() => setNewDish(prev => ({ ...prev, foodstatus: "Out of Stock" }))}
                                            >
                                                Hết món
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={newDish.foodstatus === "Unavailable" ? "default" : "outline"}
                                                className={newDish.foodstatus === "Unavailable" ? "bg-red-600 hover:bg-red-700" : ""}
                                                onClick={() => setNewDish(prev => ({ ...prev, foodstatus: "Unavailable" }))}
                                            >
                                                Ngừng bán
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* Diets */}
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Diet</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {DIETS.map(diet => (
                                            <div key={diet} className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                                <Checkbox
                                                    id={`diet-${diet}`}
                                                    checked={newDish.diets?.includes(diet)}
                                                    onCheckedChange={() => {
                                                        const current = newDish.diets || []
                                                        setNewDish(prev => ({
                                                            ...prev,
                                                            diets: current.includes(diet) ? current.filter(d => d !== diet) : [...current, diet]
                                                        }))
                                                    }}
                                                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 rounded-full"
                                                />
                                                <label htmlFor={`diet-${diet}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                                    {diet}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Allergies and Flavors */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Food Allergies</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {ALLERGIES.map(allergy => (
                                            <div key={allergy} className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                                <Checkbox
                                                    id={`allergy-${allergy}`}
                                                    checked={newDish.allergies?.includes(allergy)}
                                                    onCheckedChange={() => {
                                                        const current = newDish.allergies || []
                                                        setNewDish(prev => ({
                                                            ...prev,
                                                            allergies: current.includes(allergy) ? current.filter(a => a !== allergy) : [...current, allergy]
                                                        }))
                                                    }}
                                                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 rounded-full"
                                                />
                                                <label htmlFor={`allergy-${allergy}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                                    {allergy}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Flavor</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {FLAVORS.map(flavor => (
                                            <div key={flavor} className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                                <Checkbox
                                                    id={`flavor-${flavor}`}
                                                    checked={newDish.flavors?.includes(flavor)}
                                                    onCheckedChange={() => {
                                                        const current = newDish.flavors || []
                                                        setNewDish(prev => ({
                                                            ...prev,
                                                            flavors: current.includes(flavor) ? current.filter(f => f !== flavor) : [...current, flavor]
                                                        }))
                                                    }}
                                                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 rounded-full"
                                                />
                                                <label htmlFor={`flavor-${flavor}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                                    {flavor}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* SmartBite AI Review */}
                            <div className="grid gap-4">
                                <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                                    SmartBite AI Review
                                    <span className="text-xs font-normal text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Automated</span>
                                </h3>
                                <div className="space-y-2">
                                    <Label>Nutrition</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {PREDEFINED_TAGS.map(tag => (
                                            <div key={tag} className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                                <Checkbox
                                                    id={`tag-${tag}`}
                                                    checked={newDish.aiReview?.tags?.includes(tag)}
                                                    onCheckedChange={() => toggleTag(tag)}
                                                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                                />
                                                <label htmlFor={`tag-${tag}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                                    {tag}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="aiSummary">AI Summary</Label>
                                    <textarea
                                        id="aiSummary"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newDish.aiReview?.summary}
                                        onChange={(e) => handleAiReviewChange('summary', e.target.value)}
                                        placeholder="This dish is Highly Suitable..."
                                    />
                                </div>
                            </div>

                            {/* Main Ingredients */}
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h3 className="font-semibold text-gray-900">Main Ingredients</h3>
                                    <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="text-orange-600 border-orange-200 hover:bg-orange-50">
                                        <Plus className="h-3 w-3 mr-1" /> Add
                                    </Button>
                                </div>
                                {newDish.ingredients?.map((ing, idx) => (
                                    <div key={idx} className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg relative group">
                                        <div className="flex-1 space-y-1">
                                            <Label className="text-xs">Icon</Label>
                                            <select
                                                className="w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={ing.icon}
                                                onChange={(e) => updateIngredient(idx, 'icon', e.target.value)}
                                            >
                                                {INGREDIENT_ICONS.map(icon => (
                                                    <option key={icon.value} value={icon.value}>{icon.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-[2] space-y-1">
                                            <Label className="text-xs">Name</Label>
                                            <Input value={ing.name} onChange={(e) => updateIngredient(idx, 'name', e.target.value)} placeholder="e.g. White Rice" className="h-9 bg-white" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <Label className="text-xs">Amount</Label>
                                            <Input value={ing.amount} onChange={(e) => updateIngredient(idx, 'amount', e.target.value)} placeholder="150g" className="h-9 bg-white" />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(idx)} className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {(!newDish.ingredients || newDish.ingredients.length === 0) && (
                                    <p className="text-sm text-gray-500 italic text-center py-2">No ingredients added yet.</p>
                                )}
                            </div>

                            {/* Extras */}
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h3 className="font-semibold text-gray-900">Add Extras</h3>
                                    <Button type="button" variant="outline" size="sm" onClick={addExtra} className="text-orange-600 border-orange-200 hover:bg-orange-50">
                                        <Plus className="h-3 w-3 mr-1" /> Add
                                    </Button>
                                </div>
                                {newDish.extras?.map((extra, idx) => (
                                    <div key={idx} className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-[2] space-y-1">
                                            <Label className="text-xs">Name</Label>
                                            <Input value={extra.name} onChange={(e) => updateExtra(idx, 'name', e.target.value)} placeholder="e.g. Add Teriyaki Sauce" className="h-9 bg-white" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <Label className="text-xs">Price</Label>
                                            <Input value={extra.price} onChange={(e) => updateExtra(idx, 'price', e.target.value)} placeholder="+5.000 đ" className="h-9 bg-white" />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeExtra(idx)} className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {(!newDish.extras || newDish.extras.length === 0) && (
                                    <p className="text-sm text-gray-500 italic text-center py-2">No extras added yet.</p>
                                )}
                            </div>

                            <DialogFooter className="mt-6 sticky bottom-0 bg-white pt-2 border-t">
                                <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                                    {isSubmitting ? "Saving..." : (editingDishId ? "Update Dish" : "Save Dish")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>


            </div>

            <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Dishes List</CardTitle>
                        <div className="relative w-64 hidden md:block">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input placeholder="Search dishes..." className="pl-8 bg-gray-50 border-gray-200 focus-visible:ring-orange-500" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-4 text-gray-500">Loading menu...</div>
                    ) : (
                        <div className="rounded-lg border border-gray-100 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                    <tr>
                                        <th className="p-4">Image</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {dishes.map((dish) => (
                                        <tr key={dish.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <img
                                                    src={dish.image}
                                                    alt={dish.title}
                                                    className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                                                />
                                            </td>
                                            <td className="p-4 font-medium text-gray-900">{dish.title}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                                    ${dish.category === "Food" ? "bg-green-50 text-green-700" :
                                                        dish.category === "Drinks" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                                                    {dish.category || "Food"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600 font-medium">{dish.price}</td>
                                            <td className="p-4">
                                                <select
                                                    value={dish.foodstatus}
                                                    onChange={(e) => handleUpdateStatus(dish.id, e.target.value)}
                                                    className={`text-xs font-medium rounded-full px-2 py-1 border border-gray-200 focus:ring-2 focus:ring-orange-200 cursor-pointer outline-none
                                                        ${dish.foodstatus === "Available" ? "bg-green-50 text-green-700 border-green-100" :
                                                            dish.foodstatus === "Out of Stock" ? "bg-yellow-50 text-yellow-700 border-yellow-100" : "bg-red-50 text-red-700 border-red-100"}`}
                                                >
                                                    <option value="Available">Còn bán</option>
                                                    <option value="Out of Stock">Hết hàng</option>
                                                    <option value="Unavailable">Ngừng bán</option>
                                                </select>
                                            </td>

                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        onClick={() => {
                                                            setNewDish(dish);
                                                            setEditingDishId(dish.id);
                                                            setIsDialogOpen(true);
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {dishes.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-500">
                                                No dishes found. Add your first dish!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
