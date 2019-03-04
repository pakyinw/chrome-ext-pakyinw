
var createMenus = function() {  
    var parent = chrome.contextMenus.create({  
        "title": "Translation to Chinese on %s",  
        "type": "normal",
        "contexts": ['all'],    
        "onclick": (onClickData)=>{
            chrome.tabs.create({
                url: "https://www.google.com/search?q=" + onClickData.selectionText +"+中文"
            }, ()=>{
                console.log("translate finished")
            })
        }
    });  
}  

createMenus();  
