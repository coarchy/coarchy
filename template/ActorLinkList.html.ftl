<#if actorPartyList?size &gt; 0><#list actorPartyList! as actorParty><a href="/coapp/Actor?actorId=${actorParty.actorId}">${actorParty.name}</a><#sep><#if actorPartyList?size-2==actorParty_index> and <#elseif actorPartyList?size==2>, and <#else>, </#if></#list></#if>