
import { app, BrowserWindow } from 'electron';

app.on('ready', () => {    
    const win = new BrowserWindow({
        width: 500,
        height: 660,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,           
            
        },
    });
    win.setMenuBarVisibility(false);
    win.setResizable(false);
    const indexHTML = __dirname + '/view/index.html';
    win.loadFile(indexHTML);
});