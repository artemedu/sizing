var lastFocusElement;
var cellOriginalValue;
var firedCalcs = new Array();
var inCalcs = false;
var shouldChangeFocus = true;
var lastSelectedRadioCell = "";
var driveValues;
var bulkCellValues = new Object();
var cellColor = "";

function doCustomRadioClick(theRadio) {
    doMouseDown(theRadio);
    doChange(theRadio);
}

function doMouseDown(theRadio) {

    var name = theRadio.name;
    var radioGroup = document.getElementsByName(name);

    for (var i = 0; i < radioGroup.length; i++) {
        if (radioGroup[i].checked == true) {
            lastSelectedRadioCell = radioGroup[i].id;
        }
    }
}
var currentBoxDirty = false;
function doKeyPress(event) {
    if (event.keyCode == 13) {  // block <enter> key
        return false;
    }
    if ((event.keyCode >= 1 && event.keyCode <= 46) || (event.keyCode >= 112 && event.keyCode <= 123)) { // special keys; no "cell changed" processing
        return true;
    }
    currentBoxDirty = true;
    return !inCalcs;
}
function doFocus(theField) {
    lastFocusElement = theField;
    var myObj = new Object();
    myObj.status = "pending";
    firedCalcs[theField.id] = myObj;
    if (theField.type == "select-one") {
        firedCalcs[theField.id].block = "true";
    }
    cellOriginalValue = theField.value;
    if (!top.Ext.isIE8) {
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }
    if (theField.type == "text" || theField.type == "textarea") {
        theField.select();
    }
}

function doBlur(theField) {
    if (currentBoxDirty == true) {
        doChange(theField);
        currentBoxDirty = false;
        return;
    } else {
        if (theField.type == "select-one") {
            firedCalcs[theField.id].block = "false";
            firedCalcs[theField.id].status = "complete";
            doChange(theField);
        }
    }
}

function sliderChangeEnd(cellId) {
    if (!inCalcs) {
        var selectedIndex = document.getElementById(cellId + "selectedIndex").value;
        document.getElementById(cellId).value = sliderObjects[cellId].sliderOptions[selectedIndex];
        doChange(document.getElementById(cellId));
    }
}
function doMouseUp(theField) {

    if (theField.type == "select-one") {
        firedCalcs[theField.id].block = "false";
        firedCalcs[theField.id].status = "complete";
        doChange(theField);
    }
}
function doChange(theField) {
    if (theField.type == "select-one") {
         
         // Mouse Up events are not firing for Chrome, but
         // the change event is.  So if this is Chrome do the
         // mouseup logic.
         if (/Chrome/.test(navigator.userAgent) ||
             /Apple/.test(navigator.userAgent)) {
             firedCalcs[theField.id].block = "false";
             firedCalcs[theField.id].status = "complete";
         }
         else if (firedCalcs[theField.id].block == "true") {
            if (!currentBoxDirty) {
                return;
            }
        }
    }
    // slider
    if (parseInt(theField.getAttribute('dT')) == 8) {
        setDirty();
        inCalcs = true;
        if (driveValues)
            top.beginLoading();
        PCID(pTIV, theField.getAttribute('dT'), theField.getAttribute('id'), theField.value);
        return;
    }
    // radio button    
    if (parseInt(theField.getAttribute('dT')) == 7) {
        if (lastSelectedRadioCell != theField.id) {
            setDirty();
            
            if(firedCalcs.length == 0) {
                 doFocus(theField);
            }
            
            firedCalcs[theField.id].status = "complete";
            inCalcs = true;
            if (driveValues)
                top.beginLoading();
            PCID(pTIV, theField.getAttribute('dT'), theField.getAttribute('id'), value, lastSelectedRadioCell);
        }
        return;
    }
    // checkbox
    if (theField.getAttribute('dT') == 5) {
        setDirty();

        if(firedCalcs.length == 0) {
            doFocus(theField);
        }

        firedCalcs[theField.id].status = "complete";
        inCalcs = true;
        document.getElementById('c_' + theField.getAttribute('id')).style.background = cellColor;
        document.getElementById(theField.getAttribute('id')).style.background = cellColor;
        if (driveValues)
            top.beginLoading();
        PCID(pTIV, theField.getAttribute('dT'), theField.getAttribute('id'), value);
        cellOriginalValue = theField.value;
    }
    if (firedCalcs[theField.id].status == "pending" || theField.value != cellOriginalValue) {
        firedCalcs[theField.id].status = "complete";
        top.tabList.disabled = true;
        var value = theField.value;
        if (theField.type == "text") {
            value = NormalizeForDatabase(pTIV, theField, theField.getAttribute('nD'));
            if (value == "") {
                var type = theField.getAttribute('dT');
                if (type == 1 || type == 2 || type == 3) {
                    theField.value = pTIV.inputValidator.formatData(type, "0");
                    value = NormalizeForDatabase(pTIV, theField, theField.getAttribute('nD'));
                } else {
                    top.tabList.disabled = false;
                    return;
                }
            }
        }
        inCalcs = true;
        setDirty();
        // if it is not hide/show or list, set the td background color
        if (theField.getAttribute('dT') != 6 && theField.getAttribute('dT') != 0) {
            document.getElementById('c_' + theField.getAttribute('id')).style.background = cellColor;
        }
        document.getElementById(theField.getAttribute('id')).style.background = cellColor;
        if (driveValues)
            top.beginLoading();
        PCID(pTIV, theField.getAttribute('dT'), theField.getAttribute('id'), value);
        cellOriginalValue = theField.value;

        if (!driveValues && theField.type == "text") {
            pTIV.inputValidator.formatNormalizedNumberInFieldData(theField.getAttribute('dT'), theField, theField.getAttribute('nD'));
        }
    }
}

//onchange='setDirty("E11");PCID(pTIV, pTIV.inputValidator.AS_CURRENCY, "E11", NormalizeForDatabase(pTIV, this, "1"));doChange()' 
//onblur='try{pTIV.inputValidator.validateData(pTIV.inputValidator.AS_CURRENCY, this, 1);doBlur(this);restoreCellBorderProperties("E11");}catch(error){}' 
//onfocus='try{doFocus();doHandleFocus(this);highlightCell("E11");this.select();}catch(error){}' name=value("E11") tabindex=1></td>

function oN(row, col, contextPath) {
    var theURL = contextPath + "/launchGenericSpreadsheetNotesPopup.do";
    theURL += "?row=" + escape(row) + "&column=" + escape(col) + "&worksheetIndex=" + escape(document.forms[0].worksheetIndex.value);
    theURL += "&type=" + escape(document.forms[0].type.value);
    theURL += "&paramID=" + escape(document.forms[0].paramID.value);
    theURL += "&popupPrintArea=" + escape(document.forms[0].popupPrintArea.value);
    parent.window.dialog.open('auditLogPopup', top.genericSpreadsheets_js_on_Window_Title, theURL, 750, 620, true, new parent.window.popupProps(saveAndCloseCallback, false));
}
function oS(row, col, contextPath, sourceName) {
    openPopup(row, col, contextPath, 'Source', sourceName);
}
function openPopup(row, col, contextPath, windowTitle, printArea) {
    //alert(windowTitle);
    var theURL = contextPath + "/launchGenericSourcePopup.do";
    theURL += "?row=" + escape(row) + "&col=" + escape(col) + "&worksheetIndex=" + escape(document.forms[0].worksheetIndex.value);
    theURL += "&type=" + escape(document.forms[0].type.value);
    theURL += "&paramID=" + escape(document.forms[0].paramID.value);
    theURL += "&popupPrintArea=" + printArea;

    // Ticket 20419: added encodeURI() wrapper
    theURL += "&tabName=" + encodeURI(windowTitle);
    //alert(theURL);    
    parent.window.dialog.open(cleanupWindowId(windowTitle), windowTitle, theURL, 940, 620, true, new parent.window.popupProps(saveAndCloseCallback, false));
}
function cleanupWindowId(title) {
    return title.replace(/[ \/\\]/gi, "");
}

function doBulkSuccess(o){
        doSuccess(o);
        doSpreadsheetUpdate();
}

function hideShowTabs(tabVisibilityList) {
    var tabList = top.tabList;
    for (var i = 0; i < tabVisibilityList.length; i++) {
        currentTabVisibility = tabVisibilityList[i];
        var tabIndex = currentTabVisibility.tabIndex;
        var visible = currentTabVisibility.tabVisible;
        tabList.tabs[tabIndex].visible = visible;
    }
    tabList.displayTabs();
}
function doSuccess(o) {
    try {
        var root = o.responseXML.documentElement;
        var cellValuePairs = root.getElementsByTagName('fieldValues')[0].firstChild.nodeValue;
        cellValuePairs = cellValuePairs.split(";");
        var showPrint = root.getElementsByTagName('showPrint')[0].firstChild.nodeValue;
        var showBottomPrintButton = root.getElementsByTagName('showBottomPrintButton')[0].firstChild.nodeValue;
        var showResources = root.getElementsByTagName('showResources')[0].firstChild.nodeValue;
        var showTellAFriend = root.getElementsByTagName('showTellAFriend')[0].firstChild.nodeValue;
        var showCollaborate = root.getElementsByTagName('showCollaborate')[0].firstChild.nodeValue;
        var showEMailAReport = root.getElementsByTagName('showEMailAReport')[0].firstChild.nodeValue;
        var showRegistration = root.getElementsByTagName('showRegistration')[0].firstChild.nodeValue;
        var showFooterLogo = root.getElementsByTagName('showFooterLogo')[0].firstChild.nodeValue;
        var showNextButton = root.getElementsByTagName('showNextButton')[0].firstChild.nodeValue;
        var showPreviousButton = root.getElementsByTagName('showPreviousButton')[0].firstChild.nodeValue;
        var showMenu = root.getElementsByTagName('showMenu')[0].firstChild.nodeValue;
        var showAnalysisName = root.getElementsByTagName('showAnalysisName')[0].firstChild.nodeValue;
        var showAlert = root.getElementsByTagName('alertOnNodeChange')[0].getElementsByTagName('enabled')[0].firstChild.nodeValue;
        var alertMessage = root.getElementsByTagName('alertOnNodeChange')[0].getElementsByTagName('message')[0].firstChild.nodeValue;
        var showConfirm = root.getElementsByTagName('confirmOnNodeChange')[0].getElementsByTagName('enabled')[0].firstChild.nodeValue;
        var confirmMessage = root.getElementsByTagName('confirmOnNodeChange')[0].getElementsByTagName('message')[0].firstChild.nodeValue;
        var assessmentIndexChanged = root.getElementsByTagName('assessmentIndexChanged')[0].firstChild.nodeValue;
        var assessmentScoreChanged = root.getElementsByTagName('assessmentScoreChanged')[0].firstChild.nodeValue;
        var showTabs = root.getElementsByTagName('showTabs')[0].firstChild.nodeValue;

        var ajaxTabAccessList = root.getElementsByTagName('tabAccess');
        tabAccessList = new Array();
        for (var i = 0; i < ajaxTabAccessList.length; i++) {
            var currElement = ajaxTabAccessList[i];
            var ajaxTabListObj = new Object();
            ajaxTabListObj.allowAccess = currElement.getElementsByTagName('allow')[0].firstChild.nodeValue;
            ajaxTabListObj.message = currElement.getElementsByTagName('message')[0].firstChild.nodeValue;
            ajaxTabListObj.worksheetIndex = currElement.getElementsByTagName('index')[0].firstChild.nodeValue;
            ajaxTabListObj.isConfirm = currElement.getElementsByTagName('isConfirm')[0].firstChild.nodeValue;
            tabAccessList.push(ajaxTabListObj);
        }

        var tabVisibility = root.getElementsByTagName('tabVisibility');
        var tabVisibilityList = new Array();
        for (var i = 0; i < tabVisibility.length; i++) {
            var currElement = tabVisibility[i];
            var currentTabVisibility = new Object();
            currentTabVisibility.tabIndex = parseInt(currElement.getElementsByTagName('index')[0].firstChild.nodeValue);
            currentTabVisibility.tabVisible = (currElement.getElementsByTagName('visible')[0].firstChild.nodeValue == "true") || (currElement.getElementsByTagName('visible')[0].firstChild.nodeValue == "true");
            tabVisibilityList.push(currentTabVisibility);
        }

        var chartTooltipList = root.getElementsByTagName('chart');
        for (var i = 0; i < chartTooltipList.length; i++) {
            var currElement = chartTooltipList[i];
            var index = currElement.getElementsByTagName('index')[0].firstChild.nodeValue;
            var imageMapContent = currElement.getElementsByTagName('map')[0].firstChild.nodeValue;
            imageMapContent = "<map name=\"chart" + index + "\">" + imageMapContent + "</map>";
            if (typeof window["win_" + index] != "undefined") {
                // This replace regex was causing a Javascipt out of memory exception on a model
                // with 10 charts on the page. So now using array splits to replace the image map.
                // window["win_" + index] = window["win_" + index].replace(/\<map[\S\s]*\<\/map>/, imageMapContent);
                var beforeMap = window["win_" + index].split("<map ")[0];
                var afterMap = window["win_" + index].split("<\/map>")[1];
                window["win_" + index] = beforeMap + imageMapContent + afterMap;                
            }
        }

        var thumbTooltipList = root.getElementsByTagName('thumb');
        for (var j = 0; j < thumbTooltipList.length; j++) {
            var thumbElement = thumbTooltipList[j];
            var idx = thumbElement.getElementsByTagName('index')[0].firstChild.nodeValue;
            var thumbMapContent = thumbElement.getElementsByTagName('map')[0].firstChild.nodeValue;
            var currMap = document.getElementsByName('thumb' + idx);
            if (currMap.length > 0) {
                currMap[0].innerHTML = thumbMapContent;
            }
        }

        enableAlertOnNodeChange(showAlert, alertMessage);
        enableConfirmOnNodeChange(showConfirm, confirmMessage);
        setAssessmentIndexChanged(assessmentIndexChanged);
        setAssessmentScoreChanged(assessmentScoreChanged);
        hideShowPrepareReport(showPrint);
        hideShowTellAFriend(showTellAFriend);
        hideShowCollaborate(showCollaborate);
        hideShowPrintToEmail(showEMailAReport);
        hideShowRegistration(showRegistration);
        hideShowFooterLogo(showFooterLogo);
        hideShowNextButton(showNextButton);
        hideShowPreviousButton(showPreviousButton);
        hideShowMenu(showMenu);
        hideShowAnalysisName(showAnalysisName);
        hideShowTabs(tabVisibilityList);
        top.tabList.hideShowTabs(showTabs);

        // Bottom Print Button display/hide
        toggleBottomPrintButton(showBottomPrintButton);

        hideShowResources(showResources);
        //var cellValuePairs = o.responseText.split(";");
        
        for (var i = 0; i < cellValuePairs.length; i++) {
            var cellValuePair = cellValuePairs[i].split(":");
            var cellReference = cellValuePair[0];
            var cellValue = "";
            for (var j = 1; j < cellValuePair.length; j++) {
                cellValue += cellValuePair[j];
                if (j < cellValuePair.length - 1) {
                    cellValue += ":";
                }
            }
            var currentElement = document.getElementById(cellReference);
            if (currentElement != null) {
                // slider
                if (parseInt(currentElement.getAttribute('dT')) == 8) {
                    var stepScalar = parseInt(currentElement.getAttribute("stepScalar"));
                    var theSliderObj = sliderObjects[cellReference].sliderObj;
                    var sliderOptions = sliderObjects[cellReference].sliderOptions;
                    for (var optionCounter = 0; optionCounter < sliderOptions.length; optionCounter++) {
                        if (sliderOptions[optionCounter] == cellValue) {
                            theSliderObj.set("value", optionCounter * stepScalar);
                        }
                    }
                }
                // Checkbox stuff
                if (currentElement.type == 'checkbox') {
                    var deselectedValue = currentElement.value.split(',')[0];
                    currentElement.checked = deselectedValue != cellValue;
                    // Don't know what image is for - found it - driven expand collapses
                } else if (currentElement.type == 'image') {
                    currentElement.value = cellValue;
                    if (top.Ext.isIE)
                        currentElement.fireEvent("onchange");
                    else
                        currentElement.onchange();
                } else if (currentElement.getAttribute('dT') == "hideRow") {
                    var theDisplay = "none";
                    if (cellValue != "hide") {
                        if (navigator.appName.indexOf("Microsoft") > -1) {
                            theDisplay = 'block'
                        } else {
                            theDisplay = 'table-row';
                        }
                    }
                    currentElement.style.display = theDisplay;
                    // Text, select, and textarea
                } else { // Every other type
                    currentElement.value = cellValue;
                }
            }
        }

        var imgCounter = 0;
        var thumbImage = document.getElementById('thumbImg' + imgCounter);
        while (thumbImage != null) {
            document.getElementById('thumbImg' + imgCounter).src = document.getElementById('thumbImg' + imgCounter).src + '&time=' + (new Date()).getTime();
            imgCounter++;
            thumbImage = document.getElementById('thumbImg' + imgCounter);
        }
        imgCounter = 0;
        var fullImage = document.getElementById('chartImg' + imgCounter);
        while (fullImage != null) {
            document.getElementById('chartImg' + imgCounter).src = document.getElementById('chartImg' + imgCounter).src + '&time=' + (new Date()).getTime();
            imgCounter++;
            fullImage = document.getElementById('chartImg' + imgCounter);
        }
        if (hasSpiderChart) {
            chartFrame.location.href = contextPath + "/Project/CurrentPracticesChart.jsp" + '?time=' + (new Date()).getTime();
        }

        // Update the background graphics
        var graphics = root.getElementsByTagName('graphic');
        if (graphics != null) {
            for (var x = 0; x < graphics.length; x++) {
                var graphicAttributes = graphics[x].attributes;
                var imageID = graphicAttributes.getNamedItem('id').nodeValue;
                var imageObj = document.getElementById(imageID);

                imageObj.src = graphicAttributes.getNamedItem('imgsrc').nodeValue;

                // Pull off visibility to reset the onLoad, if necessary.
                var visibility = graphicAttributes.getNamedItem('visibility').nodeValue;
                imageObj.style.visibility = visibility;
                imageObj.style.zIndex = graphicAttributes.getNamedItem('zorder').nodeValue;

                // The X and Y coordinates need to be pulled off to
                // handle anchored images.
                var xaxis = graphicAttributes.getNamedItem('left').nodeValue;
                var yaxis = graphicAttributes.getNamedItem('top').nodeValue;

                // Detemine if opacity needs to be set.
                var opacityObj = graphicAttributes.getNamedItem('opacity');
                if (opacityObj != null) {
                    var opacity = opacityObj.nodeValue;
                    imageObj.style.opacity = opacity;

                    // Set IE opacity
                    imageObj.style.filter = 'alpha(opacity=' + opacity + ')';
                }


                // Determine if this is anchor object, and handle
                // accordingly.  If this is an anchored image then the x,y coordinates
                // are offsets.
                var anchorCellObj = graphicAttributes.getNamedItem('anchorCell');
                if (anchorCellObj != null) {
                    var anchorCellName = anchorCellObj.nodeValue;
                    var anchorCell = document.getElementById("c_" + anchorCellName);
                    if (anchorCell != null) {
                        var row = anchorCell.parentNode;
                        var displayCell = row.style.display;

                        imageObj.style.display = displayCell;

                        var anchorPos = findPos(anchorCell);
                        xaxis = parseInt(anchorPos[0]) + parseInt(xaxis);
                        yaxis = parseInt(anchorPos[1]) + parseInt(yaxis);

                        // reset the onload method, just in case.
                        imageObj.onload = "processImage(this," + anchorCell + ","
                                + xaxis + "," + yaxis + "," + visibility + ")";
                    }
                }

                imageObj.style.top = yaxis + "px";
                imageObj.style.left = xaxis + "px";
            }
        }

        top.window.dialog.winCache.clearHiddenCache();
        if(driveValues)
            top.endLoading();

        if (shouldChangeFocus == true) {
            if (typeof lastFocusElement != "undefined") {
                doFocus(lastFocusElement);
            }
        }
        shouldChangeFocus = true;
        inCalcs = false;
        top.tabList.disabled = false;
    } catch(err) {
        if (console)
            console.log(err);
        top.endLoading();
        inCalcs = false;
        top.tabList.disabled = false;
    }
}
function doFailure(o) {
    top.endLoading();
    inCalcs = false;
    top.tabList.disabled = false;
    alert(top.genericSpreadsheets_js_doFailure_alert);
}
function PCID(pTIV, theType, cell, value, unselectedRadioCellReference) {
    value = getValueToPush(theType, value, pTIV, cell);

    if (driveValues) {
        //alert("Pushing value " + value + " for cell " + cell + " of type " + theType + ".");
        var ajaxURL = contextPath + "/genericSpreadsheetFieldChange.do?" + "type=" + encodeURIComponent(document.forms[0].type.value) + "&cell=" + encodeURIComponent(cell) + "&value=" + encodeURIComponent(value) + "&paramID=" + encodeURIComponent(document.forms[0].paramID.value) + "&worksheetIndex=" + encodeURIComponent(document.forms[0].worksheetIndex.value) + "&popupPrintArea=" + encodeURIComponent(document.forms[0].popupPrintArea.value);
        if (typeof unselectedRadioCellReference != "undefined") {
            ajaxURL += "&unselectedRadioCellReference=" + escape(unselectedRadioCellReference);
        }
        //alert(ajaxURL);
        // Connect to our data source and load the data
        //var conn = YAHOO.util.Connect.asyncRequest("GET", ajaxURL, callback);
        top.Ext.Ajax.request({
           url: ajaxURL,
           method: 'POST',
           timeout: 120000,
           success: doSuccess,
           failure: doFailure
        });
    } else {
        //alert("Caching value " + value + " for cell " + cell + " of type " + theType + ".");
        if (typeof unselectedRadioCellReference != "undefined" && unselectedRadioCellReference != "") {
            bulkCellValues[unselectedRadioCellReference] = "unselect";
        }
        bulkCellValues[cell] = value;
        
        inCalcs = false;
        top.tabList.disabled = false;
    }
}

function NormalizeForDatabase(pTIV, theField, numDec) {
    var outputText = "";
    var inputText = theField.value;


    outputText = pTIV.inputValidator.normalizeData(inputText);
    if (outputText == "") {
        proceedWithCalculations = false;
        return "";
    }
    proceedWithCalculations = true;
    outputText = pTIV.inputValidator.roundData(outputText, numDec);
    return outputText;
}
function getValueToPush(theType, value, pTIV, cell) {
    if (theType == 0) {
        var saParts = value.split("&quot;");
        var newValue = "";
        for (var i = 0; i < saParts.length; i++) {
            newValue = newValue + saParts[i];
        }
        value = newValue;
    }
    // It is a currency
    if (theType == 1) {
        value = value / pTIV.inputValidator.exchangeRate;
    }
    // If it is a percentage, divide by 100
    if (theType == 3) {
        value = value / 100;
    }
    // It is a checkbox
    if (theType == 5) {
        if (document.getElementById(cell).checked == true) {
            value = document.getElementById(cell).value.split(",")[1];
        } else {
            value = document.getElementById(cell).value.split(",")[0];
        }
    }
    // It is a hide show node
    if (theType == 6) {
        value = document.getElementById(cell).value;
    }
    return value;
}

function doECChange(objBox, rangeName, contextPath) {  // does the actual hiding showing
    var isHidden = (objBox.value == 'HS: 0') ? true : false;
    if (isHidden == true) {
        objBox.src = contextPath + "/images/icons/bullet_toggle_plus.png";
    } else {
        objBox.src = contextPath + "/images/icons/bullet_toggle_minus.png";
    }

    var i = 1;
    while (document.getElementById(rangeName + i)) {
        var theDisplay = "";
        if (isHidden == true) {
            theDisplay = "none";
        } else if (top.Ext.isIE == true) {
            theDisplay = "inline";
        } else {
            theDisplay = "table-row";
        }
        document.getElementById(rangeName + i).style.display = theDisplay;
        i++;
    }
}
function doECClick(objBox, rangeName, contextPath) {    // just changes the value and pushes to the db
    if (driveValues)
        top.beginLoading();
    objBox.value = (objBox.value == 'HS: 0') ? 'HS: 1' : 'HS: 0';
    doECChange(objBox, rangeName, contextPath);
    // push to the database
    shouldChangeFocus = false;
    PCID(pTIV, 6, objBox.id, objBox.value);
}
function launchSelect_Target_Company(contextPath) {
    top.window.dialog.open('selectMyCompany', top.genericSpreadsheets_js_launchSelect_Target_Company_Window_Title, contextPath + '/launchSelectMyCompanyPopup.do', 750, 550, true, new PopupProps(null, true));
}
function launchSelect_Peers(contextPath) {
    top.window.dialog.open('selectPeers', top.genericSpreadsheets_js_launchSelect_Peers_Window_Title, contextPath + '/launchSelectPeersPopup.do', 750, 550, true, new top.window.popupProps(saveAndCloseCallback));
}
function launchCreate_Report_To_Email() {
    if (parent.launchCreateReport_Email){
        parent.launchCreateReport_Email();
    }else{
        launchCreateReport_Email();
    }    
}
function launchCreate_Report() {
    parent.launchCreate_Report();
}
function launchCurrency_Options() {
    parent.launchCurrency();
}
function launchTell_A_Friend() {
    parent.launchTellAFriend();
}
function launchRegistration() {
    parent.launchRegistration();
}
function launchRefresh() {
    setSubmitButtonClicked(true);
    pathToTabCalls.tabClicked(pathToTabCalls.tabList.selectedIndex);
}
function launchExit() {
    parent.logout();
}
function launchInvite_To_Collaborate(contextPage, emailAddress) {
    parent.launchInviteToCollaborate(emailAddress);
}
function launchJump_To_Sheet(contextPath, tabIndex) {
    //setSubmitButtonClicked(true); // Don't trigger a subtmit event on tab change
    parent.tabClicked(parseInt(tabIndex));
}
function launchPopup(row, col, contextPath, windowName, targetNamedRange) {
    openPopup(row, col, contextPath, windowName, targetNamedRange);
}
function launchExitToUrl(contextPath, url) {
    parent.launch_ExitToUrl(url);
}

function processImage(image, anchorElement, xOffSet, yOffSet, visible) {
    var anchorPos = findPos(anchorElement);
    image.style.top = anchorPos[1] + yOffSet;
    image.style.left = anchorPos[0] + xOffSet;
    image.style.visibility = visible;

    // Update visibility based on hidden row.
     if (anchorElement != null) {
         var row = anchorElement.parentNode;
         image.style.display = row.style.display;
     }

}

function findPos(obj) {
    var curleft = curtop = 0;

    // To determine the absolute position iterate through
    // the parents and sum up the locations (locations are relative based,
    // so the chilren are 0,0 to their parent and not the page.
    while (obj != null) {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
        obj = obj.offsetParent;
    }

    return [curleft,curtop];
}

function BulkCellValue (id, value) {
    this.id = id;
    this.value = value;
}  
