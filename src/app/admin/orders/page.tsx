"use client"

import { useState, useEffect } from "react"
import { Search, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function OrderManagement() {
    const [orders, setOrders] = useState<any[]>([])

    // Poll for new orders from API
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const res = await fetch('/api/orders', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    const localOrders = data.orders || [];

                    // Log để debug (có thể xóa sau khi fix xong)
                    // console.log("Raw orders from API:", localOrders.map(o => ({ id: o.orderid, st: o.orderstatus })));

                    // Map DB format to UI format
                    const formatted = localOrders.map((o: any) => {
                        const statusMap: Record<number, string> = {
                            1: 'pending',
                            2: 'accepted',
                            3: 'preparing',
                            4: 'delivering',
                            5: 'completed'
                        };

                        const rawStatus = Number(o.orderstatus);
                        const status = statusMap[rawStatus] || 'pending';

                        // Lấy paymentStatus từ payments (Supabase có thể trả về mảng hoặc đối tượng)
                        const paymentInfo = Array.isArray(o.payments) ? (o.payments.length > 0 ? o.payments[0] : null) : o.payments;
                        const pStatus = paymentInfo?.paymentstatus || 'pending';

                        return {
                            id: o.orderid,
                            customer: o.users?.fullname || "Guest",
                            email: o.users?.email,
                            items: (o.orderitems || []).map((oi: any) => {
                                const tStr = oi.orderitemtoppings?.map((t: any) => t.toppingoptions?.toppingname).filter(Boolean).join(", ");
                                return oi.fooditems?.foodname + (tStr ? ` (+${tStr})` : "");
                            }).filter(Boolean).join(", ") || "No items",
                            price: new Intl.NumberFormat('vi-VN').format(o.finalamount || 0) + 'đ',
                            time: new Date(o.ordertime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            status: status,
                            paymentStatus: pStatus,
                            avatar: "/images/avatar-placeholder.jpg"
                        };
                    });
                    setOrders(formatted);
                }
            } catch (error) {
                console.error("Load Orders Error:", error);
            }
        }

        loadOrders()

        // Poll every 5 seconds for new orders
        const interval = setInterval(loadOrders, 5000)

        return () => clearInterval(interval)
    }, [])

    const updateOrderStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Update local state for immediate feedback
                setOrders(prev => prev.map(order => order.id === id ? { ...order, status: newStatus } : order));
                // Reload from server to be sure
                const refreshRes = await fetch('/api/orders', { cache: 'no-store' });
                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    const localOrders = data.orders || [];
                    // ... same mapping as useEffect ...
                    // Short version for refresh:
                    window.location.reload(); // Quickest way to sync all state including status Map
                }
            } else {
                const errData = await res.json();
                alert("Lỗi cập nhật: " + (errData.error || "Không rõ nguyên nhân"));
            }
        } catch (error) {
            console.error("Update Status Error:", error);
            alert("Lỗi kết nối máy chủ.");
        }
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-500 mt-1">Manage incoming orders and accept payments</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-lg">Incoming Orders</h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Search orders..." className="pl-9 h-10 border-gray-200 bg-gray-50 focus-visible:ring-orange-100 rounded-xl" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-sm font-semibold border-b border-gray-100">
                                <th className="px-6 py-4 rounded-tl-xl whitespace-nowrap">Order ID</th>
                                <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                                <th className="px-6 py-4 whitespace-nowrap">Items</th>
                                <th className="px-6 py-4 whitespace-nowrap">Price</th>
                                <th className="px-6 py-4 whitespace-nowrap">Time</th>
                                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 rounded-tr-xl text-center whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="font-bold text-gray-900">{order.id}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                                <img src={order.avatar} alt={order.customer} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-700">{order.customer}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm text-gray-600 line-clamp-1">{order.items}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="font-bold text-gray-900">{order.price}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm text-gray-500">{order.time}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        {order.status === 'pending' && (
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'completed'
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.paymentStatus === 'completed' ? 'Paid - Post Confirmation' : 'Awaiting QR Payment'}
                                            </span>
                                        )}
                                        {order.status === 'accepted' && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                Confirmed
                                            </span>
                                        )}
                                        {order.status === 'preparing' && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                                Preparing
                                            </span>
                                        )}
                                        {order.status === 'delivering' && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                Delivering
                                            </span>
                                        )}
                                        {order.status === 'completed' && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                                Completed
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'accepted')}
                                                className="inline-flex px-4 py-2 font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
                                            >
                                                Confirm Order
                                            </button>
                                        )}
                                        {order.status === 'accepted' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                className="inline-flex px-4 py-2 font-bold text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors shadow-sm"
                                            >
                                                Cook Dish
                                            </button>
                                        )}
                                        {order.status === 'preparing' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'delivering')}
                                                className="inline-flex px-4 py-2 font-bold text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                                            >
                                                Deliver
                                            </button>
                                        )}
                                        {order.status === 'delivering' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                                className="inline-flex px-4 py-2 font-bold text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors shadow-sm"
                                            >
                                                Complete
                                            </button>
                                        )}
                                        {order.status === 'completed' && (
                                            <div className="flex items-center justify-center gap-1.5 text-purple-600 text-sm font-bold">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Completed
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
