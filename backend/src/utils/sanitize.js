const sanitizeText = (value) => {
  if (typeof value !== 'string') return value;

  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
};

module.exports = { sanitizeText };