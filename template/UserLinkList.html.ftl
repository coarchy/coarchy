<span v-pre><#if actorPartyList?size &gt; 0><#list actorPartyList! as actorParty><a href="/settings/EditOrganization?organizationId=${activeOrgId}">${actorParty.firstName} ${actorParty.lastName}</a><#sep><#if actorPartyList?size-2==actorParty_index> and <#elseif actorPartyList?size==2>, and <#else>, </#if></#list><#else>None Assigned</#if></span>