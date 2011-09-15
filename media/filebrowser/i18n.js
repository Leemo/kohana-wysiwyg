function __(s) {
  if (typeof(i18n) !='undefined' && i18n[s]) {
    return i18n[s];
  }

  return s;
}