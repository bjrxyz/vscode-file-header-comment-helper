"use strict";
import * as vscode from "vscode";

let configPrefix: String = "fileHeaderCommentHelper";

export function insertFileHeaderComment() {
    let _workspace = vscode.workspace;
    let _window    = vscode.window;
    let _editor    = _window.activeTextEditor;
    let _root      = _workspace.rootPath;

    var projConf  = _workspace.getConfiguration((configPrefix + ".projectSettings"));
    var langConfs = _workspace.getConfiguration((configPrefix + ".languageConfigs"));

    var values = {
        "projectName": undefined,
        "currentFile": undefined
    };

    if (_root !== undefined && _editor !== undefined) {
        var languageStr = ("language_" + _editor.document.languageId);
        
        if (projConf.has("projectName") && projConf.get("projectName") !== null) {
            values.projectName = projConf.get("projectName");
        } else {
            values.projectName = _root.substr(_root.lastIndexOf("/") + 1);
        }

        values.currentFile = _editor.document.fileName.replace(_root, "").substr(1);
        
        if (langConfs.has(languageStr)) {
            var template = (langConfs.get(languageStr + ".template") as Array<String>).join("\n");
            
            _editor.edit((edit) => {
                edit.insert(new vscode.Position(0, 0), template
                    .replace("$(projectName)", values.projectName)
                    .replace("$(currentFile)", values.currentFile));
            });
            
            vscode.commands.executeCommand("workbench.action.files.save");
        } else {
            var openGlobalSettingsItem: vscode.MessageItem = {
                "title": "Open Global Settings"
            };
            var openWorkspaceSettingsItem: vscode.MessageItem = {
                "title": "Open Workspace Settings"
            };
            
            vscode.window.showErrorMessage(
                ("Unable to locate file-header-comment template for " +
                _editor.document.languageId + "."),
                openGlobalSettingsItem, openWorkspaceSettingsItem
            ).then((selectedItem: vscode.MessageItem) => {
                if (selectedItem === openGlobalSettingsItem) {
                    vscode.commands.executeCommand(
                        "workbench.action.openGlobalSettings"
                    );
                } else if (selectedItem === openWorkspaceSettingsItem) {
                    vscode.commands.executeCommand(
                        "workbench.action.openWorkspaceSettings"
                    );
                }
            });
        }
    }
}