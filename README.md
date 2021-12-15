# 11ty image optimization by tag

This is a demo of how you can run [11ty's image plugin](https://www.11ty.dev/docs/plugins/image/) across any part of your site, no shortcodes required!

The goal:
1. Find all `img` tags in a given template
2. Replace with an optimized `picture` element

⚠️ **Note:** this only works in 11ty's latest v1.0 beta. You can install this by adding the `@beta` flag to your 11ty install: `npm i @11ty/eleventy@beta`

## Running and building

1. Install dependencies using `npm i`
2. Run `npm run dev` to spin up the dev server
3. Run `npm run build` for production builds

## The core setup

This code snippet (found in the `.eleventy.js` config) powers everything you're seeing:

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('img')
  eleventyConfig.addExtension('md', {
    read: true,
    compile(markdown) {
      return async function render(data) {
        // let 11ty process markdown how it normally would
        const html = await this.defaultRenderer(markdown);
        const $ = cheerio.load(html);
        
        // if this markdown file has the "blog" tag applied...
        if (data.tags?.includes('blog')) {
          await Promise.all([
            // loop over all the images in the document
            $('img').toArray().map(async (img) => {
              // grab the image attributes
              const { src = '', alt = '', sizes = '100vw' } = img.attribs;
              // convert to an optimized image
              const optimizedImage = await imageShortcode(src, alt, sizes);
              // and replace the image with an optimized one
              $(img).replaceWith(optimizedImage);
            })
          ])
        }

        return $.html();
      }
    }
  })
}
```