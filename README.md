# Color me

Works for Firefox, untested for others (you are free to try).

![preview](preview/Sep-21-2020%2015-15-55.gif)

## Run & Installation

> ### Run & Build
>
> > 1.  Clone the repository `git clone https://github.com/ehcaw/colorme.git`.
> > 2.  Run `npm install` or `yarn install`
> > 3.  Run `npm run build:{target browser}` or `yarn build:{target browser}`. EX: `yarn build:chrome`

> ### Load the extension in Chrome & Opera
>
> > 1.  Open Chrome/Opera browser and navigate to chrome://extensions
> > 2.  Select "Developer Mode" and then click "Load unpacked extension..."
> > 3.  From the file browser, choose to `colorme/dev/chrome`
> >     or > (`colorme/dev/opera`)
>
> ### Load the extension in Firefox
>
> > 1. Open Firefox browser and navigate to about:debugging
> > 2. Click "Load Temporary Add-on" and from the file browser, choose >>`colorme/dev/firefox`
>
> ### Load the extension in Edge
>
> > <https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/>adding-and-removing-extensions>

## Developing

> The following tasks can be used when you want to start developing the extension
> and want to enable live reload -
> `npm run dev:{target browser}` or `yarn dev:{target browser}`

## Profiling

> Run `npm run profile:{target browser}` or `yarn profile:{target browser}`

## Packaging

> Run `npm run build:{target browser}` or `yarn build:{target browser}` to create a zipped,
> production-ready extension for each browser.
> You can then upload that to the app store.

## Available Target Browsers

> `firefox` `opera` `edge`

---

This project is licensed under the MIT license.

If you have any questions or comments, please create a new issue.
I'd be happy to hear your thoughts.
