<#list processStoryActivityList! as processStoryActivity>
    <#if processStoryActivity.detailProcessStoryId!?has_content && showSubstoriesActual!>
        <a id="${processStoryActivity.processStoryId!}" href="#${processStoryActivity.detailProcessStoryId}"><#include "ActivityStyled.html.ftl"/></a>
    <#else>
        <#include "ActivityStyled.html.ftl"/>
    </#if>
</#list>
<#if showSubstoriesActual!>
    <br/>
    <hr/>
    <br/>
    <h4>${processStory.name!} Substories</h4>
    <#list processStoryActivityList! as processStoryActivity>
        <@substory processStoryActivity/>
    </#list>
</#if>

<#macro substory processStoryActivity>
    <#if processStoryActivity.detailProcessStoryId!?has_content>
        <a id="${processStoryActivity.detailProcessStoryId!}" href="/coapp/Process/EditProcessStory?processStoryId=${processStoryActivity.detailProcessStoryId!}">${processStoryActivity.detailProcessStoryName} Story</a>
        <#list processStoryActivity.detailProcessStoryActivityList! as processStoryActivity>
            <#if processStoryActivity.detailProcessStoryId!?has_content>
                <a id="${processStoryActivity.processStoryId!}" href="#${processStoryActivity.detailProcessStoryId}"><#include "ActivityStyled.html.ftl"/></a>
            <#else>
                <#include "ActivityStyled.html.ftl"/>
            </#if>
        </#list>
        <#if processStoryActivity.detailProcessStoryActivityList!?size == 0><br/>No activities</#if>
        <hr/>
        <#list processStoryActivity.detailProcessStoryActivityList! as processStoryActivity>
            <@substory processStoryActivity/>
        </#list>
    </#if>
</#macro>

