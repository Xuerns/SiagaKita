import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { getBMKGWeather } from "@/lib/bmkg";

export async function GET(request: NextRequest) {
  await connection();
  try {
    const { searchParams } = new URL(request.url);
    // Default to Bogor Selatan (32.71.01.1001) or accept query adm4
    const adm4 = searchParams.get("adm4") || "32.71.01.1001";

    const data = await getBMKGWeather(adm4);

    return NextResponse.json({
      success: true,
      data: {
        weather: data.weather,
        forecast: data.forecast,
      },
      source: data.source,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("API /api/cuaca Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal mengambil data cuaca BMKG",
      },
      { status: 500 }
    );
  }
}
