[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/y8OahlhZ)
# Cliente de GitHub con Ionic

## Información del Estudiante

- **Nombre:** [Tu nombre completo aquí]
- **Carrera:** [Tu carrera]
- **Fecha de inicio:** [Fecha]

---

Este proyecto es una aplicación móvil desarrollada con Ionic y React que implementa un cliente de GitHub. A través de una serie de laboratorios, construirás gradualmente las funcionalidades para gestionar repositorios de GitHub.

## Descripción del Proyecto

Aplicación móvil que permite:
- Visualizar lista de repositorios de GitHub
- Crear nuevos repositorios
- Ver información del usuario
- Editar y eliminar repositorios (funcionalidad avanzada)

## Laboratorios

### Laboratorio 7: Componentes GUI de Ionic

En este laboratorio explorarás varios componentes de GUI propios de Ionic para construir:

- **Interfaz de lista de repositorios**: Implementación de una lista interactiva utilizando componentes Ionic para mostrar repositorios
- **Componente de ítem de repositorio**: Creación de un componente reutilizable para cada repositorio en la lista
- **Formulario de creación**: Diseño de un formulario para crear nuevos repositorios utilizando componentes de entrada de Ionic
- **Pestaña de información de usuario**: Interfaz para desplegar la información del perfil del usuario de GitHub

**Componentes Ionic a utilizar:**
- `IonList`, `IonItem`, `IonLabel`
- `IonInput`, `IonTextarea`, `IonButton`
- `IonCard`, `IonCardHeader`, `IonCardContent`
- `IonTabs`, `IonTabBar`, `IonTabButton`

### Laboratorio 8: Implementación de una API REST usando Ionic (Métodos GET)

Implementación de la comunicación con la API REST de GitHub usando Axios:

- Configuración de Axios en el proyecto
- Implementación del método `GET` para obtener la lista de repositorios
- Implementación del método `GET` para obtener la información del usuario
- Manejo de estados de carga y errores
- Integración de los datos obtenidos con los componentes GUI

**Endpoints a implementar:**
- `GET /user/repos` - Obtener repositorios del usuario
- `GET /user` - Obtener información del usuario

### Laboratorio 9: Implementación de una API REST usando Ionic (Método POST)

Implementación de la funcionalidad para crear repositorios:

- Implementación del método `POST` para crear un nuevo repositorio
- Validación de formularios
- Manejo de respuestas exitosas y errores
- Actualización de la lista de repositorios tras la creación
- Feedback visual al usuario

**Endpoint a implementar:**
- `POST /user/repos` - Crear un nuevo repositorio

### Examen Parcial 2: Implementación de una API REST usando Ionic (Métodos DELETE y PATCH)

Implementación de funcionalidades avanzadas de gestión:

- Implementación del método `DELETE` para eliminar repositorios
- Implementación del método `PATCH` para editar repositorios existentes
- Confirmaciones de acciones destructivas
- Actualización dinámica de la interfaz
- Manejo completo del ciclo CRUD

**Endpoints a implementar:**
- `DELETE /repos/{owner}/{repo}` - Eliminar un repositorio
- `PATCH /repos/{owner}/{repo}` - Actualizar un repositorio

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Ionic CLI: `npm install -g @ionic/cli`
- Android Studio (para desarrollo Android)
- Xcode (para desarrollo iOS, solo en macOS)
- Token de acceso personal de GitHub

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd github-client
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar el token de GitHub:
   - Crea un archivo `.env` en la raíz del proyecto
   - Agrega tu token: `VITE_GITHUB_TOKEN=tu_token_aquí`

## Comandos Básicos de Ionic

### Desarrollo Web

Levantar el servidor de desarrollo:
```bash
ionic serve
```

Levantar en un puerto específico:
```bash
ionic serve --port=8100
```

Abrir en el navegador automáticamente:
```bash
ionic serve --open
```

### Construcción

Generar build de producción:
```bash
ionic build
```

Build con configuración específica:
```bash
ionic build --prod
```

### Plataformas Móviles

#### Agregar plataformas

Agregar plataforma Android:
```bash
ionic capacitor add android
```

Agregar plataforma iOS:
```bash
ionic capacitor add ios
```

#### Sincronizar código con plataformas

Sincronizar todos los cambios:
```bash
ionic capacitor sync
```

Sincronizar solo Android:
```bash
ionic capacitor sync android
```

Sincronizar solo iOS:
```bash
ionic capacitor sync ios
```

#### Copiar archivos web a plataformas nativas

Copiar a todas las plataformas:
```bash
ionic capacitor copy
```

Copiar solo a Android:
```bash
ionic capacitor copy android
```

Copiar solo a iOS:
```bash
ionic capacitor copy ios
```

#### Actualizar Capacitor

```bash
ionic capacitor update
```

### Desarrollo en Dispositivos

#### Abrir en IDE nativo

Abrir proyecto Android en Android Studio:
```bash
ionic capacitor open android
```

Abrir proyecto iOS en Xcode:
```bash
ionic capacitor open ios
```

#### Live Reload en dispositivos

Desplegar con Live Reload en Android:
```bash
ionic capacitor run android --livereload --external
```

Desplegar con Live Reload en iOS:
```bash
ionic capacitor run ios --livereload --external
```

Live Reload con SSL:
```bash
ionic capacitor run android --livereload --external --ssl
```

#### Ejecutar en dispositivo específico

Listar dispositivos disponibles:
```bash
ionic capacitor run android --list
```

Ejecutar en dispositivo específico:
```bash
ionic capacitor run android --target=<device-id>
```

### Control de Versiones (Git)

#### Configuración inicial

Configurar tu nombre de usuario:
```bash
git config --global user.name "Tu Nombre"
```

Configurar tu email:
```bash
git config --global user.email "tu.email@ejemplo.com"
```

Ver configuración actual:
```bash
git config --list
```

#### Comandos básicos de Git

Ver estado del repositorio:
```bash
git status
```

Agregar archivos al staging area:
```bash
git add .
```

Agregar un archivo específico:
```bash
git add nombre-archivo.ts
```

Hacer commit de los cambios:
```bash
git commit -m "Descripción de los cambios realizados"
```

Subir cambios al repositorio remoto:
```bash
git push
```

Subir cambios a una rama específica:
```bash
git push origin nombre-rama
```

Descargar cambios del repositorio remoto:
```bash
git pull
```

#### Flujo de trabajo recomendado

1. Verifica el estado de tu repositorio:
```bash
git status
```

2. Agrega los archivos modificados:
```bash
git add .
```

3. Realiza un commit con un mensaje descriptivo:
```bash
git commit -m "Lab 7: Implementación de componentes GUI"
```

4. Sube los cambios al repositorio:
```bash
git push
```

### Comandos Útiles de Ionic de Ionic

Ver información del proyecto:
```bash
ionic info
```

Ver configuración de Capacitor:
```bash
ionic capacitor doctor
```

Limpiar y reconstruir:
```bash
rm -rf node_modules package-lock.json
npm install
ionic build
ionic capacitor sync
```

Ver versión de Ionic:
```bash
ionic --version
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── pages/              # Páginas de la aplicación (Tabs)
│   ├── Tab1.tsx       # Lista de repositorios
│   ├── Tab2.tsx       # Crear repositorio
│   └── Tab3.tsx       # Información de usuario
├── services/          # Servicios para API REST (crear en laboratorios)
├── theme/             # Estilos y temas de Ionic
└── App.tsx            # Componente principal
```

## Tecnologías Utilizadas

- **Ionic Framework 8**: Framework para aplicaciones móviles híbridas
- **React 18**: Biblioteca de JavaScript para interfaces de usuario
- **TypeScript**: Superset tipado de JavaScript
- **Capacitor**: Runtime nativo para aplicaciones web
- **Axios**: Cliente HTTP para consumir APIs REST
- **Vite**: Herramienta de construcción rápida
- **GitHub API v3**: API REST de GitHub

## API de GitHub

### Autenticación

Todas las peticiones requieren un token de autenticación personal:

```typescript
headers: {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
}
```

### Endpoints Principales

- `GET https://api.github.com/user` - Información del usuario
- `GET https://api.github.com/user/repos` - Lista de repositorios
- `POST https://api.github.com/user/repos` - Crear repositorio
- `PATCH https://api.github.com/repos/{owner}/{repo}` - Actualizar repositorio
- `DELETE https://api.github.com/repos/{owner}/{repo}` - Eliminar repositorio

Documentación completa: [GitHub REST API Documentation](https://docs.github.com/en/rest)

## Recursos Adicionales

- [Documentación de Ionic](https://ionicframework.com/docs)
- [Documentación de React](https://react.dev)
- [Documentación de Capacitor](https://capacitorjs.com/docs)
- [Documentación de Axios](https://axios-http.com/docs/intro)
- [GitHub API Documentation](https://docs.github.com/en/rest)

## Soporte

Para dudas o problemas durante el desarrollo de los laboratorios, consulta con tu instructor o revisa la documentación oficial de las tecnologías utilizadas.

## Licencia

Este proyecto está con fines educativos.


## Datos del docente

Pablo Pérez Martínez
- ✉️ paperez@puce.edu.ec
- ✉️ pablo.perez@uisek.edu.ec