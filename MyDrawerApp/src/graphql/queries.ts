import { gql } from '@apollo/client';

export const GET_ITEMS = gql`
  query GetItems($page: Int) {
    characters(page: $page) {
      results {
        id
        name
        species
        created
      }
    }
  }
`;


export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        next
        count
      }
      results {
        id
        name
        status
        species
        gender
        image
        
      }
    }
  }
`;

// --- POSTS (Offline-First Feature) ---
// Note: We use plain strings here because graphql-request doesn't require the `gql` tag,
// but using it or a plain string works. The prompt says use `gql`-tagged template literals.

export const GET_POSTS = gql`
  query GetPosts($options: PageQueryOptions) {
    posts(options: $options) {
      data {
        id
        title
        body
        user {
          id
        }
      }
      meta {
        totalCount
      }
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      body
      user {
        id
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      body
      user {
        id
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      body
      user {
        id
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;