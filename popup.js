console.log ("popup.js begins")

import {exportCSV, importCSV, readFile, drawVocab} from './func.js'

document.getElementById("btnExport").addEventListener("click", exportCSV);
document.getElementById("btnImport").addEventListener("click", importCSV);
document.getElementById("selectedFile").addEventListener("change", readFile);

drawVocab()