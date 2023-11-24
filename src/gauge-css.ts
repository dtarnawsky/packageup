export function generalCss() {
  return `
  @property --progress-value {
    syntax: '<integer>';
    inherits: false;
    initial-value: 0;
  }
  
  .progress-bar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    
    /* to center the percentage value */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .progress-bar::before {
    counter-reset: percentage var(--progress-value);
    content: counter(percentage) '%';
  }
  
  .row {    
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
  }

  .notes {    
    display: flex;
    justify-content: space-around;
    align-items: start;
    flex-wrap: wrap;
  }

  p {
    padding: 0;
    margin: 0;
  }

  .metrics {
    margin: 30px auto;
    max-width: 600px;
  }

  body {
    font-family: -apple-system, system-ui, Helvetica, Arial, sans-serif;
  }
  
  h2 {
    text-align: center;
    font-size: 15px;
  }

  h3 {
    text-align: left;
    font-size: 18px;
    margin: 0;
  }
  
  progress {
    visibility: hidden;
    width: 0;
    height: 0;
  }  
  `;
}

export function gaugeCss(className: string, value: number) {
  const color = scoreToColor(value);
  const backColor = scoreToBackColor(value);
  return ` 
  @keyframes ${className}-progress {
    to { --progress-value: ${value}; }
  }
     
  .${className} {
    background: 
      radial-gradient(closest-side, white 79%, transparent 80% 100%, white 0),
      conic-gradient(${color} calc(var(--progress-value) * 1%), ${backColor} 0);
    animation: ${className}-progress 2s 1 forwards;
  }
  
  .${className}::before {
    animation: ${className}-progress 2s 1 forwards;
  }  
  `;
}

function scoreToColor(score: number): string {
  if (score < 25) {
    return '#d50000'; // red
  } else if (score < 50) {
    return '#ff6d00'; // orange
  } else if (score < 75) {
    return '#ffd600'; // yellow
  }
  return '#00c853'; // green  
}

function scoreToBackColor(score: number): string {
  if (score < 25) {
    return '#c62828'; // red
  } else if (score < 50) {
    return '#fff3e0'; // orange
  } else if (score < 75) {
    return '#fffde7'; // yellow
  }
  return '#e8f5e9'; // green  
}