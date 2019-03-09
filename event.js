var getSelectionText = () => {
    var selection = window.getSelection();
    return (selection.rangeCount > 0) ? selection.toString() : '';
};

var jsCodeStr = ';(' + getSelectionText + ')();';

var saveToStorage = (text) => (tabs) => {
    var url = tabs[0].url;
    var info = {}, obj = {}
    info["text"] = text
    info["url"] = url
    obj[Date.now()] = info;
    chrome.storage.sync.set(obj,()=>{
        console.log("Record Finished")
    })
}

var processSelectedText = (selectedTextPerFrame) => {
    if (chrome.runtime.lastError) {
        console.log('ERROR:\n' + chrome.runtime.lastError.message);
    } else if ((selectedTextPerFrame.length > 0)
            && (typeof(selectedTextPerFrame[0]) === 'string')) {
        console.log('Selected text: ' + selectedTextPerFrame[0]);
        if(command == "chinese-translation"){
            translateToChinese(selectedTextPerFrame[0]);
        }  
    }
}

var translateToChinese = (text) => {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, saveToStorage(text));
    chrome.tabs.create(
        {
            url: "https://www.google.com/search?q=" + text +"+中文"
        }, 
        ()=>{
            console.log("Translation finished")
        }
    )
}

var createMenus = () => {  
    chrome.contextMenus.create({  
        "title": "Translate to Chinese on \"%s\"",  
        "type": "normal",
        "contexts": ['all'],    
        "onclick": (onClickData) => {
            translateToChinese(onClickData.selectionText)
        }
    });  
}  

var createShortcuts = () => {
    chrome.commands.onCommand.addListener(
        (command) => { 
            console.log("Chrome Extension pakyinw Shortcut pressed.");
            console.log('Command:', command);  
            chrome.tabs.executeScript({
                code: jsCodeStr,
                allFrames: true
            }, processSelectedText);
        }
    );
}

createMenus();  
createShortcuts();