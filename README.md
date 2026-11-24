# reduardo7.github.io

[https://reduardo7.github.io/](https://reduardo7.github.io/)

## Desarrollo local

Sitio estático sin dependencias. Para probarlo en local:

```bash
npm start
```

Queda disponible en <http://127.0.0.1:8080/>. El puerto y el host se pueden
cambiar por entorno, por ejemplo `PORT=3000 npm start`. También existe el alias
`npm run dev`.

El servidor (`scripts/serve.js`) usa sólo módulos de Node: sirve archivos desde
la raíz del repo, resuelve `/carpeta/` a su `index.html` (con redirección desde
`/carpeta`, igual que GitHub Pages) y desactiva la caché para ver los cambios al
recargar.

## Componente `link-list`

Listado vertical reutilizable, sin JavaScript. Los estilos del componente viven en
`src/link-list.css` y los de la página en `src/styles.css`.

```html
<link rel="stylesheet" href="src/link-list.css" />

<ul class="link-list">
  <li class="link-list__item">
    <a class="link-list__link" href="/ruta" style="--link-list-accent: #3ee6ff">
      <span class="link-list__icon" aria-hidden="true"><!-- SVG --></span>
      <span class="link-list__content">
        <span class="link-list__title">Título</span>
        <span class="link-list__meta">/ruta</span>
      </span>
      <span class="link-list__index" aria-hidden="true"></span>
      <span class="link-list__arrow" aria-hidden="true"><!-- SVG --></span>
    </a>
  </li>
</ul>
```

La numeración (`01`, `02`, …) es automática. Cada item admite `--link-list-accent`
(color de acento) y `--i` (orden para la animación de entrada).

## Tuki-Tok

La aplicación Tuki-Tok tiene su propio sitio dentro de `tuki-tok/`: el home y la
política de privacidad declarada en Google Play.

```bash
npm run start:tuki-tok
```

Lo sirve en <http://127.0.0.1:3003/> (el home; la política queda en
<http://127.0.0.1:3003/privacy.html>). El puerto se puede cambiar con
`PORT=3004 npm run start:tuki-tok`.

- <https://reduardo7.github.io/tuki-tok/>
- <https://reduardo7.github.io/tuki-tok/privacy.html>

