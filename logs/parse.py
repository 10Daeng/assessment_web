import re
import json

with open('logs/pattern_table_raw.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Match 4 digits, some garbage separators, then the name
# Just split the text into words/tokens and find 4-digit numbers.
# Looking at the file, the format is like: 4444-Tight 4242-Undershift
# Or 7777 7576--0vershifl 7374-Achiever
tokens = re.split(r'\s+', text)
mapping = {}

for token in tokens:
    match = re.search(r'([1-7]{4})[-~=]+([a-zA-Z]+(?:[\s-][a-zA-Z]+)?)', token)
    if not match:
        # try without dashes e.g. "7777overshift" or with space inside a larger chunk
        pass

# Let's just find all occurrences of 4 digits followed by optional garbage then letters.
matches = re.findall(r'([1-7]{4})[^a-zA-Z0-9]*([a-zA-Z]+(?:\s*[a-zA-Z]+)*)', text)

for code, name in matches:
    name = name.strip()
    lower = name.lower()
    clean_name = None
    
    if 'achiev' in lower: clean_name = 'Achiever'
    elif 'agent' in lower: clean_name = 'Agent'
    elif 'apprais' in lower or 'approis' in lower or 'approi' in lower: clean_name = 'Appraiser'
    elif 'counsel' in lower or 'counset' in lower or 'covmel' in lower or 'coumel' in lower: clean_name = 'Counselor'
    elif 'creati' in lower or 'creoli' in lower or 'cleotive' in lower or 'creotlve' in lower or 'create' in lower or 'crecn' in lower or 'creca' in lower: clean_name = 'Creative'
    elif 'develop' in lower or 'develap' in lower or 'deveic' in lower: clean_name = 'Developer'
    elif 'nspirat' in lower or 'impirot' in lower or 'nspiral' in lower or 'nspirol' in lower: clean_name = 'Inspirational'
    elif 'investig' in lower or 'nve,tig' in lower or 'nveslig' in lower or 'nvestig' in lower or 'nveshgotor' in lower: clean_name = 'Investigator'
    elif 'think' in lower or 'thnker' in lower or 'obiect' in lower: clean_name = 'Objective Thinker'
    elif 'perfect' in lower or 'pertec' in lower or 'perlec' in lower or 'petfec' in lower: clean_name = 'Perfectionist'
    elif 'persuad' in lower or 'per,uoder' in lower or 'persvod' in lower or 'pe,suoder' in lower: clean_name = 'Persuader'
    elif 'pract' in lower or 'pmctl' in lower or 'proc' in lower or 'pruct' in lower: clean_name = 'Practitioner'
    elif 'promot' in lower or 'promafe' in lower or 'promate' in lower: clean_name = 'Promoter'
    elif 'result' in lower or 're,ult' in lower or 'resull' in lower or 'resvlt' in lower: clean_name = 'Result-Oriented'
    elif 'specialis' in lower or 'specian' in lower or 'specioi' in lower: clean_name = 'Specialist'
    elif 'oversh' in lower or 'ovefsm' in lower or 'ovef,hifl' in lower or 'ove"hifl' in lower or 'ovesrs' in lower: clean_name = 'Overshift'
    elif 'under' in lower or 'ljnder' in lower or 'l1nder' in lower or 'uncer' in lower: clean_name = 'Undershift'
    elif 'tight' in lower or 'tighl' in lower or '1ighl' in lower: clean_name = 'Tight'
    
    if clean_name:
        mapping[code] = clean_name

print("Total mapped:", len(mapping))
with open('logs/parsed_mapping.json', 'w') as f:
    json.dump(mapping, f, indent=2)

