<#macro activityResponseStat processStoryActivity>
    <#if showOrgResponseView>
        <#if isUserInternalOrgMember>
            <#assign responseCount = vendorResponseByActivity[processStoryActivity.activityId] />
            <#assign allVendorsResponded = (responseCount == totalVendorCount)/>
            <a href="${sri.buildUrl('refreshPageWithFilters').url}?productEvaluationId=${productEvaluationId}&_openDialog=ActivityResponseListDialog_${activityResponseDialogIndexMap[processStoryActivity.activityId]}">
                <span class="text-caption <#if allVendorsResponded>text-positive<#else>text-negative</#if>">(${responseCount!0}/${totalVendorCount} evals) </span>
            </a>
        <#elseif isUserVendor>
            <#assign responseCount = activityResponseByVendor[ec.user.userAccount.partyId!][processStoryActivity.activityId] />
            <#assign vendorResponseComplete = responseCount &gt; 0/>
            <#if vendorResponseComplete>
            <a href="${sri.buildUrl('refreshPageWithFilters').url}?productEvaluationId=${productEvaluationId}&_openDialog=ActivityResponseListDialog_${activityResponseDialogIndexMap[processStoryActivity.activityId]}">
                <span class="text-caption text-info">${'['}View Eval${']'}</span>
            </a>
            </#if>
        </#if>
    </#if>
</#macro>
<#macro evaluateActivityButton processStoryActivity>
    <#if showVendorResponseView>
        <#assign responseCount = activityResponseByVendor[ec.user.userAccount.partyId!][processStoryActivity.activityId] />
        <#assign vendorResponseComplete = responseCount &gt; 0/>
        <a href="${sri.buildUrl('refreshPageWithFilters').url}?productEvaluationId=${productEvaluationId}&_openDialog=ActivityResponseDialog_${activityResponseDialogIndexMap[processStoryActivity.activityId]}">
            <span class="text-caption <#if vendorResponseComplete>text-positive<#else>text-negative</#if>"><#if vendorResponseComplete>(Update Evaluation)<#else>(Evaluate)</#if> </span>
        </a>
    </#if>
    <#if showInternalResponseView>
        <#assign responseCount = internalResponseByActivity[processStoryActivity.activityId] />
        <#assign internalResponseComplete = responseCount &gt; 0/>
        <a href="${sri.buildUrl('refreshPageWithFilters').url}?productEvaluationId=${productEvaluationId}&_openDialog=ActivityResponseDialog_${activityResponseDialogIndexMap[processStoryActivity.activityId]}">
            <span class="text-caption <#if internalResponseComplete>text-positive<#else>text-negative</#if>"><#if internalResponseComplete>(Update Internal Evaluation)<#else>(Internal Evaluation)</#if> </span>
        </a>
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
                <button class="btn text-positive" type="submit">${ec.l10n.localize("Included")}</button>
            </form>
            <#else>
            <form method="post" action="${sri.buildUrl('includeActivity').url}" class="" id="IncludeActivityForm">
                <input type="hidden" name="moquiSessionToken" value="${ec.web.sessionToken}">
                <input type="hidden" name="activityId" value="${processStoryActivity.activityId}">
                <input type="hidden" name="processStoryId" value="${processStoryActivity.processStoryId}">
                <input type="hidden" name="productEvaluationId" value="${productEvaluationId}">
                <button class="btn text-negative" type="submit">${ec.l10n.localize("Excluded")}</button>
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