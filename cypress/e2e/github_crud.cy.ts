/// <reference types="cypress" />

// Pruebas E2E para el flujo principal: Login -> Listar -> Crear -> Editar -> Borrar
// Comentarios y aserciones en español para la defensa técnica

describe('Flujo CRUD GitHub (simulado con intercepts)', () => {
  beforeEach(() => {
    // Interceptar llamadas a la API de GitHub para que las pruebas no dependan de la red
    cy.intercept('GET', '/user', { fixture: 'github_user.json' }).as('getUser');
    cy.intercept('GET', '/user/repos', { fixture: 'repos.json' }).as('getRepos');
  });

  it('Inicia sesión y muestra repositorios', () => {
    cy.visit('/login');

    // Completar formulario de login
    cy.get('ion-input[placeholder="Usuario"]').shadow().find('input').type('student123');
    cy.get('ion-input[placeholder="Github Token"]').shadow().find('input').type('fake-token');
    cy.contains('button', 'Iniciar Sesión').click();

    // Tras login, debería navegar a la lista de repos y cargar los repos interceptados
    cy.url().should('include', '/tab1');

    // Esperamos la petición a /user/repos y comprobamos que se renderiza el repo de fixtures
    cy.wait('@getRepos');
    cy.get('.repo-name').contains('demo-repo').should('exist');
  });

  it('Crea un nuevo repositorio y se muestra en la lista', () => {
    // Interceptar la creación y devolver un objeto con owner (simula creación remota)
    cy.intercept('POST', '/user/repos', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: 222,
          name: req.body.name,
          description: req.body.description,
          owner: { login: 'student123', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' },
          language: null,
          stargazers_count: 0
        }
      });
    }).as('createRepo');

    // Abrir modal de creación
    cy.get('button[title="Crear repositorio"]').click();

    // Ingresar datos en el modal
    cy.get('ion-input[placeholder="nombre-del-repo"]').shadow().find('input').type('nuevo-repo');
    cy.get('ion-textarea').shadow().find('textarea').type('Descripción del nuevo repo');

    cy.contains('button', 'Crear repositorio').click();

    cy.wait('@createRepo');

    // Comprobamos que el nuevo repo aparece en la lista
    cy.get('.repo-name').contains('nuevo-repo').should('exist');
  });

  it('Edita un repositorio existente', () => {
    // Interceptar PATCH y devolver la versión actualizada
    cy.intercept('PATCH', '/repos/*/*', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 111,
          name: 'demo-repo-renombrado',
          description: 'Descripción actualizada',
          owner: { login: 'student123', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' },
          language: 'TypeScript',
          stargazers_count: 2
        }
      });
    }).as('editRepo');

    // Abrir modal de edición (buscar por nombre actual)
    cy.get('.repo-name').contains('demo-repo').parents('ion-item').within(() => {
      cy.get('button[aria-label="Editar repositorio"]').click();
    });

    // Cambiar nombre y descripción
    cy.get('ion-input[placeholder="nombre-del-repo"]').shadow().find('input').clear().type('demo-repo-renombrado');
    cy.get('ion-textarea').shadow().find('textarea').clear().type('Descripción actualizada');
    cy.contains('button', 'Guardar cambios').click();

    cy.wait('@editRepo');
    cy.get('.repo-name').contains('demo-repo-renombrado').should('exist');
  });

  it('Elimina un repositorio', () => {
    // Interceptar DELETE
    cy.intercept('DELETE', '/repos/*/*', { statusCode: 204 }).as('deleteRepo');

    // Hacer click en eliminar y confirmar en la alerta
    cy.get('.repo-name').contains('demo-repo-renombrado').parents('ion-item-sliding').within(() => {
      cy.get('button[aria-label="Eliminar repositorio"]').click();
    });

    // Confirmar en el IonAlert
    cy.contains('button', 'Eliminar').click();

    cy.wait('@deleteRepo');

    // Comprobamos que ya no existe en la lista
    cy.get('.repo-name').contains('demo-repo-renombrado').should('not.exist');
  });
});