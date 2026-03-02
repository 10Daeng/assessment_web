const fs = require('fs');
const text = fs.readFileSync('logs/pattern_table_raw.txt', 'utf8');

// Match 4 digits followed by hyphens/spaces followed by alphabetic words.
const regex = /\b([1-7]{4})\s*[-~=]+\s*([a-zA-Z]+(?:[\s-][a-zA-Z]+)?)/g;
let match;
const mapping = {};

while ((match = regex.exec(text)) !== null) {
  let [_, code, name] = match;
  name = name.trim();
  let cleanName = null;
  // Standardize names a bit due to OCR errors
  const lower = name.toLowerCase();
  if (lower.includes('achiev')) cleanName = 'Achiever';
  else if (lower.includes('agent')) cleanName = 'Agent';
  else if (lower.includes('apprais') || lower.includes('approis') || lower.includes('approi')) cleanName = 'Appraiser';
  else if (lower.includes('counsel') || lower.includes('counset') || lower.includes('covmel') || lower.includes('coumel')) cleanName = 'Counselor';
  else if (lower.includes('creati') || lower.includes('creoli') || lower.includes('creolive') || lower.includes('cleotive') || lower.includes('creotlve') || lower.includes('create')) cleanName = 'Creative';
  else if (lower.includes('develop') || lower.includes('develap')) cleanName = 'Developer';
  else if (lower.includes('nspirat') || lower.includes('nspirati') || lower.includes('impirot') || lower.includes('nspiral') || lower.includes('nspirol')) cleanName = 'Inspirational';
  else if (lower.includes('investig') || lower.includes('nve,tig') || lower.includes('nveslig') || lower.includes('nvestig') || lower.includes('nvesHgotor') || lower.includes('1nvesHgotor')) cleanName = 'Investigator';
  else if (lower.includes('think') || lower.includes('thnker')) cleanName = 'Objective Thinker';
  else if (lower.includes('perfect') || lower.includes('pertec')) cleanName = 'Perfectionist';
  else if (lower.includes('persuad') || lower.includes('per,uoder') || lower.includes('persvod')) cleanName = 'Persuader';
  else if (lower.includes('pract') || lower.includes('pmctl') || lower.includes('proc')) cleanName = 'Practitioner';
  else if (lower.includes('promot') || lower.includes('promafe') || lower.includes('promate')) cleanName = 'Promoter';
  else if (lower.includes('result') || lower.includes('re,ult') || lower.includes('resull') || lower.includes('resvlt')) cleanName = 'Result-Oriented';
  else if (lower.includes('specialis') || lower.includes('specian') || lower.includes('specioi')) cleanName = 'Specialist';
  else if (lower.includes('oversh') || lower.includes('ovefsM') || lower.includes('ovef,hifl') || lower.includes('ove"hifl') || lower.includes('overshift')) cleanName = 'Overshift';
  else if (lower.includes('under') || lower.includes('ljnder')) cleanName = 'Undershift';
  else if (lower.includes('tight') || lower.includes('tighl') || lower.includes('1ighl')) cleanName = 'Tight';
  else {
    console.log("Unmapped pattern:", code, name);
  }

  if (cleanName) {
    mapping[code] = cleanName;
  }
}

console.log('Total mapped patterns:', Object.keys(mapping).length);
fs.writeFileSync('logs/parsed_mapping.json', JSON.stringify(mapping, null, 2));

