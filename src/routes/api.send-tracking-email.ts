import { json } from "@tanstack/react-start";
import { sendTrackingEmail } from "@/lib/email-service";
import type { Order } from "@/lib/order-tracking";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order } = body as { order: Order };

    if (!order) {
      return json(
        { success: false, message: "Order data is required" },
        { status: 400 },
      );
    }

    const result = await sendTrackingEmail({ order });

    if (result.success) {
      return json(
        { success: true, message: "Email sent successfully", messageId: result.messageId },
        { status: 200 },
      );
    } else {
      return json(
        { success: false, message: result.message || result.error },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
