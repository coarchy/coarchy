/* This software is in the public domain under CC0 1.0 Universal plus a Grant of Patent License. */
Vue.component('r-toolbar-left', {
    name: "rToolbarLeft",
    template:
        `<q-btn v-if="backState" flat round dense icon="arrow_back_ios_new" class="q-mr-sm" @click.prevent="goLastPath()"/>`//+
        // `<m-link :href="firstPath"><div class="q-mx-md q-mt-sm">` +
        // `<img src="/costatic/images/CoarchySquare.png" alt="Home" height="32">` +
        // `</div></m-link>`
    ,
    methods: {
        goLastPath: function() {
            // console.log("goPath");
            // console.log(this);
            // console.log(this.$root.navHistoryList[1].pathWithParams)
            // console.log(this.$root.currentPath.substring(0, this.$root.currentPath.lastIndexOf("/")))
            this.$root.setUrl(this.$root.navHistoryList[1] ? this.$root.navHistoryList[1].pathWithParams : this.$root.currentPath.substring(0, this.$root.currentPath.lastIndexOf("/")));
        }
    },
    computed: {
        backState: function () {
            // console.log('menuState')
            // console.log(this)
            // console.log(this.$root.currentPath !== "/cointernal/Message/FindMessage")
            return ["/cointernal/Message/FindMessage",
            //    "/cointernal/Project/ViewProject",
            //    "/cointernal/Project/FindProjectPositions",
            //    "/cointernal/Account/ViewAccount",
            //    "/cointernal/Account/FindTalent",
            ].includes(this.$root.currentPath);
        },
        // firstPath: function() {
        //     // console.log("goPath");
        //     // console.log(this);
        //     // console.log(this.$root.navHistoryList[1].pathWithParams)
        //     // console.log(this.$root.currentPath.substring(0, this.$root.currentPath.lastIndexOf("/")))
        //     return this.$root.currentPath.substring(0, this.$root.currentPath.lastIndexOf("/"));
        // },
    },
});