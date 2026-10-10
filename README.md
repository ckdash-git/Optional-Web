# optionallabs.com

The website for Optional Labs, the company behind ZeroAuth, Saifu, Parchi and Tegami.

Static HTML, CSS and JavaScript with no build step. GitHub Pages deploys `main` (see `.github/workflows/static.yml`) to the custom domain in `CNAME`.

## Run locally

```sh
python3 -m http.server 8080
# open http://localhost:8080
```

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | Homepage: the hub that lists every product |
| `privacy-policy.html` | Privacy policy |
| `app-ads.txt` | Ad network declaration for the apps |
| `Assets/` | Logo and brand files |
| `PRODUCT.md` | Product facts the site is written from |
