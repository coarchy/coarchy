<#list processStoryActivityList! as processStoryActivity>
    <#include "ActivityStyled.html.ftl"/>
    <#if processStoryActivity.detailProcessStoryName!?has_content && partyActivationCount gt 0><h6>Substory: <a href="/coapp/ProcessStory?processStoryId=${processStoryActivity.detailProcessStoryId}">${processStoryActivity.detailProcessStoryName}</h6></a><ul>
        <#list processStoryActivity.detailProcessStoryActivityList! as processStoryActivity>
            <li><h6><#include "ActivityStyled.html.ftl"/></h6></li>
        </#list>
    </ul><br>
    </#if>
</#list>