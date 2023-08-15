// some globals for all Vue components to directly use the moqui object (for methods, constants, etc) and the window object
Vue.prototype.moqui = moqui;
// Vue.prototype.moment = moment;
Vue.prototype.window = window;


/* ========== notify and error handling ========== */
moqui.notifyOpts = { timeout:1500, type:'positive' };
moqui.notifyOptsInfo = { timeout:5000, type:'info' };
moqui.notifyOptsError = { timeout:15000, type:'negative' };
moqui.notifyMessages = function(messages, errors, validationErrors) {
    var notified = false;
    if (messages) {
        if (moqui.isArray(messages)) {
            for (var mi=0; mi < messages.length; mi++) {
                var messageItem = messages[mi];
                if (moqui.isPlainObject(messageItem)) {
                    var msgType = moqui.getQuasarColor(messageItem.type);
                    if (!msgType || !msgType.length) msgType = 'info';
                    // moqui.webrootVue.$q.notify($.extend({}, moqui.notifyOptsInfo, { type:msgType, message:messageItem.message }));
                    // moqui.webrootVue.addNotify(messageItem.message, msgType);
                } else {
                    // moqui.webrootVue.$q.notify($.extend({}, moqui.notifyOptsInfo, { message:messageItem }));
                    // moqui.webrootVue.addNotify(messageItem, 'info');
                }
                notified = true;
            }
        } else {
            // moqui.webrootVue.$q.notify($.extend({}, moqui.notifyOptsInfo, { message:messages }));
            // moqui.webrootVue.addNotify(messages, 'info');
            // notified = true;
        }
    }
    if (errors) {
        if (moqui.isArray(errors)) {
            for (var ei=0; ei < errors.length; ei++) {
                // moqui.webrootVue.$q.notify($.extend({}, moqui.notifyOptsError, { message:errors[ei] }));
                // moqui.webrootVue.addNotify(errors[ei], 'negative');
                notified = true;
            }
        } else {
            // moqui.webrootVue.$q.notify($.extend({}, moqui.notifyOptsError, { message:errors }));
            // moqui.webrootVue.addNotify(errors, 'negative');
            notified = true;
        }
    }
    if (validationErrors) {
        if (moqui.isArray(validationErrors)) {
            for (var vei=0; vei < validationErrors.length; vei++) { moqui.notifyValidationError(validationErrors[vei]); notified = true; }
        } else { moqui.notifyValidationError(validationErrors); notified = true; }
    }
    return notified;
};
moqui.handleLoadError = function (jqXHR, textStatus, errorThrown) {
    if (textStatus === 'abort') {
        console.warn('load aborted: ' + textStatus + ' (' + jqXHR.status + '), message ' + errorThrown);
        return;
    }
    // moqui.webrootVue.loading = 0;
    moqui.handleAjaxError(jqXHR, textStatus, errorThrown);
};
moqui.handleAjaxError = function(jqXHR, textStatus, errorThrown, responseText) {
    var resp;
    if (responseText) {
        resp = responseText;
    } else if (jqXHR.responseType === 'blob') {
        var reader = new FileReader();
        reader.onload = function(evt) {
            var bodyText = evt.target.result;
            moqui.handleAjaxError(jqXHR, textStatus, errorThrown, bodyText);
        };
        reader.readAsText(jqXHR.response);
        return;
    } else {
        resp = jqXHR.responseText;
    }

    var respObj;
    try { respObj = JSON.parse(resp); } catch (e) { /* ignore error, don't always expect it to be JSON */ }
    console.warn('ajax ' + textStatus + ' (' + jqXHR.status + '), message ' + errorThrown /*+ '; response: ' + resp*/);
    // console.error('resp [' + resp + '] respObj: ' + JSON.stringify(respObj));
    var notified = false;
    if (jqXHR.status === 401) {
        notified = moqui.notifyMessages(null, "No user authenticated");
    } else {
        if (respObj && moqui.isPlainObject(respObj)) {
            notified = moqui.notifyMessages(respObj.messageInfos, respObj.errors, respObj.validationErrors);
        } else if (resp && moqui.isString(resp) && resp.length) {
            notified = moqui.notifyMessages(resp);
        }
    }

    // reload on 401 (Unauthorized) so server can remember current URL and redirect to login screen, or show re-login dialog to maintain the client app context
    if (jqXHR.status === 401) {
        if (moqui.webrootVue && moqui.webrootVue.reLoginCheckShow) {
            // window.location.href = moqui.webrootVue.currentLinkUrl;
            // instead of reloading the web page, show the Re-Login dialog
            // moqui.webrootVue.reLoginCheckShow();
            console.log('99')
        } else {
            window.location.reload(true);
        }
    } else if (jqXHR.status === 0) {
        if (errorThrown.indexOf('abort') < 0) {
            var msg = 'Could not connect to server';
            // moqui.webrootVue.$q.notify($.extend({}, moqui.notifyOptsError, { message:msg }));
            // moqui.webrootVue.addNotify(msg, 'negative');
            console.log('108')
        }
    } else {
        if (moqui.webrootVue && moqui.webrootVue.getCsrfToken) {
            // update the moqui session token if it has changed
            // moqui.webrootVue.getCsrfToken(jqXHR);
            console.log('114')
        }
        if (!notified) {
            var errMsg = 'Error: ' + errorThrown + ' (' + textStatus + ')';
            // moqui.webrootVue.$q.notify($.extend({}, moqui.notifyOptsError, { message:errMsg }));
            // moqui.webrootVue.addNotify(errMsg, 'negative');
            console.log('120')
        }
    }
};

moqui.checkboxSetMixin = {
    // NOTE: checkboxCount is used to init the checkbox state array, defaults to 100 and must be greater than or equal to the actual number of checkboxes (not including the All checkbox)
    props: { checkboxCount:{type:Number,'default':100}, checkboxParameter:String, checkboxListMode:Boolean, checkboxValues:Array },
    data: function() {
        var checkboxStates = [];
        for (var i = 0; i < this.checkboxCount; i++) checkboxStates[i] = false;
        return { checkboxAllState:false, checkboxStates:checkboxStates }
    },
    methods: {
        setCheckboxAllState: function(newState) {
            this.checkboxAllState = newState;
            var csSize = this.checkboxStates.length;
            for (var i = 0; i < csSize; i++) this.checkboxStates[i] = newState;
        },
        getCheckboxValueArray: function() {
            if (!this.checkboxValues) return [];
            var valueArray = [];
            var csSize = this.checkboxStates.length;
            for (var i = 0; i < csSize; i++) if (this.checkboxStates[i] && this.checkboxValues[i]) valueArray.push(this.checkboxValues[i]);
            return valueArray;
        },
        addCheckboxParameters: function(formData, parameter, listMode) {
            var parmName = parameter || this.checkboxParameter;
            var useList = (listMode !== null && listMode !== undefined && listMode) ? listMode : this.checkboxListMode;
            // NOTE: formData must be a FormData object, or at least have a set(name, value) method
            var valueArray = this.getCheckboxValueArray();
            if (!valueArray.length) return false;
            if (useList) {
                formData.set(parmName, valueArray.join(','));
            } else {
                for (var i = 0; i < valueArray.length; i++)
                    formData.set(parmName + '_' + i, valueArray[i]);
                formData.set('_isMulti', 'true');
            }
            return true;
        }
    },
    watch: {
        checkboxStates: { deep:true, handler:function(newArray) {
                var allTrue = true;
                for (var i = 0; i < newArray.length; i++) {
                    var curState = newArray[i];
                    if (!curState) allTrue = false;
                    if (!allTrue) break;
                }
                this.checkboxAllState = allTrue;
            } }
    }
}

Vue.component('m-form', {
    name: "mForm",
    mixins:[moqui.checkboxSetMixin],
    props: { fieldsInitial:Object, action:{type:String,required:true}, method:{type:String,'default':'POST'},
        submitMessage:String, submitReloadId:String, submitHideId:String, focusField:String, noValidate:Boolean,
        excludeEmptyFields:Boolean, parentCheckboxSet:Object },
    data: function() { return { fields:Object.assign({}, this.fieldsInitial), fieldsChanged:{}, buttonClicked:null }},
    // NOTE: <slot v-bind:fields="fields"> also requires prefix from caller, using <m-form v-slot:default="formProps"> in qvt.ftl macro
    // see https://vuejs.org/v2/guide/components-slots.html
    template:
        '<q-form ref="qForm" @submit.prevent="submitForm" @reset.prevent="resetForm" autocapitalize="off" autocomplete="off">' +
        '<slot :fields="fields" :checkboxAllState="checkboxAllState" :setCheckboxAllState="setCheckboxAllState"' +
        ' :checkboxStates="checkboxStates" :addCheckboxParameters="addCheckboxParameters"></slot>' +
        '</q-form>',
    methods: {
        submitForm: function() {
            if (this.noValidate) {
                this.submitGo();
            } else {
                var jqEl = $(this.$el);
                var vm = this;
                this.$refs.qForm.validate().then(function(success) {
                    if (success) {
                        vm.submitGo();
                    } else {
                        /*
                        // For convenience, attempt to focus the first invalid element.
                        // Begin by finding the first invalid input
                        var invEle = jqEl.find('div.has-error input, div.has-error select, div.has-error textarea').first();
                        if (invEle.length) {
                            // TODO remove this or change to handle Quasar flavor of accordian/panel
                            // If the element is inside a collapsed panel, attempt to open it.
                            // Find parent (if it exists) with class .panel-collapse.collapse (works for accordion and regular panels)
                            var nearestPanel = invEle.parents('div.panel-collapse.collapse').last();
                            if (nearestPanel.length) {
                                // Only bother if the panel is not currently open
                                if (!nearestPanel.hasClass('in')) {
                                    // From there find sibling with class panel-heading
                                    var panelHeader = nearestPanel.prevAll('div.panel-heading').last();
                                    if (panelHeader.length) {
                                        // Here is where accordion and regular panels diverge.
                                        var panelLink = panelHeader.find('a[data-toggle="collapse"]').first();
                                        if (panelLink.length) panelLink.click();
                                        else panelHeader.click();
                                        setTimeout(function() { invEle.focus(); }, 250);
                                    } else invEle.focus();
                                } else invEle.focus();
                            } else invEle.focus();
                        }
                        */
                    }
                })
            }
        },
        resetForm: function() {
            this.fields = Object.assign({}, this.fieldsInitial);
            this.fieldsChanged = {};
        },
        submitGo: function() {
            var vm = this;
            var jqEl = $(this.$el);
            // get button pressed value and disable ASAP to avoid double submit
            var btnName = null, btnValue = null;
            var $btn = $(this.buttonClicked || document.activeElement);
            if ($btn.length && jqEl.has($btn) && $btn.is('button[type="submit"], input[type="submit"], input[type="image"]')) {
                if ($btn.is('[name]')) { btnName = $btn.attr('name'); btnValue = $btn.val(); }
                $btn.prop('disabled', true);
                setTimeout(function() { $btn.prop('disabled', false); }, 3000);
            }
            var formData = Object.keys(this.fields).length ? new FormData() : new FormData(this.$refs.qForm.$el);
            $.each(this.fields, function(key, value) {
                if (moqui.isArray(value)) {
                    value.forEach(function(v) {formData.append(key, v);});
                } else { formData.set(key, value || ""); }
            });

            var fieldsToRemove = [];
            // NOTE: using iterator directly to avoid using 'for of' which requires more recent ES version (for minify, browser compatibility)
            var formDataIterator = formData.entries()[Symbol.iterator]();
            while (true) {
                var iterEntry = formDataIterator.next();
                if (iterEntry.done) break;
                var pair = iterEntry.value;
                var fieldName = pair[0];
                var fieldValue = pair[1];
                // NOTE: this shouldn't happen as when not getting from FormData q-input with mask should have null value when empty, but just in case skip String values that are unfilled masks
                // NOTE: with q-input mask place holder is underscore, look for 2; this will cause issues if a valid user input starts with 2 underscores, may need better approach here and in m-form-link
                if (moqui.isString(fieldValue) && fieldValue.startsWith("__")) {
                    // instead of delete set to empty string, otherwise can't clear masked fields: formData["delete"](fieldName);
                    formData.set(fieldName, "");
                }
                if (this.excludeEmptyFields && (!fieldValue || !fieldValue.length)) fieldsToRemove.push(fieldName);
            }
            for (var ftrIdx = 0; ftrIdx < fieldsToRemove.length; ftrIdx++) formData['delete'](fieldsToRemove[ftrIdx]);

            formData.set('moquiSessionToken', this.$root.moquiSessionToken);
            if (btnName) { formData.set(btnName, btnValue); }

            // add ID parameters for selected rows, add _isMulti=true
            if (this.parentCheckboxSet && this.parentCheckboxSet.addCheckboxParameters) {
                var addedParms = this.parentCheckboxSet.addCheckboxParameters(formData);
                // TODO: if no addedParms should this blow up or just wait for the server for a missing parameter?
                // maybe best to leave it to the server, some forms might make sense without any rows selected...
            }

            // console.info('m-form parameters ' + JSON.stringify(formData));
            // for (var key of formData.keys()) { console.log('m-form key ' + key + ' val ' + JSON.stringify(formData.get(key))); }
            this.$root.loading++;

            /* this didn't work, JS console error: Failed to execute 'createObjectURL' on 'URL': Overload resolution failed
            $.ajax({ type:this.method, url:(this.$root.appRootPath + this.action), data:formData, contentType:false, processData:false, dataType:'text',
                xhrFields:{responseType:'blob'}, headers:{Accept:'application/json'}, error:moqui.handleLoadError, success:this.handleResponse });
             */

            var xhr = new XMLHttpRequest();
            xhr.open(this.method, (this.$root.appRootPath + this.action), true);
            xhr.responseType = 'blob';
            xhr.withCredentials = true;
            xhr.onload = function () {
                if (this.status === 200) {
                    // decrement loading counter
                    vm.$root.loading--;

                    var disposition = xhr.getResponseHeader('Content-Disposition');
                    if (disposition && (disposition.indexOf('attachment') !== -1 || disposition.indexOf('inline') !== -1)) {
                        // download code here thanks to Jonathan Amend, see: https://stackoverflow.com/questions/16086162/handle-file-download-from-ajax-post/23797348#23797348
                        var blob = this.response;
                        var filename = "";
                        if (disposition && disposition.indexOf('attachment') !== -1) {
                            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                            var matches = filenameRegex.exec(disposition);
                            if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                        }

                        if (typeof window.navigator.msSaveBlob !== 'undefined') {
                            window.navigator.msSaveBlob(blob, filename);
                        } else {
                            var URL = window.URL || window.webkitURL;
                            var downloadUrl = URL.createObjectURL(blob);

                            if (filename) {
                                var a = document.createElement("a");
                                if (typeof a.download === 'undefined') {
                                    window.location.href = downloadUrl;
                                } else {
                                    a.href = downloadUrl;
                                    a.download = filename;
                                    document.body.appendChild(a);
                                    a.click();
                                }
                            } else {
                                window.location.href = downloadUrl;
                            }

                            setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
                        }
                    } else {
                        var reader = new FileReader();
                        reader.onload = function(evt) {
                            var bodyText = evt.target.result;
                            try {
                                vm.handleResponse(JSON.parse(bodyText));
                            } catch(e) {
                                vm.handleResponse(bodyText);
                            }

                        };
                        reader.readAsText(this.response);
                    }
                } else {
                    moqui.handleLoadError(this, this.statusText, "");
                }
            };
            xhr.setRequestHeader('Accept', 'application/json');
            console.log(this.$root.appRootPath);
            console.log(this.action)
            xhr.send(formData);
        },
        handleResponse: function(resp) {
            var notified = false;
            // console.info('m-form response ' + JSON.stringify(resp));
            if (resp && moqui.isPlainObject(resp)) {
                notified = moqui.notifyMessages(resp.messageInfos, resp.errors);
                if (resp.screenUrl && resp.screenUrl.length > 0) { this.$root.setUrl(resp.screenUrl); }
                else if (resp.redirectUrl && resp.redirectUrl.length > 0) { window.location.href = resp.redirectUrl; }
            } else { console.warn('m-form no response or non-JSON response: ' + JSON.stringify(resp)) }
            var hideId = this.submitHideId; if (hideId && hideId.length > 0) { this.$root.hideContainer(hideId); }
            var reloadId = this.submitReloadId; if (reloadId && reloadId.length > 0) { this.$root.reloadContainer(reloadId); }
            var subMsg = this.submitMessage;
            if (subMsg && subMsg.length) {
                var responseText = resp; // this is set for backward compatibility in case message relies on responseText as in old JS
                var message = eval('"' + subMsg + '"');
                // moqui.webrootVue.$q.notify($.extend({}, moqui.notifyOpts, { message:message }));
                // moqui.webrootVue.addNotify(message, 'success');
            } else if (!notified) {
                // moqui.webrootVue.$q.notify($.extend({}, moqui.notifyOpts, { message:"Submit successful" }));
            }
        }
        /* TODO
        fieldChange: function (evt) {
            var targetDom = evt.delegateTarget; var targetEl = $(targetDom);
            if (targetEl.hasClass("input-group") && targetEl.children("input").length) {
                // special case for date-time using bootstrap-datetimepicker
                targetEl = targetEl.children("input").first();
                targetDom = targetEl.get(0);
            }
            var changed = false;
            if (targetDom.nodeName === "INPUT" || targetDom.nodeName === "TEXTAREA") {
                if (targetEl.attr("type") === "radio" || targetEl.attr("type") === "checkbox") {
                    changed = targetDom.checked !== targetDom.defaultChecked; }
                else { changed = targetDom.value !== targetDom.defaultValue; }
            } else if (targetDom.nodeName === "SELECT") {
                if (targetDom.multiple) {
                    var optLen = targetDom.options.length;
                    for (var i = 0; i < optLen; i++) {
                        var opt = targetDom.options[i];
                        if (opt.selected !== opt.defaultSelected) { changed = true; break; }
                    }
                } else {
                    changed = !targetDom.options[targetDom.selectedIndex].defaultSelected;
                }
            }
            // console.log("changed? " + changed + " node " + targetDom.nodeName + " type " + targetEl.attr("type") + " " + targetEl.attr("name") + " to " + targetDom.value + " default " + targetDom.defaultValue);
            // console.log(targetDom.defaultValue);
            if (changed) {
                this.fieldsChanged[targetEl.attr("name")] = true;
                targetEl.parents(".form-group").children("label").addClass("is-changed");
                targetEl.parents(".form-group").find(".select2-selection").addClass("is-changed");
                targetEl.addClass("is-changed");
            } else {
                this.fieldsChanged[targetEl.attr("name")] = false;
                targetEl.parents(".form-group").children("label").removeClass("is-changed");
                targetEl.parents(".form-group").find(".select2-selection").removeClass("is-changed");
                targetEl.removeClass("is-changed");
            }
        }
         */
    },
    mounted: function() {
        var vm = this;
        var jqEl = $(this.$el);
        if (this.focusField && this.focusField.length) jqEl.find('[name^="' + this.focusField + '"]').addClass('default-focus').focus();

        /* TODO: should not need to watch input fields any more
        // watch changed fields
        jqEl.find(':input').on('change', this.fieldChange);
        // special case for date-time using bootstrap-datetimepicker
        jqEl.find('div.input-group.date').on('change', this.fieldChange);
        */
        // TODO: find other way to get button clicked (Vue event?)
        // watch button clicked
        jqEl.find('button[type="submit"], input[type="submit"], input[type="image"]').on('click', function() { vm.buttonClicked = this; });
    }
});

Vue.component('m-text-line', {
    name: "mTextLine",
    props: { value:String, type:{type:String,'default':'text'}, id:String, name:String, size:String, fields:{type:Object},
        label:String, tooltip:String, prefix:String, disable:Boolean, mask:String, fillMask:String, reverseFillMask:Boolean, rules:Array,
        defaultUrl:String, defaultParameters:Object, dependsOn:Object, dependsOptional:Boolean, defaultLoadInit:Boolean },
    data: function() { return { loading:false } },
    template:
        '<q-input dense outlined stack-label :label="label" :prefix="prefix" v-bind:value="value" v-on:input="$emit(\'input\', $event)" :type="type"' +
        ' :id="id" :name="name" :size="size" :loading="loading" :rules="rules" :disable="disable"' +
        ' :mask="mask" :fill-mask="fillMask" :reverse-fill-mask="reverseFillMask"' +
        ' autocapitalize="off" autocomplete="off">' +
        '<q-tooltip v-if="tooltip">{{tooltip}}</q-tooltip>' +
        '</q-input>',
    methods: {
        serverData: function() {
            var hasAllParms = true;
            var dependsOnMap = this.dependsOn;
            var parmMap = this.defaultParameters;
            var reqData = { moquiSessionToken: this.$root.moquiSessionToken };
            for (var parmName in parmMap) { if (parmMap.hasOwnProperty(parmName)) reqData[parmName] = parmMap[parmName]; }
            for (var doParm in dependsOnMap) { if (dependsOnMap.hasOwnProperty(doParm)) {
                var doValue;
                if (this.fields) {
                    doValue = this.fields[dependsOnMap[doParm]];
                } else {
                    var doParmJqEl = $('#' + dependsOnMap[doParm]);
                    doValue = doParmJqEl.val();
                    if (!doValue) doValue = doParmJqEl.find('select').val();
                }
                if (!doValue) { hasAllParms = false; } else { reqData[doParm] = doValue; }
            }}
            reqData.hasAllParms = hasAllParms;
            return reqData;
        },
        populateFromUrl: function(params) {
            var reqData = this.serverData(params);
            // console.log("m-text-line populateFromUrl 1 " + this.defaultUrl + " reqData.hasAllParms " + reqData.hasAllParms + " dependsOptional " + this.dependsOptional);
            // console.log(reqData);
            if (!this.defaultUrl || !this.defaultUrl.length) {
                console.warn("In m-text-line tried to populateFromUrl but no defaultUrl");
                return;
            }
            if (!reqData.hasAllParms && !this.dependsOptional) {
                console.warn("In m-text-line tried to populateFromUrl but not hasAllParms and not dependsOptional");
                return;
            }
            var vm = this;
            this.loading = true;
            $.ajax({ type:"POST", url:this.defaultUrl, data:reqData, dataType:"text",
                error:function(jqXHR, textStatus, errorThrown) {
                    vm.loading = false;
                    moqui.handleAjaxError(jqXHR, textStatus, errorThrown);
                },
                success: function(defaultText) {
                    vm.loading = false;
                    if (defaultText && defaultText.length) vm.$emit('input', defaultText);
                }
            });
        }
    },
    mounted: function() {
        if (this.defaultUrl && this.defaultUrl.length) {
            var dependsOnMap = this.dependsOn;
            for (var doParm in dependsOnMap) { if (dependsOnMap.hasOwnProperty(doParm)) {
                if (this.fields) {
                    this.$watch('fields.' + doParm, function() { this.populateFromUrl({term:this.value}); });
                } else {
                    // TODO: if no fields passed, use some sort of DOM-based value like jQuery val()?
                }
            } }
            // do initial populate if not a serverSearch or for serverSearch if we have an initial value do the search so we don't display the ID
            if (this.defaultLoadInit) { this.populateFromUrl(); }
        }
    }
});

// moqui.webrootVue =
moqui.webrootVue = new Vue({
    el: '#apps-root',
    data: {
        basePath:"", linkBasePath:"", currentPathList:[], extraPathList:[], currentParameters:{}, bodyParameters:null,
        activeSubscreens:[], navMenuList:[], navHistoryList:[], navPlugins:[], accountPlugins:[], notifyHistoryList:[],
        lastNavTime:Date.now(), loading:0, currentLoadRequest:null, activeContainers:{}, urlListeners:[],
        moquiSessionToken:"", appHost:"", appRootPath:"", userId:"", username:"", locale:"en",
        reLoginShow:false, reLoginPassword:null, reLoginMfaData:null, reLoginOtp:null,
        notificationClient:null, sessionTokenBc:null, qzVue:null, leftOpen:false, moqui:moqui },
    methods: {
        setUrl: function (url, bodyParameters, onComplete) {
            // cancel current load if needed
            if (this.currentLoadRequest) {
                console.log("Aborting current page load currentLinkUrl " + this.currentLinkUrl + " url " + url);
                this.currentLoadRequest.abort();
                this.currentLoadRequest = null;
                this.loading = 0;
            }
            // always set bodyParameters, setting to null when not specified to clear out previous
            this.bodyParameters = bodyParameters;
            url = this.getLinkPath(url);
            console.info('setting url ' + url + ', cur ' + this.currentLinkUrl);
            if (this.currentLinkUrl === url && url !== this.linkBasePath) {
                this.reloadSubscreens(); /* console.info('reloading, same url ' + url); */
                if (onComplete) this.callOnComplete(onComplete, this.currentPath);
            } else {
                var redirectedFrom = this.currentPath;
                var urlInfo = moqui.parseHref(url);
                // clear out extra path, to be set from nav menu data if needed
                this.extraPathList = [];
                // set currentSearch before currentPath so that it is available when path updates
                this.currentSearch = urlInfo.search;
                this.currentPath = urlInfo.path;
                // with url cleaned up through setters now get current screen url for menu
                var srch = this.currentSearch;
                var screenUrl = this.currentPath + (srch.length > 0 ? '?' + srch : '');
                if (!screenUrl || screenUrl.length === 0) return;
                console.info("Current URL changing to " + screenUrl);
                this.lastNavTime = Date.now();
                // TODO: somehow only clear out activeContainers that are in subscreens actually reloaded? may cause issues if any but last screen have m-dynamic-container
                this.activeContainers = {};

                // update menu, which triggers update of screen/subscreen components
                var vm = this;
                var menuDataUrl = this.appRootPath && this.appRootPath.length && screenUrl.indexOf(this.appRootPath) === 0 ?
                    this.appRootPath + "/menuData" + screenUrl.slice(this.appRootPath.length) : "/menuData" + screenUrl;
                // $.ajax({
                //     type: "GET",
                //     url: menuDataUrl,
                //     dataType: "text",
                //     error: moqui.handleAjaxError,
                //     success: function (outerListText) {
                //         var outerList = null;
                //         // console.log("menu response " + outerListText);
                //         try {
                //             outerList = JSON.parse(outerListText);
                //         } catch (e) {
                //             console.info("Error parson menu list JSON: " + e);
                //         }
                //         if (outerList && moqui.isArray(outerList)) {
                //             vm.navMenuList = outerList;
                //             if (onComplete) vm.callOnComplete(onComplete, redirectedFrom);
                //             /* console.info('navMenuList ' + JSON.stringify(outerList)); */
                //         }
                //     }
                // });

                // set the window URL
                window.history.pushState(null, this.ScreenTitle, url);
                // notify url listeners
                this.urlListeners.forEach(function (callback) {
                    callback(url, this)
                }, this);
                // scroll to top
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }
        },
        getLinkPath: function(path) {
            if (moqui.isPlainObject(path)) path = moqui.makeHref(path);
            if (this.appRootPath && this.appRootPath.length && path.indexOf(this.appRootPath) !== 0) path = this.appRootPath + path;
            var pathList = path.split('/');
            // element 0 in array after split is empty string from leading '/'
            var wrapperIdx = this.appRootPath.split('/').length;
            // appRootPath is '/moqui/v1' or '/moqui'. wrapper means 'qapps'
            pathList[wrapperIdx] = this.linkBasePath.split('/').slice(-1);
            path = pathList.join("/");
            return path;
        },

    },
    computed: {
        currentPath: {
            get: function() { var curPath = this.currentPathList; var extraPath = this.extraPathList;
                return this.basePath + (curPath && curPath.length > 0 ? '/' + curPath.join('/') : '') +
                    (extraPath && extraPath.length > 0 ? '/' + extraPath.join('/') : ''); },
            set: function(newPath) {
                if (!newPath || newPath.length === 0) { this.currentPathList = []; return; }
                if (newPath.slice(newPath.length - 1) === '/') newPath = newPath.slice(0, newPath.length - 1);
                if (newPath.indexOf(this.linkBasePath) === 0) { newPath = newPath.slice(this.linkBasePath.length + 1); }
                else if (newPath.indexOf(this.basePath) === 0) { newPath = newPath.slice(this.basePath.length + 1); }
                this.currentPathList = newPath.split('/');
            }
        },
        currentLinkPath: function() {
            var curPath = this.currentPathList; var extraPath = this.extraPathList;
            return this.linkBasePath + (curPath && curPath.length > 0 ? '/' + curPath.join('/') : '') +
                (extraPath && extraPath.length > 0 ? '/' + extraPath.join('/') : '');
        },
        currentSearch: {
            get: function() { return moqui.objToSearch(this.currentParameters); },
            set: function(newSearch) { this.currentParameters = moqui.searchToObj(newSearch); }
        },
        currentLinkUrl: function() { var search = this.currentSearch; return this.currentLinkPath + (search.length > 0 ? '?' + search : ''); },
    },
    created: function() {
        this.moquiSessionToken = $("#confMoquiSessionToken").val();
        this.appHost = $("#confAppHost").val(); this.appRootPath = $("#confAppRootPath").val();
        this.basePath = $("#confBasePath").val(); this.linkBasePath = $("#confLinkBasePath").val();
        console.log(this)
        this.userId = $("#confUserId").val();
        this.username = $("#confUsername").val();
        this.locale = $("#confLocale").val(); if (moqui.localeMap[this.locale]) this.locale = moqui.localeMap[this.locale];
        this.leftOpen = $("#confLeftOpen").val() === 'true';

        // var confDarkMode = $("#confDarkMode").val();
        // this.$q.dark.set(confDarkMode === "true");

        this.notificationClient = new moqui.NotificationClient((location.protocol === 'https:' ? 'wss://' : 'ws://') + this.appHost + this.appRootPath + "/notws");
        // open BroadcastChannel to share session token between tabs/windows on the same domain (see https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
        this.sessionTokenBc = new BroadcastChannel("SessionToken");
        this.sessionTokenBc.onmessage = this.receiveBcCsrfToken;

        // var navPluginUrlList = [];
        // $('.confNavPluginUrl').each(function(idx, el) { navPluginUrlList.push($(el).val()); });
        // this.addNavPluginsWait(navPluginUrlList, 0);

        // var accountPluginUrlList = [];
        // $('.confAccountPluginUrl').each(function(idx, el) { accountPluginUrlList.push($(el).val()); });
        // this.addAccountPluginsWait(accountPluginUrlList, 0);
    },
    mounted: function() {
        var jqEl = $(this.$el);
        jqEl.css("display", "initial");
        // load the current screen
        this.setUrl(window.location.pathname + window.location.search);
        // init the NotificationClient and register 'displayNotify' as the default listener
        // this.notificationClient.registerListener("ALL");

        // request Notification permission on load if not already granted or denied
        // if (window.Notification && Notification.permission !== "granted" && Notification.permission !== "denied") {
        //     Notification.requestPermission(function (status) {
        //         if (status === "granted") {
        //             moqui.notifyMessages("Browser notifications enabled, if you don't want them use browser notification settings to block");
        //         } else if (status === "denied") {
        //             moqui.notifyMessages("Browser notifications disabled, if you want them use browser notification settings to allow");
        //         }
        //     });
        // }
    },
});
// window.addEventListener('popstate', function() { moqui.webrootVue.setUrl(window.location.pathname + window.location.search); });
