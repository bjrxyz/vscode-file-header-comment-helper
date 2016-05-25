"use strict";
import * as vscode from "vscode";
import * as commands from "./commands";

export function activate(context: vscode.ExtensionContext) {
    let insertFileHeaderComment = vscode.commands.registerCommand(
        "extension.insertFileHeaderComment",
        commands.insertFileHeaderComment
    );
    
    context.subscriptions.push(insertFileHeaderComment);
}

export function deactivate() { }