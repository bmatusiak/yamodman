export default function (imports) {

    return {
        launch: function (app_id, args) {
            var steamDir = '';
            imports.exec(`"${steamDir}/Steam.exe" -applaunch ${app_id} ${args}`, (err => { }))
        }
    }
}