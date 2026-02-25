async function testSubmit() {
  const payload = {
    userData: {
      nama: "TEST 2",
      email: "test2@lenterabatin.com",
      usia: "25",
      instansi: "Lentera Batin Tester",
      pekerjaan: "QA Engineer",
      jabatan: "Staff"
    },
    discScores: {
      discMost: { D: 10, I: 4, S: 5, C: 5 },
      discLeast: { D: 2, I: 6, S: 8, C: 8 },
      discComposite: { D: 8, I: -2, S: -3, C: -3 },
      pattern: "DI",
      primary: "D"
    },
    hexacoScores: {
      facetMeans: {
        sinc: 3.5, fair: 4.2, gree: 2.1, mode: 3.3,
        fear: 2.2, anxi: 2.1, depe: 1.1, sent: 3.5,
        sses: 4.1, socb: 3.5, soci: 4.4, live: 3.8,
        forg: 3.5, gent: 4.0, flex: 3.1, pati: 3.2,
        orga: 2.1, dili: 3.5, perf: 2.8, prud: 3.0,
        aesa: 3.1, inqu: 4.5, crea: 4.2, unco: 4.0,
        altr: 3.5
      },
      factorMeans: {
        H: 3.2,
        E: 2.2,
        X: 3.9,
        A: 3.4,
        C: 2.8,
        O: 3.9
      }
    },
    answers: {
      disc: { "1": { most: "D", least: "I"} },
      hexaco: { "1": 5, "2": 2 }
    }
  };

  try {
    const res = await fetch('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log("Success! ID:", data.data?.id);
  } catch (err) {
    console.error("Failed:", err);
  }
}

testSubmit();
