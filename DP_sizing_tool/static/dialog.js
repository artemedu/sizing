function AlineanDialog() { 
    var iOSIframeOptions = "";
    if (/(iPad|iPhone)/i.test(navigator.userAgent)) {
        iOSIframeOptions = "scrolling=\"no\" onresize=\"top.window.dialog.syncWindowSizeWithContent(this);\" onload=\"top.window.dialog.syncWindowSizeWithContent(this);\"";
    }
    var contextPath = (top.XcelLive && top.XcelLive.contextPath) ? top.XcelLive.contextPath : "";
    this.iframeBody = "<iframe " + iOSIframeOptions + " name=\"{0}ContentFrame\" id=\"{0}Content\" width=\"100%\" height=\"100%\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\" src=\"\"></iframe>";
    //<iframe frameborder="0" height="0" id=iframe1 marginheight="0" marginwidth="0" scrolling="no" width="100%" onload="this.style.height=iframe1.document.body.scrollHeight + 5;" src="/file.htm" ><iframe>
    this.winCache = new AlineanDialogWinCacheStack();
    this.HIDEABLE = 0;
    this.CLOSEABLE = 1;
}
AlineanDialog.prototype.resizeAndCenter = function(win, doResize, config) {
    var viewportHeight = 0;
    var viewportWidth = 0;
    var winHeight = 0; 
    var winWidth = 0; 
    
    try {
        if (doResize != false && !(/(iPad|iPhone)/i.test(navigator.userAgent))) {
            // Get viewport size
            if (typeof top.window.innerWidth != 'undefined') { // (mozilla/netscape/opera/IE7)
                viewportWidth = parseInt(top.window.innerWidth);
                viewportHeight = parseInt(top.window.innerHeight);
            } else if (typeof top.window.document.documentElement != 'undefined' && 
                typeof top.window.document.documentElement.clientWidth != 'undefined' &&
                top.window.document.documentElement.clientWidth != 0) { // IE6+
                viewportWidth = parseInt(top.window.document.documentElement.clientWidth);
                viewportHeight = parseInt(top.window.document.documentElement.clientHeight);
            } else { // older versions of IE
                viewportWidth = parseInt(top.window.document.getElementsByTagName('body')[0].clientWidth);
                viewportHeight = parseInt(top.window.document.getElementsByTagName('body')[0].clientHeight);
            }

            viewportWidth -= 20;
            viewportHeight -= 30;        
            winHeight = parseInt(win.getFrameHeight()) + parseInt(win.getInnerHeight());
            winWidth = parseInt(win.getFrameWidth()) + parseInt(win.getInnerWidth());   
            // Resize window if larger then viewport
            //var winEl = Ext.get(win.getId());
            if (winHeight > viewportHeight){
                win.setHeight(viewportHeight);
            } else{
                win.setHeight(config.height);
            } 
            if (winWidth > viewportWidth){
                win.setWidth(viewportWidth);
            } else{
                win.setWidth(config.width);
            }
                
        }
        
        // Center window
        win.center();
        if (/(iPad|iPhone)/i.test(navigator.userAgent) || win.getPosition()[1] < 5)
            win.setPosition(win.getPosition()[0], 15);
        win.show();

    } catch (e) {
        var errorString = top.dialog_js_errorString1 + ": " + e.name
        + ". " + top.dialog_js_errorString2 + ": " + e.description
        + ". " + top.dialog_js_errorString3 + ": " + e.number
        + ". " + top.dialog_js_errorString4 + ": " + e.message;
        alert(errorString);
    }
}
AlineanDialog.prototype.resize = function(width, height) {
    var winHeight = 0;
    var winWidth = 0;

    try {
        var win = this.winCache.getLast();

        winHeight = parseInt(win.getFrameHeight()) + parseInt(win.getInnerHeight());
        winWidth = parseInt(win.getFrameWidth()) + parseInt(win.getInnerWidth());

        if (winHeight > height)
            win.setHeight(height);
        if (winWidth > width)
            win.setWidth(width);

        // Center window
        win.center();
        win.show();

    } catch (e) {
        var errorString = top.dialog_js_errorString1 + ": " + e.name
        + ". " + top.dialog_js_errorString2 + ": " + e.description
        + ". " + top.dialog_js_errorString3 + ": " + e.number
        + ". " + top.dialog_js_errorString4 + ": " + e.message;
        alert(errorString);
    }
}
AlineanDialog.prototype.newConfig = function () {
    var config = new Object();
    config.plain = true;
    config.shadow = false;
    config.constrain = (/(iPad|iPhone)/i.test(navigator.userAgent)) ? false : true;
    config.collapsible = false;
    config.animCollapse = false;
    config.maximizable = false;
    config.autoWidth = false;
    config.autoHeight = false;
    // position:relative is necessary for IE.
    config.bodyStyle = 'position:relative;'; 
    
    //config.allowDomMove = true;
    config.bufferResize = true;
    return config;
}
AlineanDialog.prototype.newWindow = function (config, destroyOnHide) {
    config.destroyWinOnHide = (typeof destroyOnHide == "undefined") ? false : destroyOnHide;
    if (config.destroyWinOnHide) {
        config.closeAction = 'close';
    } else {
        config.closeAction = 'hide';
    }    
    
    var win;
    if (this.winCache.search(config.id) == null) {
        win = new Ext.Window(config);
        win.setDisabled(true);
        this.winCache.push(new AlineanDialogStackEntry(win.getId(), win)); 
    } else {
        win = this.winCache.search(config.id);
    }

    if (config.destroyWinOnHide) {
        win.on("hide", function(obj) { 
            if (obj.initialConfig.propObject != null && typeof obj.initialConfig.propObject == "object")
                obj.initialConfig.propObject.showConfirm = false; 
            obj.close(); 
        });
        win.on("beforeclose", this.onBeforeHideCloseFunction);
    } else {
        win.on("beforehide", this.onBeforeHideCloseFunction);
    }
    top.isPopup = true;
    //if (typeof console != 'undefined') console.debug("newWindow winCache: " + this.winCache.size());
    
    return win;
}    
AlineanDialog.prototype.onBeforeHideCloseFunction = function(obj) {  
    var returnVal = true;
    try {
        if (typeof obj == "object" && typeof obj.initialConfig == "object" && obj.initialConfig.propObject != null) {
            var propObject = obj.initialConfig.propObject;
            if (propObject.showConfirm == true) {
                if (!confirm(top.parent.parent.dialog_js_confirmMessage)) {
                    returnVal = false;
                } else {
                    propObject.showConfirm = false;
                }
            } else if (typeof propObject.callback == "function") {
                propObject.callback(obj);                
                returnVal = false;
            } else {
            //alert("Critical Error: propObject did not contain expected information.");
            }
        }       
    } catch (e) {
        var errorString = top.dialog_js_errorString1 + ": " + e.name
        + ". " + top.dialog_js_errorString2 + ": " + e.description
        + ". " + top.dialog_js_errorString3 + ": " + e.number
        + ". " + top.dialog_js_errorString4 + ": " + e.message;
        alert(errorString);
    } finally {
        if (returnVal && obj.initialConfig.destroyWinOnHide == true)
            window.dialog.winCache.search(obj.id, true);
        
        //if (typeof console != 'undefined') console.debug("onBeforeHideCloseFunction winCache: " + top.window.dialog.winCache.size());        
        
        if(top.Ext.isIE6){
            var bH = document.documentElement.clientHeight - 189;
            var bW = document.documentElement.clientWidth - 10;
            top.document.getElementById("content-middle").style.height = bH + "px";
            top.document.getElementById("content-middle").style.width = bW + "px";
        }        
        return returnVal;
    }
}
AlineanDialog.prototype.hideWhiteScreen = function() {    
    if (document.selection) {
        //document.selection.empty();          
   
        txtObject = document.selection.createRange();
        //txtObject.clear();
        //document.selection.empty();
        txtObject.text = txtObject.text;          
    }
}
AlineanDialog.prototype.open = function(id, title, url, width, height, modal, propObject, autoScroll, resizable) {
    var config = this.newConfig();
    config.id = id;
    config.width = width;
    config.height = height;
    config.title = title;
    config.modal = modal;
    config.autoScroll = (autoScroll == null || typeof autoScroll == "undefined") ? false : autoScroll;
    config.autoScroll = (/(iPad|iPhone)/i.test(navigator.userAgent)) ? false : config.autoScroll;
    config.resizable = (resizable == null || typeof resizable == "undefined") ? true : resizable;
    config.html = String.format(this.iframeBody, id);         
    //config.animateTarget = "menubar";
    config.propObject = (propObject == null || typeof propObject == "undefined") ? null : propObject;
    var win = this.newWindow(config, true);
    
    if (typeof top.beginLoading == 'function')
        top.beginLoading();
        
    //win.on("resize", function(obj) { top.Ext.get(id+'Content').setHeight(obj.body.getHeight()-30); if(console) console.log('body height: '+obj.body.getHeight()); });
    
    // When win is shown, tell iframe to load the given url.
    win.on("beforeshow", function(obj) {
        Ext.get(id+'Content').dom.src = url;
    }, win);
    win.on("show", function(obj) {
        obj.setDisabled(false);
    }, win);
    win.on("destroy", this.hideWhiteScreen, win);
    win.show();
    this.resizeAndCenter(win, config.resizable, config);
    return win;
}
AlineanDialog.prototype.openHtml = function(id, title, html, width, height, modal, propObject, target, maximizable, autoScroll) {
    
    var config = this.newConfig();
    config.id = id;
    config.width = width;
    config.height = height;
    config.title = title;
    config.modal = modal;
    config.html = html;
    config.autoScroll = (autoScroll == null || typeof autoScroll == "undefined") ? false : autoScroll;
    config.autoScroll = (/(iPad|iPhone)/i.test(navigator.userAgent)) ? false : config.autoScroll;
    //config.animateTarget = target;
    //config.maximizable = (maximizable == true);
   
    var win = this.newWindow(config, false);

    win.on("show", function(obj) {
        obj.setDisabled(false);
    }, win);    
    win.on("destroy", this.hideWhiteScreen, win);
    win.show(); 
    this.resizeAndCenter(win, false, config);
    
    return win;
}
AlineanDialog.prototype.close = function(id) {    
    var win = null;
    //debugger;
    if (typeof id != "undefined" && typeof this.getById(id) == "object") {
        win = this.getById(id);
    } else if (this.winCache.search(id) != null) {
        win = this.winCache.search(id);
    } else if (this.winCache.getLast() != null) {
        win = this.winCache.getLast();
    }     
    if (win == null) {
        this.closeAll();
    } else {        
        if (win.initialConfig.destroyWinOnHide) {
            if (win.initialConfig.propObject != null)
                win.initialConfig.propObject.showConfirm = false;
            this.winCache.search(win.id, true);
            //win.suspendEvents();
            win.on("beforeclose", function() {}, win);    
            win.on("beforehide", function() {}, win);
            win.destroy();            
        } else { 
            win.hide();
        }
    }
    top.window.windowReloaderProps = null;
    top.window.document.getElementById('popupDialogs').innerHTML = '';
//if (typeof console != 'undefined') console.debug("close winCache: " + this.winCache.size());
}
AlineanDialog.prototype.changeTitle = function(newValue) {
    var win = null;
    win = this.winCache.getLast();
    win.setTitle(newValue);
}
AlineanDialog.prototype.syncWindowSizeWithContent = function(content) {
    if (top.window.frames[content.name].frames[0].frameElement) {
        top.window.frames[content.name].frames[0].frameElement.onload = function() {
            this.contentWindow.parent.scrolling = "no";
            this.scrolling = "no";
            var win = top.window.dialog.winCache.getLast();
            
            var windowIframe = $(content);
            var contentIframe = $(content).contents().find('#content');
      
            // Determine width of widest element
            var contentWidth = 0;
            contentIframe.contents().find("*:not(script,link,style)").each(function(index,value) { 
                try {
                    contentWidth = Math.max($(this).outerWidth(true), contentWidth);
                } catch(err) {
                // Ignore
                }
            });
            
            // Set content iframe width/height based on it's visible contents
            contentIframe.width(contentWidth);
            contentIframe.height(contentIframe.contents().find('body').outerHeight(true));
            
            // Reposition footer elements
            var contentMiddle = windowIframe.contents().find('#content-middle');
            contentMiddle.height(contentIframe.outerHeight(true));
            contentMiddle.width(contentIframe.outerWidth(true));
            var footerTop = contentMiddle.position().top + contentMiddle.height();
            if (windowIframe.contents().find('#buttonbar').is(":visible")) {
                footerTop = footerTop + 40;
            }
            windowIframe.contents().find('#backNext').css('top', footerTop + 10);
            windowIframe.contents().find('#saveClose').css('top', footerTop + 10);
            windowIframe.contents().find('#footer').css('top', footerTop);
            //debugger;
            
            // Reset dialog iframe width/height
            windowIframe.width(contentIframe.outerWidth(true) + contentMiddle.position().left);
            windowIframe.height(footerTop + windowIframe.contents().find('#footer').outerHeight(true));
           
            // Set dialog width/height based on window iframe
            win.setWidth(windowIframe.outerWidth(true) + 16);
            win.setHeight(windowIframe.outerHeight(true) + 34);
            
        }
    }
}
AlineanDialog.prototype.closeAll = function() {
    Ext.WindowMgr.hideAll();
}
AlineanDialog.prototype.bringToFront = function(id) {
    Ext.WindowMgr.bringToFront(id);
}
AlineanDialog.prototype.sendToBack = function(id) {
    Ext.WindowMgr.sendToBack(id);
}
AlineanDialog.prototype.getById = function(id) {
    return Ext.WindowMgr.get(id);   
}
function PopupProps(callback, showConfirm) {
    this.callback = callback || undefined;
    this.showConfirm = showConfirm || false;
    this.overrideSaveCloseClick = false;
    this.reloadAnalysis = false;
    this.reloadOpener = false;
}
function AlineanDialogStackEntry(k,v) {
    this.key = k;
    this.value = v;
}
function AlineanDialogWinCacheStack() {
    this.stack = new Array();
}
AlineanDialogWinCacheStack.prototype.clearHiddenCache = function() {
    var stackSplice = [];
    // destroy hideable windows
    for (var i = 0; i < this.stack.length; i++) {
        if (this.stack[i] != null && typeof this.stack[i].value == "object" && 
            !this.stack[i].value.initialConfig.destroyWinOnHide) {
            this.stack[i].value.on("hide", function() {}, this.stack[i].value); 
            this.stack[i].value.on("beforeclose", function() {}, this.stack[i].value);    
            this.stack[i].value.on("beforehide", function() {}, this.stack[i].value);
            this.stack[i].value.destroy();
            stackSplice.push(i);
        }    
    }
    // remove hideable windows from stack
    var modifier = 0;
    for (var j = 0; j < stackSplice.length; j++) {
        this.stack.splice(stackSplice[j-modifier],1);
        modifier++;
    }
//if (typeof console != 'undefined') console.debug("clearHiddenCache winCache: " + top.window.dialog.winCache.size());
}
AlineanDialogWinCacheStack.prototype.search = function(id, remove) {
    var returnVal = null;
    for (var i = 0; i < this.stack.length; i++) {
        if (typeof this.stack[i] == "object" && this.stack[i].key == id) {
            returnVal = this.stack[i].value;
            if (remove == true)
                this.stack.splice(i,1);
            break;
        }
    }
    return returnVal;
}
AlineanDialogWinCacheStack.prototype.push = function(entry) {
    this.stack.push(entry);
}
AlineanDialogWinCacheStack.prototype.getLast = function() {
    var returnVal = null;
    if (this.stack.length > 0) {
        for (var i = this.stack.length-1; i >=0; i--) {
            if (this.stack[i].value.initialConfig.destroyWinOnHide) {
                returnVal = this.stack[i].value;
                break;
            }
        }
    }
    return returnVal;
}
AlineanDialogWinCacheStack.prototype.size = function() {
    return this.stack.length;
}
Ext.onReady(function() {
    var rootwin = findRootWindow(top.window.self);
    if (typeof rootwin.dialog == "undefined") { 
        rootwin.dialog = new AlineanDialog();
    }
    window.dialog = rootwin.dialog;
    if (typeof rootwin.popupProps == "undefined") { 
        rootwin.popupProps = PopupProps;
    }
    window.popupProps = rootwin.popupProps;
});
