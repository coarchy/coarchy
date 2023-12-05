<div class="numbered-list">
<ol>
<#list processStoryActivityList! as processStoryActivity>
    <#if processStoryActivity.action!?has_content><li></#if>
    <#include "ActivityStyledSpan.html.ftl"/>
    <#if processStoryActivity.detailProcessStoryId!?has_content && showSubstoriesActual>
        <@substory processStoryActivity 1/>
    </#if>
    <#if processStoryActivity.activity!?has_content></li></#if>
    <#if !processStoryActivity.detailProcessStoryId!?has_content><br/></#if>
</#list>
</ol>

<#macro substory processStoryActivity levels>
    <#if processStoryActivity.detailProcessStoryActivityList!?size == 0><#list 1..(levels+1) as level>&nbsp;&nbsp;</#list>No Activities<#else>
        <ol>
        <#list processStoryActivity.detailProcessStoryActivityList! as processStoryActivity>
            <li><#include "ActivityStyledSpan.html.ftl"/><#if processStoryActivity.detailProcessStoryId!?has_content><@substory processStoryActivity levels+1/></#if></li>
        </#list>
        </ol>
    </#if>
</#macro>
</div>