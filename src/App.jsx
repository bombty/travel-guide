import { useState, useEffect, useRef } from "react";

/* ═══ CONFIG ═══ */
const CAT={shopping:{i:"🛍️",l:"Alışveriş",c:"#E91E63",b:"#FCE4EC"},food:{i:"🍜",l:"Yemek",c:"#FF9800",b:"#FFF3E0"},sightseeing:{i:"🏛️",l:"Gezi",c:"#9C27B0",b:"#F3E5F5"},explore:{i:"🧭",l:"Keşif",c:"#3F51B5",b:"#E8EAF6"},nature:{i:"🌿",l:"Doğa",c:"#4CAF50",b:"#E8F5E9"},transport:{i:"✈️",l:"Transfer",c:"#607D8B",b:"#ECEFF1"},free:{i:"☕",l:"Serbest",c:"#795548",b:"#EFEBE9"},nightlife:{i:"🌙",l:"Gece",c:"#FF5722",b:"#FBE9E7"},culture:{i:"🎭",l:"Kültür",c:"#00BCD4",b:"#E0F7FA"},beach:{i:"🏖️",l:"Sahil",c:"#00ACC1",b:"#E0F7FA"}};
const CITY={beijing:{n:"Pekin",f:"🇨🇳",c:"#C41E3A",g:"linear-gradient(135deg,#C41E3A,#8B0000)",cur:"CNY",rate:4.8,tz:8,plug:"A/C/I",sim:"China Mobile Tourist SIM",emergency:"110 polis, 120 ambulans, 119 itfaiye",consulate:"Türkiye Büyükelçiliği: +86-10-65321715"},hongkong:{n:"Hong Kong",f:"🇭🇰",c:"#DE2910",g:"linear-gradient(135deg,#DE2910,#B71C1C)",cur:"HKD",rate:4.5,tz:8,plug:"G (İngiliz)",sim:"CSL Tourist SIM, havaalanında",emergency:"999 (genel acil)",consulate:"Türkiye Konsolosluğu: +852-2572-1331"},bangkok:{n:"Bangkok",f:"🇹🇭",c:"#1565C0",g:"linear-gradient(135deg,#1565C0,#0D47A1)",cur:"THB",rate:0.95,tz:7,plug:"A/B/C",sim:"AIS Tourist SIM (havaalanı)",emergency:"191 polis, 1669 ambulans, 199 itfaiye",consulate:"Türkiye Büyükelçiliği: +66-2-274-7262"},kohsamui:{n:"Koh Samui",f:"🇹🇭",c:"#00796B",g:"linear-gradient(135deg,#00796B,#004D40)",cur:"THB",rate:0.95,tz:7,plug:"A/B/C",sim:"AIS (Bangkok'ta alın)",emergency:"191 polis, 1669 ambulans",consulate:"Bangkok büyükelçiliği"}};

const LANG={beijing:[{tr:"Merhaba",local:"Nǐ hǎo",pron:"Ni hao"},{tr:"Teşekkürler",local:"Xièxiè",pron:"Şie şie"},{tr:"Hesap lütfen",local:"Mǎidān",pron:"May dan"},{tr:"Bu ne kadar?",local:"Duōshǎo qián?",pron:"Duo şao çien?"},{tr:"Yardım edin",local:"Jiùmìng!",pron:"Ciyu ming!"},{tr:"Evet / Hayır",local:"Shì / Bù shì",pron:"Şı / Bu şı"},{tr:"Havaalanı",local:"Jīchǎng",pron:"Ci çang"},{tr:"Tuvaletler nerede?",local:"Cèsuǒ zài nǎr?",pron:"Tsö suo dzay nar?"}],hongkong:[{tr:"Merhaba",local:"Néih hóu",pron:"Ney ho"},{tr:"Teşekkürler",local:"M̀h'gōi",pron:"Mm goy"},{tr:"Hesap lütfen",local:"Māai dāan",pron:"May dan"},{tr:"Bu ne kadar?",local:"Géi dō chín?",pron:"Gay do çin?"},{tr:"Yardım edin",local:"Gau mehng!",pron:"Gau meng!"},{tr:"Evet / Hayır",local:"Haih / M̀h haih",pron:"Hay / Mm hay"}],bangkok:[{tr:"Merhaba",local:"Sawàtdii kráp",pron:"Savat dii krap"},{tr:"Teşekkürler",local:"Khàawp khun kráp",pron:"Kop kun krap"},{tr:"Hesap lütfen",local:"Check bin kráp",pron:"Çek bin krap"},{tr:"Bu ne kadar?",local:"Thâo rài?",pron:"Tao ray?"},{tr:"Yardım edin",local:"Chûuay dûuay!",pron:"Çuay duay!"},{tr:"Evet / Hayır",local:"Châi / Mâi châi",pron:"Çay / May çay"},{tr:"Acı olmasın",local:"Mâi phèt",pron:"May pet"},{tr:"İndirim var mı?",local:"Lót dâi mái?",pron:"Lot day may?"}],kohsamui:[{tr:"(Bangkok ile aynı)",local:"Sawàtdii kráp",pron:"Savat dii krap"}]};

const HOTELS=[
  {city:"hongkong",name:"(Otel bilgisi ekle)",addr:"—",checkin:"14:00",checkout:"11:00",phone:"—",lat:22.2932,lng:114.172},
  {city:"bangkok",name:"(Otel bilgisi ekle)",addr:"Asok bölgesi önerilir",checkin:"14:00",checkout:"12:00",phone:"—",lat:13.7378,lng:100.5602},
  {city:"kohsamui",name:"(Otel bilgisi ekle)",addr:"—",checkin:"14:00",checkout:"11:00",phone:"—",lat:9.5313,lng:100.0699},
];

const initChecklist=()=>({
  bavul:[
    {id:"c1",t:"Pasaport + fotokopi",ok:false},{id:"c2",t:"Uçak biletleri (print)",ok:false},
    {id:"c3",t:"Otel reservasyonları",ok:false},{id:"c4",t:"Seyahat sigortası",ok:false},
    {id:"c5",t:"Kredi/banka kartı + nakit USD",ok:false},{id:"c6",t:"Şarj kablosu + powerbank",ok:false},
    {id:"c7",t:"Adaptör (G tipi HK, A/C Tayland/Çin)",ok:false},{id:"c8",t:"Güneş kremi SPF50+",ok:false},
    {id:"c9",t:"Şemsiye / yağmurluk",ok:false},{id:"c10",t:"Rahat yürüyüş ayakkabısı",ok:false},
    {id:"c11",t:"Tapınak kıyafeti (diz+omuz kapalı)",ok:false},{id:"c12",t:"İlaçlar + ilk yardım",ok:false},
    {id:"c13",t:"SIM kart / eSIM (Airalo vb.)",ok:false},{id:"c14",t:"Fotoğraf makinesi / GoPro",ok:false},
    {id:"c15",t:"Su geçirmez çanta/kılıf",ok:false},{id:"c16",t:"Küçük sırt çantası (günlük)",ok:false},
  ],
  belge:[
    {id:"b1",t:"Çin: 24h transit vizesiz (layover)",ok:false},{id:"b2",t:"HK: 90 gün vizesiz",ok:false},
    {id:"b3",t:"Tayland: 60 gün vizesiz",ok:false},{id:"b4",t:"COVID belge gerekli mi? (kontrol et)",ok:false},
  ]
});

const initFlights=()=>[
  {id:"f1",date:"14 May",time:"15:00",from:"İstanbul",to:"Pekin",air:"Air China CA860",note:""},
  {id:"f2",date:"15 May",time:"05:20",from:"Pekin varış",to:"—",air:"—",note:"10sa layover"},
  {id:"f3",date:"15 May",time:"15:20",from:"Pekin",to:"Hong Kong",air:"Air China CA115",note:""},
  {id:"f4",date:"17 May",time:"17:00",from:"Hong Kong",to:"Bangkok",air:"—",note:""},
  {id:"f5",date:"20 May",time:"16:00",from:"Bangkok",to:"Koh Samui",air:"—",note:""},
  {id:"f6",date:"24 May",time:"—",from:"Koh Samui",to:"Hong Kong",air:"—",note:""},
  {id:"f7",date:"25 May",time:"08:30",from:"Hong Kong",to:"Pekin",air:"CA118",note:"13sa55dk layover"},
  {id:"f8",date:"26 May",time:"01:55",from:"Pekin",to:"İstanbul",air:"CA859",note:"08:00 varış"},
];

const initDays=()=>[
  {id:"d1",date:"15 Mayıs",label:"Gün 1",city:"beijing",title:"Pekin Layover + HK",spots:[
    {id:"s1",name:"Sanlitun",startMin:570,durMin:90,desc:"Pekin'in en modern semti. Taikoo Li markalar, kafeler.",tips:"Ara sokaklardaki kafeler çok iyi.",category:"shopping",lat:39.93,lng:116.46,img:"https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&h=400&fit=crop",famous:"Taikoo Li, tasarım butikler",cost:200,costCur:"CNY",transport:"Metro Hattı 10 → Tuanjiehu"},
    {id:"s2",name:"Parkview Green",startMin:690,durMin:90,desc:"Cam piramit AVM. Sanat galerileri, premium markalar.",tips:"Mimari fotoğraf muhteşem.",category:"shopping",lat:39.93,lng:116.45,img:"https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=600&h=400&fit=crop",famous:"Piramit mimari, galeri",cost:150,costCur:"CNY",transport:"Yürüyüş 10dk Sanlitun'dan"},
    {id:"s3",name:"Hong Kong Varış",startMin:1140,durMin:150,desc:"Otele geçiş, ilk gece skyline.",tips:"Airport Express 24dk, 110 HKD.",category:"transport",lat:22.32,lng:114.17,img:"https://images.unsplash.com/photo-1536599018102-9f803c979981?w=600&h=400&fit=crop",famous:"Victoria Harbour",cost:110,costCur:"HKD",transport:"Airport Express → Hong Kong Stn"},
  ]},
  {id:"d2",date:"16 Mayıs",label:"Gün 2",city:"hongkong",title:"Hong Kong Tam Gün",spots:[
    {id:"s4",name:"Tsim Sha Tsui",startMin:660,durMin:60,desc:"Victoria Harbour manzarası, Avenue of Stars.",tips:"Sabah ışığı en iyi fotoğraf.",category:"sightseeing",lat:22.29,lng:114.17,img:"https://images.unsplash.com/photo-1594973782943-3b23f7e3e536?w=600&h=400&fit=crop",famous:"Harbour, Avenue of Stars",cost:0,costCur:"HKD",transport:"MTR Tsim Sha Tsui Stn"},
    {id:"s5",name:"K11 MUSEA",startMin:720,durMin:90,desc:"Sanat+alışveriş, Gold Ball.",tips:"Bodrum yemek alanı çok iyi.",category:"shopping",lat:22.29,lng:114.18,img:"https://images.unsplash.com/photo-1582560475093-ba66accbc953?w=600&h=400&fit=crop",famous:"Gold Ball, lüks markalar",cost:500,costCur:"HKD",transport:"Yürüyüş 5dk TST'den"},
    {id:"s6",name:"Harbour City",startMin:810,durMin:60,desc:"450+ mağaza, sahil kenarı dev AVM.",tips:"Ocean Terminal Deck manzarası.",category:"shopping",lat:22.30,lng:114.17,img:"https://images.unsplash.com/photo-1518599807935-37015b9cefcb?w=600&h=400&fit=crop",famous:"Cruise limanı, 450 mağaza",cost:300,costCur:"HKD",transport:"Yürüyüş 8dk K11'den"},
    {id:"s7",name:"Mong Kok",startMin:900,durMin:120,desc:"Dünyanın en yoğun bölgesi. Sneaker Street.",tips:"Goldfish Market ilginç.",category:"explore",lat:22.32,lng:114.17,img:"https://images.unsplash.com/photo-1513622790541-eaa84d356909?w=600&h=400&fit=crop",famous:"Sneaker Street, neon",cost:200,costCur:"HKD",transport:"MTR Mong Kok Stn (1 durak)"},
    {id:"s8",name:"Ladies' Market",startMin:1020,durMin:90,desc:"1km açık hava pazarı.",tips:"Pazarlık şart! Yarı fiyat başla.",category:"shopping",lat:22.32,lng:114.17,img:"https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&h=400&fit=crop",famous:"Uygun fiyat, sokak pazarı",cost:150,costCur:"HKD",transport:"Yürüyüş 3dk Mong Kok'tan"},
    {id:"s9",name:"Temple St Night Market",startMin:1140,durMin:180,desc:"En ünlü gece pazarı. Sokak yemeği, falcılar.",tips:"Claypot rice deneyin. 21:00+ canlı.",category:"food",lat:22.31,lng:114.17,img:"https://images.unsplash.com/photo-1517824806704-9040b037703b?w=600&h=400&fit=crop",famous:"Gece pazarı, sokak yemeği",cost:100,costCur:"HKD",transport:"MTR Jordan Stn"},
  ]},
  {id:"d3",date:"17 Mayıs",label:"Gün 3",city:"hongkong",title:"HK Sabah + Bangkok",spots:[
    {id:"s10",name:"Central / Soho",startMin:600,durMin:180,desc:"Finans+kültür. Escalator, sanat, kafeler.",tips:"Mid-Levels dünyanın en uzun merdiveni.",category:"explore",lat:22.28,lng:114.15,img:"https://images.unsplash.com/photo-1576788369575-4ab045b9287e?w=600&h=400&fit=crop",famous:"Escalator, PMQ",cost:100,costCur:"HKD",transport:"MTR Central Stn"},
    {id:"s11",name:"ICONSIAM",startMin:1200,durMin:120,desc:"Bangkok nehir kenarı dev AVM, yüzen pazar.",tips:"SookSiam her bölgeden yemek.",category:"food",lat:13.73,lng:100.51,img:"https://images.unsplash.com/photo-1563784462386-044fd95e9852?w=600&h=400&fit=crop",famous:"Yüzen pazar, nehir",cost:500,costCur:"THB",transport:"BTS → Gold Line → ICONSIAM"},
    {id:"s12",name:"Asiatique",startMin:1335,durMin:75,desc:"Eski liman, gece pazarı, dönme dolap.",tips:"Ferris wheel güzel. Ücretsiz giriş.",category:"explore",lat:13.71,lng:100.50,img:"https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop",famous:"Dönme dolap, nehir",cost:200,costCur:"THB",transport:"Ücretsiz tekne Sathorn'dan"},
  ]},
  {id:"d4",date:"18 Mayıs",label:"Gün 4",city:"bangkok",title:"Bangkok Klasik",spots:[
    {id:"s13",name:"Grand Palace",startMin:540,durMin:120,desc:"1782 saray. Zümrüt Buda. Muhteşem mimari.",tips:"Kapalı kıyafet zorunlu. Sabah erken.",category:"sightseeing",lat:13.75,lng:100.49,img:"https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&h=400&fit=crop",famous:"Zümrüt Buda, kraliyet",cost:500,costCur:"THB",transport:"Tekne → Tha Chang İskelesi"},
    {id:"s14",name:"Wat Pho",startMin:660,durMin:60,desc:"46m yatan Buda. Masajın doğum yeri.",tips:"Masaj 260 THB. Sedef kakma.",category:"sightseeing",lat:13.75,lng:100.49,img:"https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop",famous:"Yatan Buda, Tayland masajı",cost:360,costCur:"THB",transport:"Yürüyüş 5dk Grand Palace'tan"},
    {id:"s15",name:"Wat Arun",startMin:720,durMin:60,desc:"Şafak Tapınağı, 70m seramik kule.",tips:"Tekne 5dk. Merdivenler dik.",category:"sightseeing",lat:13.74,lng:100.49,img:"https://images.unsplash.com/photo-1569431801806-8af1e5e2b2ac?w=600&h=400&fit=crop",famous:"Seramik mozaik, nehir",cost:100,costCur:"THB",transport:"Tekne Wat Pho'dan (5 THB)"},
    {id:"s16",name:"Lumphini Park",startMin:900,durMin:45,desc:"Bangkok'un Central Park'ı.",tips:"Varanlar büyük ama zararsız.",category:"nature",lat:13.73,lng:100.54,img:"https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=600&h=400&fit=crop",famous:"Göl, varanlar",cost:0,costCur:"THB",transport:"MRT Lumphini Stn"},
    {id:"s17",name:"Mahanakhon SkyWalk",startMin:990,durMin:105,desc:"314m cam taban, 360° panorama.",tips:"Gün batımı en iyi! Son giriş 18:30.",category:"sightseeing",lat:13.72,lng:100.53,img:"https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop",famous:"Cam taban, en yüksek bina",cost:880,costCur:"THB",transport:"BTS Chong Nonsi Stn"},
    {id:"s18",name:"Khao San Road",startMin:1140,durMin:75,desc:"Backpacker efsanesi. Bar, sokak yemeği.",tips:"Pad Thai ucuz. Böcek tezgahları.",category:"food",lat:13.76,lng:100.50,img:"https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&h=400&fit=crop",famous:"Backpacker, gece hayatı",cost:200,costCur:"THB",transport:"Taksi/Grab (~80 THB)"},
    {id:"s19",name:"Yaowarat Chinatown",startMin:1245,durMin:90,desc:"200 yıllık Chinatown. Neon, sokak yemeği.",tips:"Fried oyster + mango sticky rice.",category:"food",lat:13.74,lng:100.51,img:"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop",famous:"Neon, sokak yemeği cenneti",cost:150,costCur:"THB",transport:"MRT Wat Mangkon Stn"},
  ]},
  {id:"d5",date:"19 Mayıs",label:"Gün 5",city:"bangkok",title:"Alışveriş Maratonu",spots:[
    {id:"s20",name:"Benjakitti Park",startMin:600,durMin:45,desc:"Göl platformu, sabah yürüyüşü.",tips:"Skywalk fotoğraf güzel.",category:"nature",lat:13.72,lng:100.56,img:"https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop",famous:"Göl, skywalk",cost:0,costCur:"THB",transport:"MRT Queen Sirikit Stn"},
    {id:"s21",name:"EM District",startMin:660,durMin:150,desc:"Emporium+EmQuartier+Emsphere bağlı.",tips:"Helix Dining çok iyi.",category:"shopping",lat:13.73,lng:100.57,img:"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop",famous:"3 AVM, rooftop bahçe",cost:1000,costCur:"THB",transport:"BTS Phrom Phong Stn"},
    {id:"s22",name:"Terminal 21",startMin:825,durMin:45,desc:"Her kat farklı şehir. Food court efsane.",tips:"5. kat: öğün 40-60 THB.",category:"shopping",lat:13.74,lng:100.56,img:"https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop",famous:"Şehir temaları, ucuz yemek",cost:60,costCur:"THB",transport:"BTS Asok Stn (1 durak)"},
    {id:"s23",name:"Siam Paragon",startMin:900,durMin:60,desc:"En lüks AVM. Akvaryum, IMAX.",tips:"Food hall premium.",category:"shopping",lat:13.75,lng:100.53,img:"https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop",famous:"Lüks, akvaryum",cost:800,costCur:"THB",transport:"BTS Siam Stn"},
    {id:"s24",name:"MBK + Siam Center",startMin:960,durMin:75,desc:"MBK uygun fiyat, Siam genç moda.",tips:"Telefon aksesuarları ucuz.",category:"shopping",lat:13.74,lng:100.53,img:"https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop",famous:"Uygun fiyat, yerel moda",cost:500,costCur:"THB",transport:"BTS National Stadium / Siam"},
    {id:"s25",name:"CentralWorld",startMin:1080,durMin:75,desc:"500+ mağaza, Groove restoranlar.",tips:"Groove açık hava güzel.",category:"shopping",lat:13.75,lng:100.54,img:"https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop",famous:"Dev AVM, buz pateni",cost:600,costCur:"THB",transport:"BTS Chit Lom Stn"},
    {id:"s26",name:"Platinum Fashion",startMin:1170,durMin:60,desc:"Toptan fiyat, 1300+ mağaza.",tips:"Nakit. Kapanış 20:00!",category:"shopping",lat:13.75,lng:100.54,img:"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop",famous:"Toptan moda",cost:400,costCur:"THB",transport:"Yürüyüş 10dk CentralWorld'den"},
  ]},
  {id:"d6",date:"20 Mayıs",label:"Gün 6",city:"bangkok",title:"Bangkok → Samui",spots:[
    {id:"s27",name:"Serbest Sabah",startMin:600,durMin:120,desc:"Eksik alışveriş veya kahve.",tips:"Terminal 21 son kahvaltı.",category:"free",lat:13.74,lng:100.56,img:"https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop",famous:"",cost:100,costCur:"THB",transport:"—"},
    {id:"s28",name:"Koh Samui Varış",startMin:960,durMin:180,desc:"Tropik ada başlıyor!",tips:"Transfer önceden ayarlayın.",category:"transport",lat:9.55,lng:100.06,img:"https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=600&h=400&fit=crop",famous:"Açık hava havaalanı",cost:300,costCur:"THB",transport:"Uçuş → otel shuttle"},
  ]},
  {id:"d7",date:"21 Mayıs",label:"Gün 7",city:"kohsamui",title:"Plaj & Dinlenme",spots:[
    {id:"s29",name:"Chaweng Beach",startMin:600,durMin:360,desc:"En uzun plaj. Beyaz kum, berrak su.",tips:"Kuzey ucu sakin. Güneş kremi.",category:"beach",lat:9.53,lng:100.07,img:"https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=600&h=400&fit=crop",famous:"Beyaz kum, plaj barları",cost:200,costCur:"THB",transport:"Songthaew (30-50 THB)"},
    {id:"s30",name:"Fisherman's Village",startMin:1080,durMin:180,desc:"Tarihi balıkçı köyü. Butik+restoran.",tips:"Cuma Walking Street!",category:"food",lat:9.56,lng:100.05,img:"https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&h=400&fit=crop",famous:"Cuma pazarı, deniz ürünleri",cost:400,costCur:"THB",transport:"Songthaew (50 THB)"},
  ]},
  {id:"d8",date:"22 Mayıs",label:"Gün 8",city:"kohsamui",title:"Ada Turu",spots:[
    {id:"s31",name:"Ang Thong Marine Park",startMin:480,durMin:540,desc:"42 ada. Lagünler, kayak, şnorkeling.",tips:"Önceden rezerve. Su geçirmez çanta.",category:"nature",lat:9.62,lng:99.69,img:"https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=600&h=400&fit=crop",famous:"Emerald Lake, 42 ada",cost:2500,costCur:"THB",transport:"Tur teknesi (dahil)"},
  ]},
  {id:"d9",date:"23 Mayıs",label:"Gün 9",city:"kohsamui",title:"Serbest Gün",spots:[
    {id:"s32",name:"Bophut Beach",startMin:600,durMin:180,desc:"Sakin plaj, sığ su, samimi.",tips:"Plajda masaj 300 THB.",category:"beach",lat:9.56,lng:100.05,img:"https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=600&h=400&fit=crop",famous:"Sakin, aile dostu",cost:300,costCur:"THB",transport:"Yürüyüş (otel yakınsa)"},
  ]},
  {id:"d10",date:"24 Mayıs",label:"Gün 10",city:"hongkong",title:"HK Son Gece",spots:[
    {id:"s33",name:"Son Akşam HK",startMin:1140,durMin:180,desc:"Son alışveriş, ışık gösterisi 20:00.",tips:"Symphony of Lights TST'den.",category:"sightseeing",lat:22.29,lng:114.17,img:"https://images.unsplash.com/photo-1536599018102-9f803c979981?w=600&h=400&fit=crop",famous:"Işık gösterisi",cost:200,costCur:"HKD",transport:"MTR Tsim Sha Tsui Stn"},
  ]},
  {id:"d11",date:"25 Mayıs",label:"Gün 11",city:"beijing",title:"Pekin Layover",spots:[
    {id:"s34",name:"Wangfujing",startMin:900,durMin:150,desc:"600+ yıllık cadde, sokak yemeği.",tips:"Snack Street egzotik.",category:"explore",lat:39.91,lng:116.41,img:"https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&h=400&fit=crop",famous:"Tarihi cadde, sokak yemeği",cost:200,costCur:"CNY",transport:"Metro Hattı 1 → Wangfujing"},
    {id:"s35",name:"Dashilan",startMin:1050,durMin:150,desc:"Qianmen tarihi cadde. İpek, çay.",tips:"Çin çayı + ipek hediyelik.",category:"explore",lat:39.89,lng:116.40,img:"https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop",famous:"Geleneksel mimari, ipek",cost:300,costCur:"CNY",transport:"Yürüyüş 15dk / Metro Qianmen"},
  ]},
];

const initDiscover=()=>[
  {id:"x1",name:"Talat Noi",city:"bangkok",desc:"Gizli street art mahallesi. Eski Portekiz etkisi, vintage kafeler, duvar resimleri.",famous:"Street art, Portekiz mirası, hipster kafeler",category:"culture",lat:13.73,lng:100.51,img:"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop",cost:100,costCur:"THB"},
  {id:"x2",name:"Song Wat Road",city:"bangkok",desc:"Chinatown'ın yeni yaratıcı caddesi. Galeri+bar+restoran.",famous:"Cocktail barlar, pop-up galeri, street food",category:"nightlife",lat:13.74,lng:100.51,img:"https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&h=400&fit=crop",cost:300,costCur:"THB"},
  {id:"x3",name:"Dusit Central Park",city:"bangkok",desc:"2024 açılan dev park. Eski bira fabrikası.",famous:"Heritage bina, göl, yeni park",category:"nature",lat:13.77,lng:100.51,img:"https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop",cost:0,costCur:"THB"},
  {id:"x4",name:"Victoria Peak",city:"hongkong",desc:"Tramvay ile tepe, HK'nin en ikonik manzarası.",famous:"Peak Tram, Sky Terrace 428",category:"sightseeing",lat:22.28,lng:114.15,img:"https://images.unsplash.com/photo-1594973782943-3b23f7e3e536?w=600&h=400&fit=crop",cost:88,costCur:"HKD"},
  {id:"x5",name:"Chatuchak Market",city:"bangkok",desc:"Dünyanın en büyük açık hava pazarı. 15.000 tezgah.",famous:"Vintage, sanat, yemek, bitki",category:"shopping",lat:13.80,lng:100.55,img:"https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop",cost:500,costCur:"THB"},
  {id:"x6",name:"Jodd Fairs",city:"bangkok",desc:"En trendy gece pazarı. Neon, seafood.",famous:"Neon, deniz ürünleri, vintage",category:"food",lat:13.75,lng:100.57,img:"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop",cost:300,costCur:"THB"},
  {id:"x7",name:"Lan Kwai Fong",city:"hongkong",desc:"Efsanevi bar/gece hayatı sokağı.",famous:"Barlar, canlı müzik",category:"nightlife",lat:22.28,lng:114.16,img:"https://images.unsplash.com/photo-1576788369575-4ab045b9287e?w=600&h=400&fit=crop",cost:200,costCur:"HKD"},
  {id:"x8",name:"798 Art District",city:"beijing",desc:"Eski fabrika → modern sanat merkezi.",famous:"Çağdaş sanat, Bauhaus",category:"culture",lat:39.98,lng:116.49,img:"https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&h=400&fit=crop",cost:50,costCur:"CNY"},
  {id:"x9",name:"Lamai Beach",city:"kohsamui",desc:"Chaweng alternatifi, sakin, güzel kayalıklar.",famous:"Grandfather rocks, sakin plaj",category:"beach",lat:9.47,lng:100.05,img:"https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=600&h=400&fit=crop",cost:0,costCur:"THB"},
  {id:"x10",name:"Star Ferry",city:"hongkong",desc:"1888'den beri çalışan efsanevi feribot.",famous:"İkonik, panoramik, 3 HKD",category:"sightseeing",lat:22.29,lng:114.17,img:"https://images.unsplash.com/photo-1536599018102-9f803c979981?w=600&h=400&fit=crop",cost:3,costCur:"HKD"},
  {id:"x11",name:"Tai O Köyü",city:"hongkong",desc:"Lantau'da su üzeri evler, pembe yunuslar.",famous:"Su evleri, pembe yunuslar",category:"explore",lat:22.25,lng:113.86,img:"https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&h=400&fit=crop",cost:50,costCur:"HKD"},
  {id:"x12",name:"Jurassic World Exp.",city:"bangkok",desc:"ICONSIAM'da interaktif dinozor deneyimi.",famous:"Animatronik, VR, interaktif",category:"explore",lat:13.73,lng:100.51,img:"https://images.unsplash.com/photo-1563784462386-044fd95e9852?w=600&h=400&fit=crop",cost:990,costCur:"THB"},
];

/* ═══ HELPERS ═══ */
const fm=m=>`${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;
const dl=m=>m>=60?(Math.floor(m/60)+"sa"+(m%60?" "+m%60+"dk":"")):(m+"dk");
const toTRY=(amt,cur)=>{const r={CNY:4.8,HKD:4.5,THB:0.95};return Math.round(amt*(r[cur]||1))};

/* ═══ MAIN APP ═══ */
export default function App(){
  const[tab,setTab]=useState("plan");
  const[days,setDays]=useState(initDays);
  const[flights,setFlights]=useState(initFlights);
  const[disc,setDisc]=useState(initDiscover);
  const[liked,setLiked]=useState([]);
  const[checks,setChecks]=useState(initChecklist);
  const[hotels,setHotels]=useState(HOTELS);
  const[visited,setVisited]=useState({});
  const[ratings,setRatings]=useState({});
  const[notes,setNotes]=useState({});
  const[activeDay,setActiveDay]=useState(0);
  const[expSpot,setExpSpot]=useState(null);
  const[editSpot,setEditSpot]=useState(null);
  const[editFlight,setEditFlight]=useState(null);
  const[swDir,setSwDir]=useState(null);
  const[disliked,setDisliked]=useState([]);
  const[discCity,setDiscCity]=useState("all");
  const[discCat,setDiscCat]=useState("all");
  const[discView,setDiscView]=useState("swipe");
  const[dark,setDark]=useState(false);
  const[infoSub,setInfoSub]=useState("flights");
  const[aiMsgs,setAiMsgs]=useState([]);
  const[aiIn,setAiIn]=useState("");
  const[aiLoad,setAiLoad]=useState(false);
  const[toast,setToast]=useState(null);
  const aiRef=useRef(null);
  const touchX=useRef(null);

  const day=days[activeDay];
  const ct=CITY[day?.city]||CITY.bangkok;
  const show=m=>{setToast(m);setTimeout(()=>setToast(null),2e3)};

  const recalc=sp=>{if(!sp.length)return sp;const r=[{...sp[0]}];for(let i=1;i<sp.length;i++){const p=r[i-1];r.push({...sp[i],startMin:Math.max(sp[i].startMin,p.startMin+p.durMin+30)})}return r};
  const updSpot=(sid,p)=>{setDays(d=>d.map((dd,i)=>i!==activeDay?dd:{...dd,spots:recalc(dd.spots.map(s=>s.id===sid?{...s,...p}:s))}));show("✅ Güncellendi")};
  const delSpot=sid=>{setDays(d=>d.map((dd,i)=>i!==activeDay?dd:{...dd,spots:recalc(dd.spots.filter(s=>s.id!==sid))}));setExpSpot(null);show("🗑️ Silindi")};
  const movSpot=(sid,dir)=>{setDays(d=>d.map((dd,i)=>{if(i!==activeDay)return dd;const idx=dd.spots.findIndex(s=>s.id===sid);const ni=idx+dir;if(ni<0||ni>=dd.spots.length)return dd;const a=[...dd.spots];[a[idx],a[ni]]=[a[ni],a[idx]];return{...dd,spots:recalc(a)}}));show("↕️")};
  const addToDay=(pl,di)=>{setDays(d=>d.map((dd,i)=>i!==di?dd:{...dd,spots:recalc([...dd.spots,{...pl,id:"a"+Date.now(),startMin:1200,durMin:90,tips:pl.famous,transport:"—"}])}));show(`✅ ${pl.name} eklendi`)};

  const filteredDisc=disc.filter(d=>(discCity==="all"||d.city===discCity)&&(discCat==="all"||d.category===discCat));
  const curDisc=filteredDisc[0];
  const swLike=()=>{if(!curDisc)return;setSwDir("r");setTimeout(()=>{setLiked(p=>[...p,curDisc]);setDisc(p=>p.filter(x=>x.id!==curDisc.id));setSwDir(null)},200)};
  const swPass=()=>{if(!curDisc)return;setSwDir("l");setTimeout(()=>{setDisliked(p=>[...p,curDisc]);setDisc(p=>p.filter(x=>x.id!==curDisc.id));setSwDir(null)},200)};
  const restoreDisliked=(item)=>{setDisliked(p=>p.filter(x=>x.id!==item.id));setDisc(p=>[...p,item]);show("♻️ Geri yüklendi")};
  const restoreAll=()=>{setDisc(p=>[...p,...disliked]);setDisliked([]);show("♻️ Tümü geri yüklendi")};

  const sendAi=async()=>{
    if(!aiIn.trim())return;const msg=aiIn.trim();setAiIn("");setAiMsgs(p=>[...p,{r:"user",t:msg}]);setAiLoad(true);
    const ctx=`Kişisel gezi rehberisin. Kullanıcı: Aslan, ${ct.n}'da. Bugün: ${day?.spots?.map(s=>`${fm(s.startMin)} ${s.name}`).join(", ")}. Kısa samimi Türkçe, emoji kullan. Web search ile güncel bilgi çek. Para birimi: ${ct.cur}, kur≈${ct.rate} TRY.`;
    try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:ctx,messages:[...aiMsgs.map(m=>({role:m.r==="user"?"user":"assistant",content:m.t})),{role:"user",content:msg}],tools:[{type:"web_search_20250305",name:"web_search"}]})});const d=await r.json();const t=(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n")||"Cevap alınamadı.";setAiMsgs(p=>[...p,{r:"assistant",t}])}catch{setAiMsgs(p=>[...p,{r:"assistant",t:"⚠️ Bağlantı hatası."}])}setAiLoad(false)};
  useEffect(()=>{aiRef.current&&(aiRef.current.scrollTop=aiRef.current.scrollHeight)},[aiMsgs]);

  /* budget calc */
  const dayBudget=day?.spots?.reduce((s,sp)=>s+(sp.cost||0)*((CITY[day.city]?.rate)||1),0)||0;
  const tripBudget=days.reduce((s,d)=>s+d.spots.reduce((ss,sp)=>ss+(sp.cost||0)*((CITY[d.city]?.rate)||1),0),0);

  const D=dark;
  const css={app:{minHeight:"100vh",background:D?"#0c0f14":"#F5F0EB",fontFamily:"'Outfit',sans-serif",paddingBottom:64,color:D?"#e0e0e0":"#333",transition:"background .3s,color .3s"},nav:{position:"fixed",bottom:0,left:0,right:0,display:"flex",background:D?"#1a1d24":"#fff",borderTop:`1px solid ${D?"#2a2d34":"#eee"}`,zIndex:300},nb:a=>({flex:1,padding:"6px 0 4px",border:"none",background:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:1,cursor:"pointer",color:a?(D?"#64B5F6":"#1565C0"):(D?"#666":"#aaa"),fontSize:9,fontWeight:a?700:500,fontFamily:"'Outfit',sans-serif"}),card:{background:D?"#1a1d24":"#fff",borderRadius:12,overflow:"hidden",boxShadow:D?"0 1px 6px rgba(0,0,0,.2)":"0 1px 6px rgba(0,0,0,.05)"},txt:{color:D?"#e0e0e0":"#1a1a2e"},sub:{color:D?"#999":"#777"},bg2:D?"#222630":"#F3F4F6",bdr:D?"#2a2d34":"#eee",inp:{background:D?"#222630":"#fff",color:D?"#e0e0e0":"#333",border:`1px solid ${D?"#333":"#ddd"}`}};

  /* ═══ PLAN TAB ═══ */
  const Plan=()=><div>
    <div style={{background:ct.g,padding:"16px 14px 10px",color:"#fff"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:9,fontWeight:600,opacity:.7,letterSpacing:".12em",textTransform:"uppercase"}}>🧳 Aslan's Travel Guide</div>
        <button onClick={()=>setDark(p=>!p)} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:14,padding:"3px 10px",color:"#fff",fontSize:11,cursor:"pointer"}}>{D?"☀️ Light":"🌙 Dark"}</button>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:3}}>
        <h1 style={{margin:0,fontSize:16,fontWeight:900}}>{ct.f} {day.title}</h1>
        <div style={{background:"rgba(255,255,255,.18)",borderRadius:8,padding:"3px 8px",textAlign:"center"}}>
          <div style={{fontSize:9,fontWeight:600}}>{day.label}</div>
          <div style={{fontSize:12,fontWeight:800}}>{day.date}</div>
        </div>
      </div>
      {/* budget + timezone bar */}
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <div style={{background:"rgba(255,255,255,.15)",borderRadius:8,padding:"4px 10px",fontSize:10}}>💰 Bugün: ~₺{Math.round(dayBudget)}</div>
        <div style={{background:"rgba(255,255,255,.15)",borderRadius:8,padding:"4px 10px",fontSize:10}}>🌍 Toplam: ~₺{Math.round(tripBudget)}</div>
        <div style={{background:"rgba(255,255,255,.15)",borderRadius:8,padding:"4px 10px",fontSize:10}}>🕐 {ct.n} UTC+{ct.tz}</div>
      </div>
    </div>
    {/* day pills */}
    <div style={{display:"flex",gap:3,padding:"8px 10px",overflowX:"auto",background:"#fff",borderBottom:"1px solid #eee"}}>
      {days.map((d,i)=>{const c=CITY[d.city];const a=i===activeDay;return <button key={d.id} onClick={()=>{setActiveDay(i);setExpSpot(null);setEditSpot(null)}} style={{flexShrink:0,padding:"3px 10px",borderRadius:16,border:a?`2px solid ${c.c}`:"1px solid #e0e0e0",background:a?c.c:"#fff",color:a?"#fff":"#999",fontSize:10,fontWeight:a?800:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Outfit',sans-serif"}}>{c.f} {d.date.split(" ")[0]}</button>})}
    </div>
    {/* spots */}
    <div style={{padding:"8px 10px",display:"flex",flexDirection:"column",gap:6}}>
      {day.spots.map((sp,idx)=>{const cat=CAT[sp.category]||CAT.explore;const isE=expSpot===sp.id;const isEd=editSpot===sp.id;const isV=visited[sp.id];
        return <div key={sp.id} style={{display:"flex",gap:6}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:10,minWidth:16}}>
            <div style={{width:isV?14:8,height:isV?14:8,borderRadius:"50%",background:isV?"#4CAF50":cat.c,border:"2px solid #fff",boxShadow:`0 0 0 1px ${cat.c}33`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:"#fff",transition:"all .2s"}}>{isV?"✓":""}</div>
            {idx<day.spots.length-1&&<div style={{width:1,flex:1,background:`${cat.c}22`,marginTop:2}}/>}
          </div>
          <div style={{flex:1,...css.card,border:isE?`1px solid ${cat.c}30`:"1px solid transparent"}}>
            <div style={{position:"relative",height:isE?160:100,overflow:"hidden",cursor:"pointer"}} onClick={()=>{setExpSpot(isE?null:sp.id);setEditSpot(null)}}>
              <img src={sp.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",top:5,left:5,background:"rgba(0,0,0,.6)",color:"#fff",padding:"2px 7px",borderRadius:12,fontSize:9,fontWeight:700,fontFamily:"monospace"}}>{fm(sp.startMin)}–{fm(sp.startMin+sp.durMin)}</div>
              <div style={{position:"absolute",top:5,right:5,background:cat.c,color:"#fff",padding:"1px 6px",borderRadius:12,fontSize:8,fontWeight:700}}>{cat.i} {cat.l}</div>
              {sp.famous&&<div style={{position:"absolute",bottom:5,left:5,background:"rgba(0,0,0,.5)",color:"#FFD54F",padding:"1px 7px",borderRadius:12,fontSize:8,fontWeight:600,maxWidth:"75%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>⭐ {sp.famous}</div>}
              <div style={{position:"absolute",bottom:5,right:5,background:"rgba(255,255,255,.9)",padding:"1px 6px",borderRadius:8,fontSize:8,fontWeight:700}}>⏱{dl(sp.durMin)}</div>
            </div>
            <div style={{padding:"6px 10px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <h3 style={{margin:0,fontSize:13,fontWeight:800,color:"#1a1a2e"}}>{sp.name}</h3>
                <div style={{display:"flex",gap:3,alignItems:"center"}}>
                  <span style={{fontSize:9,color:"#4CAF50",fontWeight:700}}>~₺{toTRY(sp.cost||0,sp.costCur)}</span>
                  <span onClick={()=>{setExpSpot(isE?null:sp.id);setEditSpot(null)}} style={{cursor:"pointer",fontSize:9,color:"#ccc",transform:isE?"rotate(180deg)":"none",transition:".2s"}}>▼</span>
                </div>
              </div>
              <p style={{margin:"3px 0 0",fontSize:11,color:"#777",lineHeight:1.4}}>{sp.desc}</p>
              {/* transport hint */}
              {sp.transport&&sp.transport!=="—"&&<div style={{marginTop:4,fontSize:10,color:"#1565C0",fontWeight:600}}>🚇 {sp.transport}</div>}

              {isE&&<>
                <div style={{marginTop:6,padding:"6px 8px",background:cat.b,borderRadius:8,borderLeft:`3px solid ${cat.c}`}}>
                  <div style={{fontSize:9,fontWeight:700,color:cat.c}}>💡 İPUCU</div>
                  <p style={{margin:"2px 0 0",fontSize:10,color:"#5D4037",lineHeight:1.35}}>{sp.tips}</p>
                </div>
                {/* cost detail */}
                <div style={{marginTop:6,fontSize:10,color:"#555"}}>💰 Tahmini: {sp.cost} {sp.costCur} ≈ ₺{toTRY(sp.cost||0,sp.costCur)}</div>
                {/* journal */}
                <div style={{marginTop:6,display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
                  <button onClick={()=>setVisited(p=>({...p,[sp.id]:!p[sp.id]}))} style={{padding:"4px 10px",borderRadius:14,border:"none",background:isV?"#4CAF50":"#E8F5E9",color:isV?"#fff":"#4CAF50",fontSize:10,fontWeight:700,cursor:"pointer"}}>{isV?"✅ Gezdim":"Gezdim olarak işaretle"}</button>
                  {[1,2,3,4,5].map(s=><span key={s} onClick={()=>setRatings(p=>({...p,[sp.id]:s}))} style={{cursor:"pointer",fontSize:14,opacity:(ratings[sp.id]||0)>=s?1:.25}}>⭐</span>)}
                </div>
                {isV&&<input placeholder="Not bırak..." value={notes[sp.id]||""} onChange={e=>setNotes(p=>({...p,[sp.id]:e.target.value}))} style={{marginTop:4,width:"100%",padding:"6px 8px",borderRadius:8,border:"1px solid #ddd",fontSize:10,boxSizing:"border-box"}}/>}
                {/* actions */}
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${sp.lat},${sp.lng}`} target="_blank" rel="noopener noreferrer" style={{padding:"4px 8px",background:cat.c,color:"#fff",borderRadius:14,fontSize:9,fontWeight:700,textDecoration:"none"}}>📍 Harita</a>
                  <button onClick={()=>setEditSpot(isEd?null:sp.id)} style={{padding:"4px 8px",background:isEd?"#333":"#f0f0f0",color:isEd?"#fff":"#333",borderRadius:14,border:"none",fontSize:9,fontWeight:700,cursor:"pointer"}}>✏️</button>
                  <button onClick={()=>movSpot(sp.id,-1)} style={{padding:"4px 6px",background:"#f0f0f0",borderRadius:14,border:"none",fontSize:9,cursor:"pointer"}}>⬆️</button>
                  <button onClick={()=>movSpot(sp.id,1)} style={{padding:"4px 6px",background:"#f0f0f0",borderRadius:14,border:"none",fontSize:9,cursor:"pointer"}}>⬇️</button>
                  <button onClick={()=>delSpot(sp.id)} style={{padding:"4px 8px",background:"#FFEBEE",color:"#C62828",borderRadius:14,border:"none",fontSize:9,fontWeight:700,cursor:"pointer"}}>🗑️</button>
                </div>
                {isEd&&<div style={{marginTop:6,padding:8,background:"#F3F4F6",borderRadius:8}}>
                  <div style={{fontSize:9,fontWeight:700,marginBottom:4}}>⏰ Süre</div>
                  <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                    {[30,45,60,90,120,150,180,240,360].map(d=><button key={d} onClick={()=>{updSpot(sp.id,{durMin:d});setEditSpot(null)}} style={{padding:"3px 8px",background:sp.durMin===d?cat.c:"#fff",color:sp.durMin===d?"#fff":"#333",border:`1px solid ${sp.durMin===d?cat.c:"#ddd"}`,borderRadius:12,fontSize:9,fontWeight:600,cursor:"pointer"}}>{dl(d)}</button>)}
                  </div>
                  <div style={{fontSize:9,fontWeight:700,marginTop:6,marginBottom:3}}>🕐 Başlangıç</div>
                  <input type="time" value={fm(sp.startMin)} onChange={e=>{const[h,m]=e.target.value.split(":").map(Number);updSpot(sp.id,{startMin:h*60+m});setEditSpot(null)}} style={{padding:"3px 6px",borderRadius:6,border:"1px solid #ddd",fontSize:11,fontFamily:"monospace"}}/>
                  <div style={{fontSize:9,fontWeight:700,marginTop:6,marginBottom:3}}>💰 Maliyet ({ct.cur})</div>
                  <input type="number" value={sp.cost||0} onChange={e=>updSpot(sp.id,{cost:+e.target.value})} style={{padding:"3px 6px",borderRadius:6,border:"1px solid #ddd",fontSize:11,width:80}}/>
                </div>}
              </>}
            </div>
          </div>
        </div>})}
    </div>
  </div>;

  /* ═══ DISCOVER ═══ */
  const cityKeys=["all",...new Set(disc.concat(disliked).map(d=>d.city))];
  const catKeys=["all",...new Set(disc.concat(disliked).map(d=>d.category))];
  const Discover=()=> {
    return <div style={{padding:14,minHeight:"calc(100vh - 64px)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
      <h2 style={{margin:0,fontSize:16,fontWeight:900,color:css.txt.color}}>🧭 Keşfet</h2>
      <div style={{display:"flex",gap:4}}>
        {[{k:"swipe",l:"Kartlar"},{k:"disliked",l:`Geçilenler (${disliked.length})`}].map(v=> (
          <button key={v.k} onClick={()=>setDiscView(v.k)} style={{padding:"3px 8px",borderRadius:12,border:`1px solid ${discView===v.k?(D?"#64B5F6":"#1565C0"):css.bdr}`,background:discView===v.k?(D?"#1565C0":"#1565C0"):(D?"#1a1d24":"#fff"),color:discView===v.k?"#fff":css.sub.color,fontSize:9,fontWeight:discView===v.k?700:500,cursor:"pointer"}}>{v.l}</button>
        ))}
      </div>
    </div>

    {/* City filter */}
    <div style={{display:"flex",gap:3,overflowX:"auto",marginBottom:6,paddingBottom:2}}>
      {cityKeys.map(k=> (
        <button key={k} onClick={()=>setDiscCity(k)} style={{flexShrink:0,padding:"3px 10px",borderRadius:14,border:discCity===k?`2px solid ${k==="all"?(D?"#64B5F6":"#1565C0"):(CITY[k]?.c||"#999")}`:`1px solid ${css.bdr}`,background:discCity===k?(k==="all"?(D?"#1565C0":"#1565C0"):(CITY[k]?.c||"#999")):(D?"#1a1d24":"#fff"),color:discCity===k?"#fff":css.sub.color,fontSize:10,fontWeight:discCity===k?700:500,cursor:"pointer",whiteSpace:"nowrap"}}>{k==="all"?"🌍 Tümü":`${CITY[k]?.f||""} ${CITY[k]?.n||k}`}</button>
      ))}
    </div>

    {/* Category filter */}
    <div style={{display:"flex",gap:3,overflowX:"auto",marginBottom:10,paddingBottom:2}}>
      {catKeys.map(k=> (
        <button key={k} onClick={()=>setDiscCat(k)} style={{flexShrink:0,padding:"3px 8px",borderRadius:14,border:discCat===k?`2px solid ${k==="all"?(D?"#64B5F6":"#1565C0"):(CAT[k]?.c||"#999")}`:`1px solid ${css.bdr}`,background:discCat===k?(k==="all"?(D?"#1565C0":"#1565C0"):(CAT[k]?.c||"#999")):(D?"#1a1d24":"#fff"),color:discCat===k?"#fff":css.sub.color,fontSize:9,fontWeight:discCat===k?700:500,cursor:"pointer",whiteSpace:"nowrap"}}>{k==="all"?"Tümü":`${CAT[k]?.i||""} ${CAT[k]?.l||k}`}</button>
      ))}
    </div>

    {discView==="swipe" && (<div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <p style={{margin:"0 0 8px",fontSize:11,color:css.sub.color}}>Sağa = beğen ❤️ · Sola = geç 👎</p>
      {curDisc ? (
        <div onTouchStart={e=>touchX.current=e.touches[0].clientX} onTouchEnd={e=>{if(!touchX.current)return;const dd=e.changedTouches[0].clientX-touchX.current;if(dd>50)swLike();else if(dd<-50)swPass();touchX.current=null}} style={{width:"100%",maxWidth:340,...css.card,borderRadius:18,transition:"transform .2s,opacity .2s",transform:swDir==="r"?"translateX(100%) rotate(6deg)":swDir==="l"?"translateX(-100%) rotate(-6deg)":"none",opacity:swDir?0.4:1}}>
          <div style={{position:"relative",height:200}}>
            <img src={curDisc.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,.7))",padding:"30px 14px 12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:18,fontWeight:900,color:"#fff"}}>{curDisc.name}</span>
                <span style={{background:CAT[curDisc.category]?.c||"#666",color:"#fff",padding:"1px 7px",borderRadius:10,fontSize:8,fontWeight:700}}>{CAT[curDisc.category]?.i} {CAT[curDisc.category]?.l}</span>
              </div>
              <div style={{color:"#FFD54F",fontSize:10,fontWeight:600,marginTop:1}}>{CITY[curDisc.city]?.f} {CITY[curDisc.city]?.n} · 💰 {curDisc.cost} {curDisc.costCur} ≈ ₺{toTRY(curDisc.cost,curDisc.costCur)}</div>
            </div>
          </div>
          <div style={{padding:"12px 14px"}}>
            <p style={{margin:"0 0 6px",fontSize:12,color:css.sub.color,lineHeight:1.45}}>{curDisc.desc}</p>
            {curDisc.famous && <div style={{padding:"6px 10px",background:D?"#332B00":"#FFF8E1",borderRadius:8,marginBottom:10}}><span style={{fontSize:10,fontWeight:700,color:"#FF8F00"}}>⭐ </span><span style={{fontSize:10,color:D?"#FFD54F":"#5D4037"}}>{curDisc.famous}</span></div>}
            <div style={{display:"flex",gap:8,justifyContent:"center"}}>
              <button onClick={swPass} style={{width:50,height:50,borderRadius:"50%",border:"2px solid #EF5350",background:D?"#1a1d24":"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>👎</button>
              <a href={`https://www.google.com/maps/search/?api=1&query=${curDisc.lat},${curDisc.lng}`} target="_blank" rel="noopener noreferrer" style={{width:40,height:40,borderRadius:"50%",border:"2px solid #42A5F5",background:D?"#1a1d24":"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",marginTop:5}}>📍</a>
              <button onClick={swLike} style={{width:50,height:50,borderRadius:"50%",border:"2px solid #66BB6A",background:D?"#1a1d24":"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>❤️</button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{textAlign:"center",color:css.sub.color,marginTop:50}}>
          <div style={{fontSize:40}}>🎉</div>
          <div style={{fontSize:13,fontWeight:600,marginTop:6}}>Bu filtrede başka öneri yok!</div>
          <p style={{fontSize:11}}>Filtreleri değiştir veya AI Rehber'den yeni öneriler iste.</p>
        </div>
      )}
      <div style={{marginTop:8,fontSize:10,color:css.sub.color}}>{filteredDisc.length} öneri kaldı (toplam {disc.length})</div>
    </div>)}

    {/* Disliked / Passed items */}
    {discView==="disliked" && (
      <div>
        {disliked.length > 0 && (
          <button onClick={restoreAll} style={{width:"100%",padding:"8px",borderRadius:10,border:"none",background:D?"#1565C0":"#E3F2FD",color:D?"#fff":"#1565C0",fontSize:11,fontWeight:700,cursor:"pointer",marginBottom:8}}>♻️ Tümünü Geri Yükle ({disliked.length})</button>
        )}
        {disliked.length === 0 ? (
          <div style={{textAlign:"center",color:css.sub.color,marginTop:40}}>
            <div style={{fontSize:36}}>✨</div>
            <div style={{fontSize:12,fontWeight:600,marginTop:6}}>Geçilen yer yok</div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {disliked.filter(d=>(discCity==="all"||d.city===discCity)&&(discCat==="all"||d.category===discCat)).map(p=> {
              const cat=CAT[p.category]||CAT.explore;
              return <div key={p.id} style={{...css.card,display:"flex",overflow:"hidden"}}>
                <img src={p.img} alt="" style={{width:80,height:80,objectFit:"cover",flexShrink:0,opacity:0.7}}/>
                <div style={{flex:1,padding:"6px 8px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:3}}>
                      <span style={{fontSize:12,fontWeight:800,color:css.txt.color}}>{p.name}</span>
                      <span style={{fontSize:7,background:cat.c,color:"#fff",padding:"0 5px",borderRadius:6,fontWeight:700}}>{cat.i}</span>
                    </div>
                    <div style={{fontSize:9,color:css.sub.color}}>{CITY[p.city]?.f} {CITY[p.city]?.n} · {p.famous}</div>
                  </div>
                  <div style={{display:"flex",gap:3}}>
                    <button onClick={()=>restoreDisliked(p)} style={{flex:1,padding:"4px 8px",background:D?"#1B5E20":"#E8F5E9",color:D?"#81C784":"#2E7D32",border:"none",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer"}}>♻️ Geri Al</button>
                    <button onClick={()=>{setDisliked(prev=>prev.filter(x=>x.id!==p.id));setLiked(prev=>[...prev,p]);show("❤️ Beğenildi")}} style={{padding:"4px 8px",background:D?"#B71C1C":"#FCE4EC",color:D?"#EF9A9A":"#C62828",border:"none",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer"}}>❤️ Beğen</button>
                  </div>
                </div>
              </div>;
            })}
          </div>
        )}
      </div>
    )}
  </div>;
  };

  /* ═══ LIKED ═══ */
  const Liked=()=><div style={{padding:14}}>
    <h2 style={{margin:"0 0 2px",fontSize:16,fontWeight:900,color:"#1a1a2e"}}>❤️ Beğendiklerin</h2>
    <p style={{margin:"0 0 10px",fontSize:11,color:"#999"}}>Güne ekleyerek programa dahil et</p>
    {liked.length===0?<div style={{textAlign:"center",color:"#ddd",marginTop:50}}><div style={{fontSize:40}}>🫥</div><div style={{fontSize:12,marginTop:6}}>Keşfet'te sağa kaydır</div></div>:
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {liked.map(p=>{const cat=CAT[p.category]||CAT.explore;return <div key={p.id} style={{...css.card,display:"flex",overflow:"hidden"}}>
        <img src={p.img} alt="" style={{width:80,height:80,objectFit:"cover",flexShrink:0}}/>
        <div style={{flex:1,padding:"6px 8px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
          <div><div style={{display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:12,fontWeight:800}}>{p.name}</span><span style={{fontSize:7,background:cat.c,color:"#fff",padding:"0 5px",borderRadius:6,fontWeight:700}}>{cat.i}</span></div>
          <div style={{fontSize:9,color:"#999"}}>{CITY[p.city]?.f} {CITY[p.city]?.n} · ₺{toTRY(p.cost,p.costCur)}</div></div>
          <div style={{display:"flex",gap:3}}>
            <select onChange={e=>{if(e.target.value!=="")addToDay(p,+e.target.value);e.target.value=""}} defaultValue="" style={{padding:"3px 6px",borderRadius:8,border:"1px solid #ddd",fontSize:9,flex:1}}>
              <option value="" disabled>➕ Güne ekle</option>
              {days.map((d,i)=><option key={d.id} value={i}>{d.date}</option>)}
            </select>
            <button onClick={()=>setLiked(prev=>prev.filter(x=>x.id!==p.id))} style={{padding:"3px 6px",background:"#FFEBEE",color:"#C62828",border:"none",borderRadius:8,fontSize:9,cursor:"pointer"}}>✕</button>
          </div>
        </div>
      </div>})}
    </div>}
  </div>;

  /* ═══ INFO TAB ═══ */
  const infoTabs=[{k:"flights",i:"✈️",l:"Uçuşlar"},{k:"hotels",i:"🏨",l:"Oteller"},{k:"emergency",i:"🆘",l:"Acil"},{k:"lang",i:"🗣️",l:"Dil"},{k:"check",i:"🧳",l:"Checklist"},{k:"tz",i:"🕐",l:"Saat"}];

  const Info=()=><div style={{padding:14}}>
    <h2 style={{margin:"0 0 8px",fontSize:16,fontWeight:900,color:"#1a1a2e"}}>💼 Gezi Bilgileri</h2>
    <div style={{display:"flex",gap:3,overflowX:"auto",marginBottom:10}}>
      {infoTabs.map(t=><button key={t.k} onClick={()=>setInfoSub(t.k)} style={{flexShrink:0,padding:"4px 10px",borderRadius:14,border:infoSub===t.k?"2px solid #1565C0":"1px solid #e0e0e0",background:infoSub===t.k?"#1565C0":"#fff",color:infoSub===t.k?"#fff":"#888",fontSize:10,fontWeight:infoSub===t.k?700:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Outfit',sans-serif"}}>{t.i} {t.l}</button>)}
    </div>

    {/* FLIGHTS */}
    {infoSub==="flights"&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
      {flights.map(f=>{const isEd=editFlight===f.id;return <div key={f.id} style={{...css.card,padding:"10px 12px",cursor:"pointer",border:isEd?"1px solid #1565C0":"1px solid transparent"}} onClick={()=>setEditFlight(isEd?null:f.id)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:9,color:"#999",fontWeight:600}}>{f.date} · {f.time}</div><div style={{fontSize:13,fontWeight:800,color:"#1a1a2e"}}>{f.from} → {f.to}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#1565C0",fontWeight:600}}>{f.air}</div>{f.note&&<div style={{fontSize:9,color:"#FF8F00"}}>{f.note}</div>}</div>
        </div>
        {isEd&&<div style={{marginTop:8,display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}} onClick={e=>e.stopPropagation()}>
          {[{k:"date",l:"Tarih"},{k:"time",l:"Saat"},{k:"from",l:"Nereden"},{k:"to",l:"Nereye"},{k:"air",l:"Havayolu"},{k:"note",l:"Not"}].map(({k,l})=><div key={k} style={{gridColumn:k==="note"?"1/-1":"auto"}}><div style={{fontSize:8,fontWeight:700,color:"#999"}}>{l}</div><input value={f[k]} onChange={e=>setFlights(p=>p.map(x=>x.id===f.id?{...x,[k]:e.target.value}:x))} style={{width:"100%",padding:"4px 6px",borderRadius:4,border:"1px solid #ddd",fontSize:11,boxSizing:"border-box"}}/></div>)}
        </div>}
      </div>})}
    </div>}

    {/* HOTELS */}
    {infoSub==="hotels"&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
      {hotels.map((h,hi)=><div key={hi} style={{...css.card,padding:"10px 12px"}}>
        <div style={{fontSize:12,fontWeight:800,color:"#1a1a2e"}}>{CITY[h.city]?.f} {CITY[h.city]?.n}</div>
        {[{k:"name",l:"🏨 Otel"},{k:"addr",l:"📍 Adres"},{k:"phone",l:"📞 Telefon"},{k:"checkin",l:"⬇️ Check-in"},{k:"checkout",l:"⬆️ Check-out"}].map(({k,l})=><div key={k} style={{marginTop:4}}>
          <div style={{fontSize:8,fontWeight:700,color:"#999"}}>{l}</div>
          <input value={h[k]} onChange={e=>setHotels(p=>p.map((x,i)=>i===hi?{...x,[k]:e.target.value}:x))} style={{width:"100%",padding:"4px 6px",borderRadius:4,border:"1px solid #ddd",fontSize:11,boxSizing:"border-box"}}/>
        </div>)}
        <a href={`https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:6,padding:"4px 10px",background:"#1565C0",color:"#fff",borderRadius:12,fontSize:9,fontWeight:700,textDecoration:"none"}}>📍 Haritada Aç</a>
      </div>)}
    </div>}

    {/* EMERGENCY */}
    {infoSub==="emergency"&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
      {Object.entries(CITY).map(([k,c])=><div key={k} style={{...css.card,padding:"10px 12px"}}>
        <div style={{fontSize:13,fontWeight:800}}>{c.f} {c.n}</div>
        <div style={{marginTop:4,fontSize:11,color:"#C62828",fontWeight:600}}>🚨 {c.emergency}</div>
        <div style={{marginTop:2,fontSize:11,color:"#1565C0"}}>🏛️ {c.consulate}</div>
        <div style={{marginTop:2,fontSize:10,color:"#777"}}>🔌 Priz: {c.plug} · 📱 SIM: {c.sim}</div>
      </div>)}
    </div>}

    {/* LANGUAGE */}
    {infoSub==="lang"&&<div>
      {Object.entries(LANG).map(([k,phrases])=><div key={k} style={{marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:800,marginBottom:6}}>{CITY[k]?.f} {CITY[k]?.n}</div>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          {phrases.map((p,i)=><div key={i} style={{...css.card,padding:"8px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:11,fontWeight:700,color:"#1a1a2e"}}>{p.tr}</div><div style={{fontSize:10,color:"#999"}}>{p.local}</div></div>
            <div style={{background:"#E8EAF6",padding:"3px 8px",borderRadius:10,fontSize:10,fontWeight:600,color:"#3F51B5"}}>🔊 {p.pron}</div>
          </div>)}
        </div>
      </div>)}
    </div>}

    {/* CHECKLIST */}
    {infoSub==="check"&&<div>
      {Object.entries(checks).map(([group,items])=><div key={group} style={{marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:800,marginBottom:6}}>{group==="bavul"?"🧳 Bavul Listesi":"📄 Belgeler & Vize"}</div>
        <div style={{...css.card,padding:"8px 10px"}}>
          {items.map(it=><div key={it.id} onClick={()=>setChecks(p=>({...p,[group]:p[group].map(x=>x.id===it.id?{...x,ok:!x.ok}:x)}))} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f5f5f5",cursor:"pointer"}}>
            <div style={{width:20,height:20,borderRadius:6,border:it.ok?"none":"2px solid #ddd",background:it.ok?"#4CAF50":"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",flexShrink:0}}>{it.ok?"✓":""}</div>
            <span style={{fontSize:11,color:it.ok?"#aaa":"#333",textDecoration:it.ok?"line-through":"none"}}>{it.t}</span>
          </div>)}
        </div>
        <div style={{fontSize:10,color:"#4CAF50",fontWeight:600,marginTop:4}}>✅ {items.filter(x=>x.ok).length}/{items.length} tamamlandı</div>
      </div>)}
    </div>}

    {/* TIMEZONE */}
    {infoSub==="tz"&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
      <div style={{...css.card,padding:"12px 14px",textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#999"}}>🇹🇷 Antalya (UTC+3)</div>
        <div style={{fontSize:28,fontWeight:900,color:"#1a1a2e",fontFamily:"monospace"}}>{new Date().toLocaleTimeString("tr-TR",{timeZone:"Europe/Istanbul",hour:"2-digit",minute:"2-digit"})}</div>
      </div>
      {Object.entries(CITY).map(([k,c])=>{const tz=["Asia/Shanghai","Asia/Hong_Kong","Asia/Bangkok","Asia/Bangkok"][["beijing","hongkong","bangkok","kohsamui"].indexOf(k)]||"Asia/Bangkok";return <div key={k} style={{...css.card,padding:"12px 14px",textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#999"}}>{c.f} {c.n} (UTC+{c.tz})</div>
        <div style={{fontSize:28,fontWeight:900,color:c.c,fontFamily:"monospace"}}>{new Date().toLocaleTimeString("tr-TR",{timeZone:tz,hour:"2-digit",minute:"2-digit"})}</div>
        <div style={{fontSize:10,color:"#999"}}>Antalya'dan {c.tz-3>0?"+":"" }{c.tz-3} saat</div>
      </div>})}
    </div>}
  </div>;

  /* ═══ AI TAB ═══ */
  const AI=()=><div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 64px)"}}>
    <div style={{padding:"14px 14px 6px"}}><h2 style={{margin:"0 0 1px",fontSize:16,fontWeight:900,color:"#1a1a2e"}}>🤖 AI Rehber</h2><p style={{margin:0,fontSize:10,color:"#999"}}>Güncel bilgi çeker, öneri verir</p></div>
    <div ref={aiRef} style={{flex:1,overflowY:"auto",padding:"6px 14px",display:"flex",flexDirection:"column",gap:5}}>
      {aiMsgs.length===0&&<div style={{textAlign:"center",color:"#ccc",marginTop:24}}>
        <div style={{fontSize:32}}>🧭</div><div style={{fontWeight:600,fontSize:11,marginTop:4}}>Merhaba Aslan!</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginTop:8}}>
          {["Yakında ne yiyeyim?","1 saat fazla vaktim var","Gizli mekanlar?","Hava durumu?","Ne giymeliyim?","Bu bölgede yeni mekanlar?"].map(q=><button key={q} onClick={()=>setAiIn(q)} style={{padding:"4px 8px",background:"#F3F4F6",border:"1px solid #e0e0e0",borderRadius:12,fontSize:9,cursor:"pointer",color:"#666"}}>{q}</button>)}
        </div>
      </div>}
      {aiMsgs.map((m,i)=><div key={i} style={{alignSelf:m.r==="user"?"flex-end":"flex-start",maxWidth:"85%",padding:"6px 10px",borderRadius:m.r==="user"?"12px 12px 3px 12px":"12px 12px 12px 3px",background:m.r==="user"?"#1565C0":"#F3F4F6",color:m.r==="user"?"#fff":"#333",fontSize:11,lineHeight:1.45,whiteSpace:"pre-wrap"}}>{m.t}</div>)}
      {aiLoad&&<div style={{alignSelf:"flex-start",padding:"6px 10px",borderRadius:12,background:"#F3F4F6",color:"#999",fontSize:11}}>⏳ Düşünüyorum...</div>}
    </div>
    <div style={{display:"flex",gap:4,padding:"8px 12px",borderTop:"1px solid #eee",background:"#fff"}}>
      <input value={aiIn} onChange={e=>setAiIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAi()} placeholder="Soru sor..." style={{flex:1,padding:"8px 10px",borderRadius:16,border:"1px solid #ddd",fontSize:11,outline:"none"}}/>
      <button onClick={sendAi} disabled={aiLoad||!aiIn.trim()} style={{padding:"8px 12px",borderRadius:16,border:"none",background:"#1565C0",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",opacity:(aiLoad||!aiIn.trim())?0.5:1}}>→</button>
    </div>
  </div>;

  /* ═══ RENDER ═══ */
  const tabs=[{k:"plan",i:"📋",l:"Program"},{k:"discover",i:"🧭",l:"Keşfet"},{k:"liked",i:"❤️",l:`Beğeni${liked.length?` ${liked.length}`:""}`},{k:"info",i:"💼",l:"Bilgi"},{k:"ai",i:"🤖",l:"AI"}];

  return <div style={css.app}>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    {toast&&<div style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",background:D?"#fff":"#1a1a2e",color:D?"#1a1a2e":"#fff",padding:"6px 16px",borderRadius:18,fontSize:11,fontWeight:600,zIndex:999,boxShadow:"0 4px 16px rgba(0,0,0,.2)",animation:"fi .3s"}}>{toast}</div>}

    {tab==="plan"&&<Plan/>}
    {tab==="discover"&&<Discover/>}
    {tab==="liked"&&<Liked/>}
    {tab==="info"&&<Info/>}
    {tab==="ai"&&<AI/>}

    <div style={css.nav}>{tabs.map(t=><button key={t.k} onClick={()=>setTab(t.k)} style={css.nb(tab===t.k)}><span style={{fontSize:16}}>{t.i}</span><span>{t.l}</span></button>)}</div>
    <style>{`@keyframes fi{from{opacity:0;transform:translateX(-50%) translateY(-6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}*{-webkit-tap-highlight-color:transparent}input,select,button{font-family:'Outfit',sans-serif}`}</style>
  </div>;
}
