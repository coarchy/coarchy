
Vue.component('c-login', {
    name: "cLogin",
    template:
        '<q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md" >\n' +
        '    <q-input filled v-model="username" label="Work Email" lazy-rules :rules="[ val => val && val.length > 0 || \'Please type something\']"/>\n' +
        '    <q-input filled type="number" v-model="age" label="Your age *" lazy-rules :rules="[\n' +
        '     val => val !== null && val !== \'\' || \'Please type your age\',\n' +
        '     val => val > 0 && val < 100 || \'Please type a real age\'\n' +
        '   ]"/>\n' +
        '    <q-toggle v-model="accept" label="I accept the license and terms" />\n' +
        '    <div>\n' +
        '        <q-btn label="Submit" type="submit" color="primary"/>\n' +
        '        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />\n' +
        '    </div>\n' +
        '</q-form>',
    data () {
        return {
            username: null,
            age: null,

            accept: false
        }
    },

    methods: {
        onSubmit () {
            if (this.accept !== true) {
                this.$q.notify({
                    color: 'red-5',
                    textColor: 'white',
                    icon: 'warning',
                    message: 'You need to accept the license and terms first'
                })
            }
            else {
                this.$q.notify({
                    color: 'green-4',
                    textColor: 'white',
                    icon: 'cloud_done',
                    message: 'Submitted'
                })
            }
        },

        onReset () {
            this.username = null
            this.age = null
            this.accept = false
        }
    }
});

// moqui.webrootVue =
// moqui.webrootVue =
new Vue({
    el: '#apps-root',
    data() {
        return {
            showPassword: false,
            isDesktop: window.innerWidth >= 800
        };
    },
    methods: {
        togglePassword() {
            const passwordInput = document.getElementById('password');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.showPassword = true;
            } else {
                passwordInput.type = 'password';
                this.showPassword = false;
            }
        }
    },
    mounted() {
        window.addEventListener('resize', () => {
            this.isDesktop = window.innerWidth >= 800;
        });
    },
    beforeDestroy() {
        window.removeEventListener('resize', () => {
            this.isDesktop = window.innerWidth >= 800;
        });
    }

});
