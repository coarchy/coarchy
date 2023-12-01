<div v-pre>
    <#if processStoryActivity.condition?hasContent><i>${processStoryActivity.condition?html?capFirst?ensureEndsWith(",")} </i></#if>
    <#list processStoryActivity.actorNames! as actorName><b>${actorName?html}</b><#sep>, </#list>
    <#if processStoryActivity.action?hasContent>${processStoryActivity.action?html?removeEnding(".")?ensureEndsWith(".")} <#else><br/></#if>
</div>
