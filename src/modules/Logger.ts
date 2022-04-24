/* The below source code is licensed under MIT. */

const ccstyles = (color: string) => `
  color: white;
  font-weight: bold;
  border-radius:4px; 
  padding: 0px 6px 0px 6px;
  background-color: ${colors[color]}; 
`;

const sbstyles = 'color: #fafafa; font-weight: 700;';
const colors = { info: '#7289da', warn: '#debf18', error: 'red' };

export default class Logger {
  private static parse(type: string, information: any[]) {
    console[type]('%cCumcord%c [Sperm Bank]:', ccstyles(type), sbstyles, ...information);
  }

  static info(...information: any[]) { this.parse('info', information); }
  static warn(...information: any[]) { this.parse('warn', information); }
  static error(...information: any[]) { this.parse('error', information); }
};
