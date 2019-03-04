var getSelectionText = function() {
    var selection = window.getSelection();
    return (selection.rangeCount > 0) ? selection.toString() : '';
};

var jsCodeStr = ';(' + getSelectionText + ')();';

var translateToChinese = (text) => {
    chrome.tabs.create(
        {
            url: "https://www.google.com/search?q=" + text +"+中文"
        }, 
        ()=>{
            console.log("Translation finished")
        }
    )
}

var createMenus = function() {  
    chrome.contextMenus.create({  
        "title": "Translation to Chinese on %s",  
        "type": "normal",
        "contexts": ['all'],    
        "onclick": (onClickData) => {
            translateToChinese(onClickData.selectionText)
        }
    });  
}  

var createShortcuts = function(){
    console.log('pakyinw command pressed');

    chrome.commands.onCommand.addListener(
        function(command) { 
            console.log('Command:', command);  
            chrome.tabs.executeScript({
                code: jsCodeStr,
                allFrames: true   //  <-- inject into all frames, as the selection 
                                  //      might be in an iframe, not the main page
            }, function(selectedTextPerFrame) {
                if (chrome.runtime.lastError) {
                    console.log('ERROR:\n' + chrome.runtime.lastError.message);
                } else if ((selectedTextPerFrame.length > 0)
                        && (typeof(selectedTextPerFrame[0]) === 'string')) {
                    console.log('Selected text: ' + selectedTextPerFrame[0]);
                    if(command == "chinese-translation"){
                        translateToChinese(selectedTextPerFrame[0]);
                    }  
                }
            });
        }
    );
}

createMenus();  
createShortcuts();