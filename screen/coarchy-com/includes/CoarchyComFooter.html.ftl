        </q-page></q-page-container>

<#--        &lt;#&ndash; <r-menu></r-menu> &ndash;&gt;-->
    </q-layout>

<#--    &lt;#&ndash; re-login dialog &ndash;&gt;-->
<#--    <m-dialog v-model="reLoginShow" width="375" title="${ec.l10n.localize("Re-Login")}">-->
<#--        <div v-if="reLoginMfaData">-->
<#--            <div style="text-align:center;padding-bottom:10px">User <strong>{{username}}</strong> requires an authentication code, you have these options:</div>-->
<#--            <div style="text-align:center;padding-bottom:10px">{{reLoginMfaData.factorTypeDescriptions.join(", ")}}</div>-->
<#--            <q-form @submit.prevent="reLoginVerifyOtp" autocapitalize="off" autocomplete="off">-->
<#--                <q-input v-model="reLoginOtp" name="code" type="password" :autofocus="true" :noPassToggle="false"-->
<#--                         outlined stack-label label="${ec.l10n.localize("Authentication Code")}"></q-input>-->
<#--                <q-btn outline no-caps color="primary" type="submit" label="${ec.l10n.localize("Sign in")}"></q-btn>-->
<#--            </q-form>-->
<#--            <div v-for="sendableFactor in reLoginMfaData.sendableFactors" style="padding:8px">-->
<#--                <q-btn outline no-caps dense-->
<#--                       :label="'${ec.l10n.localize("Send code to")} ' + sendableFactor.factorOption"-->
<#--                       @click.prevent="reLoginSendOtp(sendableFactor.factorId)"></q-btn>-->
<#--            </div>-->
<#--        </div>-->
<#--        <div v-else>-->
<#--            <div style="text-align:center;padding-bottom:10px">Please sign in to continue as user <strong>{{username}}</strong></div>-->
<#--            <q-form @submit.prevent="reLoginSubmit" autocapitalize="off" autocomplete="off">-->
<#--                <q-input v-model="reLoginPassword" name="password" type="password" :autofocus="true"-->
<#--                         outlined stack-label label="${ec.l10n.localize("Password")}"></q-input>-->
<#--                <q-btn outline no-caps color="primary" type="submit" label="${ec.l10n.localize("Sign in")}"></q-btn>-->
<#--                <q-btn outline no-caps color="negative" @click.prevent="reLoginReload" label="${ec.l10n.localize("Reload Page")}"></q-btn>-->
<#--            </q-form>-->
<#--        </div>-->
<#--    </m-dialog>-->
</div>

<script>
    window.quasarConfig = {
        brand: { // this will NOT work on IE 11
            // primary: '#e46262',
            info:'#1e7b8e',
            secondary: '#646464',
        },
        notify: { progress:true, closeBtn:'X' }, // default set of options for Notify Quasar plugin
        // loading: {...}, // default set of options for Loading Quasar plugin
        loadingBar: { color:'primary' }, // settings for LoadingBar Quasar plugin
        // ..and many more (check Installation card on each Quasar component/directive/plugin)
    }
</script>

<#--${sri.getAfterScreenWriterText()}-->

<#-- Footer JavaScript -->
<#list footer_scripts?if_exists as scriptLocation>
    <#assign srcUrl = sri.buildUrl(scriptLocation).url>
    <script src="${srcUrl}<#if !scriptLocation?starts_with("http") && !srcUrl?contains("?")>?v=${ec.web.getResourceDistinctValue()}</#if>" type="text/javascript"></script>
</#list>
<#--<#assign scriptText = sri.getScriptWriterText()>-->
<#--<#if scriptText?has_content>-->
<#--    <script>-->
<#--        ${scriptText}-->
<#--        $(window).on('unload', function(){}); // Does nothing but break the bfcache-->
<#--    </script>-->
<#--</#if>-->

        <script>
            AOS.init();
        </script>

</body>
</html>
