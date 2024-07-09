const validateField = (field, min, max, fieldName) => {
  const validateRange = (start, end) => {
    // Check if the range values are numbers and within the valid range
    if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
      throw new Error(`Invalid ${fieldName} field range: ${start}-${end}`);
    }
  };

  const validateStep = (base, step) => {
    // Check if the base value is a valid number or an asterisk and within the valid range
    if (base !== '*' && (isNaN(base) || base < min || base > max)) {
      throw new Error(`Invalid ${fieldName} field base for step: ${base}`);
    }
    // Check if the step value is a valid positive number
    if (isNaN(step) || step <= 0) {
      throw new Error(`Invalid ${fieldName} field step: ${step}`);
    }
  };

  const validateValue = (value) => {
    // Check if the value is a valid number and within the valid range
    if (isNaN(value) || value < min || value > max) {
      throw new Error(`Invalid ${fieldName} field value: ${value}`);
    }
  };

  if (field === '*') return;

  field.split(',').forEach((part) => {
    if (part.includes('/')) {
      const [base, step] = part.split('/');
      if (base.includes('-')) {
        const [start, end] = base.split('-').map(Number);
        return validateRange(start, end);
      } else if (base !== '*') {
        return validateValue(base);
      }
      validateStep(base, step);
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      validateRange(start, end);
    } else {
      validateValue(Number(part));
    }
  });
};

module.exports = { validateField };
