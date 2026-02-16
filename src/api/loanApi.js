import products from '../mock/products.json';
import validationRules from '../mock/validation.json';
import eligibilityResults from '../mock/eligibility.json';
import rateResponse from '../mock/rate.json';

const simulateDelay = (data, delay = 800) =>
    new Promise((resolve) => setTimeout(() => resolve(data), delay));

export const getLoanProducts = async () => {
    return simulateDelay(products);
};

export const getValidationRules = async () => {
    return simulateDelay(validationRules, 400);
};

export const checkEligibility = async (payload) => {
    console.log('Submitted payload:', payload);
    return simulateDelay(eligibilityResults, 1000);
};

export const CalculateRates = async (payload) => {
    return simulateDelay(rateResponse, 700);
};