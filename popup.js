console.log ("popup.js begins")

document.getElementById("btnExport").addEventListener("click", exportCSV);
document.getElementById("btnImport").addEventListener("click", importCSV);
document.getElementById("selectedFile").addEventListener("change", readFile);

drawVocab()