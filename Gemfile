source "https://rubygems.org"

gem "jekyll", "~> 4.3"

group :jekyll_plugins do
  gem "jekyll-feed",         "~> 0.17"
  gem "jekyll-sitemap",      "~> 1.4"
  gem "jekyll-seo-tag",      "~> 2.8"
  gem "jekyll-redirect-from", "~> 0.16"
end

gem "webrick", "~> 1.8"

# Build-time link, markup and broken-image audit. Run by Cloudflare
# Pages after `jekyll build` as part of the production build command:
#   bundle exec htmlproofer ./_site --disable-external --allow-hash-href
gem "html-proofer", "~> 5.0"

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
