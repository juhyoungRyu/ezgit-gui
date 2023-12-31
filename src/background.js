"use strict";

import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import { exec } from "child_process";
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let win;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 400,
    height: 670,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
    autoHideMenuBar: true,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

ipcMain.on("selectDir", async (event, arg) => {
  const options = {
    title: "Select Working Directory", // Dialog title
    properties: ["openDirectory"], // Specify that it's an open file dialog
  };

  try {
    const result = await dialog.showOpenDialog(win, options);
    if (!result.canceled && result.filePaths.length > 0) {
      const selectedFolderPath = result.filePaths[0];
      // 선택한 폴더 경로를 비동기적으로 처리
      console.log("Selected folder:", selectedFolderPath);

      // Bug : 이동한 폴더에서 명령이 실행되지 않는 이슈
      // * exec는 함수 단위로 실행되기 때문에 해당 명령이 종료되면 원래 위치로 돌아감

      // exec(`cd ${selectedFolderPath}`, (error, stdout, stderr) => {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("success");
      //   }
      // });

      event.reply("sendPath", selectedFolderPath);
    } else {
      event.reply("sendPath", "cancel");
    }
  } catch (error) {
    console.error("Error opening folder picker dialog:", error);
  }
});

ipcMain.on("execGitMethod", async (e, method) => {
  try {
    const stdout = await executeGitCommand(method);
    console.log("execGitMethodResult : " + stdout);

    e.reply("gitMethodReturn", stdout);
  } catch (error) {
    console.error(error);
    e.reply("gitMethodError", error.message);
  }
});

function executeGitCommand([cwd, command]) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
