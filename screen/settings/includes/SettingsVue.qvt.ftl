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
    <input type="hidden" id="confBasePath" value="${ec.web.servletContext.contextPath}/settingsinternal">
    <input type="hidden" id="confLinkBasePath" value="${ec.web.servletContext.contextPath}/settings">
    <input type="hidden" id="confUserId" value="${ec.user.userId!''}">
    <input type="hidden" id="confUsername" value="${ec.user.username!''}">
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
        <q-header class="${headerClass}" id="top">

            <q-bar class="bg-secondary text-black">
                <div class="justify-center text-bold">For feedback or support, contact our founder Michael at <a href="mailto:michael@coarchy.com">michael@coarchy.com</a> or <a href="sms:+18019958124">(801) 995-8124</a></div>
            </q-bar>

            <q-toolbar style="font-size:15px;">

<#--            <#assign headerLogoList = sri.getThemeValues("STRT_HEADER_LOGO")>-->
            <#if headerLogoList?has_content>
                <m-link href="/settings"><div class="q-mx-md q-mt-sm">
                    <img src="${sri.buildUrl(headerLogoList?first).getUrl()}" alt="Home" height="32">
                </div></m-link>
            </#if>
            <#assign headerTitleList = sri.getThemeValues("STRT_HEADER_TITLE")>
            <#if headerTitleList?has_content>
            <q-toolbar-title>${ec.resource.expand(headerTitleList?first, "")}</q-toolbar-title>
            </#if>

            <#-- NOTE: tried using q-breadcrumbs but last item with q-breadcrumbs--last class makes never clickable! -->
            <template v-for="(navMenuItem, menuIndex) in navMenuList"><template v-if="menuIndex < (navMenuList.length - 1)">
                    <m-link v-if="navMenuItem.hasTabMenu" :href="getNavHref(menuIndex)" class="gt-xs">{{navMenuItem.title}}</m-link>
                    <div v-else-if="navMenuItem.subscreens && navMenuItem.subscreens.length" class="cursor-pointer gt-xs">
                        {{navMenuItem.title}}
                        <q-menu anchor="bottom left" self="top left"><q-list dense style="min-width: 200px">
                                <q-item v-for="subscreen in navMenuItem.subscreens" :key="subscreen.name" :class="{'bg-primary':subscreen.active, 'text-white':subscreen.active}" clickable v-close-popup><q-item-section>
                                        <m-link :href="subscreen.pathWithParams">
                                            <template v-if="subscreen.image">
                                                <i v-if="subscreen.imageType === 'icon'" :class="subscreen.image" style="padding-right: 4px;"></i>
                                                <img v-else :src="subscreen.image" :alt="subscreen.title" width="18" class="invertible" style="padding-right: 4px;">
                                            </template>
                                            <i v-else class="fa fa-link" style="padding-right: 8px;"></i>
                                            {{subscreen.title}}
                                        </m-link></li>
                                    </q-item-section></q-item>
                            </q-list></q-menu>
                    </div>
                    <m-link v-else :href="getNavHref(menuIndex)" class="gt-xs">{{navMenuItem.title}}</m-link>
                    <q-icon size="1.5em" name="chevron_right" color="grey" class="gt-xs"></q-icon>
                </template></template>
            <m-link v-if="navMenuList.length > 0" :href="getNavHref(navMenuList.length - 1)" class="gt-xs">{{navMenuList[navMenuList.length - 1].title}}</m-link>

            <q-space></q-space>

            <#-- spinner, usually hidden -->
            <q-circular-progress indeterminate size="20px" color="light-blue" class="q-ma-xs" :class="{ hidden: loading < 1 }"></q-circular-progress>

            <#-- QZ print options placeholder -->
<#--            <component :is="qzVue" ref="qzVue"></component>-->

            <#-- screen documentation/help -->
<#--            <q-btn push icon="help_outline" color="info" :class="{hidden:!documentMenuList.length}">-->
<#--                <q-tooltip>${ec.l10n.localize("Documentation")}</q-tooltip>-->
<#--                <q-menu><q-list dense class="q-my-md">-->
<#--                    <q-item v-for="screenDoc in documentMenuList" :key="screenDoc.index"><q-item-section>-->
<#--                        <m-dynamic-dialog :url="currentPath + '/screenDoc?docIndex=' + screenDoc.index" :button-text="screenDoc.title" :title="screenDoc.title"></m-dynamic-dialog>-->
<#--                    </q-item-section></q-item>-->
<#--                </q-list></q-menu>-->
<#--            </q-btn>-->

            <#-- nav plugins See in root CoarchyComVue.qvt.ftl -->
<#--            <template v-for="navPlugin in navPlugins"><component :is="navPlugin"></component></template>-->

            <#-- notify history See in root CoarchyComVue.qvt.ftl -->

            <#-- screen history menu See in root CoarchyComVue.qvt.ftl -->

                <q-btn color="secondary" class="text-black" label="${(ec.user.userAccount.userFullName)!'Account'}">
                    <q-menu auto-close>
                        <q-list dense style="min-width: 100px">
<#--                            <q-item clickable>-->
<#--                                <q-item-section><q-btn flat label="Application" type="a" href="${sri.buildUrl("/coapp/FindProcessStory").url}">-->
<#--                                        <q-tooltip>Go to Application</q-tooltip></q-btn>-->
<#--                                </q-item-section>-->
<#--                            </q-item>-->
                            <q-item clickable>
                                <q-item-section>
                                    <q-btn flat label="Logout" color="negative" type="a" href="${sri.buildUrl("/Login/logout").url}"
                                                       onclick="return confirm('${ec.l10n.localize("Logout")} ${(ec.user.userAccount.userFullName)!''}?')">
                                        <q-tooltip>${ec.l10n.localize("Logout")} ${(ec.user.userAccount.userFullName)!''}</q-tooltip></q-btn>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
<#--            <q-btn push icon="account_circle">-->
<#--                <q-tooltip>${(ec.user.userAccount.userFullName)!ec.l10n.localize("Account")}</q-tooltip>-->
<#--                <q-menu><q-card flat bordered>&lt;#&ndash; always matching header (dark): class="${headerClass}" &ndash;&gt;-->
<#--                        <q-card-section horizontal class="q-pa-md">-->
<#--                            <q-card-actions vertical class="justify-around q-px-md">-->
                                <#-- logout button -->

                                <#-- dark/light switch -->
                                <#-- re-login button -->
<#--                                <q-btn flat dense icon="autorenew" color="negative" @click="reLoginShowDialog"><q-tooltip>Re-Login</q-tooltip></q-btn>-->
<#--                            </q-card-actions>-->
<#--                        </q-card-section>-->
<#--                    </q-card></q-menu>-->
<#--            </q-btn>-->
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
            info:'#1e7b8e',
            secondary: '#b5b5b5',
        },
        notify: { progress:true, closeBtn:'X' }, // default set of options for Notify Quasar plugin
        // loading: {...}, // default set of options for Loading Quasar plugin
        loadingBar: { color:'primary' }, // settings for LoadingBar Quasar plugin
        // ..and many more (check Installation card on each Quasar component/directive/plugin)
    }
</script>
