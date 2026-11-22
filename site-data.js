/* =====================================================================
   TOMMY 4K — SITE CONTENT
   This is the one file to edit when adding videos.
   Paste the full Vimeo link for each film (public or unlisted both work),
   e.g. 'https://vimeo.com/123456789' or 'https://vimeo.com/123456789/abc123def4'.
   Leave a link empty ('') and the page shows a placeholder instead.
   poster: optional still for cards and thumbnails, e.g. 'media/posters/shea-moisture.jpg'
   more: optional list of extra films for the same client, e.g. more: [{ title: 'Part 2', ar: 9 / 16, vimeo: '...', poster: '...' }]
   focus: optional, which part of a vertical still to keep when it is cropped wide, e.g. '50% 40%'
   ===================================================================== */
window.T4K = {
  /* Contact form: enquiries are emailed to this address (sent through formsubmit.co, free, no account).
     The very first enquiry triggers a one-time "activate" email from FormSubmit: click it and every enquiry after that lands in your inbox. */
  contact: {
    email: 'info@tommy4k.com'
  },

  reel: {
    vimeo: 'https://vimeo.com/1248952759/533a681138'   /* full showreel (placeholder for now), plays muted behind your name and with sound when clicked */
  },

  /* "Trusted by many" logo strip under the reel.
     Add each brand's logo file to media/logos/ and set logo: 'media/logos/name.svg' (SVG or PNG with a transparent background).
     Logos are tinted to match the site automatically. Until a file is added, the brand name shows as text. */
  clients: [
    { name: 'Fenty Beauty', logo: 'media/logos/fenty-beauty.svg' },
    { name: 'Aston Martin', logo: 'media/logos/aston-martin.svg' },
    { name: 'Microsoft 365', logo: 'media/logos/microsoft-365.png' },
    { name: 'Shea Moisture', logo: 'media/logos/shea-moisture.png' },
    { name: 'Charmin', logo: 'media/logos/charmin.png' },
    { name: 'Western Union', logo: 'media/logos/western-union.svg' },
    { name: 'Yummy Extensions', logo: 'media/logos/yummy-extensions.png' },
    { name: 'Lorvae', logo: 'media/logos/lorvae.png' },
    { name: 'Be Eyeconic', logo: '' },
    { name: 'Salt.XO', logo: 'media/logos/salt-xo.png' },
    { name: 'Toyota', logo: 'media/logos/toyota.svg' },
    { name: 'Essence', logo: 'media/logos/essence.svg' },
    { name: 'Ulta Beauty', logo: 'media/logos/ulta-beauty.png' },
    { name: 'Fiserv', logo: 'media/logos/fiserv.svg' }
  ],

  /* Videography: brand films and campaigns you shot and edited */
  video: [
    {
      slug: 'toyota', name: 'Toyota', type: 'Brand film', ar: 9 / 16,
      title: 'Setup vs. the Shot',
      vimeo: 'https://vimeo.com/1248838785', poster: 'media/posters/toyota-3.jpg', focus: '50% 35%',
      /* more films from the same client: shown as a series under the main film on the project page */
      more: [
        { title: 'Style With Your Ride', ar: 9 / 16, vimeo: 'https://vimeo.com/1248838791', poster: 'media/posters/toyota.jpg' },
        { title: '24 Hours in ATL', ar: 9 / 16, vimeo: 'https://vimeo.com/1248838792', poster: 'media/posters/toyota-2.jpg' }
      ],
      look: [62, 58, .5, 155],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Toyota'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Editor', 'Tommy Omolabi']]
    },
    {
      slug: 'shea-moisture', name: 'Shea Moisture', type: 'Campaign',
      vimeo: '', poster: '', look: [72, 28, .55, 150],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Shea Moisture'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Editor', 'Tommy Omolabi']]
    },
    {
      slug: 'fenty-beauty', name: 'Fenty Beauty', type: 'Campaign',
      vimeo: 'https://vimeo.com/1248836241', poster: 'media/posters/fenty-beauty.jpg', look: [32, 30, .56, 140],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Fenty Beauty'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Editor', 'Tommy Omolabi']]
    },
    {
      slug: 'aston-martin', name: 'Aston Martin', type: 'Brand film',
      vimeo: 'https://vimeo.com/1034671966/4872294b71',
      poster: 'https://i.vimeocdn.com/video/1956034628-f997e7887835b2efd2c37cc786f45fbd75264e72f11b745bdf82f83bd6a591e2-d?f=webp&region=us',
      look: [24, 62, .42, 200],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Aston Martin'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Editor', 'Tommy Omolabi']]
    },
    {
      slug: 'lorvae', name: 'Lorvae', type: 'Brand film',
      vimeo: 'https://vimeo.com/1248829503', poster: 'media/posters/lorvae.jpg', look: [66, 70, .48, 210],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Lorvae'], ['Director/DP/Edit', 'Tommy Omolabi'], ['Creative director', 'Mia Denean|miadenean'], ['1st AC', 'DayJon Bacon|d_baconboy'], ['Grip & electric', 'Tony Nava|navuh.co, Creed Smith|directorcreed']]
    },
    {
      slug: 'be-eyeconic', name: 'Be Eyeconic', type: 'Brand film', ar: 9 / 16,
      vimeo: 'https://vimeo.com/1115629350/7ca0fcb16c',
      poster: 'media/posters/be-eyeconic.jpg', focus: '50% 58%',
      look: [46, 24, .52, 185],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Be Eyeconic'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Editor', 'Tommy Omolabi']]
    },
    {
      slug: 'essence-x-ulta', name: 'Essence x Ulta', type: 'Brand film',
      vimeo: 'https://vimeo.com/1248951028/122939cf16',
      poster: 'media/posters/essence-x-ulta.jpg', look: [56, 36, .54, 145],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Essence x Ulta Beauty'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Producers', 'A.O.P Agency|aop.agency_, Courtney Vaughn|cocovaughn_'], ['Gaffer', 'SeeingPlus|seeingplus'], ['Key grip', 'JVargas Media|jvargasmedia'], ['Grip', 'Samuel Wikina|samwikina'], ['Lighting', 'Moonlight Grip Truck|moonlightgriptruck'], ['1st AC', 'Clayton Koffman|clayton.koffman'], ['Editor', 'Caleb Seales|calebseales'], ['Art director / set design', 'Sinclaire|sssinclaire'], ['Talent', 'Kira Hominique|kirahominique, JaLisa E. Jefferson|jalisaevaughn, Geraud Singh|geraud_singh']]
    }
  ],

  /* Content creation: creator partnerships, vertical 9:16 */
  creator: [
    {
      slug: 'microsoft-surface', name: 'Microsoft Surface', type: 'Creator partnership',
      vimeo: 'https://vimeo.com/1248837865', poster: 'media/posters/microsoft-surface.jpg', look: [60, 22, .5, 170],
      about: ['Write-up coming soon: what the partnership was and how the piece came together.'],
      credits: [['Brand', 'Microsoft Surface'], ['Creator', 'Tommy Omolabi']]
    },
    {
      slug: 'western-union', name: 'Western Union', type: 'Creator partnership',
      vimeo: 'https://vimeo.com/1248810979',
      poster: 'media/posters/western-union.jpg', look: [70, 55, .46, 190],
      about: ['Write-up coming soon: what the partnership was and how the piece came together.'],
      credits: [['Brand', 'Western Union'], ['Creator', 'Tommy Omolabi']]
    },
    {
      slug: 'charmin', name: 'Charmin', type: 'Creator partnership',
      vimeo: 'https://vimeo.com/1248817006', poster: 'media/posters/charmin.jpg', look: [34, 70, .58, 150],
      about: ['Write-up coming soon: what the partnership was and how the piece came together.'],
      credits: [['Brand', 'Charmin'], ['Creator', 'Tommy Omolabi']]
    },
    {
      slug: 'microsoft-365', name: 'Microsoft 365', type: 'Creator partnership',
      vimeo: 'https://vimeo.com/1248949686/0b8417583e',
      poster: 'media/posters/microsoft-365.jpg', focus: '50% 40%', look: [40, 40, .5, 130],
      about: ['Write-up coming soon: what the partnership was and how the piece came together.'],
      credits: [['Brand', 'Microsoft 365'], ['Creator', 'Tommy Omolabi']]
    }
  ],

  /* Documentary: shown on the documentary page. ar is the video shape: 9 / 16 for vertical, 16 / 9 for widescreen */
  documentary: [
    {
      slug: 'lorettas', name: "Loretta's", type: 'Shea Moisture mini-doc', ar: 9 / 16,
      vimeo: 'https://vimeo.com/1115634312/f43a489fe1',
      poster: 'media/posters/lorettas.jpg',
      look: [44, 34, .5, 165],
      about: ['Write-up coming soon: a couple of lines about the story and how it was made.'],
      credits: [['Client', 'Shea Moisture'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Editor', 'Tommy Omolabi']]
    },
    {
      slug: 'anitas-story', name: "Anita's Story", type: 'Mini-doc', ar: 9 / 16,
      vimeo: 'https://vimeo.com/1115631572/0c8397b701',
      poster: 'https://i.vimeocdn.com/video/2055048960-39ee791432e17ad1909978e9a365376d96ca72171056c4d74eba099a72a7efb0-d?f=webp&region=us',
      look: [70, 30, .44, 200],
      about: ['Write-up coming soon: a couple of lines about the story and how it was made.'],
      credits: [['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Editor', 'Tommy Omolabi']]
    }
  ],

  /* Social spots: short promos for the feed, vertical 9:16. name = what the piece is, type = the label under it */
  spots: [
    {
      slug: 'remedy-body-glow', name: 'Body Glow Launch', type: 'Product launch', ar: 9 / 16,
      vimeo: 'https://vimeo.com/1022478150',
      poster: 'media/posters/remedy.jpg', focus: '50% 40%', look: [84, 46, .5, 170],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Remedy'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Editor', 'Tommy Omolabi']]
    },
    {
      slug: 'new-years-campaign', name: "New Year's Campaign", type: 'Holiday campaign', ar: 16 / 9,
      vimeo: 'https://vimeo.com/1248952762/21bb0b69f1',
      poster: 'media/posters/new-years-campaign.jpg', look: [30, 40, 0.5, 160],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Yummy Extensions'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Gaffer', 'SeeingPlus|seeingplus'], ['Grip', 'J. Matos|sir_j.matos'], ['Editor', 'Mikey Newell|mikeyynewell']]
    },
    {
      slug: 'holiday-teaser', name: 'Holiday Teaser', type: 'Holiday spot', ar: 16 / 9,
      vimeo: 'https://vimeo.com/1248952761/dfa46cf371',
      poster: 'media/posters/holiday-teaser.jpg', look: [64, 30, 0.48, 150],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Yummy Extensions'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Gaffer', 'SeeingPlus|seeingplus'], ['Grip', 'J. Matos|sir_j.matos'], ['Editor', 'Mikey Newell|mikeyynewell']]
    },
    {
      slug: 'campaign-spot', name: 'Campaign Spot', type: 'Voiceover spot', ar: 16 / 9,
      vimeo: 'https://vimeo.com/1248952755/ab4915eba0',
      poster: 'media/posters/campaign-spot.jpg', look: [44, 62, 0.52, 190],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Yummy Extensions'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Gaffer', 'SeeingPlus|seeingplus'], ['Grip', 'J. Matos|sir_j.matos'], ['Editor', 'Mikey Newell|mikeyynewell']]
    },
    {
      slug: 'womens-history-month', name: "Women's History Month", type: 'Featuring Miss Texas', ar: 9 / 16,
      vimeo: 'https://vimeo.com/1115654599/72d34b8732',
      poster: 'https://i.vimeocdn.com/video/2055057031-0793f47e26adcb6c754bef33800a3e86800e91062ded73fa2000a46e9b27258a-d?f=webp&region=us', look: [70, 50, 0.5, 140],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Talent', 'Miss Texas'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Editor', 'Tommy Omolabi']]
    },
    {
      slug: 'welcome-dinner-recap', name: 'Welcome Dinner Recap', type: 'Event recap', ar: 9 / 16,
      vimeo: 'https://vimeo.com/1115638529/e74c1cd02f',
      poster: 'media/posters/welcome-dinner-recap.jpg', look: [36, 30, 0.56, 175],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Shea Moisture'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Editor', 'Tommy Omolabi']]
    },
    {
      slug: 'product-grid', name: 'Product Grid', type: 'Social ad', ar: 4 / 5,
      vimeo: 'https://vimeo.com/1115638001/0eab51a7e9',
      poster: 'https://i.vimeocdn.com/video/2055036201-057dd143f002e0dcbc7675b241eede28fe9cb89d36557ad294e1cf2571e39a83-d?f=webp&region=us', look: [58, 70, 0.46, 200],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Shea Moisture'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Editor', 'Tommy Omolabi']]
    },
    {
      slug: 'hair-oil-spot', name: 'Hair Oil Spot', type: 'Product spot', ar: 9 / 16,
      vimeo: 'https://vimeo.com/1115632012/fc66f59577',
      poster: 'media/posters/hair-oil-spot.jpg', look: [50, 36, 0.54, 165],
      about: ['Write-up coming soon: a couple of lines about the brief, the idea and the shoot.'],
      credits: [['Client', 'Shea Moisture'], ['Director', 'Tommy Omolabi'], ['DP', 'Tommy Omolabi'], ['Editor', 'Tommy Omolabi']]
    }
  ]
};
