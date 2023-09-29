<h4 class="q-pb-sm">Actors:</h4>
<#list actorList! as actor>
    <#if actor.name?hasContent><div><b><a href="/coapp/Actor?actorId=${actor.actorId}">${actor.name?html}</a></b><#if actor.description?hasContent>: ${actor.description?html}</#if></div><#if actor_has_next><br></#if></#if>
</#list>
<#if showActivities! == 'Y'>
<hr>
<h4 class="q-pb-sm">Activities:</h4>
<#list actorList! as actor>
    <#if actor.name?hasContent><div><b>${actor.name?html}</b></div></#if>
    <#if actor.processStoryActivityList!?size &gt; 0><ul></#if>
    <#list actor.processStoryActivityList! as processStoryActivity><li>
        <#include "ActivityStyled.html.ftl"/>
    </li></#list>
    <#if actor.processStoryActivityList!?size &gt; 0></ul></br></#if>
</#list>
</#if>