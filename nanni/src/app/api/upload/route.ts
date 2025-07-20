import { NextResponse } from "next/server";
import axios from "axios";

const IMAGEBB_API_KEY = process.env.IMAGEBB_API_KEY!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return new NextResponse(
        JSON.stringify({ error: "Image data is required" }),
        { status: 400, headers: corsHeaders },
      );
    }

    // Extrai apenas o base64 se for data URL
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Verifica chave de API
    if (!IMAGEBB_API_KEY) {
      console.error("Erro: IMAGEBB_API_KEY não definida");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500, headers: corsHeaders },
      );
    }

    const formData = new URLSearchParams();
    formData.append("image", cleanBase64);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMAGEBB_API_KEY}`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 30000, // 30s timeout
      },
    );

    return NextResponse.json(
      { link: response.data.data.url },
      { status: 200, headers: corsHeaders },
    );
  } catch (error: unknown) {
    // Log detalhado do erro
    let errorDetails = "Unknown error";

    if (axios.isAxiosError(error)) {
      errorDetails = JSON.stringify({
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else if (error instanceof Error) {
      errorDetails = error.message;
    }

    console.error("Erro detalhado no upload:", errorDetails);

    return new NextResponse(
      JSON.stringify({
        error: "Erro ao enviar imagem para ImageBB.",
        details: errorDetails,
      }),
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
