# tommy4k.com

The whole site is in this folder. There's no build step: upload the folder as it is.

## Put it online (Netlify, free)
1. Go to app.netlify.com/drop and drag this whole folder onto the page.
2. Check the netlify.app link it gives you.
3. In the site's domain settings, add tommy4k.com and follow Netlify's DNS steps at the place you bought the domain.
4. Contact form: put your email in `contact.email` at the top of `site-data.js`. Send yourself one test enquiry from the live site and click the "activate" link FormSubmit emails you. Every enquiry after that lands in your inbox.
5. Once tommy4k.com shows the new site, drop the Pixieset website (keep Pixieset only if you still use it for other things).

## Add your videos
Open `site-data.js` and paste the Vimeo link for each project into its `vimeo: ''` slot, plus the showreel at the top.
Public and unlisted links both work. Save, then drag the folder onto Netlify again to update.

Optional stills: put images in a `media` folder and set `poster: 'media/name.jpg'`.

Client logos ("Trusted by many"): put each logo in `media/logos/` (SVG, or PNG with a transparent background) and set `logo: 'media/logos/name.svg'` in the `clients` list. They're tinted to match the site. Until a file is added, the brand name shows as text.

## Pages
- `index.html`: home (reel, videography, content creation, contact)
- `about.html`
- `atlanta-commercial-videographer.html`, `atlanta-content-creator.html` and `atlanta-documentary-filmmaker.html`: service pages for Google. Documentary films go in the `documentary` list in `site-data.js`
- `work/*.html`: one page per project

## After launch
Add the site to Google Search Console and submit `https://tommy4k.com/sitemap.xml`.
