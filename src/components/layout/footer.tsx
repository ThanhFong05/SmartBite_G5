import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
    return (
        <footer className="bg-[#2D2424] text-gray-400 py-12 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4 text-white">
                            <Image
                                src="/images/logo.png"
                                alt="SmartBite Logo"
                                width={56}
                                height={56}
                                className="rounded-full object-contain bg-white"
                            />
                            <span className="text-2xl font-bold text-primary">SmartBite</span>
                        </div>
                        <p className="text-sm mb-6">
                            Smart food ordering platform with AI nutrition advice, helping you eat well every day.
                        </p>
                        <div className="flex gap-4">
                            <Link href="https://www.facebook.com/tfonghjhj" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="https://www.instagram.com/_tfongg_/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="https://www.facebook.com/tfonghjhj" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                <Twitter className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
                            <li><Link href="/ai-advisor" className="hover:text-primary transition-colors">AI Advisor</Link></li>
                            <li><Link href="/profile/history" className="hover:text-primary transition-colors">Orders</Link></li>
                            <li><Link href="/profile" className="hover:text-primary transition-colors">Profile</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="https://www.facebook.com/tfonghjhj" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="https://www.facebook.com/tfonghjhj" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="https://www.facebook.com/tfonghjhj" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Terms of Use</Link></li>
                            <li><Link href="https://www.facebook.com/tfonghjhj" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Contact</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span>An Phu Thinh New Urban Area, Quy Nhon Dong Ward, Gia Lai Province</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>0842217217</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>admin123@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm">
                    <p>© 2026 SmartBite. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
