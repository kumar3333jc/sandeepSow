const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');
let win
const userDataPath = (app).getPath('userData');
var dbpath = path.join(userDataPath, '/DB/', 'database.sqlite');
if (!fs.existsSync(dbpath)) {
    if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath);
    }
    fs.mkdirSync(path.join(userDataPath, '/DB/'));
    fs.openSync(dbpath, 'w')
}
let knex = require("knex")({
    client: "sqlite",
    connection: {
        filename: path.join(dbpath)
    },
    useNullAsDefault: true
});

knex.schema.createTableIfNotExists('ITR', (table) => {
    table.increments('seq');
    table.string('form_type');
    table.string('itr_type');
    table.string('user_id');
    table.string('form_value');
    table.string('form_id');
}).then((res) => console.log("SUCCESS"));

app.on('ready', () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify()
})


function createWindow() {
    const { screen } = require('electron')
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new BrowserWindow({
        width, height,
        webPreferences: {
            nodeIntegration: true,
            backgroundThrottling: false,
            plugins: true
        }
    })
    win.removeMenu();

    // and load the index.html of the app.
    win.loadURL(`file://${__dirname}/dist/NXTAngularSample/index.html`);


    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}



// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})



ipcMain.on("save-data", async (event, item) => {
    try {
        return await knex("ITR").insert({
            form_type: '',
            itr_type: '',
            user_id: '',
            form_value: item,
            form_id: '',
        }).then(function (rows) {
            event.returnValue = rows;
        })
    } catch (err) {
        event.returnValue = err;
        throw err;
    }
});

ipcMain.on('get-items', async (event) => {
    try {
        await knex.select('*').from('ITR').then(function (rows) {
            event.returnValue = rows;
        })
    } catch (err) {
        console.log(err)
        throw err;
    }
});
ipcMain.on('app_version', async(event) => {
    event.returnValue= { version: app.getVersion() };
   //win.webContents.send('app_versionn', { version: app.getVersion() });
})
   
autoUpdater.on('update-available', () => {
    console.log('upd ava')
   // event.returnValue= { update_available: update_available }
   // autoUpdater.downloadUpdate();
    win.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    console.log('upd dwd')
 //   event.returnValue= { update_downloaded: update_downloaded }
    win.webContents.send('update_downloaded');
});
autoUpdater.on('download-progress', () => {
    console.log('progress')
 //   event.returnValue= { update_downloaded: update_downloaded }
    win.webContents.send('download-progress');
});
ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

