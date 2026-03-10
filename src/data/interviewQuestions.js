// src/data/interviewQuestions.js
// Kumpulan Pertanyaan Wawancara Terstruktur (Esai) Berdasarkan Intent (Tujuan Asesmen)

export const getInterviewQuestions = (intent) => {
  switch (intent) {
    case 'RECRUITMENT':
      return [
        {
          id: 'rec_01',
          question: 'Ceritakan pengalaman kerja/organisasi Anda yang paling menantang sejauh ini. Bagaimana cara Anda menghadapi dan menyelesaikannya?',
          type: 'textarea',
          minWords: 20
        },
        {
          id: 'rec_02',
          question: 'Apa pencapaian terbesar Anda dalam karier atau pendidikan, dan kompetensi/peran apa yang membuat Anda berhasil mencapainya?',
          type: 'textarea',
          minWords: 20
        },
        {
          id: 'rec_03',
          question: 'Ceritakan tentang saat di mana Anda harus beradaptasi dengan perubahan yang mendadak atau peraturan baru yang tidak Anda sukai. Bagaimana reaksi Anda?',
          type: 'textarea',
          minWords: 20
        },
        {
          id: 'rec_04',
          question: 'Mengapa Anda merasa cocok untuk menempati posisi yang Anda lamar di instansi/perusahaan ini?',
          type: 'textarea',
          minWords: 20
        }
      ];

    case 'ACADEMIC':
      return [
        {
          id: 'acad_01',
          question: 'Gambarkan situasi di mana Anda merasa kesulitan dalam memahami suatu materi pelajaran. Apa yang Anda lakukan untuk mengatasinya?',
          type: 'textarea',
          minWords: 15
        },
        {
          id: 'acad_02',
          question: 'Ceritakan pengalaman Anda ketika harus bekerja dalam sebuah kelompok tugas sekolah/kampus. Peran apa yang biasa Anda ambil dan mengapa?',
          type: 'textarea',
          minWords: 15
        },
        {
          id: 'acad_03',
          question: 'Apa cita-cita karier atau jurusan impian Anda? Jelaskan alasan terkuat mengapa Anda meyakini itu adalah pilihan yang tepat.',
          type: 'textarea',
          minWords: 20
        }
      ];

    case 'GRAPHOLOGY':
      return [
        {
          id: 'graf_01',
          question: 'Tuliskan secara singkat, apa harapan/tujuan utama Anda mengikuti analisis grafologi ini?',
          type: 'textarea',
          minWords: 10
        },
        {
          id: 'graf_02',
          question: 'Sebutkan 3 sifat atau kebiasaan yang menurut Anda adalah kekuatan terbesar Anda, beserta alasannya.',
          type: 'textarea',
          minWords: 15
        },
        {
          id: 'graf_03',
          question: 'Sebutkan kelemahan atau hal yang paling ingin Anda rubah dari diri Anda saat ini.',
          type: 'textarea',
          minWords: 15
        }
      ];

    case 'GENERAL':
    default:
      return [
        {
          id: 'gen_01',
          question: 'Apa motivasi utama Anda dalam mengikuti tes profiling kepribadian hari ini?',
          type: 'textarea',
          minWords: 10
        },
        {
          id: 'gen_02',
          question: 'Ceritakan secara singkat bagaimana Anda merespons tekanan atau stres dalam keseharian?',
          type: 'textarea',
          minWords: 15
        }
      ];
  }
};
