type zIndex = { key: string; value: number };
let zIndexes: zIndex[] = [];

function generateZIndex(key: string, baseZIndex: number): number {
  const lastZIndex =
    zIndexes.length > 0
      ? zIndexes[zIndexes.length - 1]
      : { key, value: baseZIndex };
  const newZIndex: number =
    lastZIndex.value + (lastZIndex.key === key ? 0 : baseZIndex) + 1;

  zIndexes.push({ key, value: newZIndex });

  return newZIndex;
}

function revertZIndex(zIndex: number): void {
  zIndexes = zIndexes.filter((object) => object.value !== zIndex);
}

export function getZIndex(element: HTMLElement | undefined): number {
  return element ? Number.parseInt(element.style.zIndex, 10) || 0 : 0;
}

export function setZIndex(
  key: string,
  element: HTMLElement | undefined,
  baseZIndex: number
): void {
  if (element) {
    element.style.zIndex = String(generateZIndex(key, baseZIndex));
  }
}

export function clearZIndex(element: HTMLElement | undefined): void {
  if (element) {
    revertZIndex(getZIndex(element));
    element.style.zIndex = "";
  }
}

export function getCurrentZIndex(): number {
  return zIndexes.length > 0 ? zIndexes[zIndexes.length - 1].value : 0;
}
