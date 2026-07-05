export function stripCssComments(css: string) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}
