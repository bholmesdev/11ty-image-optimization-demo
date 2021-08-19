const Image = require('@11ty/eleventy-img');

(async () => {
  let url = 'https://images.unsplash.com/photo-1608178398319-48f814d0750c'
  let stats = await Image(url, {
    widths: [300, 600, 1000]
  })

  let imageAttributes = {
    alt: 'galaxy',
    sizes: '100vw',
    loading: 'lazy',
    decoding: 'async',
  }

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  console.log(Image.generateHTML(stats, imageAttributes))
})()