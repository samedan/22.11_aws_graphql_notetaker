/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const newOnCreateNote = /* GraphQL */ `
  subscription NewOnCreateNote {
    newOnCreateNote {
      id
      note
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote($owner: String) {
    onCreateNote(owner: $owner) {
      id
      note
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateNote = /* GraphQL */ `
  subscription OnUpdateNote($owner: String) {
    onUpdateNote(owner: $owner) {
      id
      note
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteNote = /* GraphQL */ `
  subscription OnDeleteNote($owner: String) {
    onDeleteNote(owner: $owner) {
      id
      note
      createdAt
      updatedAt
      owner
    }
  }
`;
