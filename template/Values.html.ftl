<h4 class="q-pb-sm">Value Statements:</h4>
<#list valueStatementList! as valueStatement>
    <#if valueStatement.value?hasContent><div><b><a href="/coapp/ValueStatements?valueStatmentId=${valueStatement.valueStatementId}">${valueStatement.value?html?ensureEndsWith(".")}</a></b></div><#if valueStatement_has_next><br></#if></#if>
</#list>
<hr>
<h4 class="q-pb-sm">Activities:</h4>
<#list valueStatementList! as valueStatement>
    <#if valueStatement.value?hasContent><div><b>${valueStatement.value?html?ensureEndsWith(".")}</b></div></#if>
    <#if valueStatement.processStoryActivityList!?size &gt; 0><ul></#if>
    <#list valueStatement.processStoryActivityList! as processStoryActivity><li>
        <#include "ActivityStyled.html.ftl"/>
    </li></#list>
    <#if valueStatement.processStoryActivityList!?size &gt; 0></ul><#if valueStatement_has_next><br></#if></#if>
</#list>
