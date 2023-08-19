// Util

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
        async doTheDataThing(url = "", data = URLSearchParams) {
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
                body: data // See: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
            })

            return response.json();
        },
        onSubmit () {
            this.doTheDataThing('/c/Login/login', new URLSearchParams(this._data).toString())
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
            organizationName: null,
            emailAddress: null,
            firstName: null,
            lastName: null,
            newPassword: null,
            isPwd: true,
        }
    },
    methods: {
        async doTheDataThing(url = "", data = URLSearchParams) {
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
                body: data // See: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
            })

            return response.json();
        },
        onSubmit () {
            this.doTheDataThing('/c/SignUp/createAccount', new URLSearchParams(this._data).toString())
                .then((data) => {
                    console.log(data);

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

                    const paths = window.location.href.split("/").filter(entry => entry !== "")
                    if (data.screenPathList.at(data.screenPathList.length-1) !== paths[paths.length - 1] && data.screenUrl != "") {
                        // redirect https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections#javascript_redirections
                        window.location = data.screenUrl;
                    }
                })

        },

    }
});
Vue.component('c-onboarding', {
    name: "cOnboarding",
    template:
    // Could include type="email" for email, but then wouldn't allow john.doe to login
        '<q-stepper v-model="step" header-nav ref="stepper" color="primary" animated>\n' +
        '    <q-step :name="1" title="Create your Organization" icon="settings" :done="done1">\n' +
        '         <div class="test-body1 q-pb-md">Let\'s create the Organization that you will design.</div>\n' +
        '         <q-form @submit="createOrganization">\n' +
        '             <q-input filled v-model="organizationName" label="Organization Name" :rules="[ val => val && val.length > 0 || \'Please type something\' ]"/>\n' +
        '             <div>\n' +
        '                 <q-stepper-navigation><q-btn type="submit" color="primary" label="Create and Continue" /></q-stepper-navigation>\n' +
        '             </div>\n' +
        '         </q-form>' +
        '    </q-step>\n' +
        '    <q-step :name="2" title="Create an ad group" caption="Optional" icon="create_new_folder" :done="done2">An ad group contains one or more ads which target a shared set of keywords.\n' +
        '        <q-stepper-navigation><q-btn @click="() => { done2 = true; step = 3 }" color="primary" label="Continue" /><q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" /></q-stepper-navigation>\n' +
        '    </q-step>\n' +
        '    <q-step :name="3" title="Create an ad" icon="add_comment" :done="done3">\n' +
        '        Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they\'re running and how to resolve approval issues.\n' +
        '        <q-stepper-navigation>\n' +
        '            <q-btn color="primary" @click="done3 = true" label="Finish" />\n' +
        '            <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />\n' +
        '        </q-stepper-navigation>\n' +
        '    </q-step>\n' +
        '</q-stepper>\n',
    data () {
        return {
            organizationName: null,
            step: 1,
            done1: false,
            done2: false,
            done3: false
        }
    },
    methods: {
        async doTheDataThing(url = "", data = URLSearchParams) {
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
                body: data // See: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
            })

            return response.json();
        },
        createOrganization () {
            this.doTheDataThing('/c/Onboarding/createOrganization', new URLSearchParams(this._data).toString())
                .then((data) => {
                    console.log(data);

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

                    this.done1 = true; this.step = 2;
                })

        },
    }
});

// App
webrootVue = new Vue({
    el: '#apps-root',
});
