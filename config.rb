# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

# activate :livereload
activate :breadcrumbs

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

set :build_dir, "public"

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'


# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

helpers do
  # Active nav items
  def nav_active(page)
    current_page.path.start_with?(page) ? { class: 'active' } : {}
  end
  def show_sub(page)
    current_page.path.start_with?(page)
  end
end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript, compressor: Terser.new
# end

configure :build do
  config[:root] = "/playbook/"
  set :base_url, "/codex-playbook" # baseurl for GitLab Pages (project name) - leave empty if you're building a user/group website
  set :build_dir, 'public'
  config[:http_prefix] = '/playbook'
  # activate :relative_assets # Use relative URLs
  # set :relative_links, true
  activate :asset_host, :host => '/playbook'
  config[:css_dir] = "stylesheets"
  config[:js_dir] = "javascripts"
end

configure :development do
  config[:root] = "/"
end
