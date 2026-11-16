# Portafolio de Rodrigo Contreras

Portafolio profesional orientado a análisis de datos, BI y automatización. Aplicación estática con Vite, HTML, CSS y JavaScript.

## Desarrollo

```sh
npm ci
npm run dev
```

## Compilación

```sh
npm run build
npm run preview
```

Vercel compila el proyecto con `npm run build` y publica `dist/`.

## Actualizar contenido

- `index.html`: presentación, casos, experiencia, habilidades y formación.
- `src/style.css`: diseño adaptable, colores y temas.
- `src/main.js`: navegación, tema y formulario de contacto.
- `src/translations.js`: textos en español e inglés. Los atributos `data-i18n` conectan cada texto con su traducción.
- `public/RODRIGO_CONTRERAS_CV.pdf`: CV descargable. Sustituir este archivo al actualizar el currículum.

El formulario conserva la integración existente con EmailJS. Sus identificadores de servicio, plantilla y clave pública están en `src/main.js`. El éxito se muestra después de la respuesta del servicio; un fallo mantiene el texto para reintentar. Las restricciones de dominio, cuotas y entrega del proveedor se administran desde la cuenta de EmailJS.

El contenido se actualizó en noviembre de 2026. El certificado Google Data Analytics permanece marcado como en curso. Los proyectos internos se describen sin publicar bases de clientes ni enlaces de trabajo privados.

El selector ES/EN traduce la página y recuerda la preferencia en este navegador. Los enlaces `?lang=es` y `?lang=en` permiten compartir un idioma específico. Ambos temas usan una paleta en blanco, negro y grises. El CV descargable está en español y se identifica así también en la versión inglesa.
