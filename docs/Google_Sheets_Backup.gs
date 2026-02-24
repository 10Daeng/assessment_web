function doPost(e) {
  try {
    // 1. Dapatkan referensi Spreadsheet dan Sheet aktif
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 2. Parse data JSON dari webhook
    var payload = JSON.parse(e.postData.contents);
    
    // 3. Jika ini baris pertama, buatkan header
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Nama", "Email", "Usia", "Instansi", "Pekerjaan", "Jabatan",
        "Pola DISC", "Primary DISC",
        "Raw D (Graph 1/Most)", "Raw I (Graph 1/Most)", "Raw S (Graph 1/Most)", "Raw C (Graph 1/Most)",
        "Raw D (Graph 2/Least)", "Raw I (Graph 2/Least)", "Raw S (Graph 2/Least)", "Raw C (Graph 2/Least)",
        "Raw D (Graph 3)", "Raw I (Graph 3)", "Raw S (Graph 3)", "Raw C (Graph 3)",
        "Hexaco H", "Hexaco E", "Hexaco X", "Hexaco A", "Hexaco C", "Hexaco O", "Altruism",
        "H: Sincerity", "H: Fairness", "H: Greed Avoidance", "H: Modesty",
        "E: Fearfulness", "E: Anxiety", "E: Dependence", "E: Sentimentality",
        "X: Social Self-Esteem", "X: Social Boldness", "X: Sociability", "X: Liveliness",
        "A: Forgivingness", "A: Gentleness", "A: Flexibility", "A: Patience",
        "C: Organization", "C: Diligence", "C: Perfectionism", "C: Prudence",
        "O: Aesthetic Appreciation", "O: Inquisitiveness", "O: Creativity", "O: Unconventionality",
        "Data Mentah JSON"
      ]);
      // Styling header
      sheet.getRange(1, 1, 1, 53).setFontWeight("bold").setBackground("#d9ead3");
    }

    // 4. Siapkan data yang mau di-insert
    var userData = payload.userData || {};
    var discScores = payload.discScores || {};
    var hexacoScores = payload.hexacoScores || {};
    var most = discScores.discMost || {};
    var least = discScores.discLeast || {};
    var composite = discScores.discComposite || {};
    var hexacoFactors = hexacoScores.factorMeans || {};
    var hexacoFacets = hexacoScores.facetMeans || {};

    // 5. Masukkan sebagai baris baru
    sheet.appendRow([
      new Date(), // Timestamp
      userData.nama || "-",
      userData.email || "-",
      userData.usia || "-",
      userData.instansi || "-",
      userData.pekerjaan || "-",
      userData.jabatan || "-",
      discScores.pattern || "-",
      discScores.primary || "-",
      most.D || 0,
      most.I || 0,
      most.S || 0,
      most.C || 0,
      least.D || 0,
      least.I || 0,
      least.S || 0,
      least.C || 0,
      composite.D || 0,
      composite.I || 0,
      composite.S || 0,
      composite.C || 0,
      hexacoFactors.H || 0,
      hexacoFactors.E || 0,
      hexacoFactors.X || 0,
      hexacoFactors.A || 0,
      hexacoFactors.C || 0,
      hexacoFactors.O || 0,
      hexacoFacets.altr || 0,
      hexacoFacets.sinc || 0, hexacoFacets.fair || 0, hexacoFacets.gree || 0, hexacoFacets.mode || 0,
      hexacoFacets.fear || 0, hexacoFacets.anxi || 0, hexacoFacets.depe || 0, hexacoFacets.sent || 0,
      hexacoFacets.sses || 0, hexacoFacets.socb || 0, hexacoFacets.soci || 0, hexacoFacets.live || 0,
      hexacoFacets.forg || 0, hexacoFacets.gent || 0, hexacoFacets.flex || 0, hexacoFacets.pati || 0,
      hexacoFacets.orga || 0, hexacoFacets.dili || 0, hexacoFacets.perf || 0, hexacoFacets.prud || 0,
      hexacoFacets.aesa || 0, hexacoFacets.inqu || 0, hexacoFacets.crea || 0, hexacoFacets.unco || 0,
      JSON.stringify(payload) // Data mentah jawaban utuh
    ]);

    // 6. Return response OK
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
