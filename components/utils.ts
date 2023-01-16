export function getUrlParam(paramName: string) {
  const params = new URLSearchParams(document.location.search);

  return params.get(paramName);
}

export function isViewer() {
  return getUrlParam("viewer") === "1";
}
