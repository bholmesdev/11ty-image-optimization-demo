const Image = require('@11ty/eleventy-img');
const cheerio = require('cheerio');

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [300, 600],
    formats: ["avif", "jpeg"]
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('img')
  eleventyConfig.addPassthroughCopy('styles.css')

  eleventyConfig.addExtension('md', {
    read: true,
    compile() {
      return async function render(data) {
        const html = await this.defaultRenderer(data);
        const $ = cheerio.load(html);
        
        if (data.tags?.includes('blog')) {
          await Promise.all([
            // loop over all the images in our document
            $('img').toArray().map(async (img) => {
              // grab the image attributes
              const { src = '', alt = '', sizes = '100vw' } = img.attribs;
              // convert to an optimized image
              const optimizedImage = await imageShortcode(src, alt, sizes);
              // replace our images with an optimized one
              $(img).replaceWith(optimizedImage);
            })
          ])
        }

        return $.html();
      }
    }
  })

  return {
    dir: {
      input: 'src'
    }
  }
}