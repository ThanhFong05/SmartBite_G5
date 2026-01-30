// src/types/index.ts

// ===================== 1. USER & AUTH (PROFILE) =====================
// Bảng 'profiles' trong Supabase (Liên kết với bảng Auth.users)
export type UserProfile = {
    id: string; // UUID từ Supabase Auth
    full_name: string;
    email: string;
    phone_number: string;
    birth_date?: string; // Format: YYYY-MM-DD
    address_delivery: string; // Địa chỉ mặc định
    role: 'admin' | 'user'; // Phân quyền
    created_at: string;
};

// ===================== 2. MENU & FOOD (SẢN PHẨM) =====================

// Danh mục món (Món chính, Đồ uống...)
export type Category = {
    category_id: number; // Tự tăng
    category_name: string;
};

// Tùy chọn Topping (Trân châu, Thêm thịt...)
export type ToppingOption = {
    topping_id: number;
    topping_name: string;
    surcharge: number; // Giá tiền cộng thêm
};

// Món ăn chính
export type FoodItem = {
    food_id: number; // Tự tăng
    category_id: number;
    food_name: string;
    original_price: number;
    sale_price?: number; // Giá giảm (nếu có)
    food_image: string; // URL ảnh từ Supabase Storage
    description?: string;
    food_status: 'available' | 'out_of_stock' | 'hidden';

    // 🔥 QUAN TRỌNG: Dành cho tính năng AI & Healthy
    calories: number;
};

// ===================== 3. CART (GIỎ HÀNG FRONTEND) =====================
// Type này dùng cho State quản lý giỏ hàng ở Frontend (Zustand)

export type CartItemTopping = {
    topping_id: number;
    topping_name: string;
    surcharge: number;
};

export type CartItem = {
    food_id: number;
    food_name: string;
    food_image: string;
    price: number; // Giá chốt tại thời điểm thêm vào giỏ (đã tính sale)
    quantity: number;
    calories: number; // Calo đơn vị của 1 món
    note?: string; // Ghi chú: "Ít đường", "Không hành"

    // Mảng các topping user đã chọn cho món này
    selected_toppings: CartItemTopping[];
};

// ===================== 4. VOUCHERS =====================
export type Voucher = {
    voucher_id: number;
    voucher_code: string; // VD: "WELCOME20"
    voucher_type: 'percent' | 'fixed_amount';
    discount_value: number; // VD: 20 (nếu là %) hoặc 50000 (nếu là tiền)
    min_order_value: number; // Đơn tối thiểu
    max_usage: number; // Số lượt dùng tối đa
    start_date: string;
    end_date: string;
    is_active: boolean;
};

// ===================== 5. ORDERS (ĐƠN HÀNG) =====================

export type OrderStatus = 'pending' | 'confirmed' | 'cooking' | 'delivering' | 'completed' | 'cancelled';

// Chi tiết từng món trong đơn hàng (Lưu vào DB)
export type OrderItem = {
    order_item_id: number;
    order_id: number;
    food_id: number;
    food_name: string; // Lưu cứng tên món (đề phòng Admin đổi tên sau này)
    quantity: number;
    unit_price: number; // Giá tại thời điểm mua
    total_calories: number; // Tổng calo của dòng này

    // Lưu danh sách topping dưới dạng chuỗi JSON hoặc text
    // VD: "Trân châu đen (+5k), Thạch dừa (+3k)"
    toppings_list?: string;
};

// Đơn hàng tổng
export type Order = {
    order_id: number;
    user_id: string; // UUID của người mua
    full_name: string; // Tên người nhận
    phone_number: string; // SĐT người nhận
    delivery_address: string; // Địa chỉ giao hàng

    // Thời gian
    order_time: string;
    delivery_time?: string;

    // Tài chính
    food_amount: number; // Tiền hàng
    shipping_fee: number; // Phí ship (thường quán tự ship thì có thể free hoặc tính phí)
    discount_amount: number; // Tiền giảm giá
    final_amount: number; // Khách phải trả

    // 🔥 Dinh dưỡng tổng đơn
    total_order_calories: number;

    // Thông tin khác
    voucher_id?: number;
    order_status: OrderStatus;
    payment_method: 'COD' | 'Banking' | 'Momo';
    payment_status: 'unpaid' | 'paid';
    note?: string; // Ghi chú đơn hàng
};

// ===================== 6. REVIEWS (ĐÁNH GIÁ) =====================
export type Review = {
    review_id: number;
    order_id: number;
    user_id: string;

    rating: number; // 1 - 5 sao
    comment?: string;
    media_url?: string; // Ảnh chụp món ăn thực tế
    created_at: string;

    // Join với bảng User để lấy tên hiển thị
    user_full_name?: string;
    user_avatar?: string;
};