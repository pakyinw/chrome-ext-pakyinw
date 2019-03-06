console.log ("popup.js begins")
var getDatetime = (t) => {
    return new Date(Number(t)).toLocaleString()
}

chrome.storage.sync.get(null,(items)=>{
    var allKeys = Object.keys(items);
    if (allKeys.length > 0){
        allKeys.forEach((key,index)=>{
            console.log("raw time: " + key)
            console.log("time: " + getDatetime(key))
            console.log("text: " + items[key].text)
            console.log("url: " + items[key].url)
            document.getElementById("divTableBody").innerHTML += "<div class='divTableRow'><div class='divTableCell'>" + getDatetime(key) +"</div><div class='divTableCell'>" + items[key].text + "</div><div class='divTableCell'><a href='" +items[key].url + "'>" + items[key].url + "</a></div></div>"
        })
        
    }
});