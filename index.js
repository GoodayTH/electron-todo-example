const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`)
    addWindow.on('closed', () => {
        addWindow = null;
    });
}

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();      // 메모리를 해제하지 않고 유지하고 있는다. -> 일종의 메모리 릭
    addWindow = null;       // 일종의 메모리를 비우는 효과
});

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { 
                label: 'New Todo',
                click() { createAddWindow(); }
            },
            { label: 'Quit', 
           accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q', 
            click() {
                app.quit();
            }}
        ]
    }
];

if(process.platform === 'darwin') {  // OSX
    menuTemplate.unshift({});          // for Menubar shift
}

if(process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            { role: 'reload' },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Alt+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}