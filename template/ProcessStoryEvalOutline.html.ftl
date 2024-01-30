<#macro activityResponseStat processStoryActivity>
    <#if showOrgResponseView>
        <#if isUserInternalOrgMember>
            <#assign internalResponseCount = internalResponseByActivity[processStoryActivity.activityId] />
            <#assign responseCount = vendorResponseByActivity[processStoryActivity.activityId] />
            <#assign vendorResponseComplete = responseCount &gt; 0/>
            <m-dynamic-dialog url="${sri.buildUrl('../EvalList')}?productEvaluationId=${productEvaluationId}&activityId=${processStoryActivity.activityId}" 
                buttonText="View Evals (${internalResponseCount+responseCount})" noIcon 
                buttonClass="text-caption" title="Activity ${processStoryActivity.activityId} Evaluations" 
                color="<#if vendorResponseComplete>positive<#else>negative</#if>"></m-dynamic-dialog>
        <#elseif isUserVendor>
            <#assign responseCount = vendorResponseByActivity[processStoryActivity.activityId] />
            <#assign vendorResponseComplete = responseCount &gt; 0/>
            <#if vendorResponseComplete>
            <m-dynamic-dialog url="${sri.buildUrl('../EvalList')}?productEvaluationId=${productEvaluationId}&activityId=${processStoryActivity.activityId}" 
                buttonText="View Eval" noIcon 
                buttonClass="text-caption" title="Activity ${processStoryActivity.activityId} Evaluations" 
                color="info"></m-dynamic-dialog>
            </#if>
        </#if>
    </#if>
</#macro>
<#macro evaluateActivityButton processStoryActivity>
    <#if showVendorResponseView>
        <#assign responseCount = vendorResponseByActivity[processStoryActivity.activityId] />
        <#assign vendorResponseComplete = responseCount &gt; 0/>
        <m-dynamic-dialog url="${sri.buildUrl('../EvalResponse')}?productEvaluationId=${productEvaluationId}&activityId=${processStoryActivity.activityId}" 
            buttonText="<#if vendorResponseComplete>Update Evaluation<#else>Evaluate</#if>" noIcon 
            buttonClass="text-caption" title="<#if isUserInternalOrgMember>Add Internal Evaluation on Activity<#else>Evaluate Activity</#if>" 
            color="<#if vendorResponseComplete>positive<#else>negative</#if>"></m-dynamic-dialog>        
    </#if>
    <#if showInternalResponseView>
        <#assign responseCount = internalResponseByActivity[processStoryActivity.activityId] />
        <#assign internalResponseComplete = responseCount &gt; 0/>
        <m-dynamic-dialog url="${sri.buildUrl('../EvalResponse')}?productEvaluationId=${productEvaluationId}&activityId=${processStoryActivity.activityId}" 
            buttonText="<#if internalResponseComplete>Update Internal Evaluation<#else>Internal Evaluation</#if>" noIcon 
            buttonClass="text-caption" title="<#if isUserInternalOrgMember>Add Internal Evaluation on Activity<#else>Evaluate Activity</#if>" 
            color="<#if internalResponseComplete>positive<#else>negative</#if>"></m-dynamic-dialog>
    </#if>
</#macro>

<#macro toggleActivityInclusion processStoryActivity>
    <#if canModifyProcessStory>
        <#if processStoryActivity.action!?has_content><#if productEvalActivities.activityIds?seq_contains(processStoryActivity.activityId)>
            <form method="post" action="${sri.buildUrl('excludeActivity').url}" class="" id="ExcludeActivityForm">
                <input type="hidden" name="moquiSessionToken" value="${ec.web.sessionToken}">
                <input type="hidden" name="activityId" value="${processStoryActivity.activityId}">
                <input type="hidden" name="processStoryId" value="${processStoryActivity.processStoryId}">
                <input type="hidden" name="productEvaluationId" value="${productEvaluationId}">
                <q-btn padding="1px" dense flat no-caps size="sm" class="text-positive" icon="check" type="submit">${ec.l10n.localize("Included")}</q-btn>
            </form>
            <#else>
            <form method="post" action="${sri.buildUrl('includeActivity').url}" class="" id="IncludeActivityForm">
                <input type="hidden" name="moquiSessionToken" value="${ec.web.sessionToken}">
                <input type="hidden" name="activityId" value="${processStoryActivity.activityId}">
                <input type="hidden" name="processStoryId" value="${processStoryActivity.processStoryId}">
                <input type="hidden" name="productEvaluationId" value="${productEvaluationId}">
                <q-btn padding="1px" dense flat no-caps size="sm" class="text-negative" icon="close" type="submit">${ec.l10n.localize("Excluded")}</q-btn>
            </form>
            </#if>
        </#if>
    </#if>
</#macro>

<#macro substory processStoryActivity levels>
    <#if processStoryActivity.detailProcessStoryActivityList!?size == 0><#list 1..(levels+1) as level>&nbsp;&nbsp;</#list><br/>No Activities<br/><#else>
        <ol>
        <#list processStoryActivity.detailProcessStoryActivityList! as processStoryActivity>
            <#assign isActivityIncluded = productEvalActivities.activityIds?seq_contains(processStoryActivity.activityId)/>
            <#if !isActivityIncluded && !showExcludedActivities><#continue/></#if>
            <li>
            <@activityResponseStat processStoryActivity />
            <@evaluateActivityButton processStoryActivity />
            <@toggleActivityInclusion processStoryActivity />
            <#if processStoryActivity.action!?has_content><#if !isActivityIncluded><s class="text-grey-8"></#if></#if>
            <#include "ActivityStyledSpan.html.ftl"/>
            <#if processStoryActivity.action!?has_content><#if !isActivityIncluded></s></#if></#if>
            <#if processStoryActivity.detailProcessStoryId!?has_content><@substory processStoryActivity levels+1/></#if>
            </li>
        </#list>
        </ol>
    </#if>
</#macro>

<div class="numbered-list">
<ol>
<#list processStoryActivityList! as processStoryActivity>
    <#assign isActivityIncluded = productEvalActivities.activityIds?seq_contains(processStoryActivity.activityId)/>
    <#if !isActivityIncluded && !showExcludedActivities><#continue/></#if>
    <#if processStoryActivity.action!?has_content><li></#if>
    <@activityResponseStat processStoryActivity />
    <@evaluateActivityButton processStoryActivity />
    <@toggleActivityInclusion processStoryActivity />
    <#if processStoryActivity.action!?has_content><#if !isActivityIncluded><s class="text-grey-8"></#if></#if>
    <#include "ActivityStyledSpan.html.ftl"/>
    <#if processStoryActivity.action!?has_content><#if !isActivityIncluded></s></#if></#if>
    <#--  <a href="${sri.buildUrl('refreshPageWithFilters').url}?productEvaluationId=100051&_openDialog=ReponseDialog_100011_0">Respond</a>  -->
    <#if processStoryActivity.detailProcessStoryId!?has_content && showSubstoriesActual>
        <@substory processStoryActivity 1/>
    </#if>
    <#if processStoryActivity.action!?has_content></li></#if>
    <#--  <#if !processStoryActivity.detailProcessStoryId!?has_content><br/></#if>  -->
</#list>
</ol>
</div>