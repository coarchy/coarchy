<#list processStoryActivityList! as processStoryActivity>
    <#if processStoryActivity.detailProcessStoryId!?has_content>
        <a id="${processStoryActivity.processStoryId!}" href="#${processStoryActivity.detailProcessStoryId}"><#include "ActivityStyled.html.ftl"/></a>
    <#else>
        <#include "ActivityStyled.html.ftl"/>
    </#if>
</#list>
<#if showSubstoriesActual!>
    <hr/>
    <h4>Substories</h4>
    <#list processStoryActivityList! as processStoryActivity>
<#--        ${processSubstoryActivity}-->
        <#if processStoryActivity.detailProcessStoryName!?has_content>
            <a id="${processStoryActivity.detailProcessStoryId!}" href="#${processStoryActivity.processStoryId!}">${processStoryActivity.detailProcessStoryName}</a>
            <#list processStoryActivity.detailProcessStoryActivityList! as processStoryActivity>
                <h6><#include "ActivityStyled.html.ftl"/></h6>
            </#list>
        </#if>
    </#list>
</#if>