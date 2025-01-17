import { gql, createClient } from '@urql/core';
import { PokemonFields } from './Pokemon';

const PokemonsQuery = gql`
  query Pokemons {
    pokemons {
      id
      name
      ...pokemonFields
      __typename
    }
  }

  ${PokemonFields}
` as typeof import('./index.generated').PokemonsDocument

const client = createClient({
  url: '',
})

client.query(PokemonsQuery).toPromise().then(result => {
  result.data?.pokemons;
})

const PokemonQuery = gql`
  query Pokemon($id: ID!) {
    pokemon(id: $id) {
      id
      name
      __typename
    }
  }
` as typeof import('./index.generated').PokemonDocument

client.query(PokemonQuery, { id: '' }).toPromise().then(result => {
  result.data?.pokemon;
})
