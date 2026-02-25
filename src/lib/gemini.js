export async function generatePersonalityDescription(discPattern, hexacoMeanH, hexacoMeanE, hexacoMeanX, hexacoMeanA, hexacoMeanC, hexacoMeanO) {
  const apiKey = process.env.GEMINI_API_KEY;
  const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const prompt = `Anda adalah seorang ahli psikologi industri dan klinis.
Saya memiliki klien yang baru melakukan tes kepribadian ganda.

Ini adalah hasil tes mereka:
- Pola Utama Gaya Kerja: ${discPattern}
- Skor rata-rata Karakter Inti (Skala 1-5, dimana 1 sangat rendah dan 5 sangat tinggi):
  * Aspek Kejujuran/Kerendahhatian: ${hexacoMeanH}
  * Aspek Emosionalitas/Kerentanan: ${hexacoMeanE}
  * Aspek Ekstraversi/Sosialisasi: ${hexacoMeanX}
  * Aspek Keramahan/Toleransi: ${hexacoMeanA}
  * Aspek Kehati-hatian/Integritas Kerja: ${hexacoMeanC}
  * Aspek Keterbukaan terhadap Pengalaman Baru: ${hexacoMeanO}

Tugas Anda:
Buatlah deskripsi interpretasi natural TANPA MENGGUNAKAN JARGON TEKNIS SEPERTI "High D", "Low C", "Skor Anda 4", "DISC", "HEXACO", dll. Gunakan bahasa yang natural, profesional, dan empatik.
Keluarkan interpretasi dalam format **JSON** dengan field berikut:
{
  "gayaKerja": "[2 paragraf tentang cara kerja, pengambilan keputusan, dan gaya komunikasi. Jangan sebut nama alat tes atau skor secara spesifik, cukup sebutkan kecenderungan dinamis mereka secara natural]",
  "karakterInti": "[2-3 paragraf tentang kualitas karakter mendalam. Jelaskan bagaimana sifat ini tercermin dalam hidup mereka, namun jangan jabarkan poin per poin. Jadikan narasi gabungan yang mulus dan mengalir]",
  "rekomendasi1": "[Kalimat singkat 1-2 baris tentang saran pengembangan spesifik]",
  "rekomendasi2": "[Kalimat singkat 1-2 baris tentang saran pengembangan spesifik]",
  "rekomendasi3": "[Kalimat singkat 1-2 baris tentang saran pengembangan spesifik]"
}

PENTING: Hanya keluarkan JSON mentah tanpa markdown \`\`\`json atau penjelasan tambahan di luar JSON.`;

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
          responseMimeType: "application/json"
        },
        systemInstruction: {
          parts: [{ text: "Anda adalah AI pembuat laporan psikologi profesional untuk klien. Berikan output hanya dalam format JSON murni yang sesuai struktur yang diminta. Anda dilarang memberikan teks apapun di luar JSON." }]
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean string from markdown if any
    const cleanJsonStr = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonStr);
  } catch (err) {
    console.error("AI Generate Error: ", err);
    throw err;
  }
}
