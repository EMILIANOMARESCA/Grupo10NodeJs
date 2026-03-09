# Análisis técnico integral y propuesta de refactor

## 1) Resumen ejecutivo

El proyecto funciona como una base **MVC con Express + EJS + MySQL**, pero hoy presenta deuda técnica significativa en arquitectura, seguridad, mantenibilidad y calidad operativa. Hay varios puntos críticos que conviene abordar antes de incorporar nuevas funcionalidades:

- Riesgos de seguridad (sesión, rutas dinámicas, validación insuficiente, configuración por defecto insegura).
- Acoplamiento alto entre capa HTTP, lógica de negocio y SQL.
- Inconsistencias y errores de implementación en modelos/rutas que pueden producir fallos en producción.
- Ausencia de testing, observabilidad y pipeline de calidad.

En términos prácticos: el código permite evolucionar, pero a costo alto y con riesgo creciente de regresiones.

---

## 2) Hallazgos por área

### 2.1 Arquitectura y organización

**Situación actual**
- Los controladores contienen lógica SQL, validación y renderizado, todo junto.
- Hay modelos incompletos o incorrectos (`items.js`) y un uso inconsistente de `pool`/`connection`.
- El código mezcla patrones (algunos queries en modelos, otros directo en controladores).

**Impacto**
- Dificulta testear lógica de negocio en aislamiento.
- Eleva riesgo de errores al duplicar SQL en múltiples puntos.
- Reduce la velocidad para agregar funcionalidades.

**Evidencia**
- SQL embebido en controladores de `main`, `shop` y `admin`. 
- Modelo `items` con errores tipográficos y API inconsistente (`conn`, `querry`).
- Modelo `product.models` intenta liberar conexión de forma inválida en `finally`.

### 2.2 Calidad del código y bugs funcionales

**Issues detectados**
1. **Ruta logout mal enlazada**: `/auth/logout` ejecuta `postRegister` en vez de `logout`.
2. **Render de vista inexistente**: se intenta renderizar `error` pero no existe `src/views/error.ejs`.
3. **Modelo `items` no operativo** (`conn` inexistente y `querry` mal escrito).
4. **Liberación incorrecta de conexión en modelo de productos** (`pool.releaseConnection()` sin conexión concreta).
5. **Middlewares vacíos** (`auth.js`, `uploadFile.js`, `validator.js`) agregan ruido y confusión.

**Impacto**
- Comportamientos inesperados en autenticación y manejo de errores.
- Riesgo de fallos en tiempo de ejecución.

### 2.3 Seguridad

**Riesgos principales**
- `express-session` con `saveUninitialized: true` y `cookie.secure: false` fijo.
- Se expone información sensible por `console.log` de variables de entorno en conexión DB.
- Falta endurecimiento de headers (no se usa `helmet`).
- No hay protección CSRF para formularios sensibles (auth/admin).
- No hay rate limiting para login/búsquedas.
- Ruta dinámica en admin (`/:page`) con `sendFile` sobre parámetro sin whitelist explícita.

**Impacto**
- Aumenta superficie de ataque y riesgo de fuga de datos.

### 2.4 Base de datos y performance

**Observaciones**
- Queries repetidas y largas en varios controladores.
- No hay capa repositorio/servicio para reutilización.
- No se aprecia estrategia de paginación para listados grandes (shop/admin).
- `connectionLimit: 100` puede ser excesivo para entornos pequeños y no está justificado.

**Mejora esperada**
- Reducir latencia y carga DB con consultas encapsuladas e índices correctos.
- Mejorar escalabilidad con paginado, filtros robustos y caché puntual.

### 2.5 Front-end y UX técnica

**Observaciones**
- Existe mezcla de EJS con páginas HTML estáticas en `public/pages`.
- Falta de un diseño consistente de componentes/partials para todas las vistas.
- Sin estrategia clara de validación cliente-servidor alineada.

**Impacto**
- Duplicación de estructuras y mayor costo de mantenimiento visual.

### 2.6 Operación, DX y testing

**Situación actual**
- `npm test` no está implementado.
- No hay ESLint/Prettier ni hooks de calidad.
- No hay pruebas unitarias/integración/e2e.
- No hay estructura de logs ni manejo centralizado de errores.

**Impacto**
- Detección tardía de bugs y regresiones.
- Onboarding más lento para nuevos desarrolladores.

---

## 3) Plan de refactor propuesto (priorizado)

## Fase 0 (rápida, alto impacto: 1–2 días)
- Corregir bugs críticos:
  - Ruta de logout.
  - `items.js` y `product.models.js`.
  - Vista de error y middleware global de errores.
- Endurecer configuración mínima de sesión/cookies según entorno.
- Eliminar logs de secretos/credenciales.

**Resultado esperado:** mayor estabilidad y menor riesgo inmediato.

## Fase 1 (estructura base: 3–5 días)
- Introducir capas:
  - `routes -> controllers -> services -> repositories`.
- Centralizar acceso a DB y utilidades de query.
- Reemplazar SQL duplicada por repositorios por entidad (`product`, `licence`, `category`, `user`, `cart`).
- Definir DTOs y validaciones con `express-validator` en rutas críticas.

**Resultado esperado:** arquitectura mantenible y testeable.

## Fase 2 (seguridad y calidad: 3–4 días)
- Añadir `helmet`, `cors` (si aplica), `express-rate-limit`, `csurf` (o alternativa con tokens).
- Implementar logging estructurado (p. ej. `pino`) y request-id.
- Configurar ESLint + Prettier + scripts de CI local.
- Incorporar pruebas unitarias (services) e integración (controllers + DB mock o test DB).

**Resultado esperado:** menor riesgo de seguridad y más confiabilidad en cambios.

## Fase 3 (performance y producto: 4–7 días)
- Paginación/ordenamiento/filtros robustos en shop/admin.
- Optimizar consultas e índices de DB.
- Mejorar manejo de imágenes (nombres, validación MIME, almacenamiento externo opcional).
- Refactor del carrito (persistencia DB para usuarios autenticados + sesión para guest).

**Resultado esperado:** app más escalable y experiencia de usuario consistente.

---

## 4) Backlog técnico sugerido (tickets accionables)

1. **[BUG]** Fix `/auth/logout` apuntando a `authControllers.logout`.
2. **[BUG]** Crear `src/views/error.ejs` y middleware global de error/404.
3. **[BUG]** Reescribir `src/models/items.js` con `pool.query` válido.
4. **[BUG]** Corregir liberación de conexión en `product.models.js`.
5. **[SEC]** Quitar `console.log` de credenciales y reforzar session cookie por entorno.
6. **[SEC]** Implementar rate limit en login y endpoints de búsqueda.
7. **[ARCH]** Crear capa services/repositories para productos.
8. **[ARCH]** Unificar validaciones con `express-validator`.
9. **[DX]** Agregar ESLint + Prettier + scripts (`lint`, `format`, `test`).
10. **[TEST]** Añadir pruebas mínimas: auth login, listado shop, CRUD admin.

---

## 5) Métricas de éxito para el refactor

- **Calidad:** cobertura de pruebas inicial >= 40% en capas service/controller.
- **Confiabilidad:** reducción de errores 5xx en rutas críticas.
- **Seguridad:** checklist OWASP básico aplicado (sesiones, headers, CSRF, rate-limit).
- **Mantenibilidad:** reducción de duplicación SQL y complejidad ciclomática en controladores.
- **Performance:** tiempos p95 estables en listado de shop/admin con paginación.

---

## 6) Siguiente paso recomendado

Iniciar por **Fase 0** en un PR pequeño y controlado (hardening + bugs críticos), y luego abrir un PR por cada vertical (arquitectura, seguridad, testing) para minimizar riesgo de regresión.
