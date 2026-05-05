# Despliegue en Heroku usando Container Registry

Este proyecto se puede desplegar en Heroku usando la Container Registry (empaqueta frontend dentro del backend). Los pasos resumidos:

1. Instalar la CLI de Heroku e iniciar sesión:

```bash
heroku login
heroku container:login
```

2. Crear la app (o usar una existente):

```bash
heroku create <nombre-app>
```

3. Añadir PostgreSQL (addon) a la app:

```bash
heroku addons:create heroku-postgresql:hobby-dev -a <nombre-app>
```

4. Construir la imagen Docker y subirla:

```bash
# Desde la raíz del repo (contiene Dockerfile que construye frontend+backend)
docker build -t registry.heroku.com/<nombre-app>/web .
docker push registry.heroku.com/<nombre-app>/web
heroku container:release web -a <nombre-app>
```

5. Configurar variables de entorno sensibles (en Heroku):

```bash
heroku config:set JWT_SECRET="<tu-secreto-largo>" -a <nombre-app>
# Opcional: otras variables como JWT_EXPIRATION
```

Nota sobre la base de datos: Heroku crea `DATABASE_URL` automáticamente. El `Dockerfile` del proyecto convierte `DATABASE_URL` a `SPRING_DATASOURCE_URL` antes de iniciar la app.

6. Ver logs y abrir la app:

```bash
heroku logs --tail -a <nombre-app>
heroku open -a <nombre-app>
```

7. Migraciones y semillas

Al iniciar el contenedor, Flyway ejecutará las migraciones incluidas. `V2__insert_initial_data.sql` fue limpiado para incluir sólo usuarios.

Si prefieres usar el buildpack de Java en lugar de contenedores, dímelo y adapto los pasos.
