/**
 * Resolves a translatable field from the API.
 * If the field is a string (legacy), returns it as-is.
 * If it's an object { es, en, he }, returns the value for the current language with fallback to ES.
 */
const resolveField = (field, lang = 'es') => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    return field[lang] || field.es || field.en || '';
  }
  return String(field);
};

export default resolveField;
