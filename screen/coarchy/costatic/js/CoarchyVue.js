Vue.component('c-menu-nav-item', {
    name: "cMenuNavItem",
    props: { menuIndex:Number },
    template:
        '<q-expansion-item v-if="navMenuItem && navMenuItem.subscreens && navMenuItem.subscreens.length" :value="true" :content-inset-level="0.3"' +
        ' switch-toggle-side dense-toggle hide-expand-icon :to="navMenuItem.pathWithParams" @input="go">' +
        '<template v-slot:header><c-menu-item-content :menu-item="navMenuItem" active></c-menu-item-content></template>' +
        '<template v-slot:default><c-menu-subscreen-item v-for="(subscreen, ssIndex) in navMenuItem.subscreens" :key="subscreen.name" :menu-index="menuIndex" :subscreen-index="ssIndex"></c-menu-subscreen-item></template>' +
        '</q-expansion-item>' +
        '<q-expansion-item v-else-if="navMenuItem && navMenuItem.savedFinds && navMenuItem.savedFinds.length" :value="true" :content-inset-level="0.3"' +
        ' switch-toggle-side dense-toggle expanded-icon="arrow_drop_down" :to="navMenuItem.pathWithParams" @input="go">' +
        '<template v-slot:header><c-menu-item-content :menu-item="navMenuItem" active></c-menu-item-content></template>' +
        '<template v-slot:default><q-expansion-item v-for="(savedFind, ssIndex) in navMenuItem.savedFinds" :key="savedFind.name"' +
        ' :value="false" switch-toggle-side dense-toggle expand-icon="chevron_right" :to="savedFind.pathWithParams" @input="goPath(savedFind.pathWithParams)">' +
        '<template v-slot:header><c-menu-item-content :menu-item="savedFind" :active="savedFind.active"/></template>' +
        '</q-expansion-item></template>' +
        '</q-expansion-item>' +
        '<q-expansion-item v-else-if="menuIndex < (navMenuLength - 1)" :value="true" :content-inset-level="0.3"' +
        ' switch-toggle-side dense-toggle expanded-icon="arrow_drop_down" :to="navMenuItem.pathWithParams" @input="go">' +
        '<template v-slot:header><c-menu-item-content :menu-item="navMenuItem" active></c-menu-item-content></template>' +
        '<template v-slot:default><c-menu-nav-item :menu-index="menuIndex + 1"></c-menu-nav-item></template>' +
        '</q-expansion-item>' +
        '<q-expansion-item v-else-if="navMenuItem" :value="false" switch-toggle-side dense-toggle hide-expand-icon :to="navMenuItem.pathWithParams" @input="go">' +
        '<template v-slot:header><c-menu-item-content :menu-item="navMenuItem" active></c-menu-item-content></template>' +
        '</q-expansion-item>',
    methods: {
        go: function go() { this.$root.setUrl(this.navMenuItem.pathWithParams); },
        goPath: function goPath(path) { this.$root.setUrl(path); }
    },
    computed: {
        navMenuItem: function() { return this.$root.navMenuList[this.menuIndex]; },
        navMenuLength: function() { return this.$root.navMenuList.length; }
    }
});
Vue.component('c-menu-subscreen-item', {
    name: "cMenuSubscreenItem",
    props: { menuIndex:Number, subscreenIndex:Number },
    template:
        '<c-menu-nav-item v-if="subscreen.active" :menu-index="menuIndex + 1"></c-menu-nav-item>' +
        '<q-expansion-item v-else :value="false" switch-toggle-side dense-toggle hide-expand-icon :to="subscreen.pathWithParams" @input="go">' +
        '<template v-slot:header><c-menu-item-content :menu-item="subscreen"></c-menu-item-content></template>' +
        '</q-expansion-item>',
    methods: { go: function go() { this.$root.setUrl(this.subscreen.pathWithParams); } },
    computed: { subscreen: function() { return this.$root.navMenuList[this.menuIndex].subscreens[this.subscreenIndex]; } }
});
Vue.component('c-menu-item-content', {
    name: "cMenuItemContent",
    props: { menuItem:Object, active:Boolean },
    template:
        '<div class="q-item__section column q-item__section--main justify-center"><div class="q-item__label">' +
        '<i v-if="menuItem.image && menuItem.imageType === \'icon\'" :class="menuItem.image" style="padding-right: 8px;"></i>' +
        /* TODO: images don't line up vertically, padding-top and margin-top do nothing, very annoying layout stuff, for another time... */
        '<span v-else-if="menuItem.image" style="padding-right:8px;"><img :src="menuItem.image" :alt="menuItem.title" height="18" class="invertible"></span>' +
        '<span :class="{\'text-primary\':active}">{{menuItem.title}}</span>' +
        '</div></div>'
});
