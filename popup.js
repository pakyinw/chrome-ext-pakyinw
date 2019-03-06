console.log ("popup.js begins")
var getDatetime = (t) => {
    return new Date(Number(t)).toLocaleString()
}

var exportCSV = () => {
    chrome.storage.sync.get(null,(items)=>{
        var allKeys = Object.keys(items);
        if (allKeys.length > 0){
            let csvContent = "data:text/csv;charset=utf-8,";
            allKeys.forEach((key,index)=>{
                csvContent += key + ',' + items[key].text + ',' + items[key].url + "\r\n";
            })
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "vocab_" + new Date().toLocaleDateString() + ".csv");
            document.body.appendChild(link); // Required for FF    
            link.click();
        }
    });

}

document.getElementById("btnExport").addEventListener("click", exportCSV);

chrome.storage.sync.get(null,(items)=>{
    var allKeys = Object.keys(items);
    if (allKeys.length > 0){
        allKeys.forEach((key,index)=>{
            console.log("raw time: " + key)
            console.log("time: " + getDatetime(key))
            console.log("text: " + items[key].text)
            console.log("url: " + items[key].url)
            document.getElementById("divTableBody").innerHTML += "<div class='divTableRow'><div class='divTableCell'>" + getDatetime(key) +"</div><div class='divTableCell'>" + items[key].text + "</div><div class='divTableCell'><a target='_blank' rel='noopener noreferrer' href='" +items[key].url + "'>here</a></div></div>"
        })
        
    }
});