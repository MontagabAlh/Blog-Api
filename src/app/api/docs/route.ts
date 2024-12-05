import { NextResponse } from "next/server";
import swaggerSpec from "@/utils/swagger"; // ملف التكوين الخاص بـ swagger-jsdoc

export async function GET() {
    return NextResponse.json(swaggerSpec);
}
