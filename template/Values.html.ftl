<#list valueStatementList! as valueStatement>
    <#if valueStatement.value?hasContent><div>Value: ${valueStatement.value?html?ensureEndsWith(".")}</div></#if>
    <#if valueStatement.processStoryActivityList!?size &gt; 0>Activities:<ul></#if>
    <#list valueStatement.processStoryActivityList! as processStoryActivity><li>
        <#if processStoryActivity.condition?hasContent><i>${processStoryActivity.condition?html?ensureEndsWith(",")} </i></#if>
        <#list processStoryActivity.actorNames! as actorName><b>${actorName?html}</b><#sep>, </#list>
        <#if processStoryActivity.action?hasContent>${processStoryActivity.action?html?removeEnding(".")?ensureEndsWith(".")} <#else><br/><br/></#if>
        </li></#list>
    <#if valueStatement.processStoryActivityList!?size &gt; 0></ul></br></#if>
</#list>
