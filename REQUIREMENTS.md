## Cómo debes trabajar

1. **Haz lo mínimo que cumpla los criterios de aceptación de la historia.** Nada más. Si algo "sería bueno tenerlo", menciónalo pero no lo hagas.
2. **Copia el patrón del módulo auth y users`.** Es la referencia oficial. Si dudas cómo hacer algo, pregunta al usuario antes de añadir algo.
3. **Explica lo que hiciste** en lenguaje sencillo al terminar: qué archivos creaste y para qué sirve cada uno.
4. **Pregunta antes de** instalar una librería, crear o cambiar una tabla, o tocar un archivo fuera del módulo del usuario.
5. **Trabaja en pasos pequeños** que se puedan probar. Un PR por historia o parte de historia.
6. Si el usuario te pide algo que rompe estas reglas, avísale y explica por qué antes de hacerlo.

## Arquitectura (obligatoria)

Debes manejar una arquitectura modular clásica, el flujo controller -> service -> dao (typeorm) con la división de carpetas que manejan los módulos ya presentes en el código.

## Qué NO hacer (sobreingeniería)

- No crear clases base genéricas (`BaseRepository<T>`, `BaseEntity`, `GenericCrudService`).
- No usar CQRS, eventos, colas, microservicios, mappers automáticos ni patrones que zonas no usa.
- No agregar librerías nuevas sin permiso del usuario. Ya están: class-validator, class-transformer, TypeORM, pg, @nestjs/config.
- No crear capas o carpetas extra (`helpers/`, `core/`) sin necesidad real.
- No escribir interfaces para todo.
- No optimizar consultas ni agregar caché, paginación avanzada o índices que la historia no pida.
- No escribir pruebas para controladores ni repositorios. Solo pruebas unitarias del dominio y los casos de uso.
- No usar `synchronize: true` en TypeORM.

## Convenciones

- **Nombres en inglés** Además, archivos en kebab-case.
- Imports con extensión `.js` (el proyecto es ESM)
- Columnas de la base en snake_case, como en el modelo: `id_cliente`, `razon_social`, `fecha_creacion`.
- Rutas HTTP en plural y en inglés.
- Ramas: `feature/HU-XX-descripcion-corta`.

## Base de datos

- Para crear una migración: cambia el `*.orm-entity.ts`, luego `npm run migration:generate -- src/database/migrations/NombreDescriptivo`, revisa el SQL y luego `npm run migration:run`.

## Seguridad y archivos

- Nunca escribas contraseñas, llaves ni secretos en el código. Todo va en `.env` (que no se sube) y se documenta en `.env.example`.

## Antes de dar algo por terminado

1. `cd backend && npm run build && npm test` pasan.
2. `cd frontend && npm run build` pasa.
3. Se cumplen los criterios de aceptación de la historia (están en el archivo del usuario en `docs/agentes/`).
4. Explicaste al usuario qué hiciste para que pueda contarlo en la sustentación.
