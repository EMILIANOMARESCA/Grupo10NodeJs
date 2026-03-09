# Plan de mejoras post-merge (nueva branch)

## Contexto
Después del merge y la resolución inicial de conflictos, el proyecto quedó estable para seguir evolucionando, pero todavía hay oportunidades claras para mejorar arquitectura, seguridad, confiabilidad y DX.

Este documento propone un plan incremental para que el equipo avance sin frenar entregas funcionales.

---

## Diagnóstico rápido (estado actual)

### 1) Calidad y automatización
- `npm test` no ejecuta pruebas reales (hoy falla de forma deliberada), por lo que no hay red de seguridad para cambios futuros.
- No hay scripts de lint/format en `package.json`, por lo que la calidad de estilo depende de revisión manual.

**Impacto:** alta probabilidad de regresiones en cambios pequeños.

### 2) Seguridad de aplicación
- Se usa `express-session`, pero no hay middlewares de hardening como `helmet`, ni rate-limiting para endpoints sensibles.
- La autenticación de admin depende de una propiedad de sesión simple (`req.session.userId`) sin roles/permisos.

**Impacto:** superficie de ataque mayor a la necesaria y control de acceso poco granular.

### 3) Arquitectura y mantenibilidad
- Hay SQL en múltiples controladores (`main`, `shop`, `admin`) y mezcla de patrones de acceso a datos.
- Existe una ruta dinámica de admin (`/admin/:page`) que sirve HTML estático; aunque valida existencia de archivo, conviene encapsular esto con whitelist explícita.

**Impacto:** mantenimiento más costoso, mayor acoplamiento y riesgo de inconsistencias.

### 4) Rendimiento y experiencia de uso
- No hay paginación/filtrado robusto para listados (shop/admin), lo que puede afectar rendimiento con catálogo grande.
- Búsquedas no tienen debouncing/rate-limit en backend y pueden generar carga evitable.

**Impacto:** degradación progresiva cuando crezca volumen de productos/usuarios.

---

## Propuesta de mejoras priorizadas

## Fase 1 (Quick wins, 1 semana)
Objetivo: mejorar estabilidad sin cambios disruptivos.

1. **Calidad base del repo**
   - Agregar `eslint` + `prettier` con scripts: `lint`, `lint:fix`, `format`.
   - Reemplazar script `test` placeholder por una suite inicial en Jest + Supertest.
2. **Hardening mínimo**
   - Incorporar `helmet` y `express-rate-limit` (login, búsqueda, endpoints admin sensibles).
   - Añadir validación de entrada con `express-validator` para auth y CRUD admin.
3. **Observabilidad básica**
   - Cambiar `console.log` dispersos por un logger simple por niveles (`info`, `warn`, `error`).

**Criterio de éxito:** CI local ejecuta `npm run lint` + `npm test` en verde.

## Fase 2 (Refactor estructural, 1–2 semanas)
Objetivo: reducir acoplamiento y preparar escalabilidad.

1. **Separación por capas**
   - `routes -> controllers -> services -> repositories`.
   - Mover SQL fuera de controladores a repositorios por entidad (`product`, `licence`, `category`, `user`).
2. **Estandarizar errores**
   - Crear `AppError` + middleware de manejo centralizado con códigos y mensajes homogéneos.
3. **Control de acceso**
   - Extender sesión para roles (`admin`, `user`) y middlewares `requireAuth`/`requireRole`.

**Criterio de éxito:** controladores del módulo shop/admin sin SQL inline.

## Fase 3 (Escala funcional, 2 semanas)
Objetivo: mejorar performance y flujo de negocio.

1. **Paginación y filtros**
   - Paginación server-side para shop/admin.
   - Filtros por licencia/categoría/rango de precio.
2. **Carrito robusto**
   - Mantener carrito en DB para usuarios autenticados y sincronización con sesión guest.
3. **Índices y tuning DB**
   - Revisar índices para columnas consultadas en búsqueda y listados.

**Criterio de éxito:** tiempos de respuesta estables en listados con datasets grandes.

---

## Backlog de tickets sugerido
1. `[DX]` Setup ESLint/Prettier + scripts de calidad.
2. `[TEST]` Suite inicial Jest/Supertest para auth, shop index y admin auth guard.
3. `[SEC]` Integrar Helmet + Rate Limit + validaciones de entrada.
4. `[ARCH]` Extraer SQL de `shopController` a repositorio.
5. `[ARCH]` Extraer SQL de `adminController` a repositorio.
6. `[SEC]` Implementar roles y middleware de autorización.
7. `[PERF]` Paginación y filtros en `/shop` y `/admin`.
8. `[PERF]` Optimización de búsqueda y query plan en DB.
9. `[UX]` Mensajes de error/validación consistentes en vistas EJS.

---

## Recomendación de branch strategy
- Crear una rama por fase para evitar PRs masivos:
  - `feat/fase1-quality-security-baseline`
  - `refactor/fase2-layered-architecture`
  - `feat/fase3-performance-cart`
- Cada fase con PR incremental y checklist de validación.

