package com.cinetik.service;

import com.cinetik.dto.PricingRuleRequest;
import com.cinetik.dto.PricingRuleResponse;

import java.util.List;

public interface PricingRuleService {
    List<PricingRuleResponse> getAllPricingRules();
    PricingRuleResponse getPricingRuleById(Long id);
    PricingRuleResponse createPricingRule(PricingRuleRequest request);
    PricingRuleResponse updatePricingRule(Long id, PricingRuleRequest request);
    void deletePricingRule(Long id);
}
