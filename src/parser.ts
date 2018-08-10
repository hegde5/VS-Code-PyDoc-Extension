export class Parser {
    constructor(private header: string) { }

    public functionParser() {
        let paramText;
        let openBracesIndex = this.header.indexOf('(');
        let closeBracesIndex = this.header.indexOf(')');
        if (openBracesIndex < 0 || closeBracesIndex < 0) {
            return '';
        }
        else {
            paramText = this.header.substring(openBracesIndex + 1, closeBracesIndex)
            if (!paramText) return '';
        }

        const params = paramText.split(',');
        params.forEach((value, index) => {
            const kwargEqIndex = value.indexOf('=');
            if ( kwargEqIndex >=0 ){
                params[index] = value.substr(0, kwargEqIndex);
            }
        });
        return params;
    }
}