// Components
Vue.component('m-stripe', {
    name: "mStripe",
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

            const { clientSecret } = await response.json();

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
                    return_url: "http://localhost:8080/settings/OrderHistory",
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
            items: [{ id: "xl-tshirt" }],
            stripe: null,
            emailAddress: "",
            elements: null
        }
    },
    mounted: function() {
        var vm = this;
        moqui.loadScript('https://js.stripe.com/v3', function(err) {
            if (err) {
                console.error("Error loading stripe: " + err);
                return;
            }
            // This is your test publishable API key.
            vm.stripe = Stripe("pk_test_51NwtETDVIK4XcJLUKKfmdgqu4P7JZXG2OYxvI2RwINSohtadc4IIhdHr9yxjDat8fTA1k0noud5oyVWAlMjL9kxS00uDSFLMI3")
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