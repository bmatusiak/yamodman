const { app, Menu } = require('electron');

module.exports = function menu_setup(__DEV__){
    // remove devtools menu
    // build a new menu based on default one
    const menu = Menu.getApplicationMenu(); // get default menu
    const newmenu = Menu.buildFromTemplate(
        menu.items.map(i => {
            // overwrite viewmenu item
            if (!__DEV__) {
                if (i.role === 'viewmenu') {
                    // create new submenu
                    const newviewsub = Menu.buildFromTemplate(
                        i.submenu.items.slice(4) // cut first 4 item (4th is separator)
                    )
                    // replace this item's submenu with the news
                    return Object.assign({}, i, { submenu: newviewsub })
                }
            }
            if (i.role === 'help') {
                // create new submenu
                const newhelpsub = Menu.buildFromTemplate([{
                    label: 'About',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://electronjs.org')
                    }
                }])
                // replace this item's submenu with the news
                return Object.assign({}, i, { submenu: newhelpsub })
            }
            // otherwise keep
            return i
        })
    )
    Menu.setApplicationMenu(newmenu)
}