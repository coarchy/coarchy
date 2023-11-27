<#list processStoryActivityList! as processStoryActivity>
    <#include "ActivityStyledSpan.html.ftl"/>
    <#if processStoryActivity.detailProcessStoryId!?has_content && showSubstoriesActual>
        <@substory processStoryActivity 1/>
    </#if>
    <br/>
</#list>

<#macro substory processStoryActivity levels>
    <br/><#list 1..(levels) as level>&nbsp;&nbsp;</#list><a id="${processStoryActivity.detailProcessStoryId!}" href="/coapp/Process/EditProcessStory?processStoryId=${processStoryActivity.detailProcessStoryId!}">${processStoryActivity.detailProcessStoryName} Story</a>
    <#if processStoryActivity.detailProcessStoryActivityList!?size == 0><br/><#list 1..(levels+1) as level>&nbsp;&nbsp;</#list>No Activities</#if>
    <#list processStoryActivity.detailProcessStoryActivityList! as processStoryActivity><br/><#list 1..(levels) as level>&nbsp;&nbsp;</#list><#include "ActivityStyledSpan.html.ftl"/><#if processStoryActivity.detailProcessStoryId!?has_content><@substory processStoryActivity levels+1/></#if></#list>
</#macro>