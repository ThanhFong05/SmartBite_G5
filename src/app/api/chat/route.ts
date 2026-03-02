import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages } = body;
        const apiKey = process.env.GEMINI_API_KEY;

        // 1. Kiểm tra đầu vào
        if (!apiKey) {
            return NextResponse.json({ error: "API key is missing" }, { status: 500 });
        }
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: "No messages provided" }, { status: 400 });
        }

        const supabase = await createClient();

        // 2. Lấy danh sách món ăn từ database để làm context (Kế thừa Đoạn 1)
        const { data: dishes, error: dishesError } = await supabase
            .from('fooditems')
            .select('foodname, descriptions, price, calories, preptime, allergyinfo, ingredients')
            .eq('foodstatus', 'Available');

        if (dishesError) {
            console.error("Error fetching dishes for chat context:", dishesError);
        }

        const menuContext = (dishes || []).map(dish => {
            let metadata = { ingredients: [] };
            try {
                if (dish.ingredients && typeof dish.ingredients === 'string') {
                    if (dish.ingredients.startsWith('{') || dish.ingredients.startsWith('[')) {
                        metadata = JSON.parse(dish.ingredients);
                    }
                } else if (typeof dish.ingredients === 'object' && dish.ingredients !== null) {
                    metadata = dish.ingredients;
                }
            } catch (e) {
                console.warn(`Error parsing ingredients for dish ${dish.foodname}:`, e);
            }

            const ingredientsList = Array.isArray(metadata?.ingredients)
                ? metadata.ingredients.map((i: any) => i.name || i).join(', ')
                : (typeof dish.ingredients === 'string' ? dish.ingredients : 'N/A');

            return `- ${dish.foodname}: ${dish.descriptions}. Giá: ${(dish.price || 0).toLocaleString('vi-VN')}đ, Calo: ${dish.calories || 0}kcal, Thời gian: ${dish.preptime || 0}p. Thành phần: ${ingredientsList}. Dị ứng: ${dish.allergyinfo || 'N/A'}`;
        }).join('\n') || "Hiện tại không có món ăn nào trong thực đơn.";

        console.log(`Successfully built menu context with ${dishes?.length || 0} dishes.`);

        // 3. Định nghĩa System Prompt (Kế thừa Đoạn 3)
        const systemPrompt = `Bạn là SmartBite AI Advisor, một chuyên gia dinh dưỡng và trợ lý đặt món ăn thông minh. 
Bạn đang hỗ trợ người dùng trên ứng dụng đặt đồ ăn SmartBite.
Dưới đây là thực đơn hiện tại của nhà hàng:\n${menuContext}\n
NHIỆM VỤ CỦA BẠN:
1. Trả lời các câu hỏi về dinh dưỡng, sức khỏe và thực đơn một cách chuyên nghiệp, thân thiện.
2. Gợi ý các món ăn CÓ TRONG THỰC ĐƠN trên dựa trên yêu cầu của người dùng.
3. Luôn trả lời bằng TIẾNG VIỆT, lịch sự và ngắn gọn.`;

        // 4. Khởi tạo Gemini SDK (Kế thừa Đoạn 2 + Tối ưu hóa System Instruction)
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt // Nhồi toàn bộ bối cảnh và vai trò vào đây
        });

        // 5. Chuẩn bị lịch sử trò chuyện (Chuyển đổi role sang format của Gemini)
        const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        const latestMessage = messages[messages.length - 1].content;

        // 6. Gửi tin nhắn và nhận kết quả
        const chat = model.startChat({ history: formattedHistory });
        const result = await chat.sendMessage(latestMessage);
        
        const content = result.response.text();

        if (!content) {
            return NextResponse.json(
                { error: "No content returned from AI" },
                { status: 500 }
            );
        }

        // 7. Trả về cho Frontend
        return NextResponse.json({ 
            role: "assistant", 
            content: content 
        });

    } catch (error: any) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { 
                error: error.message || "Lỗi không xác định",
                details: error.stack,
                status: "failed" 
            },
            { status: 500 }
        );
    }
}