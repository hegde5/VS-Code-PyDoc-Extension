import * as vscode from 'vscode';
import { Parser } from './parser';
import { isArray } from 'util';


export class Docstring {

    constructor(private editor: vscode.TextEditor) { }

    public createDocstring(){
        const trimmedHeader = this.extractFunctionHeader();
        
        if (trimmedHeader.endsWith(':')) {
            if (trimmedHeader.startsWith('class')) {
                this.generateClassDocstring();
            }
            else {
                this.generateFuncDocstring(trimmedHeader);
            }
        }
        else {
            if (trimmedHeader.startsWith('class')) {
                vscode.window.showInformationMessage('Please select a valid class')
            }
            else {
                vscode.window.showInformationMessage('Please select a valid function')
            }

        }
    }

    private extractFunctionHeader() {
        let selection = this.editor.selection;
        let text = this.editor.document.getText(selection);
        let trimmedHeader = text.replace(/\s/g, '');
        return trimmedHeader;
    }

    private generateFuncDocstring(header: string) {
        let parser = new Parser(header);
        let params = parser.functionParser();
        let snippet = new vscode.SnippetString();
        const startQuotes = '\n\t""" Description\n';
        const endQuotes = '\t"""';
        const exceptions = '\t:raises:\n\n';
        const rType = '\t:rtype:\n';
        const rDescription = '\t:returns:\n';
        let linePosition = this.editor.selection.active.line;

        if (params && isArray(params)) {
            const paramStr = this.generateParamDocstring(params);
            const finalStr = startQuotes + paramStr + exceptions + rType + rDescription + endQuotes;
            this.editor.insertSnippet(snippet.appendText(finalStr), new vscode.Position(linePosition + 1, 4))
        }
        else {
            const finalStr = startQuotes + exceptions + rType + rDescription + endQuotes;
            this.editor.insertSnippet(snippet.appendText(finalStr), new vscode.Position(linePosition + 1, 4))
        }
    }

    private generateClassDocstring() {
        const quotes = '\n\t""" Description\t"""\n';
        const linePosition = this.editor.selection.active.line;
        let snippet = new vscode.SnippetString();
        this.editor.insertSnippet(snippet.appendText(quotes), new vscode.Position(linePosition + 1, 4))
    }

    private generateParamDocstring(params: Array<string>) {
        let paramStr = '';
        params.forEach((val, index) => {
            paramStr += '\t:type ' + val + ':\n';
            paramStr += '\t:param ' + val + ':';
            paramStr += '\n\n';

        });
        return paramStr;
    }


}