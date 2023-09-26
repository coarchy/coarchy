<h4 class="q-pb-sm">Actors:</h4>
<#list actorList! as actor>
    <#if actor.name?hasContent><div><b>${actor.name?html}</b><#if actor.description?hasContent>: ${actor.description?html}</#if></div></#if>
</#list>
<#if showActivities! == 'Y'>
<hr>
<h4 class="q-pb-sm">Activities:</h4>
<#list actorList! as actor>
    <#if actor.name?hasContent><div><b>${actor.name?html}</b></div></#if>
    <#if actor.processStoryActivityList!?size &gt; 0><ul></#if>
    <#list actor.processStoryActivityList! as processStoryActivity><li>
        <#if processStoryActivity.condition?hasContent><i>${processStoryActivity.condition?html?ensureEndsWith(",")} </i></#if>
        <#list processStoryActivity.actorNames! as actorName><b>${actorName?html}</b><#sep>, </#list>
        <#if processStoryActivity.action?hasContent>${processStoryActivity.action?html?removeEnding(".")?ensureEndsWith(".")} <#else><br/><br/></#if>
        </li></#list>
    <#if actor.processStoryActivityList!?size &gt; 0></ul></br></#if>
</#list>
</#if>