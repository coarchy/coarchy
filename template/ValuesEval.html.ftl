
<#macro statementResponseStat valueStatement>
    <#if showOrgResponseView>
        <#assign responseCount = vendorResponseByStatement[valueStatement.valueStatementId] />
        <#assign allVendorsResponded = (responseCount == totalVendorCount)/>
        <a href="${sri.buildUrl('refreshPageWithFilters').url}?productEvaluationId=${productEvaluationId}&_openDialog=StatementResponseListDialog_${statementResponseDialogIndexMap[valueStatement.valueStatementId]}">
            <span class="text-caption <#if allVendorsResponded>text-positive<#else>text-negative</#if>">(${responseCount!0}/${totalVendorCount} evals) </span>
        </a>
    </#if>
</#macro>
<#macro evaluateStatementButton valueStatement>
    <#if showVendorResponseView>
        <#assign responseCount = vendorResponseByStatement[valueStatement.valueStatementId] />
        <#assign vendorResponseComplete = responseCount &gt; 0/>
        <a href="${sri.buildUrl('refreshPageWithFilters').url}?productEvaluationId=${productEvaluationId}&_openDialog=StatementResponseDialog_${statementResponseDialogIndexMap[valueStatement.valueStatementId]}">
            <span class="text-caption <#if vendorResponseComplete>text-positive<#else>text-negative</#if>"><#if vendorResponseComplete>(Update Evaluation)<#else>(Evaluate)</#if> </span>
        </a>
    </#if>
    <#if showInternalResponseView>
        <#assign responseCount = internalResponseByStatement[valueStatement.valueStatementId] />
        <#assign internalResponseComplete = responseCount &gt; 0/>
        <a href="${sri.buildUrl('refreshPageWithFilters').url}?productEvaluationId=${productEvaluationId}&_openDialog=StatementResponseDialog_${statementResponseDialogIndexMap[valueStatement.valueStatementId]}">
            <span class="text-caption <#if internalResponseComplete>text-positive<#else>text-negative</#if>"><#if internalResponseComplete>(Update Internal Evaluation)<#else>(Internal Evaluation)</#if> </span>
        </a>
    </#if>
</#macro>
<#macro toggleStatementInclusion valueStatement>
    <#if canModifyStatements>
        <#if productEvalStatements.valueStatementIds?seq_contains(valueStatement.valueStatementId)>
            <form method="post" action="${sri.buildUrl('excludeStatement').url}" class="" id="ExcludeStatementForm">
                <input type="hidden" name="moquiSessionToken" value="${ec.web.sessionToken}">
                <input type="hidden" name="statementId" value="${valueStatement.valueStatementId}">
                <input type="hidden" name="productEvaluationId" value="${productEvaluationId}">
                <button class="btn text-positive" type="submit">${ec.l10n.localize("Included")}</button>
            </form>
            <#else>
            <form method="post" action="${sri.buildUrl('includeStatement').url}" class="" id="IncludeStatementForm">
                <input type="hidden" name="moquiSessionToken" value="${ec.web.sessionToken}">
                <input type="hidden" name="statementId" value="${valueStatement.valueStatementId}">
                <input type="hidden" name="productEvaluationId" value="${productEvaluationId}">
                <button class="btn text-negative" type="submit">${ec.l10n.localize("Excluded")}</button>
            </form>
        </#if>
    </#if>
</#macro>

<ol>
    <#list productEvalStatements.allValueStatementList! as valueStatement>
        <#assign isStatementIncluded = productEvalStatements.valueStatementIds?seq_contains(valueStatement.valueStatementId)/>
        <#if !showExcludedStatements><#if !isStatementIncluded><#continue></#if></#if>
        <#if valueStatement.value?has_content>
            <div>
                <#--  <a href="/coapp/ValueStatements?valueStatementId=${valueStatement.valueStatementId}">${valueStatement.value?html?ensure_ends_with(".")}</a>  -->
                <li href="/coapp/ValueStatements?valueStatementId=${valueStatement.valueStatementId}">
                    <@statementResponseStat valueStatement />
                    <@evaluateStatementButton valueStatement />
                    <@toggleStatementInclusion valueStatement />
                    <#if !isStatementIncluded><s class="text-grey-8"></#if>
                    ${valueStatement.value?html?ensure_ends_with(".")}
                    <#if !isStatementIncluded></s></#if>
                </li>
            </div>
        
        </#if>
    </#list>
</ol>
<#--  <h4 class="q-pb-sm">Activities:</h4>
<#list valueStatementList! as valueStatement>
    <#if valueStatement.value?hasContent><div><b>${valueStatement.value?html?ensureEndsWith(".")}</b></div></#if>
    <#if valueStatement.processStoryActivityList!?size &gt; 0><ul></#if>
    <#list valueStatement.processStoryActivityList! as processStoryActivity><li>
        <#include "ActivityStyled.html.ftl"/>
    </li></#list>
    <#if valueStatement.processStoryActivityList!?size &gt; 0></ul><#if valueStatement_has_next><br></#if></#if>
</#list>  -->
