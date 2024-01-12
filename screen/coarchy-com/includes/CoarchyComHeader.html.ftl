<!DOCTYPE HTML>
<html>
<head lang="en-us" dir="ltr">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <#if html_keywords?has_content><meta name="keywords" content="${html_keywords}"></#if>
    <#if html_description?has_content><meta name="description" content="${html_description}"></#if>
    <title><#if html_title?has_content>${html_title}<#else><#if parentMenuName?has_content>${ec.resource.expand(parentMenuName, "")} - </#if><#if defaultMenuName?has_content>${ec.resource.expand(defaultMenuName, "")}</#if></#if></title>
    <link rel="apple-touch-icon" href="/coarchy120.png"/>
    <#-- Style Sheets -->
<#--    <#list sri.getThemeValues("STRT_STYLESHEET") as styleSheetLocation>-->
<#--        <#assign hrefUrl = sri.buildUrl(styleSheetLocation).url>-->
<#--        <link href="${hrefUrl}<#if !styleSheetLocation?starts_with("http") && !hrefUrl?contains("?")>?v=${ec.web.getResourceDistinctValue()}</#if>" rel="stylesheet" type="text/css">-->
<#--    </#list>-->
    <#list html_stylesheets?if_exists as styleSheetLocation>
        <#assign hrefUrl = sri.buildUrl(styleSheetLocation).url>
        <link href="${hrefUrl}<#if !styleSheetLocation?starts_with("http") && !hrefUrl?contains("?")>?v=${ec.web.getResourceDistinctValue()}</#if>" rel="stylesheet" type="text/css">
    </#list>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@quasar/extras/material-icons/material-icons.css">
    <#-- JavaScript -->
    <#list html_scripts?if_exists as scriptLocation>
        <#assign srcUrl = sri.buildUrl(scriptLocation).url>
        <script src="${srcUrl}<#if !scriptLocation?starts_with("http") && !srcUrl?contains("?")>?v=${ec.web.getResourceDistinctValue()}</#if>" type="text/javascript"></script>
    </#list>
    <#list sri.getThemeValues("STRT_SCRIPT") as scriptLocation>
        <#assign srcUrl = sri.buildUrl(scriptLocation).url>
        <script src="${srcUrl}<#if !scriptLocation?starts_with("http") && !srcUrl?contains("?")>?v=${ec.web.getResourceDistinctValue()}</#if>" type="text/javascript"></script>
    </#list>
    <script defer data-domain="coarchy.com" src="https://plausible.io/js/script.js"></script>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-E3HKP870ZN">
    </script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-E3HKP870ZN');
    </script>
    <#-- Icon -->
    <#list sri.getThemeValues("STRT_SHORTCUT_ICON") as iconLocation>
        <link rel="shortcut icon" href="${sri.buildUrl(iconLocation).url}">
    </#list>
</head>
<#assign bodyClassList = sri.getThemeValues("STRT_BODY_CLASS")>
<#assign instancePurpose = Static["java.lang.System"].getProperty("instance_purpose")!"production">
<body class="${instancePurpose}<#list bodyClassList as bodyClass> ${bodyClass}</#list> ${(sri.screenUrlInfo.targetScreen.screenName)!""}<#if hideNav! == "true"> hide-nav</#if>">

<#--&lt;#&ndash; End of original Header &ndash;&gt;-->
<div id="apps-root" style=""><#-- NOTE: webrootVue component attaches here, uses this and below for template -->
    <input type="hidden" id="confMoquiSessionToken" value="${ec.web.sessionToken}">
    <input type="hidden" id="confAppHost" value="${ec.web.getHostName(true)}">
    <input type="hidden" id="confAppRootPath" value="${ec.web.servletContext.contextPath}">
    <input type="hidden" id="confBasePath" value="${ec.web.servletContext.contextPath}/minternal">
    <input type="hidden" id="confLinkBasePath" value="${ec.web.servletContext.contextPath}/">
    <input type="hidden" id="confUserId" value="${ec.user.userId!''}">
    <input type="hidden" id="confUsername" value="${ec.user.username!''}">
    <input type="hidden" id="confLocale" value="${ec.user.locale.toLanguageTag()}">
    <input type="hidden" id="confDarkMode" value="${ec.user.getPreference("QUASAR_DARK")!"false"}">
    <input type="hidden" id="confLeftOpen" value="${ec.user.getPreference("QUASAR_LEFT_OPEN")!"false"}">
<#--    &lt;#&ndash;    <#assign navbarCompList = sri.getThemeValues("STRT_HEADER_NAVBAR_COMP")>&ndash;&gt;-->
<#--    &lt;#&ndash;    <#list navbarCompList! as navbarCompUrl><input type="hidden" class="confNavPluginUrl" value="${navbarCompUrl}"></#list>&ndash;&gt;-->
<#--    &lt;#&ndash;    <#assign accountCompList = sri.getThemeValues("STRT_HEADER_ACCOUNT_COMP")>&ndash;&gt;-->
<#--    &lt;#&ndash;    <#list accountCompList! as accountCompUrl><input type="hidden" class="confAccountPluginUrl" value="${accountCompUrl}"></#list>&ndash;&gt;-->

    <#assign headerClass = "text-black">

    <#-- for layout options see: https://quasar.dev/layout/layout -->
    <#-- to build a layout use the handy Quasar tool: https://quasar.dev/layout-builder -->
    <q-layout view="hHh LpR fFf">
        <q-header class="${headerClass}" id="top"><q-toolbar style="font-size:15px; background: #eeeeee;">
                <q-btn stretch flat href="/">
                    <#assign headerLogoList = sri.getThemeValues("STRT_HEADER_LOGO")>
                    <#if headerLogoList?has_content>
                        <img src="${sri.buildUrl(headerLogoList?first).getUrl()}" alt="Home" height="42">
                    </#if>
                </q-btn>

                <q-space></q-space>

                <q-btn-dropdown stretch flat label="Products">
                    <div class="row">
                        <div class="col col-md-6 col-sm-12">
<#--                        <div class="col col-12">-->
                            <div class="text-h6 q-pa-md">Coarchy App</div>

                            <q-list dense class="q-pb-md">
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Process Stories" href="/ProcessStories"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Actors" href="/Actors"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Organizations" href="/ManageOrganization"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Requirements Statements" href="/RequirementsStatements"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Checklists" href="/Checklists"></q-btn></q-item-section>
                                </q-item>
                            </q-list>
                        </div>
                        <div class="col col-md-6 col-sm-12">
                            <div class="text-h6 q-pa-md">Services</div>

                            <q-list dense>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Intro Training" href="/2HourTraining"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Personalized Training" href="/4HourTraining"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Support" href="/Support"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Business Analyst Consulting" href="/BusinessAnalystConsulting"></q-btn></q-item-section>
                                </q-item>
                            </q-list>
                        </div>
<#--                        <div class="col col-md-6 col-sm-12">-->
<#--                            <div class="text-h6 q-pa-md">Demo</div>-->

<#--                            <q-list dense>-->
<#--                            </q-list>-->
<#--                        </div>-->
                    </div>
                </q-btn-dropdown>
                <q-btn-dropdown stretch flat label="Solutions">
                    <div class="row" style="min-width: 500px">
                        <div class="col col-md-6 col-sm-12">
                            <div class="text-h6 q-pa-md">Roles</div>

                            <q-list dense class="q-pb-md">
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Business Analyst" href="/BusinessAnalyst"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Business Owner" href="/Owner"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="IT Consultant" href="/ItConsultant"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Developer" href="/Developer"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Project Manager" href="/ProjectManager"></q-btn></q-item-section>
                                </q-item>
                            </q-list>
                        </div>
                        <div class="col col-md-6 col-sm-12">
                            <div class="text-h6 q-pa-md">Objectives</div>
                            <q-list dense>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Requirement Gathering" href="/RequirementGathering"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Align Organization" href="/AlignOrganization"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Software Evaluation" href="/SoftwareEvaluation"></q-btn></q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section><q-btn stretch flat label="Software Design" href="/SoftwareDesign"></q-btn></q-item-section>
                                </q-item>
                            </q-list>
                        </div>
                    </div>
                </q-btn-dropdown>
                <q-btn stretch flat label="Newsletter" href="/Newsletter"></q-btn>
                <q-separator dark vertical></q-separator>
                <q-btn stretch flat label="Log In" href="/Login"></q-btn>
                <q-separator dark vertical></q-separator>
                <q-btn stretch flat label="Sign Up" href="/SignUp"></q-btn>

                <q-space></q-space>

                <#--                <#assign headerTitleList = sri.getThemeValues("STRT_HEADER_TITLE")>-->
<#--                <#if headerTitleList?has_content>-->
<#--                    <q-toolbar-title>${ec.resource.expand(headerTitleList?first, "")}</q-toolbar-title>-->
<#--                </#if>-->

<#--                &lt;#&ndash; NOTE: tried using q-breadcrumbs but last item with q-breadcrumbs--last class makes never clickable! &ndash;&gt;-->
<#--                &lt;#&ndash;            <template v-for="(navMenuItem, menuIndex) in navMenuList"><template v-if="menuIndex < (navMenuList.length - 1)">&ndash;&gt;-->
<#--                &lt;#&ndash;                    <m-link v-if="navMenuItem.hasTabMenu" :href="getNavHref(menuIndex)" class="gt-xs">{{navMenuItem.title}}</m-link>&ndash;&gt;-->
<#--                &lt;#&ndash;                    <div v-else-if="navMenuItem.subscreens && navMenuItem.subscreens.length" class="cursor-pointer gt-xs">&ndash;&gt;-->
<#--                &lt;#&ndash;                        {{navMenuItem.title}}&ndash;&gt;-->
<#--                &lt;#&ndash;                        <q-menu anchor="bottom left" self="top left"><q-list dense style="min-width: 200px">&ndash;&gt;-->
<#--                &lt;#&ndash;                                <q-item v-for="subscreen in navMenuItem.subscreens" :key="subscreen.name" :class="{'bg-primary':subscreen.active, 'text-white':subscreen.active}" clickable v-close-popup><q-item-section>&ndash;&gt;-->
<#--                &lt;#&ndash;                                        <m-link :href="subscreen.pathWithParams">&ndash;&gt;-->
<#--                &lt;#&ndash;                                            <template v-if="subscreen.image">&ndash;&gt;-->
<#--                &lt;#&ndash;                                                <i v-if="subscreen.imageType === 'icon'" :class="subscreen.image" style="padding-right: 4px;"></i>&ndash;&gt;-->
<#--                &lt;#&ndash;                                                <img v-else :src="subscreen.image" :alt="subscreen.title" width="18" class="invertible" style="padding-right: 4px;">&ndash;&gt;-->
<#--                &lt;#&ndash;                                            </template>&ndash;&gt;-->
<#--                &lt;#&ndash;                                            <i v-else class="fa fa-link" style="padding-right: 8px;"></i>&ndash;&gt;-->
<#--                &lt;#&ndash;                                            {{subscreen.title}}&ndash;&gt;-->
<#--                &lt;#&ndash;                                        </m-link></li>&ndash;&gt;-->
<#--                &lt;#&ndash;                                    </q-item-section></q-item>&ndash;&gt;-->
<#--                &lt;#&ndash;                            </q-list></q-menu>&ndash;&gt;-->
<#--                &lt;#&ndash;                    </div>&ndash;&gt;-->
<#--                &lt;#&ndash;                    <m-link v-else :href="getNavHref(menuIndex)" class="gt-xs">{{navMenuItem.title}}</m-link>&ndash;&gt;-->
<#--                &lt;#&ndash;                    <q-icon size="1.5em" name="chevron_right" color="grey" class="gt-xs"></q-icon>&ndash;&gt;-->
<#--                &lt;#&ndash;                </template></template>&ndash;&gt;-->
<#--                &lt;#&ndash;            <m-link v-if="navMenuList.length > 0" :href="getNavHref(navMenuList.length - 1)" class="gt-xs">{{navMenuList[navMenuList.length - 1].title}}</m-link>&ndash;&gt;-->

<#--                &lt;#&ndash; spinner, usually hidden &ndash;&gt;-->
<#--                &lt;#&ndash;            <q-circular-progress indeterminate size="20px" color="light-blue" class="q-ma-xs" :class="{ hidden: loading < 1 }"></q-circular-progress>&ndash;&gt;-->

<#--                &lt;#&ndash; QZ print options placeholder &ndash;&gt;-->
<#--                &lt;#&ndash;            <component :is="qzVue" ref="qzVue"></component>&ndash;&gt;-->

<#--                &lt;#&ndash; screen documentation/help &ndash;&gt;-->
<#--                &lt;#&ndash;            <q-btn push icon="help_outline" color="info" :class="{hidden:!documentMenuList.length}">&ndash;&gt;-->
<#--                &lt;#&ndash;                <q-tooltip>${ec.l10n.localize("Documentation")}</q-tooltip>&ndash;&gt;-->
<#--                &lt;#&ndash;                <q-menu><q-list dense class="q-my-md">&ndash;&gt;-->
<#--                &lt;#&ndash;                    <q-item v-for="screenDoc in documentMenuList" :key="screenDoc.index"><q-item-section>&ndash;&gt;-->
<#--                &lt;#&ndash;                        <m-dynamic-dialog :url="currentPath + '/screenDoc?docIndex=' + screenDoc.index" :button-text="screenDoc.title" :title="screenDoc.title"></m-dynamic-dialog>&ndash;&gt;-->
<#--                &lt;#&ndash;                    </q-item-section></q-item>&ndash;&gt;-->
<#--                &lt;#&ndash;                </q-list></q-menu>&ndash;&gt;-->
<#--                &lt;#&ndash;            </q-btn>&ndash;&gt;-->

<#--                &lt;#&ndash; nav plugins See in root CoarchyComVue.qvt.ftl &ndash;&gt;-->
<#--                &lt;#&ndash;            <template v-for="navPlugin in navPlugins"><component :is="navPlugin"></component></template>&ndash;&gt;-->

<#--                &lt;#&ndash; notify history See in root CoarchyComVue.qvt.ftl &ndash;&gt;-->

<#--                &lt;#&ndash; screen history menu See in root CoarchyComVue.qvt.ftl &ndash;&gt;-->

<#--                &lt;#&ndash;            <q-btn push icon="account_circle">&ndash;&gt;-->
<#--                &lt;#&ndash;                <q-tooltip>${(ec.user.userAccount.userFullName)!ec.l10n.localize("Account")}</q-tooltip>&ndash;&gt;-->
<#--                &lt;#&ndash;                <q-menu><q-card flat bordered>&lt;#&ndash; always matching header (dark): class="${headerClass}" &ndash;&gt;&ndash;&gt;-->
<#--                &lt;#&ndash;                        <q-card-section horizontal class="q-pa-md">&ndash;&gt;-->
<#--                &lt;#&ndash;                            <q-card-actions vertical class="justify-around q-px-md">&ndash;&gt;-->
<#--                &lt;#&ndash; logout button &ndash;&gt;-->
<#--                &lt;#&ndash;                                <q-btn flat label="Logout" color="negative" type="a" href="${sri.buildUrl("/Login/logout").url}"&ndash;&gt;-->
<#--                &lt;#&ndash;                                       onclick="return confirm('${ec.l10n.localize("Logout")} ${(ec.user.userAccount.userFullName)!''}?')">&ndash;&gt;-->
<#--                &lt;#&ndash;                                    <q-tooltip>${ec.l10n.localize("Logout")} ${(ec.user.userAccount.userFullName)!''}</q-tooltip></q-btn>&ndash;&gt;-->
<#--                &lt;#&ndash; dark/light switch &ndash;&gt;-->
<#--                &lt;#&ndash; re-login button &ndash;&gt;-->
<#--                &lt;#&ndash;                                <q-btn flat dense icon="autorenew" color="negative" @click="reLoginShowDialog"><q-tooltip>Re-Login</q-tooltip></q-btn>&ndash;&gt;-->
<#--                &lt;#&ndash;                            </q-card-actions>&ndash;&gt;-->
<#--                &lt;#&ndash;                        </q-card-section>&ndash;&gt;-->
<#--                &lt;#&ndash;                    </q-card></q-menu>&ndash;&gt;-->
<#--                &lt;#&ndash;            </q-btn>&ndash;&gt;-->
            </q-toolbar></q-header>

        <q-page-container class="q-ma-sm"><q-page>
<#-- NOTE: Could use the Vue router for this -->
<#--                <m-subscreens-active></m-subscreens-active>-->