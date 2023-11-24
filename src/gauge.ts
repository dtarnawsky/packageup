
export function getGauge(title: string, id: string, value: number): string {  
    return `
    <div class="progress-bar-container">
    <h2>
      <label for="${id}">${title}</label>
    </h2>
    <div class="progress-bar ${id}">
      <progress id="${id}" min="0" max="100" value="${value}"></progress>
    </div>
  </div>
`;
}