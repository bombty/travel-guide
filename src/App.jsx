import { useState, useEffect, useRef } from "react";

const CAT = {
  shopping: { i: "🛍️", l: "Alışveriş", c: "#E91E63" },
  food: { i: "🍜", l: "Yemek", c: "#FF9800" },
  sightseeing: { i: "🏛️", l: "Gezi", c: "#9C27B0" },
  explore: { i: "🧭", l: "Keşif", c: "#3F51B5" },
  nature: { i: "🌿", l: "Doğa", c: "#4CAF50" },
  transport: { i: "✈️", l: "Transfer", c: "#607D8B" },
  free: { i: "☕", l: "Serbest", c: "#795548" },
  nightlife: { i: "🌙", l: "Gece", c: "#FF5722" },
  culture: { i: "🎭", l: "Kültür", c: "#00BCD4" },
  beach: { i: "🏖️", l: "Sahil", c: "#00ACC1" },
};

const CITY = {
  beijing: { n: "Pekin", f: "🇨🇳", c: "#C41E3A", g: "linear-gradient(135deg,#C41E3A,#8B0000)", cur: "CNY", rate: 4.8, tz: 8, plug: "A/C/I", sim: "China Mobile Tourist", emergency: "110 polis, 120 ambulans", consulate: "+86-10-65321715" },
  hongkong: { n: "Hong Kong", f: "🇭🇰", c: "#DE2910", g: "linear-gradient(135deg,#DE2910,#B71C1C)", cur: "HKD", rate: 4.5, tz: 8, plug: "G (İngiliz)", sim: "CSL Tourist SIM", emergency: "999", consulate: "+852-2572-1331" },
  bangkok: { n: "Bangkok", f: "🇹🇭", c: "#1565C0", g: "linear-gradient(135deg,#1565C0,#0D47A1)", cur: "THB", rate: 0.95, tz: 7, plug: "A/B/C", sim: "AIS Tourist SIM", emergency: "191 polis, 1669 ambulans", consulate: "+66-2-274-7262" },
  kohsamui: { n: "Koh Samui", f: "🇹🇭", c: "#00796B", g: "linear-gradient(135deg,#00796B,#004D40)", cur: "THB", rate: 0.95, tz: 7, plug: "A/B/C", sim: "AIS", emergency: "191 polis", consulate: "Bangkok" },
};

const P = (id) => `https://images.unsplash.com/${id}?w=500&h=350&fit=crop&auto=format`;
const IMG = {
  sanlitun: P("photo-1510332981392-36a2d68ee8ac"), parkview: P("photo-1486406146926-c627a92ad1ab"),
  hk: P("photo-1506973035872-a4ec16b8e8d9"), tst: P("photo-1531259683007-016a7b628fc3"),
  k11: P("photo-1555529669-e69e7aa0ba9a"), harbour: P("photo-1441986300917-64674bd600d8"),
  mongkok: P("photo-1513622790541-eaa84d356909"), temple: P("photo-1517824806704-9040b037703b"),
  central: P("photo-1518599807935-37015b9cefcb"), iconsiam: P("photo-1508009603885-50cf7c579365"),
  asiatique: P("photo-1562602833-0f4ab2fc46e5"), palace: P("photo-1563492065599-3520f775eeed"),
  watpho: P("photo-1528181304800-259b08848526"), watarun: P("photo-1569431801806-8af1e5e2b2ac"),
  lumphini: P("photo-1506665531195-3566af2b4dfa"), skywalk: P("photo-1570168007204-dfb528c6958f"),
  khaosan: P("photo-1552465011-b4e21bf6e79a"), chinatown: P("photo-1559592413-7cec4d0cae2b"),
  benjakitti: P("photo-1596422846543-75c6fc197f07"), em: P("photo-1441984904996-e0b6ba687e04"),
  t21: P("photo-1567449303078-57ad995bd329"), siam: P("photo-1459749411175-04bf5292ceea"),
  centralw: P("photo-1519046904884-53103b34b206"), samui: P("photo-1504681869696-d977211a5f4c"),
  chaweng: P("photo-1507525428034-b723cf961d3e"), angthong: P("photo-1544551763-46a013bb70d5"),
  bophut: P("photo-1506953823976-52e1fdc0149a"), wangfujing: P("photo-1547981609-4b6bfe67ca0b"),
  dashilan: P("photo-1508804185872-d7badad00f7d"), fisherman: P("photo-1519046904884-53103b34b206"),
};
const FI = (name) => `https://placehold.co/500x350/333/fff?text=${encodeURIComponent(name)}`;

const LANG = {
  beijing: [{ t: "Merhaba", l: "Nǐ hǎo", p: "Ni hao" }, { t: "Teşekkürler", l: "Xièxiè", p: "Şie şie" }, { t: "Hesap", l: "Mǎidān", p: "May dan" }, { t: "Ne kadar?", l: "Duōshǎo qián?", p: "Duo şao çien?" }],
  hongkong: [{ t: "Merhaba", l: "Néih hóu", p: "Ney ho" }, { t: "Teşekkürler", l: "M̀h'gōi", p: "Mm goy" }, { t: "Hesap", l: "Māai dāan", p: "May dan" }],
  bangkok: [{ t: "Merhaba", l: "Sawàtdii kráp", p: "Savat dii krap" }, { t: "Teşekkürler", l: "Khàawp khun", p: "Kop kun" }, { t: "Hesap", l: "Check bin", p: "Çek bin" }, { t: "Ne kadar?", l: "Thâo rài?", p: "Tao ray?" }, { t: "Acı olmasın", l: "Mâi phèt", p: "May pet" }],
  kohsamui: [{ t: "(Bangkok aynı)", l: "Sawàtdii", p: "Savat dii" }],
};

const initFlights = () => [
  { id: "f1", date: "14 May", time: "15:00", from: "İstanbul", to: "Pekin", air: "CA860", note: "" },
  { id: "f2", date: "15 May", time: "05:20", from: "Pekin varış", to: "", air: "", note: "10sa layover" },
  { id: "f3", date: "15 May", time: "15:20", from: "Pekin", to: "HK", air: "CA115", note: "" },
  { id: "f4", date: "17 May", time: "17:00", from: "HK", to: "Bangkok", air: "—", note: "" },
  { id: "f5", date: "20 May", time: "16:00", from: "Bangkok", to: "Samui", air: "—", note: "" },
  { id: "f6", date: "24 May", time: "—", from: "Samui", to: "HK", air: "—", note: "" },
  { id: "f7", date: "25 May", time: "08:30", from: "HK", to: "Pekin", air: "CA118", note: "14sa layover" },
  { id: "f8", date: "26 May", time: "01:55", from: "Pekin", to: "İstanbul", air: "CA859", note: "08:00 varış" },
];

const initChecklist = () => ({
  bavul: ["Pasaport+fotokopi", "Uçak biletleri", "Otel rezervasyonları", "Seyahat sigortası", "Kredi kartı+nakit", "Şarj+powerbank", "Adaptör (G/A/C)", "Güneş kremi SPF50+", "Şemsiye", "Rahat ayakkabı", "Tapınak kıyafeti", "İlaçlar", "SIM/eSIM", "Su geçirmez çanta"].map((t, i) => ({ id: "c" + i, t, ok: false })),
  belge: ["Çin: 24h transit vizesiz", "HK: 90 gün vizesiz", "Tayland: 60 gün vizesiz"].map((t, i) => ({ id: "b" + i, t, ok: false })),
});

const HOTELS = [
  { city: "hongkong", name: "(Ekle)", addr: "—", phone: "—", lat: 22.29, lng: 114.17 },
  { city: "bangkok", name: "(Ekle)", addr: "Asok bölgesi", phone: "—", lat: 13.74, lng: 100.56 },
  { city: "kohsamui", name: "(Ekle)", addr: "—", phone: "—", lat: 9.53, lng: 100.07 },
];

const S = (startMin, durMin, rest) => ({ startMin, durMin, ...rest });

const initDays = () => [
  { id: "d1", date: "15 Mayıs", label: "Gün 1", city: "beijing", title: "Pekin + HK Varış", spots: [
    { id: "s1", name: "Sanlitun", ...S(570, 90, { desc: "Pekin'in en modern semti. Taikoo Li markalar, trendy kafeler, canlı sokak.", tips: "Ara sokaklardaki bağımsız kafeler çok iyi.", category: "shopping", lat: 39.93, lng: 116.46, img: IMG.sanlitun, famous: "Taikoo Li, tasarım butikler", cost: 200, costCur: "CNY", transport: "Metro 10 → Tuanjiehu" }) },
    { id: "s2", name: "Parkview Green", ...S(690, 90, { desc: "Cam piramit lüks AVM. Sanat galerileri, premium markalar, fotoğraf için muhteşem.", tips: "İç mekan sıcaklığı kontrollü.", category: "shopping", lat: 39.93, lng: 116.45, img: IMG.parkview, famous: "Piramit mimari", cost: 150, costCur: "CNY", transport: "Yürüyüş 10dk" }) },
    { id: "s3", name: "Hong Kong Varış", ...S(1140, 150, { desc: "Otele geçiş, ilk gece HK skyline. Victoria Harbour büyüleyici.", tips: "Airport Express 24dk, 110 HKD.", category: "transport", lat: 22.32, lng: 114.17, img: IMG.hk, famous: "Victoria Harbour", cost: 110, costCur: "HKD", transport: "Airport Express" }) },
  ]},
  { id: "d2", date: "16 Mayıs", label: "Gün 2", city: "hongkong", title: "Hong Kong Tam Gün", spots: [
    { id: "s4", name: "Tsim Sha Tsui", ...S(660, 60, { desc: "Victoria Harbour sahili, Avenue of Stars. İkonik silüet karşınızda.", tips: "Sabah ışığı en güzel fotoğraf.", category: "sightseeing", lat: 22.29, lng: 114.17, img: IMG.tst, famous: "Harbour, Avenue of Stars", cost: 0, costCur: "HKD", transport: "MTR Tsim Sha Tsui" }) },
    { id: "s5", name: "K11 MUSEA", ...S(720, 90, { desc: "Sanat+alışveriş lüks merkez. Gold Ball Instagram noktası çok popüler.", tips: "Bodrum yemek alanı mükemmel.", category: "shopping", lat: 22.29, lng: 114.18, img: IMG.k11, famous: "Gold Ball, lüks", cost: 500, costCur: "HKD", transport: "Yürüyüş 5dk" }) },
    { id: "s6", name: "Harbour City", ...S(810, 60, { desc: "HK'nin en büyük AVM'si. 450+ mağaza, sahil kenarı devasa kompleks.", tips: "Ocean Terminal Deck manzarası.", category: "shopping", lat: 22.30, lng: 114.17, img: IMG.harbour, famous: "450 mağaza", cost: 300, costCur: "HKD", transport: "Yürüyüş 8dk" }) },
    { id: "s7", name: "Mong Kok", ...S(900, 120, { desc: "Dünyanın en yoğun bölgesi. Neon, Sneaker Street, sokak enerjisi.", tips: "Goldfish Market ilginç.", category: "explore", lat: 22.32, lng: 114.17, img: IMG.mongkok, famous: "Sneaker Street, neon", cost: 200, costCur: "HKD", transport: "MTR Mong Kok" }) },
    { id: "s8", name: "Ladies' Market", ...S(1020, 90, { desc: "1 km açık hava pazarı. Kıyafet, aksesuar, hediyelik, elektronik.", tips: "Pazarlık! Yarı fiyat başlayın.", category: "shopping", lat: 22.32, lng: 114.17, img: IMG.harbour, famous: "Uygun pazarı", cost: 150, costCur: "HKD", transport: "Yürüyüş 3dk" }) },
    { id: "s9", name: "Temple St Night Market", ...S(1140, 180, { desc: "En ünlü gece pazarı. Sokak yemeği, falcılar, canlı müzik, atmosfer.", tips: "Claypot rice deneyin. 21:00+ canlı.", category: "food", lat: 22.31, lng: 114.17, img: IMG.temple, famous: "Gece pazarı, yemek", cost: 100, costCur: "HKD", transport: "MTR Jordan" }) },
  ]},
  { id: "d3", date: "17 Mayıs", label: "Gün 3", city: "hongkong", title: "HK Sabah + Bangkok", spots: [
    { id: "s10", name: "Central / Soho", ...S(600, 180, { desc: "Finans+kültür merkezi. Mid-Levels Escalator dünyanın en uzunu.", tips: "PMQ tasarım merkezi güzel.", category: "explore", lat: 22.28, lng: 114.15, img: IMG.central, famous: "Escalator, PMQ", cost: 100, costCur: "HKD", transport: "MTR Central" }) },
    { id: "s11", name: "ICONSIAM", ...S(1200, 120, { desc: "Bangkok nehir kenarı dev AVM. İçinde yüzen pazar, her bölgeden yemek.", tips: "SookSiam katı muhteşem.", category: "food", lat: 13.73, lng: 100.51, img: IMG.iconsiam, famous: "Yüzen pazar", cost: 500, costCur: "THB", transport: "BTS → Gold Line" }) },
    { id: "s12", name: "Asiatique", ...S(1335, 75, { desc: "Eski liman açık hava gece pazarı. Dönme dolap, restoranlar.", tips: "Ferris wheel güzel. Ücretsiz giriş.", category: "explore", lat: 13.71, lng: 100.50, img: IMG.asiatique, famous: "Dönme dolap", cost: 200, costCur: "THB", transport: "Ücretsiz tekne" }) },
  ]},
  { id: "d4", date: "18 Mayıs", label: "Gün 4", city: "bangkok", title: "Bangkok Klasik", spots: [
    { id: "s13", name: "Grand Palace", ...S(540, 120, { desc: "1782 saray. Zümrüt Buda Tapınağı. Mimari inanılmaz detaylı.", tips: "Kapalı kıyafet zorunlu. Erken gidin. 500 THB.", category: "sightseeing", lat: 13.75, lng: 100.49, img: IMG.palace, famous: "Zümrüt Buda", cost: 500, costCur: "THB", transport: "Tekne → Tha Chang" }) },
    { id: "s14", name: "Wat Pho", ...S(660, 60, { desc: "46m yatan altın Buda. Tayland masajının doğum yeri.", tips: "Masaj 260 THB. Sedef kakma muhteşem.", category: "sightseeing", lat: 13.75, lng: 100.49, img: IMG.watpho, famous: "Yatan Buda, masaj", cost: 360, costCur: "THB", transport: "Yürüyüş 5dk" }) },
    { id: "s15", name: "Wat Arun", ...S(720, 60, { desc: "Şafak Tapınağı. 70m seramik kaplı kule, nehir kenarı.", tips: "Tekne 5dk. Merdivenler dik. 100 THB.", category: "sightseeing", lat: 13.74, lng: 100.49, img: IMG.watarun, famous: "Seramik mozaik", cost: 100, costCur: "THB", transport: "Tekne (5 THB)" }) },
    { id: "s16", name: "Lumphini Park", ...S(900, 45, { desc: "Bangkok'un Central Park'ı. Göl, palmiye, dev varanlar.", tips: "Varanlar zararsız ama büyük.", category: "nature", lat: 13.73, lng: 100.54, img: IMG.lumphini, famous: "Göl, varanlar", cost: 0, costCur: "THB", transport: "MRT Lumphini" }) },
    { id: "s17", name: "Mahanakhon SkyWalk", ...S(990, 105, { desc: "314m cam taban yürüyüş, 360° panorama. Bangkok'un en yükseği.", tips: "Gün batımı en iyi! Son giriş 18:30.", category: "sightseeing", lat: 13.72, lng: 100.53, img: IMG.skywalk, famous: "Cam taban", cost: 880, costCur: "THB", transport: "BTS Chong Nonsi" }) },
    { id: "s18", name: "Khao San Road", ...S(1140, 75, { desc: "Backpacker efsanesi. Bar, sokak yemeği, canlı müzik.", tips: "Pad Thai ucuz. Böcek tezgahları.", category: "food", lat: 13.76, lng: 100.50, img: IMG.khaosan, famous: "Backpacker", cost: 200, costCur: "THB", transport: "Grab ~80 THB" }) },
    { id: "s19", name: "Yaowarat Chinatown", ...S(1245, 90, { desc: "200 yıllık Chinatown. Neon, sokak yemeği cenneti.", tips: "Fried oyster + mango sticky rice.", category: "food", lat: 13.74, lng: 100.51, img: IMG.chinatown, famous: "Neon, street food", cost: 150, costCur: "THB", transport: "MRT Wat Mangkon" }) },
  ]},
  { id: "d5", date: "19 Mayıs", label: "Gün 5", city: "bangkok", title: "Alışveriş Maratonu", spots: [
    { id: "s20", name: "Benjakitti Park", ...S(600, 45, { desc: "Göl üzeri yürüyüş platformu, sabah sakinliği.", tips: "Skywalk fotoğraf güzel.", category: "nature", lat: 13.72, lng: 100.56, img: IMG.benjakitti, famous: "Göl, skywalk", cost: 0, costCur: "THB", transport: "MRT Queen Sirikit" }) },
    { id: "s21", name: "EM District", ...S(660, 150, { desc: "Emporium+EmQuartier+Emsphere üç AVM yaya bağlı.", tips: "Helix Dining çok iyi.", category: "shopping", lat: 13.73, lng: 100.57, img: IMG.em, famous: "3 AVM", cost: 1000, costCur: "THB", transport: "BTS Phrom Phong" }) },
    { id: "s22", name: "Terminal 21", ...S(825, 45, { desc: "Her kat farklı şehir temalı. Food court efsanevi ucuz.", tips: "5. kat: öğün 40-60 THB.", category: "shopping", lat: 13.74, lng: 100.56, img: IMG.t21, famous: "Temalı, ucuz yemek", cost: 60, costCur: "THB", transport: "BTS Asok" }) },
    { id: "s23", name: "Siam Paragon", ...S(900, 60, { desc: "En lüks AVM. Ocean World, IMAX.", tips: "Bodrum food hall premium.", category: "shopping", lat: 13.75, lng: 100.53, img: IMG.siam, famous: "Lüks, akvaryum", cost: 800, costCur: "THB", transport: "BTS Siam" }) },
    { id: "s24", name: "MBK + Siam Center", ...S(960, 75, { desc: "MBK uygun fiyat, Siam genç moda.", tips: "Telefon aksesuarları ucuz.", category: "shopping", lat: 13.74, lng: 100.53, img: IMG.harbour, famous: "Uygun fiyat", cost: 500, costCur: "THB", transport: "BTS National Stadium" }) },
    { id: "s25", name: "CentralWorld", ...S(1080, 75, { desc: "500+ mağaza, Groove restoranlar.", tips: "Groove açık hava güzel.", category: "shopping", lat: 13.75, lng: 100.54, img: IMG.centralw, famous: "Dev AVM", cost: 600, costCur: "THB", transport: "BTS Chit Lom" }) },
    { id: "s26", name: "Platinum Fashion", ...S(1170, 60, { desc: "Toptan fiyat perakende. 1300+ mağaza.", tips: "Nakit. Kapanış 20:00!", category: "shopping", lat: 13.75, lng: 100.54, img: IMG.harbour, famous: "Toptan moda", cost: 400, costCur: "THB", transport: "Yürüyüş 10dk" }) },
  ]},
  { id: "d6", date: "20 Mayıs", label: "Gün 6", city: "bangkok", title: "Bangkok → Samui", spots: [
    { id: "s27", name: "Serbest Sabah", ...S(600, 120, { desc: "Eksik alışveriş veya kahve molası.", tips: "Terminal 21 son kahvaltı.", category: "free", lat: 13.74, lng: 100.56, img: IMG.iconsiam, famous: "", cost: 100, costCur: "THB", transport: "—" }) },
    { id: "s28", name: "Koh Samui Varış", ...S(960, 180, { desc: "Tropik ada başlıyor! Palmiyeler, turkuaz su.", tips: "Transferi önceden ayarlayın.", category: "transport", lat: 9.55, lng: 100.06, img: IMG.samui, famous: "Açık hava havaalanı", cost: 300, costCur: "THB", transport: "Uçuş → shuttle" }) },
  ]},
  { id: "d7", date: "21 Mayıs", label: "Gün 7", city: "kohsamui", title: "Plaj & Dinlenme", spots: [
    { id: "s29", name: "Chaweng Beach", ...S(600, 360, { desc: "En uzun plaj. Beyaz kum, berrak su, barlar.", tips: "Kuzey ucu sakin. Güneş kremi!", category: "beach", lat: 9.53, lng: 100.07, img: IMG.chaweng, famous: "Beyaz kum", cost: 200, costCur: "THB", transport: "Songthaew 30 THB" }) },
    { id: "s30", name: "Fisherman's Village", ...S(1080, 180, { desc: "Bophut balıkçı köyü. Butik, deniz kenarı restoranlar.", tips: "Cuma Walking Street!", category: "food", lat: 9.56, lng: 100.05, img: IMG.fisherman, famous: "Cuma pazarı", cost: 400, costCur: "THB", transport: "Songthaew 50 THB" }) },
  ]},
  { id: "d8", date: "22 Mayıs", label: "Gün 8", city: "kohsamui", title: "Ada Turu", spots: [
    { id: "s31", name: "Ang Thong Marine Park", ...S(480, 540, { desc: "42 ada. Lagünler, kayak, şnorkeling, trekking.", tips: "Önceden rezerve. Su geçirmez çanta.", category: "nature", lat: 9.62, lng: 99.69, img: IMG.angthong, famous: "Emerald Lake, 42 ada", cost: 2500, costCur: "THB", transport: "Tur teknesi" }) },
  ]},
  { id: "d9", date: "23 Mayıs", label: "Gün 9", city: "kohsamui", title: "Serbest Gün", spots: [
    { id: "s32", name: "Bophut Beach", ...S(600, 180, { desc: "Sakin plaj, sığ su, samimi atmosfer.", tips: "Plajda masaj 300 THB.", category: "beach", lat: 9.56, lng: 100.05, img: IMG.bophut, famous: "Sakin, aile dostu", cost: 300, costCur: "THB", transport: "Yürüyüş" }) },
  ]},
  { id: "d10", date: "24 Mayıs", label: "Gün 10", city: "hongkong", title: "HK Son Gece", spots: [
    { id: "s33", name: "Son Akşam HK", ...S(1140, 180, { desc: "Son alışveriş, ışık gösterisi 20:00.", tips: "Symphony of Lights TST'den.", category: "sightseeing", lat: 22.29, lng: 114.17, img: IMG.hk, famous: "Işık gösterisi", cost: 200, costCur: "HKD", transport: "MTR TST" }) },
  ]},
  { id: "d11", date: "25 Mayıs", label: "Gün 11", city: "beijing", title: "Pekin Layover", spots: [
    { id: "s34", name: "Wangfujing", ...S(900, 150, { desc: "600+ yıllık cadde. Mağazalar ve Snack Street.", tips: "Egzotik sokak yemeği.", category: "explore", lat: 39.91, lng: 116.41, img: IMG.wangfujing, famous: "Tarihi cadde", cost: 200, costCur: "CNY", transport: "Metro Wangfujing" }) },
    { id: "s35", name: "Dashilan", ...S(1050, 150, { desc: "Qianmen tarihi cadde. İpek, çay evleri, geleneksel mimari.", tips: "Çay+ipek hediyelik.", category: "explore", lat: 39.89, lng: 116.40, img: IMG.dashilan, famous: "İpek, çay", cost: 300, costCur: "CNY", transport: "Metro Qianmen" }) },
  ]},
];

const initDiscover = () => [
  { id: "x1", name: "Talat Noi", city: "bangkok", desc: "Gizli street art mahallesi. Portekiz etkisi, vintage kafe.", famous: "Street art, Portekiz", category: "culture", lat: 13.73, lng: 100.51, img: IMG.chinatown, cost: 100, costCur: "THB" },
  { id: "x2", name: "Victoria Peak", city: "hongkong", desc: "Peak Tram ile tepe. En ikonik panoramik manzara.", famous: "Peak Tram, Sky Terrace", category: "sightseeing", lat: 22.28, lng: 114.15, img: IMG.hk, cost: 88, costCur: "HKD" },
  { id: "x3", name: "Chatuchak Market", city: "bangkok", desc: "Dünyanın en büyük hafta sonu pazarı. 15.000+ tezgah.", famous: "Vintage, sanat, yemek", category: "shopping", lat: 13.80, lng: 100.55, img: IMG.iconsiam, cost: 500, costCur: "THB" },
  { id: "x4", name: "Jodd Fairs", city: "bangkok", desc: "En trendy gece pazarı. Neon, dev deniz ürünleri.", famous: "Neon, seafood", category: "food", lat: 13.75, lng: 100.57, img: IMG.chinatown, cost: 300, costCur: "THB" },
  { id: "x5", name: "Lan Kwai Fong", city: "hongkong", desc: "Efsanevi bar sokağı. Canlı müzik, uluslararası.", famous: "Barlar, müzik", category: "nightlife", lat: 22.28, lng: 114.16, img: IMG.central, cost: 200, costCur: "HKD" },
  { id: "x6", name: "798 Art District", city: "beijing", desc: "Eski fabrika → modern sanat. Galeriler, Bauhaus.", famous: "Çağdaş sanat", category: "culture", lat: 39.98, lng: 116.49, img: IMG.sanlitun, cost: 50, costCur: "CNY" },
  { id: "x7", name: "Star Ferry", city: "hongkong", desc: "1888'den beri feribot. 10dk geçiş, sadece 3 HKD.", famous: "İkonik, 3 HKD", category: "sightseeing", lat: 22.29, lng: 114.17, img: IMG.tst, cost: 3, costCur: "HKD" },
  { id: "x8", name: "Lamai Beach", city: "kohsamui", desc: "Chaweng alternatifi. Sakin, güzel kayalıklar.", famous: "Grandfather rocks", category: "beach", lat: 9.47, lng: 100.05, img: IMG.bophut, cost: 0, costCur: "THB" },
  { id: "x9", name: "Dusit Central Park", city: "bangkok", desc: "2024 açılan dev park. Eski bira fabrikası.", famous: "Yeni park, heritage", category: "nature", lat: 13.77, lng: 100.51, img: IMG.benjakitti, cost: 0, costCur: "THB" },
  { id: "x10", name: "Song Wat Road", city: "bangkok", desc: "Chinatown'ın yaratıcı caddesi. Galeri, bar.", famous: "Cocktail, pop-up", category: "nightlife", lat: 13.74, lng: 100.51, img: IMG.khaosan, cost: 300, costCur: "THB" },
];

const fm = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const dl = (m) => m >= 60 ? (Math.floor(m / 60) + "sa" + (m % 60 ? " " + m % 60 + "dk" : "")) : (m + "dk");
const toTRY = (a, c) => Math.round(a * ({ CNY: 4.8, HKD: 4.5, THB: 0.95 }[c] || 1));

export default function App() {
  const [tab, setTab] = useState("plan");
  const [days, setDays] = useState(initDays);
  const [flights, setFlights] = useState(initFlights);
  const [disc, setDisc] = useState(initDiscover);
  const [liked, setLiked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const [checks, setChecks] = useState(initChecklist);
  const [hotels, setHotels] = useState(HOTELS);
  const [visited, setVisited] = useState({});
  const [ratings, setRatings] = useState({});
  const [notes, setNotes] = useState({});
  const [activeDay, setActiveDay] = useState(0);
  const [expSpot, setExpSpot] = useState(null);
  const [editSpot, setEditSpot] = useState(null);
  const [editFlight, setEditFlight] = useState(null);
  const [swDir, setSwDir] = useState(null);
  const [discCity, setDiscCity] = useState("all");
  const [discView, setDiscView] = useState("swipe");
  const [dark, setDark] = useState(false);
  const [infoSub, setInfoSub] = useState("flights");
  const [aiMsgs, setAiMsgs] = useState([]);
  const [aiIn, setAiIn] = useState("");
  const [aiLoad, setAiLoad] = useState(false);
  const [toast, setToast] = useState(null);
  const aiRef = useRef(null);
  const touchX = useRef(null);

  const day = days[activeDay];
  const ct = CITY[day?.city] || CITY.bangkok;
  const D = dark;
  const show = (m) => { setToast(m); setTimeout(() => setToast(null), 2000); };

  const T = { bg: D ? "#0c0f14" : "#F4F1EC", card: D ? "#1a1d24" : "#fff", txt: D ? "#e8e8e8" : "#1a1a2e", sub: D ? "#999" : "#666", dim: D ? "#555" : "#bbb", bdr: D ? "#2a2d34" : "#e8e8e8", bg2: D ? "#222630" : "#f0f0f0", inp: D ? "#222630" : "#fff", tip: D ? "#332B00" : "#FFF8E1", tipT: D ? "#FFD54F" : "#5D4037", act: D ? "#64B5F6" : "#1565C0" };

  const recalc = (sp) => { if (!sp.length) return sp; const r = [{ ...sp[0] }]; for (let i = 1; i < sp.length; i++) { const p = r[i - 1]; r.push({ ...sp[i], startMin: Math.max(sp[i].startMin, p.startMin + p.durMin + 30) }); } return r; };
  const updSpot = (sid, p) => { setDays(d => d.map((dd, i) => i !== activeDay ? dd : { ...dd, spots: recalc(dd.spots.map(s => s.id === sid ? { ...s, ...p } : s)) })); show("✅ Güncellendi"); };
  const delSpot = (sid) => { setDays(d => d.map((dd, i) => i !== activeDay ? dd : { ...dd, spots: recalc(dd.spots.filter(s => s.id !== sid)) })); setExpSpot(null); show("🗑️ Silindi"); };
  const movSpot = (sid, dir) => { setDays(d => d.map((dd, i) => { if (i !== activeDay) return dd; const idx = dd.spots.findIndex(s => s.id === sid); const ni = idx + dir; if (ni < 0 || ni >= dd.spots.length) return dd; const a = [...dd.spots]; [a[idx], a[ni]] = [a[ni], a[idx]]; return { ...dd, spots: recalc(a) }; })); show("↕️"); };
  const addToDay = (pl, di) => { setDays(d => d.map((dd, i) => i !== di ? dd : { ...dd, spots: recalc([...dd.spots, { ...pl, id: "a" + Date.now(), startMin: 1200, durMin: 90, tips: pl.famous, transport: "—" }]) })); show(`✅ ${pl.name} eklendi`); };

  const fd = disc.filter(d => discCity === "all" || d.city === discCity);
  const curD = fd[0];
  const swLike = () => { if (!curD) return; setSwDir("r"); setTimeout(() => { setLiked(p => [...p, curD]); setDisc(p => p.filter(x => x.id !== curD.id)); setSwDir(null); }, 200); };
  const swPass = () => { if (!curD) return; setSwDir("l"); setTimeout(() => { setDisliked(p => [...p, curD]); setDisc(p => p.filter(x => x.id !== curD.id)); setSwDir(null); }, 200); };

  const sendAi = async () => {
    if (!aiIn.trim()) return; const msg = aiIn.trim(); setAiIn("");
    setAiMsgs(p => [...p, { r: "user", t: msg }]); setAiLoad(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: `Gezi rehberi. Aslan, ${ct.n}'da. Program: ${day?.spots?.map(s => fm(s.startMin) + " " + s.name).join(", ")}. Kısa Türkçe, emoji. ${ct.cur} kur≈${ct.rate}TRY.`, messages: [...aiMsgs.map(m => ({ role: m.r === "user" ? "user" : "assistant", content: m.t })), { role: "user", content: msg }], tools: [{ type: "web_search_20250305", name: "web_search" }] }) });
      const d = await r.json(); const t = (d.content || []).filter(b => b.type === "text").map(b => b.text).join("\n") || "Cevap alınamadı.";
      setAiMsgs(p => [...p, { r: "assistant", t }]);
    } catch { setAiMsgs(p => [...p, { r: "assistant", t: "⚠️ Hata." }]); } setAiLoad(false);
  };
  useEffect(() => { if (aiRef.current) aiRef.current.scrollTop = aiRef.current.scrollHeight; }, [aiMsgs]);

  const dayBudget = day?.spots?.reduce((s, sp) => s + (sp.cost || 0) * ((CITY[day.city]?.rate) || 1), 0) || 0;
  const vToday = day?.spots?.filter(s => visited[s.id]).length || 0;

  /* ═══ SPOT CARD ═══ */
  const SpotCard = ({ sp, idx }) => {
    const cat = CAT[sp.category] || CAT.explore;
    const isE = expSpot === sp.id;
    const isEd = editSpot === sp.id;
    const isV = visited[sp.id];
    return (
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 32 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: isV ? "#4CAF50" : cat.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: `0 0 0 3px ${T.bg}` }}>{isV ? "✓" : idx + 1}</div>
          {idx < day.spots.length - 1 && <div style={{ width: 3, flex: 1, background: `${cat.c}33`, marginTop: 2, borderRadius: 2 }} />}
        </div>
        <div style={{ flex: 1, background: T.card, borderRadius: 18, overflow: "hidden", boxShadow: D ? "0 2px 12px rgba(0,0,0,.3)" : "0 2px 12px rgba(0,0,0,.07)", border: isE ? `2px solid ${cat.c}40` : `2px solid transparent`, marginBottom: 2 }}>
          <div style={{ position: "relative", height: isE ? 220 : 160, cursor: "pointer" }} onClick={() => { setExpSpot(isE ? null : sp.id); setEditSpot(null); }}>
            <img src={sp.img} alt={sp.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.src = FI(sp.name); }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 20%, rgba(0,0,0,.8))" }} />
            <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{sp.name}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ background: cat.c, color: "#fff", padding: "3px 10px", borderRadius: 14, fontSize: 12, fontWeight: 700 }}>{cat.i} {cat.l}</span>
                <span style={{ background: "rgba(0,0,0,.5)", color: "#fff", padding: "3px 10px", borderRadius: 14, fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}>🕐 {fm(sp.startMin)}–{fm(sp.startMin + sp.durMin)}</span>
                <span style={{ background: "rgba(0,0,0,.5)", color: "#4CAF50", padding: "3px 10px", borderRadius: 14, fontSize: 13, fontWeight: 700 }}>₺{toTRY(sp.cost || 0, sp.costCur)}</span>
              </div>
            </div>
            <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.5)", color: "#fff", padding: "4px 12px", borderRadius: 16, fontSize: 13, fontWeight: 700 }}>⏱ {dl(sp.durMin)}</div>
            {sp.famous && <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.5)", color: "#FFD54F", padding: "4px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600 }}>⭐ {sp.famous}</div>}
          </div>
          <div style={{ padding: "14px 16px" }}>
            <p style={{ margin: 0, fontSize: 15, color: T.sub, lineHeight: 1.55 }}>{sp.desc}</p>
            {sp.transport && sp.transport !== "—" && <div style={{ marginTop: 8, fontSize: 14, color: T.act, fontWeight: 600 }}>🚇 {sp.transport}</div>}
            {isE && (
              <>
                <div style={{ marginTop: 12, padding: "12px 14px", background: T.tip, borderRadius: 12, borderLeft: `4px solid ${cat.c}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: cat.c }}>💡 İPUCU</div>
                  <p style={{ margin: "4px 0 0", fontSize: 14, color: T.tipT, lineHeight: 1.45 }}>{sp.tips}</p>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setVisited(p => ({ ...p, [sp.id]: !p[sp.id] }))} style={{ padding: "8px 16px", borderRadius: 18, border: "none", background: isV ? "#4CAF50" : (D ? "#1B5E20" : "#E8F5E9"), color: isV ? "#fff" : "#4CAF50", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{isV ? "✅ Gezdim" : "Gezdim işaretle"}</button>
                  {[1, 2, 3, 4, 5].map(s => <span key={s} onClick={() => setRatings(p => ({ ...p, [sp.id]: s }))} style={{ cursor: "pointer", fontSize: 20, opacity: (ratings[sp.id] || 0) >= s ? 1 : 0.2 }}>⭐</span>)}
                </div>
                {isV && <input placeholder="Not bırak..." value={notes[sp.id] || ""} onChange={e => setNotes(p => ({ ...p, [sp.id]: e.target.value }))} style={{ marginTop: 8, width: "100%", padding: "10px 12px", borderRadius: 12, border: `1px solid ${T.bdr}`, fontSize: 14, boxSizing: "border-box", background: T.inp, color: T.txt }} />}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${sp.lat},${sp.lng}`} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: cat.c, color: "#fff", borderRadius: 18, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>📍 Harita</a>
                  <button onClick={() => setEditSpot(isEd ? null : sp.id)} style={{ padding: "8px 16px", background: T.bg2, color: T.txt, borderRadius: 18, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>✏️ Düzenle</button>
                  <button onClick={() => movSpot(sp.id, -1)} style={{ padding: "8px 12px", background: T.bg2, borderRadius: 18, border: "none", fontSize: 14, cursor: "pointer" }}>⬆️</button>
                  <button onClick={() => movSpot(sp.id, 1)} style={{ padding: "8px 12px", background: T.bg2, borderRadius: 18, border: "none", fontSize: 14, cursor: "pointer" }}>⬇️</button>
                  <button onClick={() => delSpot(sp.id)} style={{ padding: "8px 16px", background: D ? "#4A1515" : "#FFEBEE", color: "#EF5350", borderRadius: 18, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>🗑️</button>
                </div>
                {isEd && (
                  <div style={{ marginTop: 12, padding: 14, background: T.bg2, borderRadius: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.txt, marginBottom: 8 }}>⏰ Süre</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {[30, 45, 60, 90, 120, 150, 180, 240].map(d => (
                        <button key={d} onClick={() => { updSpot(sp.id, { durMin: d }); setEditSpot(null); }} style={{ padding: "6px 14px", background: sp.durMin === d ? cat.c : T.card, color: sp.durMin === d ? "#fff" : T.txt, border: `1px solid ${sp.durMin === d ? cat.c : T.bdr}`, borderRadius: 16, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{dl(d)}</button>
                      ))}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.txt, marginTop: 12, marginBottom: 6 }}>🕐 Başlangıç</div>
                    <input type="time" value={fm(sp.startMin)} onChange={e => { const [h, m] = e.target.value.split(":").map(Number); updSpot(sp.id, { startMin: h * 60 + m }); setEditSpot(null); }} style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${T.bdr}`, fontSize: 16, fontFamily: "monospace", background: T.inp, color: T.txt }} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ═══ TABS ═══ */
  const tabs = [{ k: "plan", i: "📋", l: "Program" }, { k: "discover", i: "🧭", l: "Keşfet" }, { k: "liked", i: "❤️", l: `Beğeni${liked.length ? " " + liked.length : ""}` }, { k: "info", i: "💼", l: "Bilgi" }, { k: "ai", i: "🤖", l: "AI" }];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Outfit',sans-serif", paddingBottom: 72, transition: "background .3s" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      {toast && <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: D ? "#fff" : "#1a1a2e", color: D ? "#1a1a2e" : "#fff", padding: "10px 22px", borderRadius: 22, fontSize: 15, fontWeight: 600, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,.2)", animation: "fi .3s" }}>{toast}</div>}

      {/* ═══ PLAN ═══ */}
      {tab === "plan" && (
        <div>
          <div style={{ background: ct.g, padding: "22px 18px 16px", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8, letterSpacing: ".08em" }}>🧳 ASLAN'S GUIDE</div>
              <button onClick={() => setDark(p => !p)} style={{ background: "rgba(255,255,255,.2)", border: "none", borderRadius: 18, padding: "6px 14px", color: "#fff", fontSize: 15, cursor: "pointer" }}>{D ? "☀️" : "🌙"}</button>
            </div>
            <h1 style={{ margin: "8px 0 0", fontSize: 24, fontWeight: 900 }}>{ct.f} {day.title}</h1>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 12, padding: "6px 14px", fontSize: 14, fontWeight: 600 }}>📅 {day.date}</div>
              <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 12, padding: "6px 14px", fontSize: 14, fontWeight: 600 }}>💰 ~₺{Math.round(dayBudget)}</div>
              <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 12, padding: "6px 14px", fontSize: 14, fontWeight: 600 }}>✅ {vToday}/{day.spots.length}</div>
            </div>
            <div style={{ marginTop: 10, height: 5, background: "rgba(255,255,255,.2)", borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${(vToday / (day.spots.length || 1)) * 100}%`, background: "#4CAF50", borderRadius: 3, transition: "width .3s" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, padding: "12px 16px", overflowX: "auto", background: T.card, borderBottom: `1px solid ${T.bdr}` }}>
            {days.map((d, i) => { const c = CITY[d.city]; const a = i === activeDay; return (
              <button key={d.id} onClick={() => { setActiveDay(i); setExpSpot(null); }} style={{ flexShrink: 0, padding: "7px 16px", borderRadius: 22, border: a ? `2px solid ${c.c}` : `1px solid ${T.bdr}`, background: a ? c.c : T.card, color: a ? "#fff" : T.sub, fontSize: 14, fontWeight: a ? 800 : 500, cursor: "pointer", whiteSpace: "nowrap" }}>{c.f} {d.date.split(" ")[0]}</button>
            ); })}
          </div>
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
            {day.spots.map((sp, idx) => <SpotCard key={sp.id} sp={sp} idx={idx} />)}
          </div>
        </div>
      )}

      {/* ═══ DISCOVER ═══ */}
      {tab === "discover" && (
        <div style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: T.txt }}>🧭 Keşfet</h2>
            <div style={{ display: "flex", gap: 5 }}>
              {[{ k: "swipe", l: "Kartlar" }, { k: "pass", l: `Geçilenler ${disliked.length}` }].map(v => (
                <button key={v.k} onClick={() => setDiscView(v.k)} style={{ padding: "6px 14px", borderRadius: 16, border: `1px solid ${discView === v.k ? T.act : T.bdr}`, background: discView === v.k ? T.act : T.card, color: discView === v.k ? "#fff" : T.sub, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{v.l}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, overflowX: "auto", marginBottom: 12 }}>
            {["all", ...new Set(disc.concat(disliked).map(d => d.city))].map(k => (
              <button key={k} onClick={() => setDiscCity(k)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 18, border: discCity === k ? `2px solid ${k === "all" ? T.act : (CITY[k]?.c)}` : `1px solid ${T.bdr}`, background: discCity === k ? (k === "all" ? T.act : CITY[k]?.c) : T.card, color: discCity === k ? "#fff" : T.sub, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{k === "all" ? "🌍 Tümü" : `${CITY[k]?.f} ${CITY[k]?.n}`}</button>
            ))}
          </div>

          {discView === "swipe" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <p style={{ margin: "0 0 12px", fontSize: 15, color: T.sub }}>Sağa = beğen ❤️ · Sola = geç 👎</p>
              {curD ? (
                <div onTouchStart={e => touchX.current = e.touches[0].clientX} onTouchEnd={e => { if (!touchX.current) return; const dd = e.changedTouches[0].clientX - touchX.current; if (dd > 50) swLike(); else if (dd < -50) swPass(); touchX.current = null; }} style={{ width: "100%", maxWidth: 380, background: T.card, borderRadius: 22, overflow: "hidden", boxShadow: D ? "0 8px 36px rgba(0,0,0,.4)" : "0 8px 36px rgba(0,0,0,.1)", transition: "transform .2s,opacity .2s", transform: swDir === "r" ? "translateX(100%) rotate(6deg)" : swDir === "l" ? "translateX(-100%) rotate(-6deg)" : "none", opacity: swDir ? 0.4 : 1 }}>
                  <div style={{ position: "relative", height: 240 }}>
                    <img src={curD.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.src = FI(curD.name); }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,.8))", padding: "50px 18px 16px" }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{curD.name}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                        <span style={{ background: CAT[curD.category]?.c, color: "#fff", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>{CAT[curD.category]?.i} {CAT[curD.category]?.l}</span>
                        <span style={{ color: "#FFD54F", fontSize: 14, fontWeight: 600 }}>{CITY[curD.city]?.f} {CITY[curD.city]?.n}</span>
                        <span style={{ color: "#4CAF50", fontSize: 14, fontWeight: 600 }}>₺{toTRY(curD.cost, curD.costCur)}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    <p style={{ margin: "0 0 10px", fontSize: 16, color: T.sub, lineHeight: 1.5 }}>{curD.desc}</p>
                    {curD.famous && <div style={{ padding: "8px 14px", background: T.tip, borderRadius: 12, marginBottom: 14 }}><span style={{ fontSize: 14, fontWeight: 700, color: "#FF8F00" }}>⭐ </span><span style={{ fontSize: 14, color: T.tipT }}>{curD.famous}</span></div>}
                    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                      <button onClick={swPass} style={{ width: 60, height: 60, borderRadius: "50%", border: "3px solid #EF5350", background: T.card, fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>👎</button>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${curD.lat},${curD.lng}`} target="_blank" rel="noopener noreferrer" style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #42A5F5", background: T.card, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", marginTop: 6 }}>📍</a>
                      <button onClick={swLike} style={{ width: 60, height: 60, borderRadius: "50%", border: "3px solid #66BB6A", background: T.card, fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>❤️</button>
                    </div>
                  </div>
                </div>
              ) : <div style={{ textAlign: "center", color: T.sub, marginTop: 50 }}><div style={{ fontSize: 48 }}>🎉</div><div style={{ fontSize: 18, fontWeight: 600, marginTop: 10 }}>Bu filtrede başka yok!</div></div>}
              <div style={{ marginTop: 12, fontSize: 14, color: T.dim }}>{fd.length} öneri kaldı</div>
            </div>
          )}

          {discView === "pass" && (
            <div>
              {disliked.length > 0 && <button onClick={() => { setDisc(p => [...p, ...disliked]); setDisliked([]); show("♻️ Tümü geri"); }} style={{ width: "100%", padding: "12px", borderRadius: 14, border: "none", background: T.act, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>♻️ Tümünü Geri Yükle ({disliked.length})</button>}
              {disliked.length === 0 ? <div style={{ textAlign: "center", color: T.dim, marginTop: 50 }}><div style={{ fontSize: 44 }}>✨</div><div style={{ fontSize: 16, marginTop: 8 }}>Geçilen yer yok</div></div> :
                disliked.map(p => (
                  <div key={p.id} style={{ background: T.card, borderRadius: 16, display: "flex", overflow: "hidden", marginBottom: 8, boxShadow: D ? "0 1px 6px rgba(0,0,0,.2)" : "0 1px 6px rgba(0,0,0,.05)" }}>
                    <img src={p.img} alt="" style={{ width: 100, height: 100, objectFit: "cover", opacity: 0.7 }} />
                    <div style={{ flex: 1, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: T.txt }}>{p.name}</div>
                        <div style={{ fontSize: 13, color: T.sub }}>{CITY[p.city]?.f} {CITY[p.city]?.n}</div>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => { setDisliked(prev => prev.filter(x => x.id !== p.id)); setDisc(prev => [...prev, p]); show("♻️"); }} style={{ flex: 1, padding: "6px", background: D ? "#1B5E20" : "#E8F5E9", color: "#4CAF50", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>♻️ Geri Al</button>
                        <button onClick={() => { setDisliked(prev => prev.filter(x => x.id !== p.id)); setLiked(prev => [...prev, p]); show("❤️"); }} style={{ padding: "6px 10px", background: D ? "#B71C1C" : "#FCE4EC", color: "#EF5350", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>❤️</button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      )}

      {/* ═══ LIKED ═══ */}
      {tab === "liked" && (
        <div style={{ padding: 18 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 900, color: T.txt }}>❤️ Beğendiklerin</h2>
          <p style={{ margin: "0 0 14px", fontSize: 15, color: T.sub }}>Güne ekleyerek programa dahil et</p>
          {liked.length === 0 ? <div style={{ textAlign: "center", color: T.dim, marginTop: 50 }}><div style={{ fontSize: 48 }}>🫥</div><div style={{ fontSize: 16, marginTop: 10 }}>Keşfet'te sağa kaydır</div></div> :
            liked.map(p => { const cat = CAT[p.category] || CAT.explore; return (
              <div key={p.id} style={{ background: T.card, borderRadius: 16, display: "flex", overflow: "hidden", marginBottom: 8, boxShadow: D ? "0 1px 8px rgba(0,0,0,.3)" : "0 1px 8px rgba(0,0,0,.05)" }}>
                <img src={p.img} alt="" style={{ width: 100, height: 100, objectFit: "cover" }} />
                <div style={{ flex: 1, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div><div style={{ fontSize: 16, fontWeight: 800, color: T.txt }}>{p.name} <span style={{ fontSize: 11, background: cat.c, color: "#fff", padding: "1px 7px", borderRadius: 8 }}>{cat.i}</span></div><div style={{ fontSize: 13, color: T.sub }}>{CITY[p.city]?.f} · ₺{toTRY(p.cost, p.costCur)}</div></div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <select onChange={e => { if (e.target.value !== "") addToDay(p, +e.target.value); e.target.value = ""; }} defaultValue="" style={{ padding: "5px 8px", borderRadius: 12, border: `1px solid ${T.bdr}`, fontSize: 13, flex: 1, color: T.sub, background: T.inp }}>
                      <option value="" disabled>➕ Güne ekle</option>
                      {days.map((d, i) => <option key={d.id} value={i}>{d.date}</option>)}
                    </select>
                    <button onClick={() => setLiked(prev => prev.filter(x => x.id !== p.id))} style={{ padding: "5px 10px", background: D ? "#4A1515" : "#FFEBEE", color: "#EF5350", border: "none", borderRadius: 12, fontSize: 13, cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              </div>
            ); })
          }
        </div>
      )}

      {/* ═══ INFO ═══ */}
      {tab === "info" && (
        <div style={{ padding: 18 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 900, color: T.txt }}>💼 Bilgi</h2>
          <div style={{ display: "flex", gap: 5, overflowX: "auto", marginBottom: 14 }}>
            {[{ k: "flights", l: "✈️ Uçuşlar" }, { k: "emergency", l: "🆘 Acil" }, { k: "lang", l: "🗣️ Dil" }, { k: "check", l: "🧳 Liste" }, { k: "tz", l: "🕐 Saat" }].map(t => (
              <button key={t.k} onClick={() => setInfoSub(t.k)} style={{ flexShrink: 0, padding: "7px 16px", borderRadius: 18, border: infoSub === t.k ? `2px solid ${T.act}` : `1px solid ${T.bdr}`, background: infoSub === t.k ? T.act : T.card, color: infoSub === t.k ? "#fff" : T.sub, fontSize: 14, fontWeight: infoSub === t.k ? 700 : 500, cursor: "pointer" }}>{t.l}</button>
            ))}
          </div>

          {infoSub === "flights" && flights.map(f => { const isEd = editFlight === f.id; return (
            <div key={f.id} style={{ background: T.card, borderRadius: 16, padding: "14px 16px", marginBottom: 8, cursor: "pointer", border: isEd ? `2px solid ${T.act}` : "2px solid transparent" }} onClick={() => setEditFlight(isEd ? null : f.id)}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: 13, color: T.sub }}>{f.date} · {f.time}</div><div style={{ fontSize: 18, fontWeight: 800, color: T.txt }}>{f.from} → {f.to}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 14, color: T.act, fontWeight: 600 }}>{f.air}</div>{f.note && <div style={{ fontSize: 13, color: "#FF8F00" }}>{f.note}</div>}</div>
              </div>
              {isEd && <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }} onClick={e => e.stopPropagation()}>
                {[{ k: "date", l: "Tarih" }, { k: "time", l: "Saat" }, { k: "from", l: "Nereden" }, { k: "to", l: "Nereye" }, { k: "air", l: "Havayolu" }, { k: "note", l: "Not" }].map(({ k, l }) => (
                  <div key={k} style={{ gridColumn: k === "note" ? "1/-1" : "auto" }}><div style={{ fontSize: 12, fontWeight: 700, color: T.sub }}>{l}</div><input value={f[k]} onChange={e => setFlights(p => p.map(x => x.id === f.id ? { ...x, [k]: e.target.value } : x))} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.bdr}`, fontSize: 15, boxSizing: "border-box", background: T.inp, color: T.txt }} /></div>
                ))}
              </div>}
            </div>
          ); })}

          {infoSub === "emergency" && Object.entries(CITY).map(([k, c]) => (
            <div key={k} style={{ background: T.card, borderRadius: 16, padding: "14px 16px", marginBottom: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.txt }}>{c.f} {c.n}</div>
              <div style={{ marginTop: 6, fontSize: 15, color: "#EF5350", fontWeight: 600 }}>🚨 {c.emergency}</div>
              <div style={{ marginTop: 4, fontSize: 15, color: T.act }}>🏛️ {c.consulate}</div>
              <div style={{ marginTop: 4, fontSize: 14, color: T.sub }}>🔌 {c.plug} · 📱 {c.sim}</div>
            </div>
          ))}

          {infoSub === "lang" && Object.entries(LANG).map(([k, phrases]) => (
            <div key={k} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.txt, marginBottom: 8 }}>{CITY[k]?.f} {CITY[k]?.n}</div>
              {phrases.map((p, i) => (
                <div key={i} style={{ background: T.card, borderRadius: 14, padding: "12px 14px", marginBottom: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontSize: 16, fontWeight: 700, color: T.txt }}>{p.t}</div><div style={{ fontSize: 14, color: T.sub }}>{p.l}</div></div>
                  <div style={{ background: D ? "#1a2744" : "#E8EAF6", padding: "5px 12px", borderRadius: 14, fontSize: 14, fontWeight: 600, color: T.act }}>🔊 {p.p}</div>
                </div>
              ))}
            </div>
          ))}

          {infoSub === "check" && Object.entries(checks).map(([g, items]) => (
            <div key={g} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.txt, marginBottom: 8 }}>{g === "bavul" ? "🧳 Bavul" : "📄 Belge"}</div>
              <div style={{ background: T.card, borderRadius: 16, padding: "12px 14px" }}>
                {items.map(it => (
                  <div key={it.id} onClick={() => setChecks(p => ({ ...p, [g]: p[g].map(x => x.id === it.id ? { ...x, ok: !x.ok } : x) }))} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.bdr}`, cursor: "pointer" }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, border: it.ok ? "none" : `2px solid ${T.bdr}`, background: it.ok ? "#4CAF50" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#fff", flexShrink: 0 }}>{it.ok ? "✓" : ""}</div>
                    <span style={{ fontSize: 15, color: it.ok ? T.dim : T.txt, textDecoration: it.ok ? "line-through" : "none" }}>{it.t}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 14, color: "#4CAF50", fontWeight: 600, marginTop: 6 }}>✅ {items.filter(x => x.ok).length}/{items.length}</div>
            </div>
          ))}

          {infoSub === "tz" && (
            <div>
              <div style={{ background: T.card, borderRadius: 16, padding: 16, textAlign: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.sub }}>🇹🇷 Antalya UTC+3</div>
                <div style={{ fontSize: 40, fontWeight: 900, color: T.txt, fontFamily: "monospace" }}>{new Date().toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" })}</div>
              </div>
              {Object.entries(CITY).map(([k, c]) => {
                const tz = { beijing: "Asia/Shanghai", hongkong: "Asia/Hong_Kong", bangkok: "Asia/Bangkok", kohsamui: "Asia/Bangkok" }[k];
                return (
                  <div key={k} style={{ background: T.card, borderRadius: 16, padding: 16, textAlign: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.sub }}>{c.f} {c.n} UTC+{c.tz}</div>
                    <div style={{ fontSize: 40, fontWeight: 900, color: c.c, fontFamily: "monospace" }}>{new Date().toLocaleTimeString("tr-TR", { timeZone: tz, hour: "2-digit", minute: "2-digit" })}</div>
                    <div style={{ fontSize: 14, color: T.sub }}>Antalya +{c.tz - 3} saat</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ AI ═══ */}
      {tab === "ai" && (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 72px)" }}>
          <div style={{ padding: "18px 18px 10px" }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: T.txt }}>🤖 AI Rehber</h2>
            <p style={{ margin: "2px 0 0", fontSize: 14, color: T.sub }}>Güncel bilgi + öneri</p>
          </div>
          <div ref={aiRef} style={{ flex: 1, overflowY: "auto", padding: "8px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
            {aiMsgs.length === 0 && (
              <div style={{ textAlign: "center", color: T.dim, marginTop: 30 }}>
                <div style={{ fontSize: 44 }}>🧭</div>
                <div style={{ fontWeight: 600, fontSize: 16, marginTop: 8 }}>Merhaba Aslan!</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 12 }}>
                  {["Yakında ne yiyeyim?", "1 saat fazla vaktim var", "Gizli mekanlar?", "Hava durumu?", "Yeni mekanlar?"].map(q => (
                    <button key={q} onClick={() => setAiIn(q)} style={{ padding: "8px 14px", background: T.bg2, border: `1px solid ${T.bdr}`, borderRadius: 16, fontSize: 13, cursor: "pointer", color: T.sub }}>{q}</button>
                  ))}
                </div>
              </div>
            )}
            {aiMsgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.r === "user" ? "flex-end" : "flex-start", maxWidth: "85%", padding: "12px 16px", borderRadius: m.r === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.r === "user" ? T.act : T.bg2, color: m.r === "user" ? "#fff" : T.txt, fontSize: 15, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.t}</div>
            ))}
            {aiLoad && <div style={{ alignSelf: "flex-start", padding: "12px 16px", borderRadius: 18, background: T.bg2, color: T.sub, fontSize: 15 }}>⏳ Düşünüyorum...</div>}
          </div>
          <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: `1px solid ${T.bdr}`, background: T.card }}>
            <input value={aiIn} onChange={e => setAiIn(e.target.value)} onKeyDown={e => e.key === "Enter" && sendAi()} placeholder="Soru sor..." style={{ flex: 1, padding: "14px 16px", borderRadius: 22, border: `1px solid ${T.bdr}`, fontSize: 15, outline: "none", background: T.inp, color: T.txt }} />
            <button onClick={sendAi} disabled={aiLoad || !aiIn.trim()} style={{ padding: "14px 20px", borderRadius: 22, border: "none", background: T.act, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: (aiLoad || !aiIn.trim()) ? 0.5 : 1 }}>→</button>
          </div>
        </div>
      )}

      {/* NAV */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", background: T.card, borderTop: `1px solid ${T.bdr}`, zIndex: 300, boxShadow: D ? "0 -2px 12px rgba(0,0,0,.3)" : "0 -2px 12px rgba(0,0,0,.06)" }}>
        {tabs.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{ flex: 1, padding: "10px 0 7px", border: "none", background: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", color: tab === t.k ? T.act : T.dim, fontSize: 12, fontWeight: tab === t.k ? 700 : 500, fontFamily: "'Outfit',sans-serif" }}>
            <span style={{ fontSize: 22 }}>{t.i}</span>
            <span>{t.l}</span>
          </button>
        ))}
      </div>
      <style>{`@keyframes fi{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}*{-webkit-tap-highlight-color:transparent;box-sizing:border-box}input,select,button{font-family:'Outfit',sans-serif}`}</style>
    </div>
  );
}
