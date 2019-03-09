// functions
import {langId} from './global_popup.js'

var getDatetime = (t) =>  new Date(Number(t)).toLocaleString()

var exportCSV = () => {
    chrome.storage.sync.get(null,(items)=>{
        var allKeys = Object.keys(items);
        if (allKeys.length > 0){
            let csvContent = "data:text/csv;charset=utf-8,";
            allKeys.forEach((key,index)=>{
                csvContent += key + ',' + items[key].lang + ',' + items[key].text + ',' + items[key].url + "\n";
            })
            let encodedUri = encodeURI(csvContent);
            let link = document.createElement("a");
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
            console.log("split[0] : " + split[0])
            if (split[0] != ''){
                console.log("split[1] : " + split[1])
                console.log("split[2] : " + split[2])
                console.log("split[3] : " + split[3])
                
                var time = split[0];
                var info = {}, obj = {}
                info["lang"] = split[1]
                info["text"] = split[2]
                info["url"] = split[3]
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
        Object.keys(langId).forEach((key,index) => {
            if (langId[key]) {
                console.log("langId[key]: " + langId[key])
                document.getElementById(langId[key]).innerHTML = ""
            }
        })
        const itemkeys = Object.keys(items)
        console.log("length: " + itemkeys.length)
        if (itemkeys.length > 0){
            itemkeys.forEach((key,index)=>{
                console.log("raw time: " + key)
                console.log("time: " + getDatetime(key))
                console.log("text: " + items[key].text)
                console.log("url: " + items[key].url)
                drawVocabTable(langId[items[key].lang], getDatetime(key) , items[key].text, items[key].url)
            })
        }
    });
}

var drawVocabTable = (id,date,text,url) =>
    document.getElementById(id).innerHTML += "<div class='divTableRow'><div class='divTableCell'>" + date +"</div><div class='divTableCell'>" + text + "</div><div class='divTableCell'><a target='_blank' rel='noopener noreferrer' href='" + url + "'>here</a></div></div>"

export {exportCSV, importCSV, readFile, drawVocab};
