"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode"); //import vscode classes and workspace
const parse_1 = require("./parse"); //import parse functions and class
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    console.log('C/C++ autocomplete is running');
    let disposable = vscode_1.commands.registerCommand('extension.writeimplfile', () => {
        let editor = vscode_1.window.activeTextEditor;
        if (editor) {
            let document = editor.document;
            let fileName = document.fileName.split(process.platform === 'win32' ? '\\' : '/')[document.fileName.split(process.platform === 'win32' ? '\\' : '/').length - 1];
            if (document.fileName.endsWith('.h')) {
                let text = document.getText();
                let h = new parse_1.header();
                let language = document.languageId;
                h = parse_1.parse(text);
                let parsedFileContent = '';
                for (let i = 0; i < h.methods.length; i++) {
                    parsedFileContent += h.includes[i] ? `${h.includes[i]}\n` : '';
                }
                parsedFileContent += `\n#include "${fileName}"\n`;
                parsedFileContent += h.namespace ? `\n${h.namespace}` : '';
                for (let i = 0; i < h.methods.length; i++) {
                    if (h.namespace) {
                        parsedFileContent += h.class ? `\n\t${parse_1.formatMethodsignature(h.methods[i], h.class)}\n\t{\n\t\t\n\t}\n` : `\n\t${parse_1.formatMethodsignature(h.methods[i])}\n\t{\n\t\t\n\t}\n`;
                    }
                    else {
                        parsedFileContent += h.class ? `\n${parse_1.formatMethodsignature(h.methods[i], h.class)}\n` : `\n${parse_1.formatMethodsignature(h.methods[i])}\n`;
                    }
                }
                parsedFileContent += h.namespace ? '}' : '';
                openImplementationFile(parsedFileContent, language);
                deactivate();
            }
            else {
                vscode_1.window.showWarningMessage('file type not supported');
                deactivate();
            }
        }
        else {
            vscode_1.window.showWarningMessage('no open document, please open one and run the command again');
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function openImplementationFile(fileContent, fileLanguage) {
    return __awaiter(this, void 0, void 0, function* () {
        let doc = yield vscode_1.workspace.openTextDocument({ language: fileLanguage, content: fileContent });
        vscode_1.window.showTextDocument(doc, 2);
    });
}
// this method is called when your extension is deactivated
function deactivate() {
    console.log('C/C++ autocomplete is not running anymore');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map