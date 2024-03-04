Vue.component('c-edit-activity', {
    name: "editActivity",
    template:
    '<q-form ref="editActivityForm"\n'+
        '@submit.prevent="onSubmit">\n'+
        '<div class="row items-center">\n'+
        '    <div class="col-3 q-px-xs">\n'+
        '        <q-input ref="editCondInput" autogrow v-model="conditionVal" dense\n'+
        '            label="Condition" @keydown.prevent.enter="$refs.editActorSelect.focus()"></q-input>\n'+
        // '            label="Condition" @keydown.prevent.enter="(e)=>$refs.editActivityForm.submit(e)"></q-input>\n'+
        '    </div>\n'+
        '    <div class="col-3 q-px-xs">\n'+
        '        <q-select ref="editActorSelect" v-model="actorsVal" multiple dense use-input\n'+
        '            use-chips options-dense :options="actorList" @filter="actorFilterFn"\n'+
        '            label="Actors"></q-select>\n'+
        '    </div>\n'+
        '    <div class="col-6 q-px-xs">\n'+
        '        <q-input ref="editActionInput" autogrow v-model="actionVal" dense\n'+
        '            label="Action"\n'+
        '            @keydown.enter.prevent="(e) => ($refs.editActivityForm.submit(e))" @keydown.tab.prevent="(e) => ($refs.editActivityForm.submit(e))"></q-input>\n'+
        '    </div>\n'+
        '</div>\n'+
    '</q-form>',        
    props:['condition','actors','action'],
    emits:['save'],
    data: function() { 
        return { 
            conditionVal: this.condition,
            actorsVal: this.actors,
            actionVal: this.action,
            actorList: [],
        } 
    },
    computed:{
        dirty(){
            return (this.conditionVal != this.condition) || !this.areArraysEqualSets(this.actorsVal.map(it=>it.value), this.actors.map(it=>it.value)) || (this.actionVal != this.action)
        }
    },  
    methods: {
        onSubmit(){
            if (this.dirty){
                this.$emit('save', {condition:this.conditionVal,actors:this.actorsVal,action:this.actionVal})
            }else{
                this.$emit('close')
            }
        },
        getActorList(term) {
            const vm = this
            this.loading = true
            return $.ajax({
                type: 'POST',
                url: '/cointernal/Process/EditProcessStory/getActorList',
                data: {
                    term: term,
                },
                dataType: 'json',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-Token': this.$root.moquiSessionToken,
                },
                error: moqui.handleAjaxError,
                success: function (responseObj, status, jqXHR) {
                    return responseObj
                },
                complete: function () {
                    vm.loading = false
                },
            })
        },
        actorFilterFn(val, update, abort) {
            let vm = this;
            vm.getActorList(val.toLowerCase()).then(function (resp) {
                update(() => {
                    vm.actorList = resp;
                });
            });
        },
        areArraysEqualSets(a1, a2) {
            const superSet = {};
            for (const i of a1) {
                const e = i + typeof i;
                superSet[e] = 1;
            }

            for (const i of a2) {
                const e = i + typeof i;
                if (!superSet[e]) {
                    return false;
                }
                superSet[e] = 2;
            }

            for (let e in superSet) {
                if (superSet[e] === 1) {
                    return false;
                }
            }

            return true;
        },
    },
    mounted(){
        this.$refs.editCondInput.focus();
    }
});


Vue.component('c-undelete-activity-dialog', {
    name: "undeleteActivityDialog",
    template:
    '<q-dialog v-bind="$attrs" v-on="$listeners" @show="getDeletedActivities" >\n'+
    '    <q-card :style="{width:((width||760)+\'px\'),\'max-width\':($q.platform.is.mobile?\'100vw\':\'90vw\')}" class="q-pa-md">\n'+
    '        <q-card-section class="row items-center q-pb-none">\n'+
    '            <div class="text-h4">Undelete activities</div>\n'+
    '            <q-space></q-space>\n'+
    '            <q-btn icon="close" flat round dense v-close-popup></q-btn>\n'+
    '        </q-card-section>\n'+
    '        <q-card-section class="q-py-md">\n'+
    '            <template v-if="!deletedActivityList?.length">\n'+
    '                <div class="q-pa-lg text-center q-my-md text-grey-8">\n'+
'                        We couldn\'t find any deleted activities in this process story...\n'+
    '                </div>\n'+
    '            </template>\n'+
    '            <template v-else>\n'+
    '            <div class="q-my-sm text-caption text-grey-8">\n'+
    '                Click on a deleted activity to restore it.\n'+
    '            </div>\n'+
    '            <q-list bordered separator dense>\n'+
    '                <q-item clickable v-ripple v-for="deletedActivity in deletedActivityList"\n'+
    '                    :key="deletedActivity.activityId"\n'+
    '                    @click="()=>restoreActivity(deletedActivity.processStoryActivityId)"\n'+
    '                    v-close-popup>\n'+
    '                    <q-item-section>\n'+
    '                        <div>\n'+
    '                            <span class="text-italic">\n'+
    '                                {{ formatCondition(deletedActivity.condition) }}\n'+
    '                            </span>\n'+
    '                            <span class="text-bold">\n'+
    '                                {{ formatActorNames(deletedActivity.actorNames) }}\n'+
    '                            </span>\n'+
    '                            <span class="">\n'+
    '                                {{ formatAction(deletedActivity.action) }}\n'+
    '                            </span>\n'+
    '                        </div>\n'+
    '                    </q-item-section>\n'+
    '                </q-item>\n'+
    '            </q-list>\n'+
    '            </template>\n'+
    '        </q-card-section>\n'+
    '        <q-inner-loading :showing="loading"></q-inner-loading>\n'+
    '    </q-card>\n'+
    '</q-dialog>\n',
    props:['processStoryId','width'],
    emits:['refetch'],
    data: function() { 
        return { 
            loading: false,
            deletedActivityList: [],
        } 
    },
    methods: {
        getDeletedActivities() {
            const vm = this
            this.loading = true
            return $.ajax({
                type: 'POST',
                url: '/cointernal/Process/EditProcessStory/getDeletedActivities',
                data: {
                    processStoryId: vm.processStoryId,
                },
                dataType: 'json',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-Token': this.$root.moquiSessionToken,
                },
                error: moqui.handleAjaxError,
                success: function (responseObj, status, jqXHR) {
                    vm.deletedActivityList = responseObj.processStoryActivityList;
                    return responseObj
                },
                complete: function () {
                    vm.loading = false
                },
            })
        },  
        restoreActivity(processStoryActivityId) {
            const vm = this
            this.loading = true
            return $.ajax({
                type: 'POST',
                url: '/cointernal/Process/EditProcessStory/restoreActivity',
                data: {
                    processStoryActivityId: processStoryActivityId,
                },
                dataType: 'json',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-Token': this.$root.moquiSessionToken,
                },
                error: moqui.handleAjaxError,
                success: function (responseObj, status, jqXHR) {
                    if (responseObj.success){
                        vm.$emit('refetch')
                        vm.getDeletedActivities()
                    }
                    return responseObj
                },
                complete: function () {
                    vm.loading = false
                },
            })
        },    
        ensureEndsWith(text, suffix) {
            return text?.endsWith(suffix) ? text : text + suffix
        },
        formatCondition(condition) {
            return condition ? this.ensureEndsWith(this.toSentenceCase(condition), ",") : ''
        },
        formatActorNames(actorNames) {
            return actorNames?.join(", ") || ''
        },
        formatAction(action) {
            return action ? this.ensureEndsWith(action, '.') : ''
        },
        toSentenceCase(str) {
            return str.replace(/\.\s+([a-z])[^\.]|^(\s*[a-z])[^\.]/g, s => s.replace(/([a-z])/, s => s.toUpperCase()))
        },
    },
    mounted(){
        this.getDeletedActivities();
    }
});


Vue.component('c-attach-statement-dialog', {
    name: "attachStatementDialog",
    template:
    '<q-dialog v-bind="$attrs" v-on="$listeners" @show="getActivityStatementList" >\n'+
    '    <q-card :style="{width:((width||760)+\'px\'),\'max-width\':($q.platform.is.mobile?\'100vw\':\'90vw\')}" class="q-pa-md">\n'+
    '        <q-card-section class="row items-center q-pb-none">\n'+
    '            <div class="text-h4">Connect Statements</div>\n'+
    '            <q-space></q-space>\n'+
    '            <q-btn icon="close" flat round dense v-close-popup></q-btn>\n'+
    '        </q-card-section>\n'+
    '        <q-card-section class="q-py-md">\n'+
    '           <div class="row">\n'+
    '               <div class="col-10 q-px-xs">\n'+
    '                   <q-select ref="editSelectedStatements" v-model="selectedStatements" multiple dense use-input\n'+
    '                       use-chips options-dense :options="statementList" @filter="statementFilterFn"\n'+
    '                       label="Connect Statements"></q-select>\n'+
    '               </div>\n'+
    '               <div class="col-2 text-right">\n'+
    '               <q-btn flat dense label="Add" :disable="!selectedStatements" @click="connectStatements"></q-btn>\n'+
    '               </div>\n'+
    '           </div>\n'+
    '           <div class="q-mt-xl" v-if="activityStatementList?.length">\n'+
    '               <table>\n'+
    '                   <tr>\n'+
    '                       <th align="left">\n'+
    '                           Connected Statements\n'+
    '                       </th>\n'+
    '                       <th align="right">\n'+
    '                           <q-btn v-if="activityStatementList?.length" flat dense label="Unconnect All" color="negative" @click="()=>unconnectAllStatements()"></q-btn>\n'+
    '                       </th>\n'+
    '                   </tr>\n'+
    '                   <tr v-for="statement in activityStatementList" :key="statement?.valueStatementId">\n'+
    '                       <td>\n'+
    '                           {{statement?.valueFull}}\n'+
    '                       </td>\n'+
    '                       <td>\n'+
    '                           <q-btn flat round dense icon="delete" color="negative" @click="()=>unconnectStatement(statement.valueStatementActivityId)">\n'+
    '                           <q-tooltip>Unconnect statement</q-tooltip>\n'+
    '                           </q-btn>\n'+
    '                       </td>\n'+
    '                   </tr>\n'+
    '               </table>\n'+
    '           </div>\n'+
    '        </q-card-section>\n'+
    '        <q-inner-loading :showing="loading"></q-inner-loading>\n'+
    '    </q-card>\n'+
    '</q-dialog>\n',
    props:['activityId','width'],
    emits:['refetch'],
    data: function() { 
        return { 
            selectedStatements:[],
            loading: false,
            statementList: [],
            activityStatementList: [],
        } 
    },
    methods: {
        getValueList(term) {
            const vm = this
            this.loading = true
            return $.ajax({
                type: 'POST',
                url: '/cointernal/Process/EditProcessStory/getValueList',
                data: {
                    term: term,
                    excludeValueIds: vm.activityStatementList?.map(it=>it.valueStatementId)?.join(',')
                },
                dataType: 'json',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-Token': this.$root.moquiSessionToken,
                },
                error: moqui.handleAjaxError,
                success: function (responseObj, status, jqXHR) {
                    return responseObj
                },
                complete: function () {
                    vm.loading = false
                },
            })
        },
        statementFilterFn(val, update, abort) {
            let vm = this;
            vm.getValueList(val.toLowerCase()).then(function (resp) {
                update(() => {
                    vm.statementList = resp;
                });
            });
        },
        getActivityStatementList() {
            const vm = this
            this.loading = true
            return $.ajax({
                type: 'POST',
                url: '/cointernal/Process/EditProcessStory/getActivityStatementList',
                data: {
                    activityId: vm.activityId,
                },
                dataType: 'json',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-Token': this.$root.moquiSessionToken,
                },
                error: moqui.handleAjaxError,
                success: function (responseObj, status, jqXHR) {
                    vm.activityStatementList = responseObj || [];
                    return responseObj
                },
                complete: function () {
                    vm.loading = false
                },
            })
        },  
        unconnectStatement(valueStatementActivityId) {
            const vm = this
            this.loading = true
            return $.ajax({
                type: 'POST',
                url: '/cointernal/Process/EditProcessStory/deleteValueStatementActivity',
                data: {
                    activityId: vm.activityId,
                    valueStatementActivityId: valueStatementActivityId,
                },
                dataType: 'json',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-Token': this.$root.moquiSessionToken,
                },
                error: moqui.handleAjaxError,
                success: function (responseObj, status, jqXHR) {
                    vm.getActivityStatementList()
                    return responseObj
                },
                complete: function () {
                    vm.loading = false
                },
            })
        }, 
        connectStatements() {
            const vm = this
            this.loading = true
            return $.ajax({
                type: 'POST',
                url: '/cointernal/Process/EditProcessStory/createActivityValue',
                data: {
                    activityId: vm.activityId,
                    valueIdList: vm.selectedStatements.map(it=>it.value),
                },
                dataType: 'json',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-Token': this.$root.moquiSessionToken,
                },
                error: moqui.handleAjaxError,
                success: function (responseObj, status, jqXHR) {
                    vm.selectedStatements=[]
                    vm.statementList=[]
                    vm.getActivityStatementList()
                    return responseObj
                },
                complete: function () {
                    vm.loading = false
                },
            })
        }, 
        unconnectAllStatements() {
            const vm = this
            this.loading = true
            return $.ajax({
                type: 'POST',
                url: '/cointernal/Process/EditProcessStory/deleteAllValueStatementActivities',
                data: {
                    activityId: vm.activityId,
                },
                dataType: 'json',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-Token': this.$root.moquiSessionToken,
                },
                error: moqui.handleAjaxError,
                success: function (responseObj, status, jqXHR) {
                    vm.getActivityStatementList()
                    return responseObj
                },
                complete: function () {
                    vm.loading = false
                },
            })
        },           
    },
    mounted(){
        this.getActivityStatementList();
    }
});