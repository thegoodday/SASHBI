function processKey() { 
    if( (event.ctrlKey == true && (event.keyCode == 78 || event.keyCode == 82)) || 
        (event.keyCode >= 112 && event.keyCode <= 123) || event.keyCode == 2) { 
        event.keyCode = 0; 
        event.cancelBubble = true; 
        event.returnValue =  false; 
    } 
} 

document.onkeydown = processKey;
document.oncontextmenu = new Function('return false'); 
