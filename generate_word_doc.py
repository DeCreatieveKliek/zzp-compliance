#!/usr/bin/env python3
"""Generate Word document with ZZP Compliance questionnaire and scoring."""

from docx import Document
from docx.shared import Inches, Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn

doc = Document()

# -- Styles --
style = doc.styles['Normal']
font = style.font
font.name = 'Calibri'
font.size = Pt(10)

# -- Title --
title = doc.add_heading('ZZP Compliance Tool — Vragenlijst & Puntentelling', level=0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_paragraph(
    'Dit document bevat de volledige vragenlijst en het scoringssysteem van de ZZP Compliance Tool. '
    'Het is bedoeld als specificatie voor ontwikkelaars die deze tool willen integreren in een CRM-systeem.'
)

# -- Scoring overview --
doc.add_heading('Scoringssysteem — Overzicht', level=1)

doc.add_paragraph(
    'Alle 18 vragen zijn Ja/Nee vragen. Elk "Ja"-antwoord activeert de bijbehorende punten (gewicht). '
    '"Nee"-antwoorden leveren geen punten op. Het totaal bepaalt de risicostatus.'
)

doc.add_heading('Risicoclassificatie', level=2)

# Risk table
risk_table = doc.add_table(rows=4, cols=4)
risk_table.style = 'Light Grid Accent 1'
risk_table.alignment = WD_TABLE_ALIGNMENT.CENTER

headers = ['Status', 'Kleur', 'Score', 'Betekenis']
for i, h in enumerate(headers):
    cell = risk_table.rows[0].cells[i]
    cell.text = h
    cell.paragraphs[0].runs[0].bold = True

risk_data = [
    ['GROEN', 'Groen', '≤ 4 punten', 'Laag risico op schijnzelfstandigheid. De ZZP\'er voldoet naar alle waarschijnlijkheid aan de voorwaarden voor zelfstandige arbeid.'],
    ['ORANJE', 'Oranje', '5 t/m 10 punten', 'Enkele risicofactoren geïdentificeerd. Adviseer de arbeidsrelatie nader te beoordelen en mogelijk aanpassingen door te voeren.'],
    ['ROOD', 'Rood', '> 10 punten', 'Significant risico op schijnzelfstandigheid. Dringend advies om de arbeidsrelatie te herzien of juridisch advies in te winnen.'],
]
for row_idx, row_data in enumerate(risk_data, 1):
    for col_idx, val in enumerate(row_data):
        risk_table.rows[row_idx].cells[col_idx].text = val

doc.add_paragraph('')  # spacer

# -- Scoring formula --
doc.add_heading('Berekeningsformule', level=2)
doc.add_paragraph('1. Start met totaalscore = 0')
doc.add_paragraph('2. Voor elke vraag: als antwoord = "Ja", tel het gewicht op bij de totaalscore')
doc.add_paragraph('3. Positief gewicht = risicoverhogend (wijst op dienstverband)')
doc.add_paragraph('4. Negatief gewicht = risicoverlagend (wijst op zelfstandigheid)')
doc.add_paragraph('5. Bepaal status op basis van drempelwaarden hierboven')

doc.add_paragraph('')

# ========================================================
# QUESTIONNAIRE
# ========================================================
doc.add_heading('Volledige Vragenlijst', level=1)

categories = [
    {
        'name': 'Categorie 1: Gezagsverhouding',
        'description': 'Toetst of de opdrachtnemer onder gezag, instructie en controle van de opdrachtgever staat.',
        'questions': [
            {
                'nr': 1,
                'key': 'instructies',
                'question': 'Geeft de opdrachtgever gedetailleerde instructies over hóé het werk uitgevoerd moet worden?',
                'help': 'Denk aan: werkmethoden, processen of volgorde van handelingen die voorgeschreven worden. Niet: het eindresultaat of de doelstelling van het werk.',
                'weight': '+3',
                'weight_desc': 'Risicoverhogend (hoog)',
            },
            {
                'nr': 2,
                'key': 'werkTijden',
                'question': 'Zijn er vaste werktijden of aanwezigheidsverplichtingen afgesproken?',
                'help': 'Bijv. verplicht aanwezig zijn van 9:00-17:00, vaste standplaats, deelname aan verplichte dagelijkse of wekelijkse meetings op vaste tijden.',
                'weight': '+2',
                'weight_desc': 'Risicoverhogend',
            },
            {
                'nr': 3,
                'key': 'toezicht',
                'question': 'Is er sprake van dagelijks toezicht of directe aansturing door de opdrachtgever?',
                'help': 'Denk aan: een direct leidinggevende die dagelijks taken verdeelt, voortgang controleert of prestatiegesprekken voert zoals met vaste medewerkers.',
                'weight': '+2',
                'weight_desc': 'Risicoverhogend',
            },
        ]
    },
    {
        'name': 'Categorie 2: Persoonlijke arbeidsplicht',
        'description': 'Toetst of de opdrachtnemer persoonlijk verplicht is het werk uit te voeren.',
        'questions': [
            {
                'nr': 4,
                'key': 'persoonlijkVerplicht',
                'question': 'Is de opdrachtnemer contractueel verplicht het werk persoonlijk uit te voeren?',
                'help': 'Als vervanging contractueel niet is toegestaan of altijd goedkeuring vereist, wijst dit op een persoonlijke arbeidsplicht — kenmerkend voor een arbeidsovereenkomst.',
                'weight': '+2',
                'weight_desc': 'Risicoverhogend',
            },
            {
                'nr': 5,
                'key': 'vervanger',
                'question': 'Kan de opdrachtnemer zelfstandig een gekwalificeerde vervanger aanwijzen zonder toestemming van de opdrachtgever?',
                'help': 'Echte zelfstandigen kunnen zelf een vervanger regelen. Als de opdrachtgever altijd akkoord moet geven, duidt dit op een persoonlijke arbeidsplicht.',
                'weight': '-2',
                'weight_desc': 'Risicoverlagend (wijst op zelfstandigheid)',
            },
            {
                'nr': 6,
                'key': 'verlof',
                'question': 'Moet de opdrachtnemer verlof, vakantie of afwezigheid vooraf laten goedkeuren door de opdrachtgever?',
                'help': 'Een zelfstandig ondernemer heeft geen verlofaanvraag nodig. Als de opdrachtnemer dit wel moet doen, is er sprake van werkgeversgezag over beschikbaarheid.',
                'weight': '+2',
                'weight_desc': 'Risicoverhogend',
            },
        ]
    },
    {
        'name': 'Categorie 3: Beloning en financieel risico',
        'description': 'Toetst de betalingsstructuur en of de opdrachtnemer financieel ondernemersrisico draagt.',
        'questions': [
            {
                'nr': 7,
                'key': 'vasteVergoeding',
                'question': 'Ontvangt de opdrachtnemer een vaste periodieke vergoeding, ongeacht de daadwerkelijk geleverde output of gepresteerde uren?',
                'help': 'Een vaste maandelijkse betaling los van resultaten lijkt op loon. Uurtarieven of output-gebaseerde vergoedingen passen beter bij een zelfstandige.',
                'weight': '+3',
                'weight_desc': 'Risicoverhogend (hoog)',
            },
            {
                'nr': 8,
                'key': 'doorbetaling',
                'question': 'Is er recht op doorbetaling van de vergoeding bij ziekte, vakantie of andere afwezigheid?',
                'help': 'Doorbetaling bij ziekte of vakantie is een wettelijk recht van werknemers. Een zelfstandige heeft hier geen recht op — als dit wel is afgesproken, wijst het sterk op een dienstverband.',
                'weight': '+2',
                'weight_desc': 'Risicoverhogend',
            },
            {
                'nr': 9,
                'key': 'financieelRisico',
                'question': 'Loopt de opdrachtnemer aantoonbaar financieel ondernemersrisico (bijv. aansprakelijkheid voor fouten, niet-betaalde facturen)?',
                'help': 'Echte ondernemers dragen eigen risico. Denk aan: debiteuren die niet betalen, aansprakelijkheid voor geleden schade, kosten voor herwerk of eigen faillissementsrisico.',
                'weight': '-2',
                'weight_desc': 'Risicoverlagend (wijst op ondernemerschap)',
            },
        ]
    },
    {
        'name': 'Categorie 4: Inbedding in de organisatie',
        'description': 'Toetst de mate van integratie van de opdrachtnemer in de organisatie van de opdrachtgever.',
        'questions': [
            {
                'nr': 10,
                'key': 'vasteWerkplek',
                'question': 'Heeft de opdrachtnemer een vaste werkplek (bureau, werkplaats) binnen de organisatie van de opdrachtgever?',
                'help': 'Een permanent toegewezen bureau of werkplek duidt op structurele inbedding. Incidenteel gebruik van een werkruimte voor overleg is minder risicovol.',
                'weight': '+2',
                'weight_desc': 'Risicoverhogend',
            },
            {
                'nr': 11,
                'key': 'bedrijfsmiddelen',
                'question': 'Maakt de opdrachtnemer hoofdzakelijk gebruik van materialen, systemen of apparatuur van de opdrachtgever (laptop, auto, gereedschap, licenties)?',
                'help': 'Als de opdrachtgever de primaire werkmiddelen verschaft, ontbreekt economische zelfstandigheid. Een eigen laptop, tools of software is een positief teken.',
                'weight': '+2',
                'weight_desc': 'Risicoverhogend',
            },
            {
                'nr': 12,
                'key': 'eigenGereedschap',
                'question': 'Gebruikt de opdrachtnemer overwegend eigen professioneel gereedschap, software of apparatuur voor de opdracht?',
                'help': 'Eigen investeringen in gereedschap en software tonen ondernemerschap. Denk aan: eigen laptop, vakliteratuur, specialistische tools of licenties op eigen naam.',
                'weight': '-1',
                'weight_desc': 'Risicoverlagend',
            },
            {
                'nr': 13,
                'key': 'teamlid',
                'question': 'Wordt de opdrachtnemer intern gepresenteerd als medewerker of teamlid (bijv. in het organogram, op intranet, met bedrijfse-mail of bedrijfskleding)?',
                'help': 'Als de opdrachtgever de opdrachtnemer naar buiten toe presenteert als eigen medewerker (bedrijfse-mail, visitekaartje, organogram), is er sprake van sterke organisatorische inbedding.',
                'weight': '+2',
                'weight_desc': 'Risicoverhogend',
            },
        ]
    },
    {
        'name': 'Categorie 5: Zelfstandig ondernemerschap',
        'description': 'Toetst of er sprake is van daadwerkelijk zelfstandig ondernemerschap.',
        'questions': [
            {
                'nr': 14,
                'key': 'meerdereOpdrachtgevers',
                'question': 'Heeft de opdrachtnemer tegelijkertijd meerdere opdrachtgevers of klanten?',
                'help': 'Het gelijktijdig werken voor meerdere opdrachtgevers is een van de sterkste indicatoren van echte zelfstandigheid en ondernemerschap.',
                'weight': '-2',
                'weight_desc': 'Risicoverlagend (sterkste indicator)',
            },
            {
                'nr': 15,
                'key': 'exclusiviteit',
                'question': 'Is contractueel vastgelegd dat de opdrachtnemer uitsluitend voor de opdrachtgever mag werken (exclusiviteitsbeding)?',
                'help': 'Een contractueel verbod om voor anderen te werken is niet passend bij een zelfstandig ondernemer en vergroot het risico op schijnzelfstandigheid aanzienlijk.',
                'weight': '+2',
                'weight_desc': 'Risicoverhogend',
            },
            {
                'nr': 16,
                'key': 'kvkInschrijving',
                'question': 'Is de opdrachtnemer ingeschreven in het KvK Handelsregister als ondernemer of eenmanszaak?',
                'help': 'KvK-inschrijving is een formele basisvoorwaarde voor ondernemerschap in Nederland. Afwezigheid hiervan is een risicosignaal, hoewel aanwezigheid op zichzelf niet voldoende is.',
                'weight': '-1',
                'weight_desc': 'Risicoverlagend',
            },
            {
                'nr': 17,
                'key': 'aansprakelijkheidsverzekering',
                'question': 'Heeft de opdrachtnemer een eigen beroeps- of bedrijfsaansprakelijkheidsverzekering afgesloten?',
                'help': 'Een eigen aansprakelijkheidsverzekering toont dat de opdrachtnemer als zelfstandige risico draagt en professioneel handelt als ondernemer.',
                'weight': '-1',
                'weight_desc': 'Risicoverlagend',
            },
            {
                'nr': 18,
                'key': 'langetermijn',
                'question': 'Betreft het een samenwerking van meer dan 12 maanden, of wordt de overeenkomst structureel telkens verlengd?',
                'help': 'Een langdurige exclusieve relatie met één opdrachtgever — zeker in combinatie met andere risicofactoren — vergroot het risico op kwalificatie als arbeidsovereenkomst.',
                'weight': '+1',
                'weight_desc': 'Risicoverhogend (licht)',
            },
        ]
    },
]

for cat in categories:
    doc.add_heading(cat['name'], level=2)
    doc.add_paragraph(cat['description']).italic = True

    for q in cat['questions']:
        # Question header
        p = doc.add_paragraph()
        run = p.add_run(f"Vraag {q['nr']}  |  Sleutel: {q['key']}  |  Punten: {q['weight']} ({q['weight_desc']})")
        run.bold = True
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(0x33, 0x33, 0x99)

        # Question text
        p2 = doc.add_paragraph()
        run2 = p2.add_run(q['question'])
        run2.font.size = Pt(11)
        run2.bold = True

        # Answer options
        doc.add_paragraph('Antwoordopties:  Ja / Nee', style='List Bullet')

        # Help text
        p3 = doc.add_paragraph()
        run3 = p3.add_run('Toelichting: ')
        run3.bold = True
        run3.font.size = Pt(9)
        run4 = p3.add_run(q['help'])
        run4.font.size = Pt(9)
        run4.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

        doc.add_paragraph('')  # spacer

# -- Optional notes field --
doc.add_heading('Aanvullend veld', level=2)
p = doc.add_paragraph()
run = p.add_run("Vraag 19  |  Sleutel: notes  |  Punten: geen (niet gescoord)")
run.bold = True
run.font.color.rgb = RGBColor(0x33, 0x33, 0x99)

p2 = doc.add_paragraph()
run2 = p2.add_run('Aanvullende opmerkingen of context')
run2.bold = True
run2.font.size = Pt(11)

doc.add_paragraph('Type: Vrij tekstveld (optioneel)', style='List Bullet')
p3 = doc.add_paragraph()
run3 = p3.add_run('Toelichting: ')
run3.bold = True
run3.font.size = Pt(9)
run4 = p3.add_run('Voeg hier eventuele aanvullende informatie toe die relevant kan zijn voor de beoordeling, zoals bijzondere contractuele afspraken of specifieke werkomstandigheden.')
run4.font.size = Pt(9)
run4.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

doc.add_paragraph('')

# ========================================================
# SCORING SUMMARY TABLE
# ========================================================
doc.add_heading('Totaaloverzicht — Puntentelling', level=1)

summary_table = doc.add_table(rows=19, cols=5)
summary_table.style = 'Light Grid Accent 1'
summary_table.alignment = WD_TABLE_ALIGNMENT.CENTER

# Headers
headers = ['Nr', 'Sleutel', 'Vraag (verkort)', 'Punten bij "Ja"', 'Effect']
for i, h in enumerate(headers):
    cell = summary_table.rows[0].cells[i]
    cell.text = h
    cell.paragraphs[0].runs[0].bold = True

summary_data = [
    ['1', 'instructies', 'Gedetailleerde instructies over hóé het werk?', '+3', 'Risicoverhogend'],
    ['2', 'werkTijden', 'Vaste werktijden of aanwezigheidsplicht?', '+2', 'Risicoverhogend'],
    ['3', 'toezicht', 'Dagelijks toezicht of directe aansturing?', '+2', 'Risicoverhogend'],
    ['4', 'persoonlijkVerplicht', 'Persoonlijk verplicht werk uitvoeren?', '+2', 'Risicoverhogend'],
    ['5', 'vervanger', 'Zelfstandig vervanger aanwijzen mogelijk?', '-2', 'Risicoverlagend'],
    ['6', 'verlof', 'Verlof laten goedkeuren door opdrachtgever?', '+2', 'Risicoverhogend'],
    ['7', 'vasteVergoeding', 'Vaste periodieke vergoeding?', '+3', 'Risicoverhogend'],
    ['8', 'doorbetaling', 'Doorbetaling bij ziekte/vakantie?', '+2', 'Risicoverhogend'],
    ['9', 'financieelRisico', 'Financieel ondernemersrisico?', '-2', 'Risicoverlagend'],
    ['10', 'vasteWerkplek', 'Vaste werkplek bij opdrachtgever?', '+2', 'Risicoverhogend'],
    ['11', 'bedrijfsmiddelen', 'Gebruik materialen opdrachtgever?', '+2', 'Risicoverhogend'],
    ['12', 'eigenGereedschap', 'Eigen professioneel gereedschap?', '-1', 'Risicoverlagend'],
    ['13', 'teamlid', 'Gepresenteerd als medewerker/teamlid?', '+2', 'Risicoverhogend'],
    ['14', 'meerdereOpdrachtgevers', 'Meerdere opdrachtgevers tegelijk?', '-2', 'Risicoverlagend'],
    ['15', 'exclusiviteit', 'Exclusiviteitsbeding?', '+2', 'Risicoverhogend'],
    ['16', 'kvkInschrijving', 'KvK-inschrijving?', '-1', 'Risicoverlagend'],
    ['17', 'aansprakelijkheidsverzekering', 'Eigen aansprakelijkheidsverzekering?', '-1', 'Risicoverlagend'],
    ['18', 'langetermijn', 'Samenwerking > 12 maanden / structureel verlengd?', '+1', 'Risicoverhogend'],
]

for row_idx, row_data in enumerate(summary_data, 1):
    for col_idx, val in enumerate(row_data):
        summary_table.rows[row_idx].cells[col_idx].text = val

doc.add_paragraph('')

# -- Technical notes for developers --
doc.add_heading('Technische specificaties voor CRM-integratie', level=1)

doc.add_paragraph('Ruleset versie: 2.0.0')
doc.add_paragraph('Antwoorden worden opgeslagen als JSON-object met boolean-waarden per sleutel.')

p = doc.add_paragraph()
run = p.add_run('Voorbeeld JSON-formaat:')
run.bold = True

doc.add_paragraph(
    '{\n'
    '  "instructies": true,\n'
    '  "werkTijden": false,\n'
    '  "toezicht": false,\n'
    '  "persoonlijkVerplicht": true,\n'
    '  "vervanger": false,\n'
    '  "verlof": true,\n'
    '  "vasteVergoeding": false,\n'
    '  "doorbetaling": false,\n'
    '  "financieelRisico": true,\n'
    '  "vasteWerkplek": false,\n'
    '  "bedrijfsmiddelen": false,\n'
    '  "eigenGereedschap": true,\n'
    '  "teamlid": false,\n'
    '  "meerdereOpdrachtgevers": true,\n'
    '  "exclusiviteit": false,\n'
    '  "kvkInschrijving": true,\n'
    '  "aansprakelijkheidsverzekering": true,\n'
    '  "langetermijn": false,\n'
    '  "notes": "Optionele tekst"\n'
    '}'
)

doc.add_paragraph('')

p = doc.add_paragraph()
run = p.add_run('Drempelwaarden:')
run.bold = True

doc.add_paragraph('greenMax = 4  →  score ≤ 4 = GROEN', style='List Bullet')
doc.add_paragraph('orangeMax = 10  →  score 5-10 = ORANJE', style='List Bullet')
doc.add_paragraph('score > 10 = ROOD', style='List Bullet')

doc.add_paragraph('')
doc.add_paragraph(
    'Maximale mogelijke score: +23 punten (alle risicoverhogende vragen "Ja")\n'
    'Minimale mogelijke score: -9 punten (alle risicoverlagende vragen "Ja", rest "Nee")\n'
    'Scorebereik: -9 tot +23'
)

# Save
output_path = '/home/user/zzp-compliance/ZZP_Compliance_Vragenlijst_Specificatie.docx'
doc.save(output_path)
print(f'Document opgeslagen: {output_path}')
