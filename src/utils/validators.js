export const validateField = (value, rule) => {
    if(!rule) return null;

    const numericValue = Number(value);

    if(rule.required && !value) {
        return rule.errorMessage;
    }

    if (rule.min !== undefined && (value === " "  || null)) {
        return rule.errorMessage;
    }

    if (rule.max !==undefined && numericValue < rule.min) {
        return rule.errorMessage;
    }

    if (rule.max !== undefined && numericValue > rule.max) {
        return rule.errorMessage;
    }

    if(rule.options && !rule.options.includes(value)) {
        return rule.errorMessage;
    }

    return null;
}