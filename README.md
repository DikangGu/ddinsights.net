# Distributed Data Insights

Source for [ddinsights.net](https://ddinsights.net) — a blog about distributed
data systems: storage engines, replication, consistency, streaming, and scale.

Built with [Hugo](https://gohugo.io) (extended) using a small, self-contained
custom theme (no external theme submodule). Deployed automatically to GitHub Pages
on every push to `main` via `.github/workflows/hugo.yaml`.

## Prerequisites

- Hugo **extended**, v0.139.x or newer:
  ```bash
  brew install hugo        # macOS
  hugo version             # confirm it says "+extended"
  ```

## Local development

```bash
hugo server -D            # live reload at http://localhost:1313 (-D shows drafts)
```

## Writing a new post

```bash
hugo new content posts/my-post-title.md
```

Then edit the front matter (`title`, `description`, `tags`, `categories`) and set
`draft = false` when you're ready to publish. Posts live in `content/posts/`.

## Project layout

```
content/         Markdown content
  posts/         Blog posts
  about.md       About page
layouts/         Custom HTML templates
  _default/      baseof, single, list, taxonomy, terms
  partials/      head, header, footer, post-card, pagination
  index.html     Home page
assets/css/      main.css (processed + fingerprinted by Hugo)
static/js/       theme.js (dark/light toggle)
archetypes/      Front-matter template for `hugo new`
hugo.toml        Site configuration
CNAME            Custom domain for GitHub Pages
```

## Configuration

Site title, description, menus, and social links live in `hugo.toml` under
`[params]`. Fill in `email`, `github`, `twitter`, or `linkedin` to show those
links in the footer.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow, which builds with Hugo and
publishes `./public` to GitHub Pages. The `CNAME` file maps the site to
`ddinsights.net`. Make sure GitHub Pages is set to deploy from **GitHub Actions**
(Settings → Pages → Build and deployment → Source).
