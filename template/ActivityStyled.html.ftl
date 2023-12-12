<div v-pre>
    <#if detailProcessStoryId?hasContent><a href="${sri.buildUrl('/coapp/Process/EditProcessStory').url}${'?processStoryId='+detailProcessStoryId}"></#if>
    <#if processStoryActivity.condition?hasContent><i>${processStoryActivity.condition?html?capFirst?ensureEndsWith(",")} </i></#if>
    <#list processStoryActivity.actorNames! as actorName><b>${actorName?html}</b><#sep>, </#list>
    <#if processStoryActivity.action?hasContent>${processStoryActivity.action?html?removeEnding(".")?ensureEndsWith(".")} <#else><br/></#if>
    <#if detailProcessStoryId?hasContent></a></#if>
</div>
