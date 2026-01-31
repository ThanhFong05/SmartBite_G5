import { Brain, Flame, Clock, Truck } from "lucide-react"

const features = [
    {
        icon: Brain,
        title: "AI Nutrition Advisor",
        description: "Get food suggestions tailored to your health goals from artificial intelligence.",
        color: "text-rose-500",
        bg: "bg-rose-50"
    },
    {
        icon: Flame,
        title: "Calorie Tracking",
        description: "Control your daily calorie intake with detailed nutritional information.",
        color: "text-orange-500",
        bg: "bg-orange-50"
    },
    {
        icon: Clock,
        title: "Quick Ordering",
        description: "Simple interface, order in just a few steps with convenient payment.",
        color: "text-amber-500",
        bg: "bg-amber-50"
    },
    {
        icon: Truck,
        title: "Fast Delivery",
        description: "Professional delivery team, fast delivery ensuring quality and freshness.",
        color: "text-emerald-500",
        bg: "bg-emerald-50"
    }
]

export function Features() {
    return (
        <section className="py-20 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Why Choose <span className="text-primary">SmartBite</span>?
                    </h2>
                    <p className="text-gray-500">
                        We combine advanced AI technology with quality cuisine, bringing a smart and healthy dining experience.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                            <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
