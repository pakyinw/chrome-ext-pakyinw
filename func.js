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

var importCSV = () => {
    document.getElementById('selectedFile').click();
}

var readFile = () => {
    console.log("func readFile started")
    var reader = new FileReader();
    reader.onload = () => {
        var lines = reader.result.split("\n");
        while( typeof lines[0] !== "undefined" ){
            var line = lines.shift();
            var split = line.split(',');
            console.log(line)
            if (split[0] != ''){
                var time = split[0];
                var info = {}, obj = {}
                info["text"] = split[1]
                info["url"] = split[2]
                obj[time] = info;
                chrome.storage.sync.set(obj,()=>{
                    console.log("Record Finished")
                })
            }
            //document.querySelector("#content").innerHTML += split[0]+"<br/>";
        }
        drawVocab()
    }
    reader.readAsBinaryString(document.getElementById("selectedFile").files[0]);
}

var drawVocab = () => {
    chrome.storage.sync.get(null,(items)=>{
        document.getElementById("divTableBody").innerHTML = ""
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
}