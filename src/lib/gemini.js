export async function generatePersonalityDescription(discPattern, hexacoMeanH, hexacoMeanE, hexacoMeanX, hexacoMeanA, hexacoMeanC, hexacoMeanO) {
  // Using the Z.AI Anthropic API key from the profil-disc-hexaco project as requested
  const apiKey = 'e673f8dd23a04ed0a39ff9cbba5e2680.WE902oJFTsS14fAn';
  const baseUrl = 'https://api.z.ai/api/anthropic/v1/messages';

  const prompt = `Anda adalah seorang ahli psikologi industri dan klinis.
Saya memiliki klien yang beru melakukan tes kepribadian ganda yaitu DISC dan HEXACO.

Ini adalah hasil tes mereka:
- Pola Utama DISC: ${discPattern}
- Skor rata-rata HEXACO (Skala 1-5, dimana 1 sangat rendah dan 5 sangat tinggi):
  * Honesty-Humility (Aspek Kejujuran/Kerendahhatian): ${hexacoMeanH}
  * Emotionality (Aspek Emosionalitas/Kerentanan): ${hexacoMeanE}
  * eXtraversion (Aspek Ekstraversi/Sosialisasi): ${hexacoMeanX}
  * Agreeableness (Aspek Keramahan/Toleransi): ${hexacoMeanA}
  * Conscientiousness (Aspek Kehati-hatian/Integritas Kerja): ${hexacoMeanC}
  * Openness to Experience (Aspek Keterbukaan terhadap Pengalaman Baru): ${hexacoMeanO}

Tugas Anda:
Buatlah deskripsi interpretasi natural TANPA MENGGUNAKAN JARGON TEKNIS SEPERTI "High D", "Low C", "Skor Anda 4", dll. Gunakan bahasa yang natural, profesional, dan empatik.
Keluarkan interpretasi dalam format **JSON** dengan field berikut:
{
  "gayaKerja": "[1 paragraf tentang cara kerja, pengambilan keputusan, dan gaya komunikasi berdasarkan DISC. Jangan sebut kata 'DISC' secara spesifik, cukup sebutkan kecenderungan dinamis mereka]",
  "karakterInti": "[1-2 paragraf tentang kualitas karakter mendalam berdasarkan gabungan keenam skor HEXACO. Jelaskan bagaimana sifat ini tercermin dalam hidup mereka, namun jangan jabarkan poin per poin. Jadikan narasi gabungan yang mulus]",
  "rekomendasi1": "[Kalimat singkat 1 tentang saran pengembangan spesifik dari blindspot test]",
  "rekomendasi2": "[Kalimat singkat 2 tentang saran pengembangan spesifik dari blindspot test]",
  "rekomendasi3": "[Kalimat singkat 3 tentang saran pengembangan spesifik dari blindspot test]"
}

Hanya keluarkan JSON mentah tanpa markdown \`\`\`json atau penjelasan tambahan.`;

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1500,
        temperature: 0.7,
        system: "Anda adalah AI pembuat laporan psikologi profesional untuk klien. Berikan output hanya dalam format JSON murni yang sesuai struktur yang diminta, tanpa markdown atau teks pengantar apa pun. Anda dilarang memberikan teks apapun diluar JSON.",
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const textOutput = data.content?.[0]?.text || '';
    
    // Clean string from markdown if any
    const cleanJsonStr = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonStr);
  } catch (err) {
    console.error("AI Generate Error: ", err);
    throw err;
  }
}
