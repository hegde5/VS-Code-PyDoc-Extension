
import * as assert from 'assert';
import { after, before, it, describe } from 'mocha';
import * as vscode from 'vscode';
import {Docstring} from '../generateDocString';

const path = require('path');
const sinon = require('sinon');
const fs = require('fs');


const fileFunctionPath = __dirname + 'example_function.py'
const fileClassPath = __dirname + 'example_class.py'
const fileFunctionContent = `def test1(arg1, arg2):`;
const fileClassContent = `class test1():`;

describe('GenerateDocString file strategies tests', () => {
    before(() => {
        fs.writeFile(fileFunctionPath, fileFunctionContent, (err: string) => console.log(err));
        fs.writeFile(fileClassPath, fileClassContent, (err: string) => console.log(err));
    });
    after(() => {
        fs.unlinkSync(fileFunctionPath);
        fs.unlinkSync(fileClassPath);
    });

    it('Should call Function extract strategy', async function() {
       this.timeout(7000);

        const document = await vscode.workspace.openTextDocument(fileFunctionPath);
        const editor = await vscode.window.showTextDocument(document);
        editor.selection.with(new vscode.Position(0,0), new vscode.Position(0, 22));
        const pydoc = new Docstring(editor);

        const spyExtractFunctionHeader = sinon.spy(Docstring.prototype, <any>"extractFunctionHeader");
        const spygenerateFuncDocstring = sinon.spy(Docstring.prototype, <any>"generateFuncDocstring");
        const spygenerateParamDocstring = sinon.spy(Docstring.prototype, <any>"generateParamDocstring");
        const spygenerateClassDocstring = sinon.spy(Docstring.prototype, <any>"generateClassDocstring");

        pydoc.createDocstring();

        assert.ok(spyExtractFunctionHeader.called);
        assert.ok(spygenerateFuncDocstring.called);
        assert.ok(spygenerateParamDocstring.called);

        assert.ok(!spygenerateClassDocstring.called);

        spyExtractFunctionHeader.restore();
        spygenerateClassDocstring.restore();
        spygenerateParamDocstring.restore();
        spygenerateFuncDocstring.restore();
    });

    it('Should call Class extract strategy', async function() {
        this.timeout(7000);

        const document = await vscode.workspace.openTextDocument(fileClassPath);
        const editor = await vscode.window.showTextDocument(document);
        editor.selection.with(new vscode.Position(0,0), new vscode.Position(0, 22));
        const pydoc = new Docstring(editor);

        const spyExtractFunctionHeader = sinon.spy(Docstring.prototype, <any>"extractFunctionHeader");
        const spygenerateFuncDocstring = sinon.spy(Docstring.prototype, <any>"generateFuncDocstring");
        const spygenerateParamDocstring = sinon.spy(Docstring.prototype, <any>"generateParamDocstring");
        const spygenerateClassDocstring = sinon.spy(Docstring.prototype, <any>"generateClassDocstring");

        pydoc.createDocstring();

        assert.ok(spyExtractFunctionHeader.called);
        assert.ok(spygenerateClassDocstring.called);

        assert.ok(!spygenerateFuncDocstring.called);
        assert.ok(!spygenerateParamDocstring.called);

        spyExtractFunctionHeader.restore();
        spygenerateClassDocstring.restore();
        spygenerateParamDocstring.restore();
        spygenerateFuncDocstring.restore();
    });
});

