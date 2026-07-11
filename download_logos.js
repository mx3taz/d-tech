const https = require('https');
const fs = require('fs');

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
};

async function getWikiFile(filename) {
    return new Promise((resolve, reject) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${filename}&prop=imageinfo&iiprop=url&format=json`;
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const json = JSON.parse(data);
                const pages = json.query.pages;
                const pageId = Object.keys(pages)[0];
                if(pageId == "-1") return resolve(null);
                resolve(pages[pageId].imageinfo[0].url);
            });
        }).on('error', reject);
    });
}

async function downloadLogo(filename, outPath) {
    const url = await getWikiFile(filename);
    if(url) {
        console.log("Found URL for " + filename + ": " + url);
        return new Promise((resolve) => {
            https.get(url, options, (res) => {
                const file = fs.createWriteStream(outPath);
                res.pipe(file);
                file.on('finish', () => { file.close(); resolve(true); });
            });
        });
    } else {
        console.log("Not found: " + filename);
    }
    return false;
}

(async () => {
    console.log("Downloading Hisense...");
    await downloadLogo('Hisense_logo.svg', 'img/hisense.svg');
    console.log("Downloading TCL...");
    await downloadLogo('TCL_logo.svg', 'img/tcl.svg');
    console.log("Downloading Condor...");
    await downloadLogo('Condor_Electronics_Logo.svg', 'img/condor.svg');
    console.log("Done.");
})();
