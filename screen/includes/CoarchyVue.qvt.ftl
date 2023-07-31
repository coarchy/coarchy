<#--
This software is in the public domain under CC0 1.0 Universal plus a
Grant of Patent License.

To the extent possible under law, the author(s) have dedicated all
copyright and related and neighboring rights to this software to the
public domain worldwide. This software is distributed without any
warranty.

You should have received a copy of the CC0 Public Domain Dedication
along with this software (see the LICENSE.md file). If not, see
<http://creativecommons.org/publicdomain/zero/1.0/>.
-->
<div id="apps-root" style="display:none;"><#-- NOTE: webrootVue component attaches here, uses this and below for template -->
    <input type="hidden" id="confMoquiSessionToken" value="${ec.web.sessionToken}">
    <input type="hidden" id="confAppHost" value="${ec.web.getHostName(true)}">
    <input type="hidden" id="confAppRootPath" value="${ec.web.servletContext.contextPath}">
    <input type="hidden" id="confBasePath" value="${ec.web.servletContext.contextPath}/cointernal">
    <input type="hidden" id="confLinkBasePath" value="${ec.web.servletContext.contextPath}/coapp">
    <input type="hidden" id="confUserId" value="${ec.user.userId!''}">
    <input type="hidden" id="confUsername" value="${ec.user.username!''}">
    <#-- TODO get secondFactorRequired (org.moqui.impl.UserServices.get#UserAuthcFactorRequired with userId) -->
    <input type="hidden" id="confLocale" value="${ec.user.locale.toLanguageTag()}">
    <input type="hidden" id="confDarkMode" value="${ec.user.getPreference("QUASAR_DARK")!"false"}">
    <input type="hidden" id="confLeftOpen" value="${ec.user.getPreference("QUASAR_LEFT_OPEN")!"false"}">
    <#assign navbarCompList = sri.getThemeValues("STRT_HEADER_NAVBAR_COMP")>
    <#list navbarCompList! as navbarCompUrl><input type="hidden" class="confNavPluginUrl" value="${navbarCompUrl}"></#list>
    <#assign accountCompList = sri.getThemeValues("STRT_HEADER_ACCOUNT_COMP")>
    <#list accountCompList! as accountCompUrl><input type="hidden" class="confAccountPluginUrl" value="${accountCompUrl}"></#list>

    <#assign headerClass = "text-black bg-grey-1">

    <#-- for layout options see: https://quasar.dev/layout/layout -->
    <#-- to build a layout use the handy Quasar tool: https://quasar.dev/layout-builder -->
    <q-layout view="hHh LpR fFf">
        <q-header class="${headerClass}" id="top"><q-toolbar style="font-size:15px;">

<#--            <#assign headerLogoList = sri.getThemeValues("STRT_HEADER_LOGO")>-->
            <#if headerLogoList?has_content>
                <m-link href="/copps"><div class="q-mx-md q-mt-sm">
                    <img src="${sri.buildUrl(headerLogoList?first).getUrl()}" alt="Home" height="32">
                </div></m-link>
            </#if>
            <#assign headerTitleList = sri.getThemeValues("STRT_HEADER_TITLE")>
            <#if headerTitleList?has_content>
            <q-toolbar-title>${ec.resource.expand(headerTitleList?first, "")}</q-toolbar-title>
            </#if>

            <q-space></q-space>

            <#-- spinner, usually hidden -->
            <q-circular-progress indeterminate size="20px" color="light-blue" class="q-ma-xs" :class="{ hidden: loading < 1 }"></q-circular-progress>

            <#-- QZ print options placeholder -->
            <component :is="qzVue" ref="qzVue"></component>

            <#-- screen documentation/help -->
            <q-btn push icon="help_outline" color="info" :class="{hidden:!documentMenuList.length}">
                <q-tooltip>${ec.l10n.localize("Documentation")}</q-tooltip>
                <q-menu><q-list dense class="q-my-md">
                    <q-item v-for="screenDoc in documentMenuList" :key="screenDoc.index"><q-item-section>
                        <m-dynamic-dialog :url="currentPath + '/screenDoc?docIndex=' + screenDoc.index" :button-text="screenDoc.title" :title="screenDoc.title"></m-dynamic-dialog>
                    </q-item-section></q-item>
                </q-list></q-menu>
            </q-btn>

            <#-- nav plugins See in root CoarchyVue.qvt.ftl -->

            <#-- notify history See in root CoarchyVue.qvt.ftl -->

            <#-- screen history menu See in root CoarchyVue.qvt.ftl -->

        </q-toolbar></q-header>

        <q-page-container class="q-ma-sm"><q-page>
            <m-subscreens-active></m-subscreens-active>
        </q-page></q-page-container>

        <#-- <r-menu></r-menu> -->
    </q-layout>

    <#-- re-login dialog -->
    <m-dialog v-model="reLoginShow" width="375" title="${ec.l10n.localize("Re-Login")}">
        <div v-if="reLoginMfaData">
            <div style="text-align:center;padding-bottom:10px">User <strong>{{username}}</strong> requires an authentication code, you have these options:</div>
            <div style="text-align:center;padding-bottom:10px">{{reLoginMfaData.factorTypeDescriptions.join(", ")}}</div>
            <q-form @submit.prevent="reLoginVerifyOtp" autocapitalize="off" autocomplete="off">
                <q-input v-model="reLoginOtp" name="code" type="password" :autofocus="true" :noPassToggle="false"
                         outlined stack-label label="${ec.l10n.localize("Authentication Code")}"></q-input>
                <q-btn outline no-caps color="primary" type="submit" label="${ec.l10n.localize("Sign in")}"></q-btn>
            </q-form>
            <div v-for="sendableFactor in reLoginMfaData.sendableFactors" style="padding:8px">
                <q-btn outline no-caps dense
                       :label="'${ec.l10n.localize("Send code to")} ' + sendableFactor.factorOption"
                       @click.prevent="reLoginSendOtp(sendableFactor.factorId)"></q-btn>
            </div>
        </div>
        <div v-else>
            <div style="text-align:center;padding-bottom:10px">Please sign in to continue as user <strong>{{username}}</strong></div>
            <q-form @submit.prevent="reLoginSubmit" autocapitalize="off" autocomplete="off">
                <q-input v-model="reLoginPassword" name="password" type="password" :autofocus="true"
                         outlined stack-label label="${ec.l10n.localize("Password")}"></q-input>
                <q-btn outline no-caps color="primary" type="submit" label="${ec.l10n.localize("Sign in")}"></q-btn>
                <q-btn outline no-caps color="negative" @click.prevent="reLoginReload" label="${ec.l10n.localize("Reload Page")}"></q-btn>
            </q-form>
        </div>
    </m-dialog>
</div>

<script>
    window.quasarConfig = {
        brand: { // this will NOT work on IE 11
            // primary: '#e46262',
            info:'#1e7b8e'
        },
        notify: { progress:true, closeBtn:'X', position:'top-right' }, // default set of options for Notify Quasar plugin
        // loading: {...}, // default set of options for Loading Quasar plugin
        loadingBar: { color:'primary' }, // settings for LoadingBar Quasar plugin
        // ..and many more (check Installation card on each Quasar component/directive/plugin)
    }
</script>
