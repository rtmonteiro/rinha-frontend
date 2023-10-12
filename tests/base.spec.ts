import {expect, test,} from "@playwright/test";

test.describe('User', () => {
    test('can upload json file from input', async ({page}) => {
        await page.goto('/')

        await page.setInputFiles('input[name="up_file"]', 'resources/verysmall.json')
    })

    test('can upload json file from label', async ({page}) => {
        await page.goto('/')

        // Start waiting for file chooser before clicking. Note no await.
        const fileChooserPromise = page.waitForEvent('filechooser');
        // await page.getByLabel('Load JSON').click();
        await page.getByText('Load JSON').click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles('resources/verysmall.json');
    })

    test('can see json content from console', async ({page}) => {
        await page.goto('/')

        let text = ""

        page.on('console', (msg) => {
            console.log(msg.text());
            text = msg.text();
            expect(text).toBe(JSON.stringify(json))
        })

        const json = {
            "glossary": {
                "title": "example glossary",
                "p2": "p2",
                "empty": ""
            }
        }

        await page.setInputFiles('input[name="up_file"]', 'resources/verysmall.json')

    })
});
