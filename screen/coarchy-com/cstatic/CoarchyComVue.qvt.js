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
            this.moqui.webrootVue.doTheDataThing('/c/Login/login', new URLSearchParams(this._data).toString())
                .then((data) => {
                    // console.log(data);

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

                    if (data.loggedIn) {
                        window.location = '/coapp';
                    }
                })

        },
    }
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
        }
    },
    methods: {
        onSubmit () {
            this.moqui.webrootVue.doTheDataThing('/c/SignUp/createAccount', new URLSearchParams(this._data).toString())
                .then((data) => {
                    this.moqui.webrootVue.handleNotification(data)
                    const paths = window.location.href.split("/").filter(entry => entry !== "")
                    if (data.screenPathList.at(data.screenPathList.length-1) !== paths[paths.length - 1] && data.screenUrl != "") {
                        // redirect https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections#javascript_redirections
                        window.location = data.screenUrl;
                    }
                })

        },

    }
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
            this.moqui.webrootVue.doTheDataThing('/c/Organizations/createOrganization', new URLSearchParams(this._data).toString())
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
            this.moqui.webrootVue.doTheDataThing('/c/Organizations/invitePeople', new URLSearchParams(this._data).toString())
                .then((data) => {
                    this.moqui.webrootVue.handleNotification(data)
                    emailAddress=null
                    firstName=null
                    lastName=null
                    this.popupModel=false
                })
        },
    }
});
// App
moqui.webrootVue = new Vue({
    el: '#apps-root',
    created: function() {
        this.moquiSessionToken = $("#confMoquiSessionToken").val();
    },
    methods: {
        async doTheDataThing(url = "", data = URLSearchParams) {
            console.log(this.moquiSessionToken)

            let _data = new URLSearchParams(data)
            _data.append("moquiSessionToken", this.moquiSessionToken)
            console.log(_data.toString())
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
    }
});
