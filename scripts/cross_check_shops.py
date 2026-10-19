import zipfile
import xml.etree.ElementTree as ET
import json
import re

def read_excel_shops():
    with zipfile.ZipFile('assets/SHOP DETAILS (8).xlsx') as z:
        sst = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in tree.findall('ns:si', ns):
                t = si.find('ns:t', ns)
                if t is not None:
                    sst.append(t.text or '')
                else:
                    texts = [elem.text or '' for elem in si.findall('.//ns:t', ns)]
                    sst.append(''.join(texts))
        
        sheet_xml = z.read('xl/worksheets/sheet1.xml')
        tree = ET.fromstring(sheet_xml)
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        
        rows = []
        for row in tree.findall('.//ns:row', ns):
            cells = {}
            for c in row.findall('ns:c', ns):
                ref = c.attrib.get('r', '')
                col = ''.join([ch for ch in ref if ch.isalpha()])
                t_attr = c.attrib.get('t')
                v = c.find('ns:v', ns)
                val = v.text if v is not None else ''
                if t_attr == 's' and val.isdigit():
                    val = sst[int(val)]
                cells[col] = val.strip()
            if any(cells.values()):
                rows.append(cells)
        
        shops = []
        for r in rows[1:]:
            shops.append({
                'sr': r.get('B', ''),
                'shop_name': r.get('C', ''),
                'contact_person': r.get('D', ''),
                'contact_no': r.get('E', ''),
                'address': r.get('F', ''),
                'google_link': r.get('G', '')
            })
        return shops

def clean_digits(phone):
    return ''.join([c for c in str(phone) if c.isdigit()])[-10:]

def main():
    excel_shops = read_excel_shops()
    with open('src/data/franchises.json', 'r', encoding='utf-8') as f:
        json_outlets = json.load(f)

    print("SEARCHING FOR SPECIFIC TOWNS IN JSON:")
    search_terms = ['jejuri', 'nasrapur', 'uruli', 'shewalwadi', 'khandala', 'gangadham', 'malwadi', 'khed', 'shivapur', 'lonand', 'dange']
    for term in search_terms:
        found = [o for o in json_outlets if term in json.dumps(o).lower()]
        print(f"Term '{term}': found {len(found)}")
        for o in found:
            print(f"   -> {o['id']} | {o['slug']} | {o['name']} | {o.get('address')[:50]}")

if __name__ == '__main__':
    main()
