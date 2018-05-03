// Create alinean namespace for use in extending core YUI classes.
YAHOO.namespace("alinean"); 

// Alinean's custom YUI Slider widget
YAHOO.alinean.Slider = function(sElementId, sValueId, iStep, iDecimalPrecision, sGroup, oThumb, sType) {
    YAHOO.alinean.Slider.superclass.constructor.call(this, sElementId, sGroup, oThumb, sType);
    this.valueId = sValueId;
    this.subText = new Array();
    this.step = iStep;
    this.decimalPrecision = iDecimalPrecision;
    this.onInputChange = null;
}; 

YAHOO.lang.extend(YAHOO.alinean.Slider, YAHOO.widget.Slider);

YAHOO.alinean.Slider.getHorizSlider = function (sBGElId, sHandleElId, sValueId, iLeft, iRight, iTickSize, iDecimalPrecision) {
    return new YAHOO.alinean.Slider(sBGElId, sValueId, iTickSize, iDecimalPrecision, sBGElId, new YAHOO.widget.SliderThumb(sHandleElId, sBGElId, iLeft, iRight, 0, 0, iTickSize), "horiz");
};

YAHOO.alinean.Slider.prototype.setValueValidate = function(objText, newOffset, skipAnim, force) {
    if (window.inputValidator) {
        newOffset = inputValidator.normalizeForDB(new String(newOffset));
    }
    
    out = new String(newOffset);
    var invalid = false;
    
    if (isNaN(out)) {
        invalid = true;
    }
    
    if (invalid) {
        alert("The value entered is invalid.");
        window.tempObj = objText;
        setTimeout('window.tempObj.focus();', 1);
        setTimeout('window.tempObj.select();', 1);
        return this;
    }
    if (newOffset < this.thumb.initLeft) {
        alert("The value entered was below the minimum allowable value.");
        newOffset = this.thumb.initLeft;
    }
    
    if (newOffset > this.thumb.initRight) {
        alert("The value entered was above the maximum allowable value.");
        newOffset = this.thumb.initRight;
    }
    
    this.setValue(Math.round(newOffset), skipAnim, force);    
    objText.value = newOffset;
    if (typeof this.onInputChange == "function")
        this.onInputChange();
    
    if (window.inputValidator) {
        window.inputValidator.formatNormalizedNumberInFieldData(window.inputValidator.AS_NUMBER, objText, this.decimalPrecision)
    } else {
        var multiplyer = this.decimalPrecision * 10
        objText.value = (multiplyer < 10) ? Math.round(newOffset) : new Number(Math.round(newOffset * multiplyer) / multiplyer);
    }
    
    return this;
}

YAHOO.alinean.Slider.prototype.setSubText = function(text, minValue, maxValue) {
    this.subText.push(new YAHOO.alinean.SliderSubText(text, minValue, maxValue));
    return this;
}

YAHOO.alinean.SliderSubText = function(textValue, minValue, maxValue) {
    this.textVal = textValue;
    if (maxValue == undefined || maxValue == null) {
        this.index = minValue;
        this.minVal = 0;
        this.maxVal = 0;
        this.isRange = false;
    } else {
    this.index = 0;
    this.minVal = minValue;
    this.maxVal = maxValue;
    this.isRange = true;
}
};

YAHOO.alinean.SliderOnChange = function(obj) {
    var ref = (obj.step == undefined) ? this : obj;
    
    var adjVal = (ref.step != 0) ? ref.getValue() / ref.step : ref.getValue();
    
    YAHOO.util.Dom.get(ref.valueId).value = adjVal;
    if (window.inputValidator) {
        window.inputValidator.formatNormalizedNumberInFieldData(window.inputValidator.AS_NUMBER, YAHOO.util.Dom.get(ref.valueId), ref.decimalPrecision)
    }
    
    for (var i = 0; i < ref.subText.length; i++) {
        if (ref.subText[i].isRange == true) {
            if (adjVal >= ref.subText[i].minVal && adjVal <= ref.subText[i].maxVal) {
                YAHOO.util.Dom.get(ref.id + 'text').innerHTML = ref.subText[i].textVal;
                break;
            }
        } else {
        if (adjVal == ref.subText[i].index) {
            YAHOO.util.Dom.get(ref.id + 'text').innerHTML = ref.subText[i].textVal;
            break;
        }
    }
}
}