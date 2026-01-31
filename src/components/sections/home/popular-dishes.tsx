import { Star, Clock, Flame } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const dishes = [
    {
        title: "Teriyaki Chicken Rice",
        desc: "Fragrant white rice combined with savory Teriyaki grilled chicken, fresh vegetables.",
        rating: 4.8,
        calories: "520 kcal",
        time: "15 mins",
        price: "65.000 đ",
        slug: "healthy-teriyaki-chicken-rice",
        image: (
            <img
                src="/images/pieces-chicken-fillet-with-mushrooms-stewed-tomato-sauce-with-boiled-broccoli-rice-proper-nutrition-healthy-lifestyle-dietetic-menu-top-view.jpg"
                alt="Teriyaki Chicken Rice"
                className="w-full h-full object-cover"
            />
        ),
    },
    {
        title: "Bun Cha Ha Noi",
        desc: "The essence of Hanoi cuisine. Succulent minced pork patties and pork belly slices are marinated in traditional spices and charcoal-grilled to smoky perfection.",
        rating: 4.9,
        calories: "580 kcal",
        time: "20 mins",
        price: "50.000 đ",
        slug: "bun-cha-ha-noi",
        image: (
            <img
                src="/images/bunchahanoi.jpg"
                alt="Bun Cha Ha Noi"
                className="w-full h-full object-cover"
            />
        ),
    },
    {
        title: "Tiramisu Cake",
        desc: "A love cake from Italy. The rich flavor of rum, the bitterness of cocoa, and the characteristic creaminess of cheese.",
        rating: 4.7,
        calories: "380 kcal",
        time: "2 mins",
        price: "20.000 đ",
        slug: "tiramisu-cake",
        image: (
            <img
                src="/images/tiramisu.jpg"
                alt="Tiramisu Cake"
                className="w-full h-full object-cover"
            />
        ),
    },
    {
        title: "Tuna Salad",
        desc: "Tuna salad with greens is a refreshing and nutritious dish.",
        rating: 4.6,
        calories: "350 kcal",
        time: "8 mins",
        price: "60.000 đ",
        slug: "tuna-salad",
        image: (
            <img
                src="/images/saladcangu.jpg"
                alt="Tuna Salad"
                className="w-full h-full object-cover"
            />
        ),
    },
]

export function PopularDishes() {
    return (
        <section className="py-20 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Popular <span className="text-primary">Dishes</span>
                        </h2>
                        <p className="text-gray-500 mt-2">
                            The most loved dishes at SmartBite
                        </p>
                    </div>
                    <Button variant="outline" className="hidden md:flex">
                        View All
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dishes.map((dish, index) => (
                        <Link href={`/dishes/${dish.slug}`} key={index} className="block group">
                            <Card className="overflow-hidden bg-white hover:shadow-lg transition-all duration-300 border-gray-100 h-full">
                                <div className="relative aspect-[5/4] bg-gray-100 overflow-hidden">
                                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                                        {dish.image}
                                    </div>
                                    <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 z-10">Popular</Badge>
                                </div>

                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{dish.title}</h3>
                                        <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            {dish.rating}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                        {dish.desc}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Flame className="w-3 h-3" />
                                            {dish.calories}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {dish.time}
                                        </div>
                                    </div>

                                    <div className="font-bold text-primary text-lg">
                                        {dish.price}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
