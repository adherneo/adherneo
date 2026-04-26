# AdherNeo — Sitio Web

Sitio estático para clientes de AdherNeo (farmacias, ortopedias, distribuidores). Sin build system — abre con doble-click o deploy directo.

## Estructura

```
landing.html    — página principal (hero, categorías, por qué elegirnos, CTA)
productos.html  — catálogo completo con filtros, búsqueda y modal de preview
pedido.html     — carrito + formulario de pedido (envía por EmailJS)
favicon.svg     — logo A+círculo navy
img/            — fotos de productos (vacío por ahora, soporte ya integrado)
etiquetas.html  — proyecto SEPARADO de uso interno, no tocar ni publicar
```

## Diseño

- **Colores:** navy `#12264e`, blue `#2563be`, sky `#e8f0ff`/`#d0e0f8`
- **Tipografía:** Georgia serif para títulos, system sans-serif para body
- **Modo oscuro:** `[data-theme="dark"]` en `<html>`. Guardado en `localStorage('theme')`
- **Navbar fija:** `height: 72px (--nav-h)`. Todas las páginas tienen `body { padding-top: var(--nav-h) }`

## Carrito

- `localStorage('adherneo_cart')` → `{ items: [{ key, productId, code, name, cat, emoji, size, qty }] }`
- `key = productId||size` — permite el mismo producto en distintos talles
- Sincronización cross-tab con `window.addEventListener('storage', ...)`

## EmailJS

| Variable | Valor |
|---|---|
| Public Key | `V2bRqh3q4CJXT8Cbt` |
| Service ID | `service_r5i4s3b` |
| Template ID | `template_0h7uglo` |
| Destino | `adherneo@hotmail.com` |

Params del template: `{ subject, body, reply_to }`. Formato del cuerpo:
```
Nuevo pedido de Juan Pérez
Email: juan@ejemplo.com

Artículos pedidos:
- 04. Rodillera Orificio y Velcro: T3 (1)  T4 (2)
- 030. Tobillera Corta: T2 (3)

Total: 6 artículos
```

## Íconos SVG

`CAT_ICONS` está definido en los 3 archivos HTML. Categorías: `rodilleras`, `tobilleras`, `munequeras`, `coderas`, `fajas`, `inmovilizadores`, `correctores`, `otros`. Usan `currentColor` — adaptán al tema y al hover sin CSS extra.

## Agregar fotos de productos

1. Poner la foto en `img/productos/nombre.jpg` (400×400px cuadrada recomendado)
2. En el array `CATALOG` de `productos.html`, agregar la propiedad `img` al producto:
   ```javascript
   { id:"04", code:"04", name:"Rodillera Orificio y Velcro", cat:"rodilleras",
     emoji:"🦵", sizes:[1,2,3,4,5],
     img: "img/productos/04-rodillera-velcro.jpg" },
   ```
3. Si `p.img` existe muestra la foto; si no, muestra el SVG de la categoría.

## Git / Deploy

- Repo: `https://github.com/adherneo/adherneo` (branch `main`)
- `.gitignore` excluye: `etiquetas.html`, `ETIQUETAS/`, `.claude/`, temporales de Word
- Deploy: Netlify Drop (arrastrar carpeta) o GitHub Pages (Settings → Pages → main)
- Dominio propio: configurar en Netlify *Domain settings* o GitHub Pages *Custom domain*

## Lo que falta

- [ ] Push inicial al repo (`git push -u origin main`)
- [ ] Habilitar GitHub Pages o hacer deploy en Netlify
- [ ] Dominio personalizado (adherneo.com.ar)
- [ ] Fotos de productos en `img/productos/`
- [ ] `contacto.html` (mencionada en footer pero no creada aún)
