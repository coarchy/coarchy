<#list processStoryActivityList! as processStoryActivity>
    <#--(${processStoryActivity.sequenceNum}) -->
    <#if processStoryActivity.condition?hasContent><i>${processStoryActivity.condition?ensureEndsWith(",")} </i></#if>
    <#list processStoryActivity.actorNames! as actorName><b>${actorName}</b> <#sep>, </#list>
    <#if processStoryActivity.action?hasContent>${processStoryActivity.action?removeEnding(".")?ensureEndsWith(".")} <#else><br/><br/></#if>
</#list>
