// ==========================================
// TRUMED ORDER MANAGEMENT - APP.JS
// ==========================================

import { db } from "./auth.js";
import { collection, getDocs, addDoc, setDoc, doc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let TARGET_ANNUALE = 1000000; 

// Dati completi del catalogo (57 prodotti - colonna USA rimossa)
const prodottiData = [
  { id: "amlix-1", categoria: "CARDIOVASCULAR PRODUCTS", nome: "AMLIX", descrizione: "5mg Amlodipine Besilate 5mg Tablet", pack: "100's", prezzo: 825.0, maxDeal: "-", arp: "825.00" },
  { id: "amlix-2", categoria: "CARDIOVASCULAR PRODUCTS", nome: "AMLIX", descrizione: "10mg Amlodipine Besilate 10mg Tablet", pack: "100's", prezzo: 1120.0, maxDeal: "-", arp: "1,120.00" },
  { id: "hextan-3", categoria: "CARDIOVASCULAR PRODUCTS", nome: "HEXTAN", descrizione: "Losartan Potassium 50mg Film-Coated Tablet", pack: "100's", prezzo: 1454.0, maxDeal: "-", arp: "1,454.00" },
  { id: "hextan-4", categoria: "CARDIOVASCULAR PRODUCTS", nome: "HEXTAN", descrizione: "PLUS Losartan Potassium 50mg + HCTZ 12.5mg FCT", pack: "100's", prezzo: 1980.0, maxDeal: "5+5/ 10+15/", arp: "1,980.00" },
  { id: "olmepas-5", categoria: "CARDIOVASCULAR PRODUCTS", nome: "OLMEPAS", descrizione: "Olmesartan Medoxomil 20mg FCT", pack: "30's", prezzo: 1208.0, maxDeal: "15+25", arp: "1,208.00" },
  { id: "plavihex-6", categoria: "CARDIOVASCULAR PRODUCTS", nome: "PLAVIHEX", descrizione: "Clopidogrel 75mg Tablet", pack: "100's", prezzo: 3176.0, maxDeal: "8+1", arp: "3,176.00" },
  { id: "colixtan-7", categoria: "CARDIOVASCULAR PRODUCTS", nome: "COLIXTAN", descrizione: "Losartan Potassium + Amlodipine Besilate 50mg/5mg FCT", pack: "100's", prezzo: 1725.0, maxDeal: "-", arp: "1,725.00" },
  { id: "ardilol-8", categoria: "CARDIOVASCULAR PRODUCTS", nome: "ARDILOL", descrizione: "Carvedilol mg Tablet", pack: "30's", prezzo: 6.25, maxDeal: "-", arp: "345.00" },
  { id: "truvast-9", categoria: "CARDIOVASCULAR PRODUCTS", nome: "TRUVAST", descrizione: "Atorvastatin Calcium 20mg Film-Coated Tablet", pack: "100's", prezzo: 2915.0, maxDeal: "-", arp: "2,915.00" },
  { id: "stravas-10", categoria: "CARDIOVASCULAR PRODUCTS", nome: "STRAVAS", descrizione: "Rosuvastatin Calcium 10mg Film-Coated Tablet 5+5/ 10+15", pack: "30's", prezzo: 863.0, maxDeal: "-", arp: "863.00" },
  { id: "finora-11", categoria: "CARDIOVASCULAR PRODUCTS", nome: "FINORA", descrizione: "Fenofibrate 200mg Capsule", pack: "100's", prezzo: 2800.0, maxDeal: "5+5/ 10+15 / 15+25", arp: "3,136.00" },
  { id: "amtaz-12", categoria: "CARDIOVASCULAR PRODUCTS", nome: "AMTAZ", descrizione: "Trimetazidine HCl 35mg Modified-Release Tablet", pack: "30's", prezzo: 587.0, maxDeal: "-", arp: "657.44" },
  { id: "ciflomed-13", categoria: "ANTIBACTERIAL PRODUCTS", nome: "CIFLOMED", descrizione: "Ciprofloxacin 500mg Film-Coated Tablet 5+5/ 10+20", pack: "100's", prezzo: 3300.0, maxDeal: "8+1", arp: "3,696.00" },
  { id: "dalamed-14", categoria: "ANTIBACTERIAL PRODUCTS", nome: "DALAMED", descrizione: "Clindamycin 300mg Capsule 5+5/ 10+15 / 15+25", pack: "100's", prezzo: 5440.0, maxDeal: "-", arp: "6,092.80" },
  { id: "klarimed-15", categoria: "ANTIBACTERIAL PRODUCTS", nome: "KLARIMED", descrizione: "Clarithromycin 500mg Film-Coated Tablet 5+5/ 10+15 No FG", pack: "30's", prezzo: 1668.0, maxDeal: "-", arp: "1,868.16" },
  { id: "limoclav-16", categoria: "ANTIBACTERIAL PRODUCTS", nome: "LIMOCLAV", descrizione: "Co-amoxiclav 625mg FCT 8+1", pack: "21's", prezzo: 1087.0, maxDeal: "-", arp: "1,217.44" },
  { id: "limoxil-17", categoria: "ANTIBACTERIAL PRODUCTS", nome: "LIMOXIL", descrizione: "Amoxicillin Tridhydrate 500mg Capsule 5+5/ 10+15 / 15+25 N/A", pack: "100's", prezzo: 1150.0, maxDeal: "-", arp: "1,288.00" },
  { id: "trufix-18", categoria: "ANTIBACTERIAL PRODUCTS", nome: "TRUFIX", descrizione: "Cefixime Trihydrate 200mg Capsule", pack: "10's", prezzo: 1265.0, maxDeal: "8+1", arp: "1,416.80" },
  { id: "trulev-19", categoria: "ANTIBACTERIAL PRODUCTS", nome: "TRULEV", descrizione: "Levofloxacin 500mg Film-Coated Tablet 5+5/ 10+20", pack: "30's", prezzo: 1733.0, maxDeal: "-", arp: "1,940.96" },
  { id: "truxim-20", categoria: "ANTIBACTERIAL PRODUCTS", nome: "TRUXIM", descrizione: "Cefuroxime Axetil 500mg Film-Coated Tablet 5+2/ 10+5 No FG", pack: "10's", prezzo: 690.0, maxDeal: "-", arp: "772.80" },
  { id: "rozenta-21", categoria: "ANTIBACTERIAL PRODUCTS", nome: "ROZENTA", descrizione: "Susp Azithromycin 200mg/5ml Powder for Oral suspension No FG", pack: "1's", prezzo: 403.0, maxDeal: "-", arp: "451.36" },
  { id: "rozenta-22", categoria: "ANTIBACTERIAL PRODUCTS", nome: "ROZENTA", descrizione: "Tab Azithromycin 500mg Film-coated Tablet 5+5 / 10+15 / 15+25", pack: "30's", prezzo: 2640.0, maxDeal: "-", arp: "2,956.80" },
  { id: "amrid-23", categoria: "ANTIBACTERIAL PRODUCTS", nome: "AMRID", descrizione: "Metronidazole 500mg Tablet 8+1", pack: "100's", prezzo: 1150.0, maxDeal: "-", arp: "1,288.00" },
  { id: "procin-24", categoria: "ANTIBACTERIAL PRODUCTS", nome: "PROCIN", descrizione: "Mupirocin 20mg/g (2% w/w) Ointment, 5G/tube 5+2/ 10+5", pack: "1's", prezzo: 173.0, maxDeal: "-", arp: "193.76" },
  { id: "solbina-25", categoria: "TOPICAL CORTICOSTEROIDS", nome: "SOLBINA", descrizione: "Clobetasol priopionate 500 mcg / g Topical Cream, 10G/tube 5+2/ 10+15 / 15+25 8+1", pack: "1's", prezzo: 345.0, maxDeal: "8+1", arp: "386.40" },
  { id: "glimep-26", categoria: "METABOLIC PRODUCT", nome: "GLIMEP", descrizione: "Glimepiride 2mg Tablet 5+5/ 10+15 / 15+25 8+1", pack: "100's", prezzo: 1127.0, maxDeal: "-", arp: "1,127.00" },
  { id: "sazol-27", categoria: "PROTON PUMP INHIBITORS", nome: "SAZOL", descrizione: "Esomeprazole 40mg Delayed ReleaseTablet 5+5/ 10+15 / 15+25", pack: "30'S", prezzo: 1800.0, maxDeal: "-", arp: "2,016.00" },
  { id: "nexopraz-28", categoria: "PROTON PUMP INHIBITORS", nome: "NEXOPRAZ", descrizione: "40 Esomeprazole 40mg Enteric Coated Tablet 5+5 8+1", pack: "100's", prezzo: 6050.0, maxDeal: "-", arp: "6,776.00" },
  { id: "trumeprazole-29", categoria: "PROTON PUMP INHIBITORS", nome: "TRUMEPRAZOLE", descrizione: "Omeprazole 20mg Delayed Release Capsule 5+5/ 10+15 / 15+25", pack: "100's", prezzo: 3630.0, maxDeal: "-", arp: "4,065.60" },
  { id: "levorin-30", categoria: "ANTI-HISTAMINE", nome: "LEVORIN", descrizione: "Levocetirizine Dihydrochloride 5mg FCT", pack: "30's", prezzo: 1100.0, maxDeal: "-", arp: "1,232.00" },
  { id: "sinuzerc-31", categoria: "ANTI-HISTAMINE", nome: "SINUZERC", descrizione: "Loratadine 10mg Tablet 5+5/ 10+15 / 15+25 8+1", pack: "100's", prezzo: 1500.0, maxDeal: "-", arp: "1,680.00" },
  { id: "xytozen-32", categoria: "ANTI-HISTAMINE", nome: "XYTOZEN", descrizione: "Montelukast 10mg + Levocetirizine Hydrochloride 5mg Film-coated Tablet", pack: "30's", prezzo: 1035.0, maxDeal: "-", arp: "1,159.20" },
  { id: "verahit-33", categoria: "ANTI-VERTIGO", nome: "VERAHIT", descrizione: "Betahistine Hydrochloride 16mg tablet 5+5/ 10+15/ 15+25 8+1", pack: "100's", prezzo: 2300.0, maxDeal: "-", arp: "2,576.00" },
  { id: "monlastik-34", categoria: "LEUKOTRIENE RECEPTOR ANTAGONIST", nome: "MONLASTIK", descrizione: "Montelukast 10mg Film-coated Tablet 5+5/ 10+15/ 15+25 8+1", pack: "100's", prezzo: 3300.0, maxDeal: "-", arp: "3,696.00" },
  { id: "trucox-35", categoria: "NSAID", nome: "TRUCOX", descrizione: "Celecoxib 200mg Capsule 5+5/10+15", pack: "30's", prezzo: 1012.0, maxDeal: "8+1", arp: "1,133.44" },
  { id: "memaray-36", categoria: "NSAID", nome: "MEMARAY", descrizione: "Mefenamic Acid 500mg Capsule 5+5/ 10+15 / 15+25", pack: "100's", prezzo: 1265.0, maxDeal: "-", arp: "1,416.80" },
  { id: "lotram-37", categoria: "ANALGESIC", nome: "LOTRAM", descrizione: "PLUS Tramadol 37.5mg + Paracetamol 325 mg FCT", pack: "100's", prezzo: 3000.0, maxDeal: "5+5/ 10+15/ 15+25            8+1", arp: "3,360.00" },
  { id: "lotram-38", categoria: "ANALGESIC", nome: "LOTRAM", descrizione: "Tramadol Hydrochloride 50mg FCT", pack: "100's", prezzo: 1150.0, maxDeal: "-", arp: "1,288.00" },
  { id: "colimax-39", categoria: "CHOLELITHOLYTIC & HEPATIC PROTECTOR (BILE SALT)", nome: "COLIMAX", descrizione: "Ursodeoxycholic Acid 300mg FCT 5+5/ 10+15/ 15+20 8+1", pack: "100's", prezzo: 4500.0, maxDeal: "-", arp: "5,040.00" },
  { id: "acugout-40", categoria: "ANTI-GOUT", nome: "ACUGOUT", descrizione: "Colchicine 500mcg Tablet 5+2 / 10+5", pack: "100's", prezzo: 518.0, maxDeal: "8+1", arp: "580.16" },
  { id: "xozid-41", categoria: "ANTI-GOUT", nome: "XOZID", descrizione: "Febuxostat 40mg FCT 5+5/ 10+15/ 15+25", pack: "30's", prezzo: 794.0, maxDeal: "-", arp: "889.28" },
  { id: "convuliz-42", categoria: "ANTI-EPILEPTIC / DIABETIC NEUROPATHY", nome: "CONVULIZ", descrizione: "Pregabalin 75mg Capsule 5+5/ 10+15/ 15+25 8+1", pack: "28's", prezzo: 1030.0, maxDeal: "8+1", arp: "1,030.40" },
  { id: "folmaterna-43", categoria: "ANTI-ANEMIA PRESCRIPTION DRUG", nome: "FOLMATERNA", descrizione: "Folic Acid 5mg Capsule 5+1 /10+3 /25+25 8+1", pack: "100's", prezzo: 920.0, maxDeal: "-", arp: "1,030.40" },
  { id: "prostulax-44", categoria: "ALPHA-1 ADRENORECEPTOR ANTAGONIST", nome: "PROSTULAX", descrizione: "Tamsulosin Hydrocholoride 400mcg Proloned Release Tablet 5+5 / 10+15 / 15+25 8+1", pack: "30's", prezzo: 1380.0, maxDeal: "-", arp: "1,545.60" },
  { id: "iromax-45", categoria: "NUTRITIONALS", nome: "IROMAX", descrizione: "PLUS Ferrous Ascorbate, L-Methyl Folate, Vitamins & Minerals FCT 5+1 /10+3 / 25+15", pack: "30'S", prezzo: 600.0, maxDeal: "-", arp: "672.00" },
  { id: "gutzorb-46", categoria: "NUTRITIONALS", nome: "GUTZORB", descrizione: "Probiotics + Gastric Enzymes Capsule", pack: "100's", prezzo: 4500.0, maxDeal: "-", arp: "5,040.00" },
  { id: "livoplex-47", categoria: "NUTRITIONALS", nome: "LIVOPLEX", descrizione: "Silymarin 150mg + Vit B1, B6, B12 Capsule", pack: "30'S", prezzo: 518.0, maxDeal: "10+1", arp: "580.16" },
  { id: "senphos-48", categoria: "NUTRITIONALS", nome: "SENPHOS", descrizione: "Essential Phospholipids 300mg + Vit. B & E capsule 5+1 /10+3 / 25+25", pack: "50's", prezzo: 1495.0, maxDeal: "-", arp: "1,674.40" },
  { id: "menacal-49", categoria: "NUTRITIONALS", nome: "MENACAL", descrizione: "Calcium Citrate + Vit K2-7 with Mg, Zn, and Vit D3 1.5G FCT", pack: "90'S", prezzo: 1035.0, maxDeal: "-", arp: "1,159.20" },
  { id: "morfera-50", categoria: "NUTRITIONALS", nome: "MORFERA", descrizione: "Moringa Oleifera 500mg Capsule", pack: "100's", prezzo: 719.0, maxDeal: "-", arp: "805.28" },
  { id: "momma-51", categoria: "NUTRITIONALS", nome: "MOMMA", descrizione: "VIT Pre & Post Natal Vitamins with Folic Acid, Taurine, DHA & EPA Softgel No FG", pack: "30'S", prezzo: 760.0, maxDeal: "5+1 /10+3 / 25+15", arp: "851.20" },
  { id: "powergold-52", categoria: "NUTRITIONALS", nome: "POWERGOLD", descrizione: "Multivitamins & Minerals with Ginseng, Deanol & Rutin Softgel", pack: "30's", prezzo: 700.0, maxDeal: "-", arp: "784.00" },
  { id: "sleepeasy-53", categoria: "NUTRITIONALS", nome: "SLEEPEASY", descrizione: "Melatonin 3mg Softgel", pack: "30's", prezzo: 690.0, maxDeal: "-", arp: "772.80" },
  { id: "sleepeasy-54", categoria: "NUTRITIONALS", nome: "SLEEPEASY", descrizione: "PLUS Lactium Casein Hydrolysate 75mg L-theanine 125mg Melatonin 3mg Tablet", pack: "30's", prezzo: 900.0, maxDeal: "5+1 /10+3 / 25+25", arp: "1,008.00" },
  { id: "truceevit-55", categoria: "NUTRITIONALS", nome: "TRUCEEVIT", descrizione: "Ascorbic Acid (as Sodium Ascorbate) 500mg Capsule 10+1", pack: "100's", prezzo: 690.0, maxDeal: "-", arp: "772.80" },
  { id: "lubrijoint-56", categoria: "NUTRITIONALS", nome: "LUBRIJOINT", descrizione: "OD Glucosamine 1500 mg Film-coated Tablet Palmitic Acid Monoethanolamide", pack: "30's", prezzo: 1500.0, maxDeal: "-", arp: "1,680.00" },
  { id: "peatide-57", categoria: "NUTRITIONALS", nome: "PEATIDE", descrizione: "Palmitic Acid Monoethanolamide 150mg, Cytidine 15mg, Uridine 9mg", pack: "30's", prezzo: 1200.0, maxDeal: "-", arp: "1,344.00" }
];

let catalogData = [];

document.addEventListener("DOMContentLoaded", async () => {
    const dataOggi = new Date().toISOString().split('T')[0];
    const inputData = document.getElementById('ordineData');
    if (inputData) inputData.value = dataOggi;

    // Esegue tutte le chiamate a Firebase in parallelo invece che una alla volta
    await Promise.all([
        caricaTargetDalBackend(),
        caricaCatalogoDaFirestore(),
        caricaOrdiniSalvati()
    ]);
    
    setupStickyWidgetObserver();
});

async function caricaTargetDalBackend() {
    try {
        const docRef = doc(db, "configurazioni", "impostazioni_globali");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().targetAnnuale) {
            TARGET_ANNUALE = Number(docSnap.data().targetAnnuale);
        } else {
            await setDoc(docRef, { targetAnnuale: 1000000 }, { merge: true });
            TARGET_ANNUALE = 1000000;
        }

        const inputTarget = document.getElementById('inputTargetAnnuale');
        if (inputTarget) inputTarget.value = TARGET_ANNUALE;

    } catch (error) {
        console.error("Errore caricamento target dal backend, uso default:", error);
    }
}

window.aggiornaTargetAnnuale = async function(valore) {
    const nuovoTarget = parseFloat(valore);
    if (!isNaN(nuovoTarget) && nuovoTarget > 0) {
        TARGET_ANNUALE = nuovoTarget;
        try {
            await setDoc(doc(db, "configurazioni", "impostazioni_globali"), {
                targetAnnuale: TARGET_ANNUALE
            }, { merge: true });
            ricalcolaTotale();
        } catch (error) {
            console.error("Errore salvataggio target su cloud:", error);
        }
    } else {
        const inputTarget = document.getElementById('inputTargetAnnuale');
        if (inputTarget) inputTarget.value = TARGET_ANNUALE;
    }
};

window.cambiaTargetStep = function(delta) {
    const inputEl = document.getElementById('inputTargetAnnuale');
    if (!inputEl) return;

    let valoreAttuale = parseFloat(inputEl.value) || TARGET_ANNUALE;
    let nuovoValore = valoreAttuale + delta;
    if (nuovoValore < 0) nuovoValore = 0;

    inputEl.value = nuovoValore;
    window.aggiornaTargetAnnuale(nuovoValore);
};

function popolaSelectCategorie() {
    const selectEl = document.getElementById('nuovaCategoria');
    if (!selectEl) return;

    const categorieUniche = [...new Set(catalogData.map(item => item.categoria))].sort();

    selectEl.innerHTML = '';
    categorieUniche.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        selectEl.appendChild(option);
    });
}

// Sincronizzazione ad altissima velocità: legge il catalogo senza sovrascrivere 57 volte a ogni avvio
async function caricaCatalogoDaFirestore() {
    try {
        console.log("Caricamento rapido del catalogo da Firestore...");
        
        const querySnapshot = await getDocs(collection(db, "catalogo"));
        
        if (querySnapshot.empty) {
            console.log("Database vuoto: popolamento iniziale...");
            for (const item of prodottiData) {
                await setDoc(doc(db, "catalogo", item.id), item);
            }
            const snapshotIniziale = await getDocs(collection(db, "catalogo"));
            catalogData = [];
            snapshotIniziale.forEach((docSnap) => {
                catalogData.push({ id: docSnap.id, ...docSnap.data() });
            });
        } else {
            catalogData = [];
            querySnapshot.forEach((docSnap) => {
                catalogData.push({ id: docSnap.id, ...docSnap.data() });
            });
        }

        console.log(`Catalogo pronto! Totale prodotti attivi: ${catalogData.length}`);
        renderizzaCatalogo();
        popolaSelectCategorie();
        ricalcolaTotale();
    } catch (error) {
        console.error("Errore durante il caricamento del catalogo:", error);
        catalogData = [...prodottiData];
        renderizzaCatalogo();
        popolaSelectCategorie();
        ricalcolaTotale();
    }
}

// Rendering Lazy Ultra-veloce
window.renderizzaCatalogo = function() {
    const container = document.getElementById('categorieContainer');
    if (!container) return;
    container.innerHTML = '';

    const categorieMap = {};
    catalogData.forEach(item => {
        if (!categorieMap[item.categoria]) {
            categorieMap[item.categoria] = [];
        }
        categorieMap[item.categoria].push(item);
    });

    const categorieOrdinate = Object.keys(categorieMap).sort();

    categorieOrdinate.forEach(catNome => {
        const prodotti = categorieMap[catNome];
        const categoriaDiv = document.createElement('div');
        categoriaDiv.className = 'border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-2xs mb-3';
        categoriaDiv.dataset.categoria = catNome;
        
        categoriaDiv.innerHTML = `
            <div class="bg-slate-100 px-4 py-2.5 font-semibold text-xs text-slate-700 uppercase tracking-wider border-b border-slate-200 flex justify-between items-center cursor-pointer select-none" onclick="toggleCategoriaOptimized(this, '${catNome.replace(/'/g, "\\'")}')">
                <span>📂 ${catNome} (${prodotti.length})</span>
                <span class="text-[10px] text-slate-500">▶</span>
            </div>
            <div class="overflow-x-auto cat-content" style="display: none;"></div>
        `;
        container.appendChild(categoriaDiv);
    });
}

// Generazione dinamica della tabella solo all'espansione
window.toggleCategoriaOptimized = function(headerEl, catNome) {
    const contentDiv = headerEl.nextElementSibling;
    const icona = headerEl.querySelector('span:last-child');
    
    if (contentDiv.style.display === 'none') {
        if (!contentDiv.innerHTML.trim()) {
            const prodotti = catalogData.filter(p => p.categoria === catNome);
            let prodottiHtml = '';
            
            prodotti.forEach(p => {
                const quantitaCorrente = p.quantita || 0;
                prodottiHtml += `
                    <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs">
                        <td class="px-3 py-2.5 font-medium text-slate-900">
                            <div class="flex items-center justify-between">
                                <div>
                                    ${p.nome}
                                    <div class="text-[10px] text-slate-400 font-normal">${p.descrizione || ''}</div>
                                </div>
                                <div id="delete-container-${p.id}" class="ml-2">
                                    <button type="button" onclick="avviaEliminazioneProdotto('${p.id}')" title="Delete product" class="text-slate-300 hover:text-rose-600 font-bold px-1.5 py-0.5 rounded transition-colors">✕</button>
                                </div>
                            </div>
                        </td>
                        <td class="px-2 py-2.5 text-slate-600 text-center">${p.pack}</td>
                        <td class="px-2 py-2.5 text-slate-700 font-semibold text-right">₱${Number(p.prezzo).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td class="px-2 py-2.5 text-slate-500 text-center font-mono text-[11px]">${p.maxDeal || '-'}</td>
                        <td class="px-2 py-2.5 text-slate-700 text-center font-medium">₱${p.arp || '-'}</td>
                        <td class="px-2 py-2.5 text-center">
                            <div class="flex items-center justify-center gap-1">
                                <button type="button" onclick="cambiaQuantita('${p.id}', -1)" class="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center justify-center transition-colors text-sm select-none">-</button>
                                <input type="number" id="qty_${p.id}" min="0" value="${quantitaCorrente}" onchange="aggiornaQuantitaDaInput('${p.id}', this.value)" 
                                    class="w-12 text-center border border-slate-200 rounded-lg py-1 px-1 focus:outline-none focus:border-slate-500 font-medium text-xs">
                                <button type="button" onclick="cambiaQuantita('${p.id}', 1)" class="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center justify-center transition-colors text-sm select-none">+</button>
                            </div>
                        </td>
                        <td id="subtotal-${p.id}" class="px-3 py-2.5 text-right font-semibold text-slate-900">
                            ₱${(quantitaCorrente * p.prezzo).toLocaleString('en-US', {minimumFractionDigits: 2})}
                        </td>
                    </tr>
                `;
            });

            contentDiv.innerHTML = `
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-slate-200 bg-slate-50/50 text-[11px] text-slate-400 uppercase tracking-wider">
                            <th class="px-3 py-2">Brand / Description</th>
                            <th class="px-2 py-2 text-center">Pack</th>
                            <th class="px-2 py-2 text-right">Price Net VAT</th>
                            <th class="px-2 py-2 text-center">Max Deal Reg.</th>
                            <th class="px-2 py-2 text-center">ARP w/ Deals</th>
                            <th class="px-2 py-2 text-center">Qty</th>
                            <th class="px-3 py-2 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${prodottiHtml}
                    </tbody>
                </table>
            `;
        }
        contentDiv.style.display = 'block';
        icona.textContent = '▼';
    } else {
        contentDiv.style.display = 'none';
        icona.textContent = '▶';
    }
}

window.espandiTutto = function(apri) {
    const headers = document.querySelectorAll('#categorieContainer > div > div:first-child');
    headers.forEach(h => {
        const catNome = h.parentElement.dataset.categoria;
        const contentDiv = h.nextElementSibling;
        const icona = h.querySelector('span:last-child');
        
        if (apri) {
            if (!contentDiv.innerHTML.trim()) {
                window.toggleCategoriaOptimized(h, catNome);
            } else {
                contentDiv.style.display = 'block';
                icona.textContent = '▼';
            }
        } else {
            contentDiv.style.display = 'none';
            icona.textContent = '▶';
        }
    });
}

window.cambiaQuantita = function(id, delta) {
    const inputEl = document.getElementById(`qty_${id}`);
    if (!inputEl) return;

    let valoreAttuale = parseInt(inputEl.value) || 0;
    let nuovoValore = valoreAttuale + delta;
    if (nuovoValore < 0) nuovoValore = 0;

    inputEl.value = nuovoValore;
    impostaQuantitaProdotto(id, nuovoValore);
}

window.aggiornaQuantitaDaInput = function(id, valore) {
    let nuovoValore = parseInt(valore) || 0;
    if (nuovoValore < 0) nuovoValore = 0;
    
    const inputEl = document.getElementById(`qty_${id}`);
    if (inputEl) inputEl.value = nuovoValore;

    impostaQuantitaProdotto(id, nuovoValore);
}

function impostaQuantitaProdotto(id, valore) {
    const prod = catalogData.find(p => p.id === id);
    if (prod) {
        prod.quantita = valore;
        const subtotalEl = document.getElementById(`subtotal-${id}`);
        if (subtotalEl) {
            subtotalEl.textContent = `₱${(prod.quantita * prod.prezzo).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        }
        ricalcolaTotale();
    }
}

function ricalcolaTotale() {
    let totale = 0;
    let countItems = 0;
    let previewHtml = '';

    catalogData.forEach(p => {
        const q = p.quantita || 0;
        if (q > 0) {
            const sub = q * p.prezzo;
            totale += sub;
            countItems += q;
            previewHtml += `<div class="flex justify-between items-center text-xs py-1 border-b border-slate-100">
                <span class="font-medium text-slate-800">${p.nome} (x${q})</span>
                <span class="text-slate-600 font-semibold">₱${sub.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
            </div>`;
        }
    });

    const labelTotale = document.getElementById('labelTotale');
    const labelResiduo = document.getElementById('labelResiduo');
    const labelPercentuale = document.getElementById('labelPercentuale');
    const progressBar = document.getElementById('progressBar');
    const countSelezionati = document.getElementById('countSelezionati');
    const quickPreview = document.getElementById('quickSelectedPreview');

    const stickyTotale = document.getElementById('stickyTotale');
    const stickyResiduo = document.getElementById('stickyResiduo');
    const stickyProgressBar = document.getElementById('stickyProgressBar');
    const stickyPercentBadge = document.getElementById('stickyPercentBadge');

    if (labelTotale) labelTotale.textContent = `₱${totale.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (stickyTotale) stickyTotale.textContent = `₱${totale.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

    const eccedenza = totale - TARGET_ANNUALE;
    const isOverTarget = eccedenza > 0;
    const percentuale = (totale / TARGET_ANNUALE) * 100;

    if (isOverTarget) {
        const overText = `Over by ₱${eccedenza.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        
        if (labelResiduo) labelResiduo.innerHTML = `<span class="text-rose-600 font-bold">${overText}</span>`;
        if (stickyResiduo) stickyResiduo.innerHTML = `<span class="text-rose-600 font-bold">${overText}</span>`;

        if (labelPercentuale) {
            labelPercentuale.innerHTML = `<span class="text-rose-600 font-bold">${percentuale.toFixed(1)}% of target used (EXCEEDED)</span>`;
        }

        if (progressBar) {
            progressBar.style.width = '100%';
            progressBar.className = 'bg-rose-500 h-3 w-0 transition-all duration-300';
        }
        if (stickyProgressBar) {
            stickyProgressBar.style.width = '100%';
            stickyProgressBar.className = 'bg-rose-500 h-2 w-0 transition-all duration-300';
        }

        if (stickyPercentBadge) {
            stickyPercentBadge.textContent = `${percentuale.toFixed(1)}% (OVER)`;
            stickyPercentBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700';
        }

    } else {
        const residuo = TARGET_ANNUALE - totale;
        const residuoText = `₱${residuo.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        
        if (labelResiduo) labelResiduo.textContent = residuoText;
        if (stickyResiduo) stickyResiduo.textContent = residuoText;

        if (labelPercentuale) labelPercentuale.textContent = `${percentuale.toFixed(1)}% of target used`;

        const progressPercent = Math.min(100, percentuale);
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
            progressBar.className = 'bg-slate-900 h-3 w-0 transition-all duration-300';
        }
        if (stickyProgressBar) {
            stickyProgressBar.style.width = `${progressPercent}%`;
            stickyProgressBar.className = 'bg-slate-900 h-2 w-0 transition-all duration-300';
        }

        if (stickyPercentBadge) {
            stickyPercentBadge.textContent = `${percentuale.toFixed(1)}%`;
            stickyPercentBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700';
        }
    }

    if (countSelezionati) countSelezionati.textContent = `${countItems} items`;
    if (quickPreview) {
        quickPreview.innerHTML = previewHtml || '<p class="text-slate-400 italic">No products selected yet.</p>';
    }
}

function setupStickyWidgetObserver() {
    const mainBanner = document.getElementById('targetBannerContainer');
    const stickyWidget = document.getElementById('stickyTargetWidget');

    if (mainBanner && stickyWidget) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyWidget.classList.remove('hidden');
                } else {
                    stickyWidget.classList.add('hidden');
                }
            });
        }, { threshold: 0.1 });

        observer.observe(mainBanner);
    }
}

window.azzeraQuantita = function() {
    catalogData.forEach(p => p.quantita = 0);
    renderizzaCatalogo();
    ricalcolaTotale();
}

window.apriModalNuovoProdotto = function() {
    popolaSelectCategorie();
    document.getElementById('modalProdotto').classList.remove('hidden');
}

window.chiudiModalNuovoProdotto = function() {
    document.getElementById('modalProdotto').classList.add('hidden');
}

window.salvaNuovoProdotto = async function() {
    const categoria = document.getElementById('nuovaCategoria').value;
    const nome = document.getElementById('nuovoNome').value.trim(); // Brand Name
    const descrizione = document.getElementById('nuovaDescrizione') ? document.getElementById('nuovaDescrizione').value.trim() : nome;
    const pack = document.getElementById('nuovoPack').value.trim();
    const prezzo = parseFloat(document.getElementById('nuovoPrezzo').value);
    const maxDeal = document.getElementById('nuovoMaxDeal') ? document.getElementById('nuovoMaxDeal').value.trim() : "-";
    const arp = document.getElementById('nuovoArp') ? document.getElementById('nuovoArp').value.trim() : prezzo.toFixed(2);

    if (!nome || isNaN(prezzo)) {
        alert("Inserisci un nome brand valido e un prezzo corretto.");
        return;
    }

    const nuovoId = 'prod-' + Date.now();
    const nuovoItem = { 
        id: nuovoId, 
        categoria, 
        nome, 
        descrizione: descrizione || nome, 
        pack: pack || "100's", 
        prezzo, 
        maxDeal: maxDeal || "-", 
        arp: arp || prezzo.toFixed(2), 
        quantita: 0 
    };

    try {
        await setDoc(doc(db, "catalogo", nuovoId), nuovoItem);
        catalogData.push(nuovoItem);
        renderizzaCatalogo();
        popolaSelectCategorie();
        chiudiModalNuovoProdotto();
        
        // Pulisci i campi della modale
        document.getElementById('nuovoNome').value = '';
        if (document.getElementById('nuovaDescrizione')) document.getElementById('nuovaDescrizione').value = '';
        document.getElementById('nuovoPrezzo').value = '';
        if (document.getElementById('nuovoMaxDeal')) document.getElementById('nuovoMaxDeal').value = '';
        if (document.getElementById('nuovoArp')) document.getElementById('nuovoArp').value = '';
    } catch (error) {
        console.error("Errore salvataggio nuovo prodotto su Firestore:", error);
    }
}

window.salvaOrdineCorrente = async function() {
    const cliente = document.getElementById('clienteNome').value.trim();
    if (!cliente) {
        alert("Inserisci il nome del cliente / medico prima di salvare l'ordine.");
        return;
    }

    const prodottiSelezionati = catalogData.filter(p => (p.quantita || 0) > 0);
    if (prodottiSelezionati.length === 0) {
        alert("Seleziona almeno un prodotto prima di salvare l'ordine.");
        return;
    }

    let totaleOrdine = prodottiSelezionati.reduce((acc, p) => acc + (p.quantita * p.prezzo), 0);

    const ordineData = {
        cliente,
        note: document.getElementById('ordineNote').value,
        noteExtra: document.getElementById('ordineNoteExtra').value,
        data: document.getElementById('ordineData').value,
        totale: totaleOrdine,
        prodotti: prodottiSelezionati.map(p => ({ id: p.id, nome: p.nome, quantita: p.quantita, prezzo: p.prezzo, subtotal: p.quantita * p.prezzo }))
    };

    try {
        await addDoc(collection(db, "ordini"), ordineData);
        alert("Ordine salvato con successo nel database!");
        caricaOrdiniSalvati();
    } catch (error) {
        console.error("Errore salvataggio ordine:", error);
    }
}

async function caricaOrdiniSalvati() {
    const listaContainer = document.getElementById('listaOrdiniSalvati');
    if (!listaContainer) return;

    try {
        const querySnapshot = await getDocs(collection(db, "ordini"));
        if (querySnapshot.empty) {
            listaContainer.innerHTML = '<p class="text-slate-400 italic text-xs">No saved orders yet.</p>';
            return;
        }

        let html = '';
        querySnapshot.forEach((docSnap) => {
            const o = docSnap.data();
            html += `
                <div onclick="caricaOrdineDalBackend('${docSnap.id}')" class="bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl p-2.5 flex justify-between items-center text-xs cursor-pointer transition-colors group">
                    <div>
                        <span class="font-semibold text-slate-800 group-hover:text-slate-900">${o.cliente}</span>
                        <div class="text-[10px] text-slate-400">${o.data} - ₱${Number(o.totale).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    </div>
                    <button onclick="event.stopPropagation(); eliminaOrdine('${docSnap.id}')" class="text-rose-400 hover:text-rose-600 font-medium px-1.5 py-0.5">✕</button>
                </div>
            `;
        });
        listaContainer.innerHTML = html;
    } catch (error) {
        console.error("Errore recupero ordini:", error);
    }
}

window.caricaOrdineDalBackend = async function(idOrdine) {
    try {
        const docRef = doc(db, "ordini", idOrdine);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return;

        const ordine = docSnap.data();

        if (document.getElementById('clienteNome')) document.getElementById('clienteNome').value = ordine.cliente || '';
        if (document.getElementById('ordineNote')) document.getElementById('ordineNote').value = ordine.note || '';
        if (document.getElementById('ordineNoteExtra')) document.getElementById('ordineNoteExtra').value = ordine.noteExtra || '';
        if (document.getElementById('ordineData')) document.getElementById('ordineData').value = ordine.data || '';

        catalogData.forEach(p => p.quantita = 0);

        if (ordine.prodotti && Array.isArray(ordine.prodotti)) {
            ordine.prodotti.forEach(itemProd => {
                const prodTrovato = catalogData.find(p => p.id === itemProd.id || p.nome === itemProd.nome);
                if (prodTrovato) {
                    prodTrovato.quantita = itemProd.quantita || 0;
                }
            });
        }

        renderizzaCatalogo();
        popolaSelectCategorie();
        ricalcolaTotale();
        window.espandiTutto(true);

    } catch (error) {
        console.error("Errore durante il caricamento dell'ordine:", error);
    }
}

window.eliminaOrdine = async function(id) {
    if (confirm("Vuoi eliminare questo ordine salvato dal database?")) {
        try {
            await deleteDoc(doc(db, "ordini", id));
            caricaOrdiniSalvati();
        } catch (error) {
            console.error("Errore eliminazione ordine:", error);
        }
    }
}

window.esportaPDF = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    const cliente = document.getElementById('clienteNome').value.trim() || 'N/A';
    const note = document.getElementById('ordineNote').value.trim() || 'N/A';
    const noteExtra = document.getElementById('ordineNoteExtra').value.trim() || 'N/A';
    const dataOrdine = document.getElementById('ordineData').value || new Date().toISOString().split('T')[0];

    const prodottiSelezionati = catalogData.filter(p => (p.quantita || 0) > 0);
    if (prodottiSelezionati.length === 0) {
        alert("Nessun prodotto selezionato per l'esportazione PDF.");
        return;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text("TRUMED ORDER MANAGEMENT", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text("OFFICIAL PURCHASE ORDER", 14, 26);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 30, 196, 30);

    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text("Client / Doctor / Clinic:", 14, 37);
    doc.text("References / Notes:", 14, 43);
    doc.text("Date:", 14, 49);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(cliente, 55, 37);
    doc.text(note, 55, 43);
    doc.text(dataOrdine, 55, 49);

    const tableBody = prodottiSelezionati.map(p => [
        p.nome,
        p.descrizione,
        p.pack,
        `PHP ${Number(p.prezzo).toLocaleString('en-US', {minimumFractionDigits: 2})}`,
        p.quantita.toString(),
        `PHP ${(p.quantita * p.prezzo).toLocaleString('en-US', {minimumFractionDigits: 2})}`
    ]);

    let totaleComplessivo = prodottiSelezionati.reduce((acc, p) => acc + (p.quantita * p.prezzo), 0);

    doc.autoTable({
        startY: 55,
        head: [['Brand Name', 'Description', 'Pack', 'Price (Net VAT)', 'Qty', 'Subtotal']],
        body: tableBody,
        margin: { left: 14, right: 14 },
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 8, textColor: [51, 65, 85], font: 'helvetica' },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 35 },
            1: { cellWidth: 'auto' },
            2: { halign: 'center', cellWidth: 20 },
            3: { halign: 'right', cellWidth: 30 },
            4: { halign: 'center', cellWidth: 15 },
            5: { halign: 'right', fontStyle: 'bold', cellWidth: 32 }
        },
        foot: [[
            { content: 'TOTAL AMOUNT (Net VAT):', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold', fontSize: 9 } },
            { content: `PHP ${totaleComplessivo.toLocaleString('en-US', {minimumFractionDigits: 2})}`, styles: { halign: 'right', fontStyle: 'bold', fontSize: 9, textColor: [15, 23, 42] } }
        ]],
        footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42] }
    });

    if (noteExtra !== 'N/A' && noteExtra.trim() !== '') {
        const finalY = doc.lastAutoTable.finalY + 10;
        if (finalY < 270) {
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(51, 65, 85);
            doc.text("Special Instructions:", 14, finalY);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            const splitNotes = doc.splitTextToSize(noteExtra, 180);
            doc.text(splitNotes, 14, finalY + 5);
        }
    }

    doc.save(`Trumed_Order_${cliente.replace(/\s+/g, '_')}.pdf`);
};

window.avviaEliminazioneProdotto = function(id) {
    const container = document.getElementById(`delete-container-${id}`);
    if (!container) return;

    container.innerHTML = `
        <button type="button" onclick="confermaEliminazioneProdotto('${id}')" class="bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded transition-colors">
            Confirm?
        </button>
    `;

    setTimeout(() => {
        const currentContainer = document.getElementById(`delete-container-${id}`);
        if (currentContainer && currentContainer.innerHTML.includes('Confirm?')) {
            currentContainer.innerHTML = `
                <button type="button" onclick="avviaEliminazioneProdotto('${id}')" title="Delete product" class="text-slate-300 hover:text-rose-600 font-bold px-1.5 py-0.5 rounded transition-colors">✕</button>
            `;
        }
    }, 4000);
}

window.confermaEliminazioneProdotto = async function(id) {
    try {
        await deleteDoc(doc(db, "catalogo", id));
        catalogData = catalogData.filter(p => p.id !== id);
        renderizzaCatalogo();
        popolaSelectCategorie();
        ricalcolaTotale();
    } catch (error) {
        console.error("Errore durante l'eliminazione del prodotto dal cloud:", error);
        alert("Impossibile eliminare il prodotto. Riprova.");
    }
}