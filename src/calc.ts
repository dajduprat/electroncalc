export class Calc {
    private _field1: string;
    private _field2: string;
    private _isSecondVal: boolean;
    private _calculateDone:boolean = false;
    private _operation: string;
    private _display: string = '';
    private ERROR = 'ERR';
    private MAXSIZE = 'MAX';

    constructor(field1: string, field2: string, isSecondVal: boolean) {
        this._field1 = field1;
        this._field2 = field2;
        this._isSecondVal = isSecondVal;
        this._operation = '+';
    }

    public get calculateDone():boolean{
        return this._calculateDone;
    }

    public get field1(): string {
        return this._field1;
    }

    public set field1(value: string) {
        this._calculateDone = false;
        this._field1 = value;
    }

    public get field2(): string {
        return this._field2;
    }

    public set field2(value: string) {
        this._field2 = value;
    }

    public get isSecondVal(): boolean {
        return this._isSecondVal;
    }

    public set isSecondVal(value: boolean) {
        this._isSecondVal = value;
    }

    public get operation(): string {
        return this._operation;
    }

    public set operation(value: string) {
        this._operation = value;
    }

    public get display(): string {
        return this._display;
    }

    public calculate() {
        this._calculateDone =true;
        var value1 = parseFloat(this.field1);
        var value2 = parseFloat(this.field2);
        var result;
        switch (this.operation) {
            case '-':
                result = value1 - value2;
                break;
            case 'x':
                result = value1 * value2;
                break;
            case '/':
                if (value2 === 0) {
                    // (this.display as HTMLElement).innerText = 'ERR';
                    this._display = this.ERROR;
                    this.clear();
                    return;
                }
                result = value1 / value2;
                break;
            default:
                result = value1 + value2;
                break;
        }

        //Too big number
        if (Math.floor(result).toString().length > 10) {
            this._display = this.MAXSIZE;
            this.clear();
            return;
        }

        if (Math.floor(result) === result) {
            this._display = result.toString();
            this.clear(result.toString());
            return;
        }

        // Limiting decimals
        this._display = result.toFixed(6).toString();

        this.clear(result.toString());
    }

    public clear(forcePrevious?: string): void {
        this._field1 = forcePrevious ?? '0';
        this._field2 = '0';
        this._isSecondVal = false;
    }
}

export class CalcView {
    private buttons: NodeListOf<HTMLButtonElement>;
    private calc: Calc = new Calc('', '', false);

    constructor(document: Document) {
        var isNumber = false;
        this.buttons = document.querySelectorAll('button');
        const display = document.querySelector('.calculator_display');
        const self = this;
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].addEventListener('click', function (this: HTMLButtonElement) {
                isNumber = !isNaN(parseInt(this.innerHTML));

                if (isNumber || ('.' === this.innerHTML)) {
                    if (!self.calc.isSecondVal) {
                        if (self.calc.field1 === '0') {
                            self.calc.field1 = ('.' === this.innerHTML) ? ('0' + this.innerHTML) : this.innerHTML;
                        } else if (self.calc.field1.length < 8) {
                            self.calc.field1 = (self.calc.calculateDone) ? this.innerHTML : self.calc.field1 + this.innerHTML;                            
                        }
                        if (display) {
                            (display as HTMLElement).innerText = self.calc.field1;
                        }
                    } else {
                        if (self.calc.field2 === '0') {
                            self.calc.field2 = this.innerHTML;
                        }
                        else if (self.calc.field2.length < 8) {
                            self.calc.field2 = self.calc.field2 + this.innerHTML;
                        }
                        (display as HTMLElement).innerText = self.calc.field2;
                    }
                } else {
                    switch (this.innerHTML) {
                        case '+':
                        case '-':
                        case 'x':
                        case '/':
                            self.calc.operation = this.innerHTML;
                            self.calc.isSecondVal = true;
                            break;
                        case 'AC':
                            self.calc.clear();
                            (display as HTMLElement).innerText = '0';
                            break;
                        default:
                            self.calc.calculate();
                            (display as HTMLElement).innerText = self.calc.display;                            
                            self.calc.field2 = '0';
                    }
                }
            });

        }
    }
}

const classView: CalcView = new CalcView(document);