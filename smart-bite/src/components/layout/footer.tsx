import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-[#2D2424] text-gray-400 py-12 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-white">
                            <div className="bg-primary text-white p-1 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="fill-current"
                                >
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold">SmartBite</span>
                        </div>
                        <p className="text-sm mb-6">
                            Smart food ordering platform with AI nutrition advice, helping you eat healthy every day.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                <Twitter className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-primary transition-colors">Menu</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">AI Advisor</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Orders</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Profile</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Use</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
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
                                <span>smartbite@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm">
                    <p>© 2024 SmartBite. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
