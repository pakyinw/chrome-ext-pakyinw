var getSelectionText = () => (window.getSelection().rangeCount > 0) ? window.getSelection().toString().trim() : '';

var jsCodeStr = ';(' + getSelectionText + ')();';

var saveToStorage = (text, lang) => (tabs) => {
    var url = tabs[0].url;
    var info = {}, obj = {}
    info["text"] = text
    info["url"] = url
    info["lang"] = lang
    obj[Date.now()] = info;
    chrome.storage.sync.set(obj,()=>{
        console.log("Record Finished")
    })
}

var processSelectedText = (lang) => (selectedTextPerFrame) => {
    console.log ("processSelectedText(lang) - lang: " + lang)
    console.log ("selectedTextPerFrame.length: " + selectedTextPerFrame.length)
    console.log ("typeof(selectedTextPerFrame[0]): " + typeof(selectedTextPerFrame[0]))
    if (chrome.runtime.lastError) {
        console.log('ERROR:\n' + chrome.runtime.lastError.message);
    } else if ((selectedTextPerFrame.length > 0)
            && (typeof(selectedTextPerFrame[0]) === 'string')) {
        console.log('Selected text: ' + selectedTextPerFrame[0]);
        translate(selectedTextPerFrame[0],lang);
    }
}

var translate = (text, lang) => {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, saveToStorage(text, lang));
    chrome.tabs.create(
        {
            url: "https://www.google.com/search?q=" + text + langPhrase[lang]
        }, 
        ()=>{
            console.log("Translation finished")
        }
    )
}

var createMenuInfo = (title, lang) => {
    let menuInfo =  {
        "type": "normal",
        "contexts": ['all'], 
    }
    menuInfo["title"] = title;
    menuInfo["onclick"] = (onClickData) => {
        translate(onClickData.selectionText, lang)
    }
    return menuInfo;
}

var createMenus = () => {
    chrome.contextMenus.create(createMenuInfo("German - Chinese on \"%s\"","germanToChinese"))
    chrome.contextMenus.create(createMenuInfo("English - Chinese on \"%s\"","englishToChinese"))
    chrome.contextMenus.create(createMenuInfo("Japanese - Chinese on \"%s\"","japaneseToChinese"))
    chrome.contextMenus.create(createMenuInfo("Chinese on \"%s\"","chinese"))
    chrome.contextMenus.create(createMenuInfo("Computer Language on \"%s\"","computer"))
}  

var createShortcuts = () => {
    chrome.commands.onCommand.addListener(
        (command) => { 
            console.log("Chrome Extension pakyinw Shortcut pressed.");
            console.log('Command:', command);  
            chrome.tabs.executeScript({
                code: jsCodeStr,
                allFrames: true
            }, processSelectedText(command));
        }
    );
}

createMenus();  
createShortcuts();