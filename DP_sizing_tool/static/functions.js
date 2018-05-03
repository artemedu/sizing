/***********************************************
 * Accepts n number of arguments.              *
 * First argument must be the output string.   *
 * 1 through n are the replacement parameters. *
 ***********************************************/
function replaceParams() {
    var out = arguments[0];
    for (var i = 1; i < arguments.length; i++)
        out = out.replace(new RegExp("{" + new String(i-1) + "\\}", "g"), arguments[i]);
    return out;
}
function showExitIcon() {
    top.document.getElementById('exitApplication').style.display = "inline";
}
function hideExitIcon() {
    top.document.getElementById('exitApplication').style.display = "none";
}
function showReturnToBCAIcon(bcaID, bcaTabIndex) {
    top.bcaAnalysisID = bcaID;
    top.bcaTabIndex = bcaTabIndex;
    //top.document.getElementById("largeButtonMenu").style.width = "425px";
    top.document.getElementById('returnToBCA').style.display = "block";
}
function hideReturnToBCAIcon() {
    top.bcaAnalysisID = '0';
    top.document.getElementById('returnToBCA').style.display = "none";
    //top.document.getElementById("largeButtonMenu").style.width = "425px";
}

function findRootWindow(currentWindow) {
    if (typeof currentWindow.parent == "undefined" || currentWindow.parent == currentWindow.self) {
        return currentWindow;
    } else {
        findRootWindow(currentWindow.parent);
    }
}

function beginLoading() {
    top.parent.document.getElementById('waitingElement').style.display = "inline";
    top.parent.document.getElementById('messageBox').style.display = "inline";
    
    top.parent.document.getElementById('waitingElement').style.cursor = "wait";
    top.parent.document.getElementById('messageBox').style.cursor = "wait";
    return;
}

function endLoading() {
    top.parent.document.getElementById('waitingElement').style.cursor = "default";
    top.parent.document.getElementById('messageBox').style.cursor = "default";
    
    top.parent.document.getElementById('waitingElement').style.display = "none";
    top.parent.document.getElementById('messageBox').style.display = "none";

    return;
}
   
function setAnalysisName(newText, type) {
    if (typeof type == undefined || type == null ||  type == "" ||  type == " " ){
        type = "";
        document.getElementById('analysisTypeText').innerHTML = '<em>'+ newText +'</em>' ;
    } else{
        document.getElementById('analysisTypeText').innerHTML = type +'<br /><em>'+ newText +'</em>' ;
    }

    //document.getElementById('analysisTitle').innerHTML = newText;
}

// When a tab is clicked
function tabClicked(indexClicked, skipValidation) { 
    if (tabList.disabled == true) return;
    
    var clickedTab, forward, index, paramID;
    
    if (indexClicked > -1) {
        clickedTab  = tabList.tabs[indexClicked];
        forward     = clickedTab.forward;
        index       = indexClicked;
        if( clickedTab.paramID != null) {
           paramID     = clickedTab.paramID;            
        }
        top.window.dialog.winCache.clearHiddenCache();
    } else if (indexClicked == -1){
        clickedTab  = tabList.tabs[tabList.selectedIndex];        
        index       = indexClicked;   
        if( clickedTab.paramID != null) {
           paramID     = clickedTab.paramID;            
        }
        forward     = "logout";
    } else {  
        clickedTab  = tabList.tabs[tabList.selectedIndex];        
        index       = indexClicked;   
        if( typeof clickedTab != "undefined" && clickedTab != null && typeof clickedTab.paramID != "undefined" && clickedTab.paramID != null) {
           paramID     = clickedTab.paramID;            
        }
        var popupProps = top.window.windowReloaderProps;
        if (typeof popupProps == 'undefined' || popupProps == null) {
            forward = "closeWindowReloadOpener";
        } else {            
            // if popupProps is undefined or false, business as usual
            if (typeof popupProps == "undefined" || popupProps == null || popupProps.overrideSaveCloseClick == false) {
                forward = "closeWindowReloadOpener";            
            } else {
                if (popupProps.reloadAnalysis) {                
                    forward = "closeWindowReloadAnalysis";                
                } else if (popupProps.reloadOpener) {
                    forward = "closeWindowReloadOpener";
                } else {
                    forward = "closeWindow";
                }
            }
        }
    }
    
    var frame = (typeof(contentFrame) == "undefined") ? document.contentFrame : contentFrame;
    
    if (typeof(frame) == "undefined") {
        frame = window.frames[0];
    }

    if (typeof frame.setParamID == "function") {
        frame.setParamID(paramID)
    }
    if (typeof frame.setForward == "function") {
        frame.setForward(forward);        
    }
    if (typeof frame.setIndex == "function") {
        frame.setIndex(index);
    }
    if (typeof frame.validate == "function") {
        if ((typeof(skipValidation) == "undefined") || (skipValidation == false)) {
            var isValid = frame.validate();
            if (isValid == false) {
                return;
            }
        }
    }
    if (typeof frame.doAutoSave == "function") {
        tabList.disabled = true;
        frame.doAutoSave();
    }

    tabList.selectedIndex = indexClicked;

    if (tabList.enableWaiting == true) {
        beginLoading();
        enableDisableNextBack();
    }
    tabList.displayTabs();
}

function enableDisableNextBack() {
    var first = -1;
    var last = -1;
    var indexArray = new Array();
    for (var i = 0; i < tabList.tabs.length; i++) {
        var tab = tabList.tabs[i];
        if (tab.visible == true) 
        {      
           indexArray[i] = tab.index;
        }
    }
    first = indexArray[0]; 
    last = indexArray[indexArray.length - 1];
    if (tabList.selectedIndex == first) {
            document.getElementById('prevText').disabled = true;
            document.getElementById('prevText').className = "bottomPrevDisabled";
    } else {
        document.getElementById('prevText').disabled = false;
        document.getElementById('prevText').className = "bottomPrev";
    }
    if (tabList.selectedIndex == last ) {
        document.getElementById('nextText').disabled = true;
        document.getElementById('nextText').className = "bottomNextDisabled";
    } else {
        document.getElementById('nextText').disabled = false;
        document.getElementById('nextText').className = "bottomNext";
    }
    // If number of tabs is 1 or less, hide back/next buttons
    if (tabList.tabs.length < 2) { //tabList.tabs.length
        document.getElementById('prevText').style.display = "none";
        document.getElementById('nextText').style.display = "none";
    } else {
        document.getElementById('prevText').style.display = "inline";
        document.getElementById('nextText').style.display = "inline";
    }
}
function hideShowFooterLogo(showFooterLogo){
    if(showFooterLogo == "true" || showFooterLogo == true){
        top.document.getElementById("footer-right").style.display = 'block';
    } else{
        top.document.getElementById("footer-right").style.display = 'none';
    }
}
function hideShowNextButton(showNextButton){
    if(showNextButton == "true" || showNextButton == true){
        top.document.getElementById("nextText").style.visibility = 'visible';
    } else{
        top.document.getElementById("nextText").style.visibility = "hidden";
    }
}
function hideShowPreviousButton(showPreviousButton){
    if(showPreviousButton == "true" || showPreviousButton == true){
        top.document.getElementById("prevText").style.visibility = 'visible';
    } else{
        top.document.getElementById("prevText").style.visibility = 'hidden';
    }
}
function hideShowMenu(showMenu){
    if(showMenu == "true" || showMenu == true){
        top.document.getElementById("ext-comp-1001").style.display = 'block';
    } else{
        top.document.getElementById("ext-comp-1001").style.display = 'none';
    }
}
function hideShowAnalysisName(showAnalysisName){
    if(showAnalysisName == "true" || showAnalysisName == true){
        top.document.getElementById("analysisTypeText").style.display = 'block';
    } else{
        top.document.getElementById("analysisTypeText").style.display = 'none';
    }
}
function doNextOver(objNext) {
    if (!objNext.disabled) {
        objNext.className = "bottomNextOver";
    }
}
function doPrevOver(objPrev) {
    if (!objPrev.disabled) {
        objPrev.className = "bottomPrevOver";
    }
}
function doPrintOver(objPrint) {
    if (!objPrint.disabled) {
        objPrint.className = "bottomPrintOver";
    }
}
function doSaveOver(objSave) {
    if (!objSave.disabled) {
        objSave.className = "saveCloseOver";
    }
}
function doNextOut(objNext) {
    if (!objNext.disabled) {
        objNext.className = "bottomNext";
    }
}
function doPrevOut(objPrev) {
    if (!objPrev.disabled) {
        objPrev.className = "bottomPrev";
    }
}
function doPrintOut(objPrint) {
    if (!objPrint.disabled) {
        objPrint.className = "bottomPrint";
    }
}
function doSaveOut(objSave) {
    if (!objSave.disabled) {
        objSave.className = "bottomSave";
    }
}

function largeButtonOver(objLB){
         objLB.className = "largeButtonOver"
}
function largeButtonOut(objLB){
         objLB.className = "largeButton"
}
function loadNext() {
    for (var i = parseInt(tabList.selectedIndex) + 1; i < tabList.tabs.length; i++) {
        var tab = tabList.tabs[i];
        if (tab.visible == true) {
            tabClicked(i);
            return;
        }
    }
}
function loadPrint() {
    launchUniversalCreateReport();
}
function loadPrevious() {
    for (var i = parseInt(tabList.selectedIndex) - 1; i >=0; i--) {
        var tab = tabList.tabs[i];
        if (tab.visible == true) {
            tabClicked(i);
            return;
        }
    }
}
function saveCloseClick() {
    tabClicked(-2);
}
function tabMouseOver(index) {
    //if (tabList.disabled == true) return;
    if (index != tabList.selectedIndex) {
        document.getElementById('t' + index + 'l').className = "buttonLeftOver";
        document.getElementById('t' + index + 'c').className = "buttonContentOver";
        document.getElementById('t' + index + 'r').className = "buttonRightOver";
    }
}
function tabMouseOut(index) {
    //if (tabList.disabled == true) return;
    if (index != tabList.selectedIndex) {
        document.getElementById('t' + index + 'l').className = "buttonLeft";
        document.getElementById('t' + index + 'c').className = "buttonContent";
        document.getElementById('t' + index + 'r').className = "buttonRight";
    }
}
function dialogClose1() {
    saveCloseClick();
}

/*******************************************************************************
    Popup callback objects/functions
*******************************************************************************/
function foldersCallback() {
    var w = top.parent.parent.parent.parent.parent.parent;
    w = w.document.getElementById('content');
    if (w != null && typeof w == "object" && typeof w.contentWindow == "object" &&
        typeof w.contentWindow.doRepost == "function") {
            w.contentWindow.doRepost(true);
    }
    top.window.dialog.close();      
}
function saveAndCloseCallback(obj) {
    var w = top.window.document.getElementById(obj.getId()+'Content');
    if (w != null && typeof w == "object" && typeof w.contentWindow == "object" &&
        typeof w.contentWindow.saveCloseClick == "function")
            w.contentWindow.saveCloseClick();       
    //obj.suspendEvents();
    return false;
}

function reloadCallback() {
    var w = top.parent.parent.parent;
    if (w != null && typeof w.content.doRefresh == "function")
        w.content.doRefresh();
    top.window.dialog.close(); 
}

function getIframe(frameId) {
    alert('getIframe function');
    var iframe = top.document.getElementById(frameId);
    if (typeof iframe == "undefined" || iframe == null) {
        if (typeof top.frames[frameId] == "undefined" || top.frames[frameId] == null) {
            return top.frames[frameId+'Frame'];
        } else {
            return top.frames[frameId];
        }
    } else {
        return iframe;
    }
}

function getIframeDoc(frameId) {
    var iframe = top.document.getElementById(frameId);
    if (typeof iframe == "undefined" || iframe == null) {
        if (typeof top.frames[frameId] == "undefined" || top.frames[frameId] == null) {
            return top.frames[frameId+'Frame'].document;
        } else {
            return top.frames[frameId].document;
        }
    } else {
        return iframe.contentWindow.document || iframe.contentDocument;
    }
}

/**
 * if the page that is loading is a popup then we need to show or hide the background image
 */
function setTitleBarAndFooterBGImage(content){
    //this is the list of popup that open in window.open. function. and no 
    // the Alinean custom one.
    var popupWithNoBG = ["/loadSelfRegistrationRequestEmailContents.do","/PrivacyPolicy.do", "/LicenseAgreement.do", "/loadForgotPasswordContents.do", "/launchSafeHarborPopup.do", "/loadSafeHarborContents.do", "launchSelfRegistrationPopup.do", "launchDisclosureLevelInformationPopup.do", "/DisclosureLevelInformation.do"];
    
    if (popupWithNoBG.indexOf(content) > -1 ){       
       top.isPopup = true;
    }
    
    if (top.isPopup){
        //remove the background image if the page that is being opens
        $("#wrapper").css("background","transparent url() repeat-x" );   
        $("#footer").css("background","transparent url() repeat-x" );
    }else{
        //if the window that is being opened is not a popup, then show the backgrounds
        $("#wrapper").css("background","transparent url("+headerBGImage+") repeat-x" );
        $("#footer").css("background","transparent url("+footerBGImage+") repeat-x" );
    }    
}
