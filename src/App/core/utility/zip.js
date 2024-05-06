
import JSZip from 'jszip';


export default function (imports) {
    var { fs } = imports;

    function extract(zip_b64, dest) {
        var zip = new JSZip();
        zip.loadAsync(zip_b64, { base64: true });

        require('fs').readFile('unsafe.zip', function (err, data) {
            if (err) throw err;
            var zip = new JSZip();
            zip.loadAsync(data)
                .then(function (zip) {
                });
        })
    }

    function toFile(files, dest) {
        var zip = new JSZip();
        zip
            .generateNodeStream({ streamFiles: true })
            .pipe(fs.createWriteStream('out.zip'))
            .on('finish', function () {
                console.log('out.zip written.');
            });
    }
    function toBase64(files, dest) {
        var zip = new JSZip();
        zip
            .generateNodeStream({ streamFiles: true })
            .pipe(fs.createWriteStream('out.zip'))
            .on('finish', function () {
                console.log('out.zip written.');
            });
    }
    return {};
}