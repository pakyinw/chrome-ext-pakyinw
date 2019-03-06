// functions
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