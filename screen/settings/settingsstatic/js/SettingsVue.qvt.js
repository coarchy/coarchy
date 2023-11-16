// Components
Vue.component('m-stripe', {
    name: "mStripe",
    props: {
        return_url: String,
        public_key: String,
    },
    template:
        // Display a payment form
        '<form id="payment-form">\n' +
        '    <div id="link-authentication-element">\n' +
        //'        <!--Stripe.js injects the Link Authentication Element-->\n' +
        '    </div>\n' +
        '    <div id="payment-element">\n' +
        //'        <!--Stripe.js injects the Payment Element-->\n' +
        '    </div>\n' +
        '    <button id="submit">\n' +
        '        <div class="spinner hidden" id="spinner"></div>\n' +
        '        <span id="button-text">Pay now</span>\n' +
        '    </button>\n' +
        '    <div id="payment-message" class="hidden"></div>\n' +
        '</form>',
    methods: {
        async initialize() {
            const response = await fetch("/settings/createPaymentIntent", {
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                redirect: "follow",
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            })

            const { clientSecret, messages, errors } = await response.json();
            // console.log("Messages from createPaymentIntent:\n"+messages)
            moqui.notifyMessages(null, errors, null);

            const appearance = {
                theme: 'stripe',
            };
            this.elements = this.stripe.elements({ appearance, clientSecret });

            const linkAuthenticationElement = this.elements.create("linkAuthentication");
            linkAuthenticationElement.mount("#link-authentication-element");

            linkAuthenticationElement.on('change', (event) => {
                this.emailAddress = event.value.email;
            });

            const paymentElementOptions = {
                layout: "tabs",
            };

            const paymentElement = this.elements.create("payment", paymentElementOptions);
            paymentElement.mount("#payment-element");
        },

        async handleSubmit(e) {
            e.preventDefault();
            this.setLoading(true);

            let elements = this.elements;

            if (elements == null) {
                // set loading false and return
                this.setLoading(false);
                console.log("pressed submit before elements were loaded - try again")
                return;
            }

            const { error } = await this.stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Make sure to change this to your payment completion page
                    return_url: this.return_url,
                    receipt_email: this.emailAddress,
                },
            });

            // This point will only be reached if there is an immediate error when
            // confirming the payment. Otherwise, your customer will be redirected to
            // your `return_url`. For some payment methods like iDEAL, your customer will
            // be redirected to an intermediate site first to authorize the payment, then
            // redirected to the `return_url`.
            if (error.type === "card_error" || error.type === "validation_error") {
                this.showMessage(error.message);
            } else {
                this.showMessage("An unexpected error occurred.");
            }

            this.setLoading(false);
        },

        // Fetches the payment intent status after payment submission
        async checkStatus() {
            const clientSecret = new URLSearchParams(window.location.search).get(
                "payment_intent_client_secret"
            );

            if (!clientSecret) {
                return;
            }

            const { paymentIntent } = await this.stripe.retrievePaymentIntent(clientSecret);

            switch (paymentIntent.status) {
                case "succeeded":
                    this.showMessage("Payment succeeded!");
                    break;
                case "processing":
                    this.showMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    this.showMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    this.showMessage("Something went wrong.");
                    break;
            }
        },

        // ------- UI helpers -------
        showMessage(messageText) {
            const messageContainer = document.querySelector("#payment-message");
            messageContainer.classList.remove("hidden");
            messageContainer.textContent = messageText;

            setTimeout(function () {
                messageContainer.classList.add("hidden");
                messageContainer.textContent = "";
            }, 4000);
        },

        // Show a spinner on payment submission
        setLoading(isLoading) {
            if (isLoading) {
                // Disable the button and show a spinner
                document.querySelector("#submit").disabled = true;
                document.querySelector("#spinner").classList.remove("hidden");
                document.querySelector("#button-text").classList.add("hidden");
            } else {
                document.querySelector("#submit").disabled = false;
                document.querySelector("#spinner").classList.add("hidden");
                document.querySelector("#button-text").classList.remove("hidden");
            }
        }
    },
    data () {
        return {
            stripe: null,
            emailAddress: "",
            elements: null,
        }
    },
    mounted: function() {
        var vm = this;
        moqui.loadScript('https://js.stripe.com/v3', function(err) {
            if (err) {
                console.error("Error loading stripe: " + err);
                return;
            }
            // This is your publishable API key.
            vm.stripe = Stripe(vm.public_key)
            console.log("loaded stripe")

            vm.initialize();
            vm.checkStatus();

            document
                .querySelector("#payment-form")
                .addEventListener("submit", vm.handleSubmit);

        }, function() {
            return !!window.Stripe;
        });
    },
    beforeDestroy: function() {
        // Remove stripe from other pages
        Array.from(document.querySelectorAll("script[src='https://js.stripe.com/v3']")).forEach(script => {
            script.parentNode.removeChild(script);
        });
        location.reload();
    }
});
Vue.component('m-order-progress', {
    name: "mOrderProgress",
    props: {
        return_url: String,
        progress_url: String,
        order_id: String,
        organization_name: String,
    },
    template:
        // Display a payment form
        // '<q-circular-progress v-if="showProgress" :value="value" size="50px" ' +
        // '   :thickness="0.6" color="primary" center-color="grey-8" class="q-ma-md"/>' +
        '<div>' +
        '   <h6 class="q-pb-sm">Processing Order Payment is {{description}}</h6>' +
        '   <q-linear-progress :indeterminate="indeterminate" :value="value" class="q-mt-xs"/>' +
        '   <div v-if="showButtons" class="q-pt-md">' +
        '       <a v-if="return_url" :href="return_url">' +
        '           <q-btn dense outline no-caps color="positive" class="m-link">Return to App</q-btn>' +
        '       </a>' +
        '       <a v-if="!return_url&&organization_name!=null" href="/coapp/Home">' +
        '           <q-btn dense outline no-caps color="positive" class="m-link">View {{organization_name}}</q-btn>' +
        '       </a>' +
        '       <m-link :href="orderLinkHref">' +
        '           <q-btn dense outline no-caps color="primary" class="m-link">View Order</q-btn>' +
        '       </m-link>' +
        '       <m-link :href="transactionLinkHref">' +
        '           <q-btn dense outline no-caps color="primary" class="m-link">View Transaction</q-btn>' +
        '       </m-link>' +
        '   </div>' +
        '</div>',
    data () {
        return {
            index: 0,
            indeterminate: null,
            value: 0,
            moquiSessionToken: null,
            description: 'Unknown',
            interval: null,
            showButtons: false,
        }
    },
    computed: {
        transactionLinkHref: function() { return "/settingsinternal/TransactionHistory?orderId="+this.order_id; },
        orderLinkHref: function() { return "/settingsinternal/OrderHistory?orderId="+this.order_id; },
    },
    methods: {
        async loopFunction() {
            if (this.index === 0) {
                this.indeterminate = false;
            }
            if (this.index % 5 === 0) {
                // console.log("progress_url "+this.progress_url)
                let _data = new URLSearchParams()
                _data.append("orderId", this.order_id)
                _data.append("moquiSessionToken", this.moquiSessionToken)

                // See https://web.dev/introduction-to-fetch/#post-request for the fetch api
                const response = await fetch(this.progress_url, {
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

                const { statusId, description, messages, errors } = await response.json();
                moqui.notifyMessages(messages, errors, null);

                this.description = description;
                if (['OrderCompleted','OrderApproved'].includes(statusId)) {
                    this.value = 1;
                    clearInterval(this.interval); // Clear the interval
                    moqui.notifyMessages(messages, errors, null);
                    this.showButtons = true;
                    return;
                }
                // console.log(statusId)
            }
            this.value = this.value + ((200/15000))+.000000001;
            if (this.value >= 1 || this.index === 74) {
                this.indeterminate = true;
            }
            // console.log("This message shows every 200 ms for 15 seconds: value " + this.value);
        }
    },
    mounted: function() {
        this.moquiSessionToken = $("#confMoquiSessionToken").val();
        var vm = this;

        // This interval will run every 200 ms
        vm.interval = setInterval(vm.loopFunction, 200);

        // This timeout will clear the interval after 15 seconds
        setTimeout(() => {
            clearInterval(vm.interval);
            this.showButtons = true;
            console.log("The loop has stopped after 15 seconds");
        }, 15000);

    },
});