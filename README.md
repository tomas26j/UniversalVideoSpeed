# Universal Video Speed Controller

**Universal Video Speed Controller** es una extensión para Chrome que te permite controlar la velocidad de reproducción de cualquier video HTML en la web, con una interfaz moderna, minimalista y soporte multilingüe (español/inglés).

---

## Características principales

- Cambia la velocidad de reproducción de uno o varios videos en cualquier página.
- Selecciona videos individuales con miniatura y duración.
- Elige entre velocidades predefinidas o personalizadas (0.1x a 10x).
- Panel flotante minimalista sobre el video para control rápido (aparece solo en pausa).
- Botón para restablecer la velocidad a 1x.
- Interfaz en modo oscuro por defecto.
- Soporte automático para español e inglés según el idioma del navegador.
- Accesibilidad mejorada (navegación por teclado y etiquetas ARIA).
- No requiere permisos innecesarios.

---

## Instalación manual

1. Descarga o clona este repositorio.
2. Ve a `chrome://extensions/` en tu navegador Chrome.
3. Activa el "Modo de desarrollador".
4. Haz clic en "Cargar descomprimida" y selecciona la carpeta del proyecto.

---

## ¿Cómo se usa?

1. Haz clic en el icono de la extensión en la barra de Chrome.
2. Selecciona la velocidad deseada (o ingresa una personalizada).
3. Marca los videos a los que quieres aplicar la velocidad.
4. Haz clic en **Aplicar**.
5. (Opcional) Usa el botón **Restablecer** para volver a 1x.
6. También puedes pausar un video y usar el panel flotante para ajustar la velocidad rápidamente.

---

## Accesibilidad

- Todos los controles tienen etiquetas ARIA y son navegables por teclado.
- El contraste y el diseño están optimizados para modo oscuro.

---

## Soporte multilingüe

La extensión detecta automáticamente el idioma del navegador y muestra la interfaz en español o inglés.

---

## Permisos

- `activeTab` y `scripting` (solo para modificar la velocidad de videos en la página actual).
- No se recopila ni almacena ningún dato del usuario.

---

## Créditos

Desarrollado por Tomas Riera.  
Iconos y diseño minimalista inspirados en Material Design.