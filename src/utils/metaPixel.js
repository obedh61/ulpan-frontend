const fbq = (...args) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
};

export const trackEvent = (eventName, params) => {
  if (params) {
    fbq('track', eventName, params);
  } else {
    fbq('track', eventName);
  }
};

export const trackCustomEvent = (eventName, params) => {
  if (params) {
    fbq('trackCustom', eventName, params);
  } else {
    fbq('trackCustom', eventName);
  }
};

export const trackPageView = () => fbq('track', 'PageView');

export const trackViewContent = ({ contentId, contentName, contentType = 'course', value, currency } = {}) => {
  trackEvent('ViewContent', {
    content_ids: contentId ? [contentId] : undefined,
    content_name: contentName,
    content_type: contentType,
    value,
    currency,
  });
};

export const trackLead = (params = {}) => trackEvent('Lead', params);

export const trackCompleteRegistration = (params = {}) => trackEvent('CompleteRegistration', params);

export const trackInitiateCheckout = ({ contentId, contentName, value, currency, numItems = 1 } = {}) => {
  trackEvent('InitiateCheckout', {
    content_ids: contentId ? [contentId] : undefined,
    content_name: contentName,
    content_type: 'course',
    value,
    currency,
    num_items: numItems,
  });
};

export const trackPurchase = ({ contentId, contentName, value, currency } = {}) => {
  trackEvent('Purchase', {
    content_ids: contentId ? [contentId] : undefined,
    content_name: contentName,
    content_type: 'course',
    value,
    currency,
  });
};

export const trackSearch = (searchString) => trackEvent('Search', { search_string: searchString });

export const trackContact = () => trackEvent('Contact');
