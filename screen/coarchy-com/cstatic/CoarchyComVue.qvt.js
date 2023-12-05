Vue.prototype.moqui = moqui;

// Components
// TODO: Make it so that login form covers these guidelines: https://web.dev/sign-in-form-best-practices/ (while still using quasar)
Vue.component('c-login', {
    name: "cLogin",
    template:
    // Could include type="email" for email, but then wouldn't allow john.doe to login
        '<q-form @submit="onSubmit" class="q-gutter-md" >\n' +
        '    <q-input filled v-model="username" label="Work Email" :rules="[ val => val && val.length > 0 || \'Please type something\']"/>\n' +
        '    <q-input v-model="password" filled label="Password" :type="isPwd ? \'password\' : \'text\'" :rules="[ val => val && val.length > 0 || \'Please type something\']">\n' +
        '        <template v-slot:append>\n' +
        '            <q-icon :name="isPwd ? \'visibility_off\' : \'visibility\'" class="cursor-pointer" @click="isPwd = !isPwd"/>\n' +
        '        </template>\n' +
        '    </q-input>\n' +
        '    <div>\n' +
        '        <q-btn label="Submit" type="submit" color="primary"/>\n' +
        '    </div>\n' +
        '</q-form>',
    data () {
        return {
            username: null,
            password: null,
            isPwd: true,
        }
    },
    methods: {
        onSubmit () {
            this.moqui.webrootVue.postData('/c/Login/login', new URLSearchParams(this._data).toString())
                .then((data) => {
                    this.moqui.webrootVue.handleNotification(data)

                    if (data.loggedIn) {
                        window.location = '/settings';
                    }
                })

        },
    },
    mounted: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('username')) this.username = urlParams.get('username')
    },
});
Vue.component('c-sign-up', {
    name: "cSignUp",
    template:
    // Could include type="email" for email, but then wouldn't allow john.doe to login
        '<q-form @submit="onSubmit" class="q-gutter-md" >\n' +
        '    <q-input filled v-model="emailAddress" type="email" label="Work Email" :rules="[ val => val && val.length > 0 || \'Please type something\' ]"/>\n' +
        '    <q-input filled v-model="firstName" label="First Name" :rules="[ val => val && val.length > 0 || \'Please type something\']"/>\n' +
        '    <q-input filled v-model="lastName" label="Last Name" :rules="[ val => val && val.length > 0 || \'Please type something\']"/>\n' +
        '    <q-input v-model="newPassword" filled label="New Password" :type="isPwd ? \'password\' : \'text\'" :rules="[ val => val && val.length > 0 || \'Please type something\', val => val.length >= 8 || \'Please use minimum of 8 characters\', val => /\\d/.test(val) || \'Please use at least 1 number\', val => /[^0-9a-zA-Z]/.test(val) || \'Please use at least 1 special character\' ]">\n' +
        '        <template v-slot:append>\n' +
        '            <q-icon :name="isPwd ? \'visibility_off\' : \'visibility\'" class="cursor-pointer" @click="isPwd = !isPwd"/>\n' +
        '        </template>\n' +
        '    </q-input>\n' +
        '    <p v-if="agreementlist!=null && agreementlist.length > 0" class="text-muted text-left">By signing up, you agree to our <template v-for="{contentContentLocation, typeDescription, index} in agreementlist">' +
        '       <a :href="contentContentLocation">{{ typeDescription }}{{ index }}</a>\n' +
        '       <template v-if="index < agreementlist.length - 2">,&nbsp;</template>\n' +
        '      <template v-else-if="index === agreementlist.length - 2">, and&nbsp;</template>' +
        '   </template></p>' +
        '    <div>\n' +
        '        <q-btn label="Create Account" type="submit" color="primary"/>\n' +
        '    </div>\n' +
        '</q-form>',
    data () {
        return {
            emailAddress: null,
            firstName: null,
            lastName: null,
            newPassword: null,
            isPwd: true,
            agreementlist: null
        }
    },
    mounted: function() {
        this.getData("/c/SignUp/actions").then((response) => {
            // console.log(response)
            this.agreementlist = response.agreementList

            // console.log(response.agreementList)
        })
    },
    methods: {
        async getData(url = "") {
            // console.log(this.moquiSessionToken)

            // console.log(_data.toString())
            // See https://web.dev/introduction-to-fetch/#post-request for the fetch api
            const response = await fetch(url, {
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                redirect: "follow",
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            })

            return response.json();
        },
        onSubmit () {
            this.moqui.webrootVue.postData('/c/SignUp/createAccount', new URLSearchParams(this._data).toString())
                .then((data) => {
                    this.moqui.webrootVue.handleNotificationOther(data)
                    const paths = window.location.href.split("/").filter(entry => entry !== "")
                    if (data.screenPathList.at(data.screenPathList.length-1) !== paths[paths.length - 1] && data.screenUrl != "") {
                        // redirect https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections#javascript_redirections
                        window.location = data.screenUrl;
                    }
                })
        },
    }
});
Vue.component('c-change-password', {
    name: "cChangePassword",
    template:
    // Could include type="email" for email, but then wouldn't allow john.doe to login
        '<q-form @submit="onSubmit" class="q-gutter-md" >\n' +
        '    <q-input filled v-model="username" :disable="this.cameFromEmail" :readonly="this.cameFromEmail" type="email" label="Work Email" :rules="[ val => val && val.length > 0 || \'Please type something\' ]"/>\n' +
        '    <q-input v-if="this.cameFromEmail" filled v-model="firstName" label="First Name" :rules="[ val => val && val.length > 0 || \'Please type something\']"/>\n' +
        '    <q-input v-if="this.cameFromEmail" filled v-model="lastName" label="Last Name" :rules="[ val => val && val.length > 0 || \'Please type something\']"/>\n' +
        '    <q-input filled v-model="oldPassword" :readonly="this.cameFromEmail" label="Reset Password" :type="isOldPwd ? \'password\' : \'text\'" :rules="[ val => val && val.length > 0 || \'Please type something\']">' +
        '        <template v-slot:append>\n' +
        '            <q-icon :name="isOldPwd ? \'visibility_off\' : \'visibility\'" class="cursor-pointer" @click="isOldPwd = !isOldPwd"/>\n' +
        '        </template>\n' +
        '    </q-input>\n' +
        '    <q-input v-model="newPassword" filled label="New Password" :type="isNewPwd ? \'password\' : \'text\'" :rules="[ val => val && val.length > 0 || \'Please type something\', val => val.length >= 8 || \'Please use minimum of 8 characters\', val => /\\d/.test(val) || \'Please use at least 1 number\', val => /[^0-9a-zA-Z]/.test(val) || \'Please use at least 1 special character\' ]">\n' +
        '        <template v-slot:append>\n' +
        '            <q-icon :name="isNewPwd ? \'visibility_off\' : \'visibility\'" class="cursor-pointer" @click="isNewPwd = !isNewPwd"/>\n' +
        '        </template>\n' +
        '    </q-input>\n' +
        '    <p v-if="this.cameFromEmail && agreementlist!=null && agreementlist.length > 0" class="text-muted text-left">By signing up, you agree to our <template v-for="{contentContentLocation, typeDescription, index} in agreementlist">' +
        '       <a :href="contentContentLocation">{{ typeDescription }}{{ index }}</a>\n' +
        '       <template v-if="index < agreementlist.length - 2">,&nbsp;</template>\n' +
        '      <template v-else-if="index === agreementlist.length - 2">, and&nbsp;</template>' +
        '   </template></p>' +
        '    <div>\n' +
        '        <q-btn label="Create Account" type="submit" color="primary"/>\n' +
        '    </div>\n' +
        '</q-form>',
    data () {
        return {
            username: null,
            cameFromEmail: false,
            firstName: null,
            lastName: null,
            oldPassword: null,
            newPassword: null,
            isOldPwd: true,
            isNewPwd: true,
            agreementlist: null

        }
    },
    methods: {
        async getData(url = "") {
            // console.log(this.moquiSessionToken)

            // console.log(_data.toString())
            // See https://web.dev/introduction-to-fetch/#post-request for the fetch api
            const response = await fetch(url, {
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                redirect: "follow",
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            })

            return response.json();
        },
        onSubmit () {
            this.moqui.webrootVue.postData('/c/ChangePassword/changePassword', new URLSearchParams(this._data).toString())
                .then((data) => {
                    this.moqui.webrootVue.handleNotificationOther(data)
                    const paths = window.location.href.split("/").filter(entry => entry !== "")
                    if (data.screenPathList.at(data.screenPathList.length-1) !== paths[paths.length - 1] && data.screenUrl != "") {
                        // redirect https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections#javascript_redirections
                        window.location = data.screenUrl;
                    }
                })
        },
    },
    mounted: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('username')) this.username = urlParams.get('username')
        if (urlParams.get('oldPassword')) this.oldPassword = urlParams.get('oldPassword')
        if (this.username && this.oldPassword) this.cameFromEmail = true

        this.getData("/c/SignUp/actions").then((response) => {
            // console.log(response)
            this.agreementlist = response.agreementList

            // console.log(response.agreementList)
        })
    },
});
Vue.component('c-create-organization', {
    name: "cCreateOrganization",
    template:
    // Could include type="email" for email, but then wouldn't allow john.doe to login
        '<q-btn push color="secondary" label="Create Organization">\n' +
        '    <q-popup-proxy v-model="popupModel">\n' +
        '       <div class="q-pa-md">\n' +
        '         <q-form @submit="createOrganization">\n' +
        '             <q-input filled v-model="organizationName" label="Organization Name" :rules="[ val => val && val.length > 0 || \'Please type something\' ]"/>\n' +
        '             <q-btn type="submit" color="primary" label="Create"/>\n' +
        '         </q-form>' +
        '       </div>\n' +
        '    </q-popup-proxy>\n' +
        '</q-btn>',
    data () {
        return {
            organizationName: null,
            popupModel: null
        }
    },
    methods: {
        createOrganization () {
            this.moqui.webrootVue.postData('/c/Organizations/createOrganization', new URLSearchParams(this._data).toString())
                .then((data) => {
                    this.moqui.webrootVue.handleNotification(data)
                    this.organizationName=null
                    this.popupModel=false
                })
        },
    }
});
Vue.component('c-invite-people', {
    name: "cInvitePeople",
    template:
    // Could include type="email" for email, but then wouldn't allow john.doe to login
        '<q-btn push color="primary" label="Invite People">\n' +
        '    <q-popup-proxy v-model="popupModel">\n' +
        '       <div class="q-pa-md">\n' +
        '         <div class="text-h6 q-pb-md">Invite a Person to join your Organization</div>\n' +
        '         <div class="text-body1 q-pb-md">This will email them and give them access to edit in the application, but not manage the organization.</div>\n' +
        '         <q-form @submit="invitePeople">\n' +
        '             <q-input filled v-model="emailAddress" type="email" label="Work Email" :rules="[ val => val && val.length > 0 || \'Please type something\' ]"/>\n' +
        '             <q-input filled v-model="firstName" label="First Name" :rules="[ val => val && val.length > 0 || \'Please type something\']"/>\n' +
        '             <q-input filled v-model="lastName" label="Last Name" :rules="[ val => val && val.length > 0 || \'Please type something\']"/>\n' +
        '             <q-btn type="submit" color="primary" label="Invite"/>\n' +
        '         </q-form>' +
        '       </div>\n' +
        '    </q-popup-proxy>\n' +
        '</q-btn>',
    props: {
        toPartyId: String,
    },
    data () {
        return {
            emailAddress: null,
            firstName: null,
            lastName: null,
            popupModel: null
        }
    },
    methods: {
        invitePeople () {
            let inviteData = new URLSearchParams(this._data)
            inviteData.append("toPartyId",this._props.toPartyId)
            this.moqui.webrootVue.postData('/c/Organizations/invitePeople', inviteData)
                .then((data) => {
                    this.moqui.webrootVue.handleNotificationOther(data)
                    emailAddress=null
                    firstName=null
                    lastName=null
                    this.popupModel=false
                })
        },
    },
});
Vue.component('c-list-organizations', {
    name: "cListOrganizations",
    template:
    // Could include type="email" for email, but then wouldn't allow john.doe to login
    //     '<div class="q-pt-md"><q-table :data="data" :columns="columns" title="Organizations" :rows-per-page-options="[]" row-key="name">\n' +
    //     '    <template v-slot:body="props">\n' +
    //     '        <q-tr :props="props">\n' +
    //     '            <q-td key="desc" :props="props">{{ props.row.name }}</q-td>\n' +
    //     '            <q-td key="calories" :props="props">\n' +
    //     '                {{ props.row.calories }}\n' +
    //     '                <q-popup-edit v-model.number="props.row.calories" buttons label-set="Save" label-cancel="Close" :validate="caloriesRangeValidation" @hide="caloriesRangeValidation" v-slot="scope">\n' +
    //     '                    <q-input type="number" v-model.number="scope.value" hint="Enter a number between 4 and 7" :error="errorCalories" :error-message="errorMessageCalories" dense autofocus @keyup.enter="scope.set"/>\n' +
    //     '                </q-popup-edit>\n' +
    //     '            </q-td>\n' +
    //     '            <q-td key="fat" :props="props"><div class="text-pre-wrap">{{ props.row.fat }}</div></q-td>\n' +
    //     '            <q-td key="carbs" :props="props">{{ props.row.carbs }}</q-td>\n' +
    //     '            <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>\n' +
    //     '        </q-tr>\n' +
    //     '    </template>\n' +
    //     '</q-table>\n' +

        '<div class="q-pt-md"><q-table :data="organizationList" :columns="organizationListColumns" title="Organizations" :rows-per-page-options="[0]" row-key="toPartyId" hide-header :filter="filter" :loading="loading" :expanded.sync="expanded">\n' +
        '    <template v-slot:body="props">\n' +
        '        <q-tr :props="props">\n' +
        '            <q-td auto-width><q-toggle v-model="props.expand" checked-icon="add" unchecked-icon="remove" /></q-td>\n' +
        '            <q-td key="organizationName" :props="props">{{ props.row.organizationName }}' +
        '               <q-popup-edit v-model="props.row.organizationName" buttons v-slot="scope">\n' +
        '                   <q-input v-model="scope.value" autofocus counter @keyup.enter="scope.set" />\n' +
        '               </q-popup-edit>\n' +
        '            </q-td>\n' +
        '            <q-td auto-width><c-invite-people v-bind:toPartyId="props.row.toPartyId"></c-invite-people></q-td>\n' +
        '        </q-tr>' +
        '        <q-tr v-show="props.expand" :props="props">\n' +
        '          <q-td colspan="100%">\n' +
        '            <div class="text-left">This is expand slot for row above: {{ props.row.organizationName }}.</div>\n' +
        '          </q-td>\n' +
        '        </q-tr>\n' +
        '    </template>\n' +
        '    <template v-slot:top-right>\n' +
        '        <q-input borderless dense debounce="100" v-model="filter" placeholder="Search">\n' +
        '            <template v-slot:append><q-icon name="search" /></template>\n' +
        '        </q-input>\n' +
        '    </template>' +
        '    <template v-slot:loading>\n' +
        '        <q-inner-loading showing color="primary" />\n' +
        '    </template>\n' +
        '</q-table></div>\n' +
        '',
    data () {
        return {
            expanded: [],
            filter: '',
            loading: false,
            organizationListColumns: [
                { name: 'organizationName', align: 'left', label: 'Name', field: 'organizationName' }
            ],
            organizationList: [],
        }
    },
    methods: {
        async getData(url = "") {
            // console.log(this.moquiSessionToken)

            // console.log(_data.toString())
            // See https://web.dev/introduction-to-fetch/#post-request for the fetch api
            const response = await fetch(url, {
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                redirect: "follow",
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            })

            return response.json();
        },
    },
    mounted: function() {
        this.getData("/c/Organizations/actions").then((response) => {
            // console.log(response)
            this.organizationList = response.organizationList

            // console.log(response.organizationList)

        })
    }
});
Vue.component('c-unsubscribe', {
    name: "cUnsubscribe",
    template:
    // Could include type="email" for email, but then wouldn't allow john.doe to login
        '<q-form v-if="contact_list_party_exists!==false_string && contact_list_status!==unsubscribed_string" @submit="onSubmit" class="q-gutter-md" >\n' +
        '    <div>\n' +
        '        <div class="text-h6 q-pb-md">Unsubscribe from {{contact_list_name_label}} emails</div>\n' +
        '        <q-btn label="Unsubscribe" type="submit" color="primary"/>\n' +
        '    </div>\n' +
        '</q-form>' +
        '<div v-else-if="contact_list_party_exists===false_string && contact_list_status!==unsubscribed_string" class="text-h6 q-pb-md">No subscription found</div>\n' +
        '<div v-else-if="contact_list_status===unsubscribed_string" class="text-h6 q-pb-md">Already unsubscribed</div>\n' +
        '',
    data () {
        return {
            optInVerifyCode: null,
            false_string: 'false',
            unsubscribed_string: 'CLPT_UNSUBSCRIBED',
        }
    },
    props: {
        contact_list_party_exists: String,
        contact_list_name_label: String,
        contact_list_status: String,
    },
    methods: {
        async getData(url = "") {
            // console.log(this.moquiSessionToken)

            // console.log(_data.toString())
            // See https://web.dev/introduction-to-fetch/#post-request for the fetch api
            const response = await fetch(url, {
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                redirect: "follow",
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            })

            return response.json();
        },
        onSubmit () {
            // console.log(this._data)
            this.moqui.webrootVue.postData('/c/Unsubscribe/unsubscribe', new URLSearchParams(this._data).toString())
                .then((data) => {
                    this.moqui.webrootVue.handleNotificationOther(data)
                })
        },
    },
    mounted: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('optInVerifyCode')) this.optInVerifyCode = urlParams.get('optInVerifyCode')
    },
});

// App
moqui.webrootVue = new Vue({
    // render: (h) => h(App),
    // mounted() {
    //     init()
    // },
    el: '#apps-root',
    created: function() {
        this.moquiSessionToken = $("#confMoquiSessionToken").val();
    },
    methods: {
        async postData(url = "", data = URLSearchParams) {
            // console.log(this.moquiSessionToken)

            let _data = new URLSearchParams(data)
            _data.append("moquiSessionToken", this.moquiSessionToken)
            // console.log(_data.toString())

            // See https://web.dev/introduction-to-fetch/#post-request for the fetch api
            const response = await fetch(url, {
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: "follow",
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: _data // See: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
            })

            return response.json();
        },
        handleNotification(data) {
            // console.log(data);
            // console.log(this);

            // Show the messages from the server
            if (data.messageInfos != null && data.messageInfos.length > 0) {
                for (const message of data.messageInfos) {
                    // console.log(message)
                    if (message.type == "warning") {
                        this.$q.notify({
                            color: 'yellow-5',
                            textColor: 'black',
                            icon: 'warning',
                            message: message.message
                        })
                    } else if (message.type = "success") {
                        this.$q.notify({
                            color: 'green-4',
                            textColor: 'white',
                            icon: 'cloud_done',
                            message: message.message
                        })
                    }
                }
            }

            // Show the errors from the server
            if (data.errors != null && data.errors.length > 0) {
                const errorList = data.errors.split('/n')
                for (const error of errorList) {
                    // console.log(error)
                    this.$q.notify({
                        color: 'red-5',
                        textColor: 'white',
                        icon: 'warning',
                        message: error
                    })
                }
            }
        },
        handleNotificationOther(data) {
            console.log(data);
            console.log(this);

            // Show the messages from the server
            if (data.messageInfos != null && data.messageInfos.length > 0) {
                for (const message of data.messageInfos) {
                    // console.log(message)
                    if (message.type == "warning") {
                        this.$q.notify({
                            color: 'yellow-5',
                            textColor: 'black',
                            icon: 'warning',
                            message: message.message
                        })
                    } else if (message.type = "info") {
                        this.$q.notify({
                            color: 'blue-grey-4',
                            textColor: 'black',
                            icon: 'info',
                            message: message.message
                        })
                    } else if (message.type = "success") {
                        this.$q.notify({
                            color: 'green-4',
                            textColor: 'white',
                            icon: 'cloud_done',
                            message: message.message
                        })
                    }
                }
            }

            // Show the errors from the server
            if (data.errors != null && data.errors.length > 0) {
                for (const error of data.errors) {
                    // console.log(error)
                    this.$q.notify({
                        color: 'red-5',
                        textColor: 'white',
                        icon: 'warning',
                        message: error
                    })
                }
            }
        },
    }
});
