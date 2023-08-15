
new Vue({
    el: '#apps-root',
    data: function () {
        return {
            version: Quasar.version };
    },
    methods: {
        notify: function () {
            this.$q.notify('Running on Quasar v' + this.$q.version);
        }
    }
});