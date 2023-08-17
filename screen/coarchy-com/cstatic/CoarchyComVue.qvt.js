// Utils
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        console.log('status is between 200 and < 300')
        console.log(response)
        return Promise.resolve(response)
    } else {
        console.log('status is NOT between 200 and < 300')

        console.log(response)
        console.log(response.body)
        const reader = response.body.getReader();

        console.log('reader')
        new Response( new ReadableStream({
            start(controller) {
                return pump();

                function pump() {
                    return reader.read().then(({ done, value }) => {
                        // When no more data needs to be consumed, close the stream
                        if (done) {
                            controller.close();
                            return;
                        }

                        // Enqueue the next data chunk into our target stream
                        controller.enqueue(value);
                        return pump();
                    });
                }
            },
        }) ).blob().then(function (response) { console.log('stream response ');console.log(response)})
        return Promise.reject(new Error(response))
    }
}

function json(response) {
    console.log('json')
    console.log(response)
    console.log(response.json())
    return response.json()
}

// Components
// TODO: Make it so that login form covers these guidelines: https://web.dev/sign-in-form-best-practices/ (while still using quasar)
Vue.component('c-login', {
    name: "cLogin",
    template:
        '<q-form @submit="onSubmit" class="q-gutter-md" >\n' +
        '    <q-input filled v-model="username" label="Work Email" lazy-rules :rules="[ val => val && val.length > 0 || \'Please type something\']"/>\n' +
        '    <q-input v-model="password" filled label="Password" :type="isPwd ? \'password\' : \'text\'">\n' +
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
            const response = await fetch('/c/Login/login', {
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
                // // .then(status)
                // .then(json)
                // .then(function (data) {
                //     console.log('Request succeeded with JSON response', data);
                // })
                // .catch(function (error) {
                //     console.log('Request failed', error);
                //
                //     console.log(error);
                //     console.log(this);
                //
                //
                // });
            return response.json();
        },
        onSubmit () {
            // var vm = this;
            // console.log(this);

            this.doTheDataThing('/c/Login/login', new URLSearchParams(this._data).toString())
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

                    const paths = window.location.href.split("/").filter(entry => entry !== "")
                    if (data.screenPathList.at(data.screenPathList.length-1) !== paths[paths.length - 1] && data.screenUrl != "") {
                        // redirect https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections#javascript_redirections
                        window.location = data.screenUrl;
                    }
                })

        },

    }
});


// App
webrootVue = new Vue({
    el: '#apps-root',
    data: {
        // basePath:"", linkBasePath:"", currentPathList:[], extraPathList:[], currentParameters:{}, bodyParameters:null,
        // activeSubscreens:[], navMenuList:[], navHistoryList:[], navPlugins:[], accountPlugins:[], notifyHistoryList:[],
        // lastNavTime:Date.now(), loading:0, currentLoadRequest:null, activeContainers:{}, urlListeners:[],
        // moquiSessionToken:"", appHost:"", appRootPath:"", userId:"", username:"", locale:"en",
        // reLoginShow:false, reLoginPassword:null, reLoginMfaData:null, reLoginOtp:null,
        // notificationClient:null, sessionTokenBc:null, qzVue:null, leftOpen:false, //moqui:moqui
    },
    created: function() {
        // this.moquiSessionToken = $("#confMoquiSessionToken").val();
        // this.appHost = $("#confAppHost").val(); this.appRootPath = $("#confAppRootPath").val();
        // this.basePath = $("#confBasePath").val(); this.linkBasePath = $("#confLinkBasePath").val();
        // this.userId = $("#confUserId").val();
        // this.username = $("#confUsername").val();
        // // this.locale = $("#confLocale").val(); if (moqui.localeMap[this.locale]) this.locale = moqui.localeMap[this.locale];
        // this.leftOpen = $("#confLeftOpen").val() === 'true';
        //
        // console.log(this);
    },
});
