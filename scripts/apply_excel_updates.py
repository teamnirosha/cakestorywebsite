import json
import re

def clean_digits(phone):
    return ''.join([c for c in str(phone) if c.isdigit()])[-10:]

def format_in_phone(phone_str):
    digits = clean_digits(phone_str)
    if len(digits) == 10:
        return f"+91 {digits[:5]} {digits[5:]}"
    return phone_str

def main():
    with open('scripts/resolved_shops.json', 'r', encoding='utf-8') as f:
        excel_shops = json.load(f)
    with open('src/data/franchises.json', 'r', encoding='utf-8') as f:
        outlets = json.load(f)

    # Definitive Mapping: Excel Sr -> franchises.json ID
    mapping = {
        '1': 'NEW_JEJURI',                    # Jejuri (New outlet)
        '2': 'franchise-060',                 # Shirwal (midc-hub / Shirwal Corridor)
        '3': 'NEW_NASRAPUR',                  # Nasrapur (New outlet)
        '4': 'franchise-031',                 # Narhe (Zeal College Rd / Malvika Arcade)
        '5': 'franchise-040',                 # Dhayari (Umbraya Ganpati)
        '6': 'franchise-036',                 # Kolhewadi (Amrut Vihar / Kirkatwadi)
        '7': 'franchise-037',                 # Shivane (Uttam Nagar / Yashwant Nagar)
        '8': 'franchise-035',                 # Anand Nagar (Suncity / Nirmal Township)
        '9': 'franchise-002',                 # Kothrud (Shivtara Garden / New DP Rd)
        '10': 'franchise-043',                # Chikhali Sane Chowk (GMC Raj Palace)
        '12': 'franchise-023',                # Hadapsar Sasane Nagar (Gandharv Geet / Navnath Chowk)
        '13': 'franchise-012',                # Phursungi / Bhekrai Nagar (Jadhav & Saumya Complex / Opp PNT)
        '14': 'franchise-026',                # Loni Kalbhor (Nilesh Kunj / MIT Corner)
        '15': 'franchise-022',                # Keshav Nagar (37 Pramiva / Manjari Rd)
        '17': 'franchise-039',                # Yamunanagar (Nigdi / Santkrupa Complex / LIC Corner)
        '18': 'franchise-015',                # Balajinagar / Bibwewadi (Dhankawadi / Tirupati Complex)
        '21': 'franchise-006',                # Chinchwad (Premsagar Soc / Shridhar Nagar)
        '23': 'NEW_URULI_KANCHAN',            # Uruli Kanchan (New outlet)
        '24': 'franchise-029',                # Navi Sangavi (Radharaman Complex / Krushna Chowk)
        '25': 'franchise-011',                # Kharadi (Raj Heights / Rakshak Nagar)
        '26': 'franchise-038',                # Nigdi Sector 25 (Praveen Palace / Festival Chowk)
        '27': 'franchise-025',                # Undri (The Landmark / Bellagio / Euro School)
        '28': 'franchise-004',                # Dange Chowk / Wakad (Shop 1 Dange Empire)
        '29': 'franchise-020',                # Shewalwadi / Manjri (Shop 5 Swapnashilp Complex)
        '30': 'NEW_KHANDALA',                 # Khandala (New outlet)
        '31': 'franchise-014',                # Gangadham Chowk (Ganesh Market / Market Yard)
        '32': 'franchise-017',                # Malwadi (Sade Satra Nali / Hadapsar)
        '33': 'franchise-016',                # Saswad (Anand Plaza / Near ST Stand)
        '34': 'NEW_KHED_SHIVAPUR',            # Khed Shivapur (New outlet)
        '35': 'franchise-010',                # Vadgaon Sheri (Sagar Plaza / Old Mundhwa Rd)
        '36': 'franchise-033',                # Pimpri (Rajveer Imperia / Nehrunagar)
        '38': 'franchise-013',                # Kondhwa (Mayfair Eleganza)
        '39': 'franchise-008',                # Camp (Radiant Prime Arcade / Pulgate)
        '40': 'franchise-007',                # Ravet (Ranjan Heights / SB Patil School Rd)
        '41': 'NEW_LONAND',                   # Lonand (New outlet in Satara district)
        '42': 'franchise-034',                # Warje (Prestige Point / RMD College Rd)
        '43': 'franchise-021',                # Wanowrie / Wanwadi (Sacred Heart Town)
        '44': 'franchise-003',                # Karve Nagar (Kakade Plaza / Karve Rd)
        '45': 'franchise-028',                # Jadhavwadi (Chikhali / Kumar Pratham)
        '46': 'franchise-041',                # Tilekar Nagar (Gagan Unnati / Katraj-Kondhwa Rd)
        '47': 'franchise-009',                # Viman Nagar (Ridhi Enclave / Ganpati Square)
        '48': 'franchise-018',                # Magarpatta (Sudarshan Heritage / Hadapsar)
        '49': 'franchise-059',                # Satara (Hotel Pride Executive / Bombay Restaurant Chowk)
        '50': 'franchise-027',                # Moshi (L-Axis Commercial Centre / Spine Rd)
        '51': 'franchise-024',                # Kalewadi / Rahatani (BRTS Rd / Shri Vitthal Colony)
        '52': 'franchise-019',                # Lohegaon (Aeropolis / Porwal Rd)
        '53': 'franchise-058',                # Satara City (Kesarkar Peth / Shahu Chowk)
    }

    updated_count = 0
    new_outlets_to_add = []

    # Map of ID to outlet
    outlets_by_id = {o['id']: o for o in outlets}

    # Process all excel shops
    for es in excel_shops:
        sr = es['sr']
        target_id = mapping.get(sr)
        name = es['shop_name'].strip()
        person = es['contact_person'].strip()
        phone = format_in_phone(es['contact_no'])
        addr = es['address'].strip()
        link = es['google_link'].strip()
        lat = es.get('latitude')
        lng = es.get('longitude')

        if target_id and not target_id.startswith('NEW_'):
            jo = outlets_by_id.get(target_id)
            if jo:
                # Update details from owner
                jo['phone'] = phone
                if person:
                    jo['manager'] = person
                if addr:
                    jo['address'] = addr
                if link:
                    jo['googleMapsUrl'] = link
                if lat and lng and (17.0 <= lat <= 19.5) and (73.0 <= lng <= 75.0):
                    jo['latitude'] = lat
                    jo['longitude'] = lng
                updated_count += 1
                print(f"[OK] Updated {jo['id']} ({jo['slug']}) with phone={phone}, manager={person}, link={link[:30]}...")
            else:
                print(f"[ERR] Outlet ID {target_id} not found in database!")
        else:
            # Prepare new outlet
            new_id = f"franchise-{len(outlets) + len(new_outlets_to_add) + 1:03d}"
            
            # Custom metadata for each new outlet
            if target_id == 'NEW_JEJURI':
                slug = 'jejuri'
                city = 'Jejuri'
                city_slug = 'pune-rural'
                locality = 'Jejuri'
                zone = 'South-East Corridor'
                latitude = lat or 18.2778
                longitude = lng or 74.1594
                desc = "Located in Main Peth near Talathi Office, Jejuri, offering fresh 100% pure veg cakes and custom celebration orders."
            elif target_id == 'NEW_NASRAPUR':
                slug = 'nasrapur'
                city = 'Nasrapur'
                city_slug = 'pune-rural'
                locality = 'Nasrapur'
                zone = 'South Corridor'
                latitude = lat or 18.2562
                longitude = lng or 73.9189
                desc = "Located near Swapnalok Society Gate, Nasrapur on the Pune-Satara highway corridor, serving fresh eggless celebration cakes."
            elif target_id == 'NEW_URULI_KANCHAN':
                slug = 'uruli-kanchan'
                city = 'Uruli Kanchan'
                city_slug = 'pune-rural'
                locality = 'Uruli Kanchan'
                zone = 'East Corridor'
                latitude = lat or 18.4839
                longitude = lng or 74.1345
                desc = "Situated at Sarvadnya Heights on Ashram Road, Uruli Kanchan, serving fresh artisanal cakes and desserts daily."
            elif target_id == 'NEW_KHANDALA':
                slug = 'khandala'
                city = 'Khandala'
                city_slug = 'satara'
                locality = 'Khandala'
                zone = 'Satara District'
                latitude = lat or 18.0667
                longitude = lng or 74.0278
                desc = "Located at DCC Bank, Satara Road, Khandala Bavada, bringing CakeStory's pure vegetarian desserts to Khandala."
            elif target_id == 'NEW_KHED_SHIVAPUR':
                slug = 'khed-shivapur'
                city = 'Khed Shivapur'
                city_slug = 'pune-rural'
                locality = 'Khed Shivapur'
                zone = 'South Corridor'
                latitude = lat or 18.3484
                longitude = lng or 73.8506
                desc = "Situated at Shrikrushna Complex, Kondhanpur Phata, Shrimanagar, Khed Shivapur, serving fresh handcrafted cakes daily."
            elif target_id == 'NEW_LONAND':
                slug = 'lonand'
                city = 'Lonand'
                city_slug = 'satara'
                locality = 'Lonand'
                zone = 'Satara District'
                latitude = lat or 18.0417
                longitude = lng or 74.1925
                desc = "Located in Vimalchandra Building on Lonand-Satara Road, Lonand, offering 100% pure vegetarian cakes and pastries."
            else:
                slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
                city = 'Pune'
                city_slug = 'pune'
                locality = name.title()
                zone = 'Pune Network'
                latitude = lat or 18.5204
                longitude = lng or 73.8567
                desc = f"Official CakeStory Desserts boutique at {name.title()}."

            new_outlet = {
                "id": new_id,
                "slug": slug,
                "name": f"CakeStory Desserts — {locality}",
                "outletName": locality,
                "zone": zone,
                "address": addr,
                "city": city,
                "state": "Maharashtra",
                "country": "India",
                "latitude": latitude,
                "longitude": longitude,
                "phone": phone,
                "email": "care@cakestorydesserts.com",
                "openingHours": "10:00 AM - 11:30 PM",
                "manager": person,
                "services": [
                    "Celebration Cakes",
                    "Artisanal Pastries",
                    "100% Pure Veg",
                    "Custom Orders",
                    "Takeaway"
                ],
                "description": desc,
                "image": f"/images/outlets/{slug}.jpg",
                "active": True,
                "established": "2023",
                "citySlug": city_slug,
                "locality": locality,
                "legacySlugs": [f"cakestory-{slug}"],
                "googleMapsUrl": link
            }
            new_outlets_to_add.append(new_outlet)
            print(f"[NEW] Created outlet {new_id} ({slug}) for {name} with phone={phone}, manager={person}")

    all_updated = outlets + new_outlets_to_add
    print(f"\nTotal existing updated: {updated_count}")
    print(f"Total new added: {len(new_outlets_to_add)}")
    print(f"New total outlets count: {len(all_updated)}")

    with open('src/data/franchises.json', 'w', encoding='utf-8') as f:
        json.dump(all_updated, f, indent=2, ensure_ascii=False)
    print("Successfully wrote src/data/franchises.json!")

if __name__ == '__main__':
    main()
