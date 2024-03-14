const express = require('express');
const axios = require('axios');
const Jimp = require('jimp');
const abi = require('./contractABI.json');
const path = require('path');
const cors = require('cors')

const { createPublicClient, http, getContract, formatEther } = require('viem')
const { base } = require('viem/chains')

const client = createPublicClient({
    chain: base,
    transport: http(),
});


//0.001
const HOT_POTATO_ADDR = "0xb21FC6838708CF3CD539fE17012f9A8aF1C509dC"

//0.01
//export const HOT_POTATO_ADDR = "0x2F3EC9914919478950F5E1eD524BD8e06AE919cE"



const app = express();
app.use(cors());
const port = 3300;

const contract = getContract({
    address: HOT_POTATO_ADDR,
    abi: abi,
    client,
});

app.get('/', (req, res) => {
    req.url = '/get-potato'
    req.app.handle(req, res);
})

app.get('/health', (req, res) => {
    res.send("ok");
})

app.get('/get-potato', async (req, res) => {

    console.log('/get-potato');
    console.log(req);
    try {
        const [currentPrice, nextPrice, flipCount] = await Promise.all([

            await contract.read.CURRENT_PRICE(),
            await contract.read.nextPrice(),
            await contract.read.FLIP_COUNT()
        ]);

        var imageIndex = parseInt(parseInt(flipCount) / 5 + "")+1; // step every 5

        if (imageIndex > 9) imageIndex = 9; // 9 is the last image
        const image = await Jimp.read(`./${imageIndex}.jpg`);

        const ibmFont = await Jimp.loadFont("./fonts/ibm.fnt");
        const chakraFont = await Jimp.loadFont("./fonts/chakra.fnt");

        // image.print(ibmFont, 63, 160, "There is only 1!")
        // image.print(ibmFont, 63, 184, "EACH TIME IT FLIPS, THE PRICE RISES BY 25%!");
        // image.print(ibmFont, 63, 208, "Buy & Share!");
        // image.print(ibmFont, 63, 232, "Play at your own risk.");

        const currentPriceText = parseFloat(formatEther(currentPrice)).toFixed(3) + " ETH"
        const nextPriceText = parseFloat(formatEther(nextPrice)).toFixed(4) + " ETH"
        const flipCountText = flipCount

        image.print(chakraFont, 48, 372, currentPriceText);
        image.print(chakraFont, 48, 488, nextPriceText);
        image.print(chakraFont, 48, 602, flipCountText);

        const timestamp = Math.floor(Date.now() / 1000);
        //image.print(font, 63, 556, timestamp);

        const outputPath = './potato.jpg';
        await image.writeAsync(outputPath);

        res.set('Cache-Control', 'max-age=5');

        res.sendFile(path.join(__dirname, '/potato.jpg'));


    } catch (error) {
        console.error('Error fetching prices or generating the image', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
