<h5 class="q-pb-sm">Actors:</h5>
<#list actorList! as actor>
    <#if actor.name?hasContent><div><b><a href="#${actor.actorId!}">${actor.name?html}</a></b><#if actor.description?hasContent>: ${actor.description?html}</#if></div><#if actor_has_next><br></#if></#if>
</#list>
<#if showActivities! == 'Y' && partyActivationCount! gt 0>
<hr>
<h5 class="q-pb-sm">Activities:</h5>
<#list actorList! as actor>
    <#if actor.name?hasContent><div><a id="${actor.actorId!}" href="/coapp/Actor?actorId=${actor.actorId}">
            <b>${actor.name?html}</b></a></div></#if>
    <#if actor.processStoryActivityList!?size &gt; 0></#if>
    <#list actor.processStoryActivityList! as processStoryActivity>
        <#include "ActivityStyled.html.ftl"/>
    </#list>
    <#if actor.processStoryActivityList!?size &gt; 0></br></#if>
</#list>
</#if>
