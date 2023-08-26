source 'https://rubygems.org'
gem 'github-pages'
group :jekyll_plugins do
	gem 'jemoji'
	gem 'jekyll-feed'
	gem 'jekyll-paginate'
	gem 'jekyll-sitemap'
end

install_if -> { RUBY_VERSION.split(".")[0].to_i > 2 } do
  gem "webrick"
end
