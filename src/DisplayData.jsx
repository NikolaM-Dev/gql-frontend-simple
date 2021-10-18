import React, { useState } from 'react';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';

const QUERY_ALL_USERS = gql`
  query findManyUsers {
    users {
      id
      age
      name
      username
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query findManyMovies {
    movies {
      name
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query FindMovieByName($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      age
      nationality
      username
    }
  }
`;

// Fragment example
const _FRAGMENT_QUEY = gql`
  query FragmentExample {
    users {
      ...GetAgeAndName
    }
  }

  fragment GetAgeAndName on User {
    name
    age
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUserMutation($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId) {
      name
      id
    }
  }
`;

const DisplayData = () => {
  const [movieSearched, setMovieSearched] = useState('');

  // Create User States
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('');

  const { data, loading, error, refetch } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const [fetchMovie, { data: movieSearchedData, error: movieError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);

  const handleChange = (e) => setMovieSearched(e.target.value);

  if (loading) return <h1>Data is loading...</h1>;
  if (data) console.log(data);
  if (error) console.error(error);
  if (movieError) console.error(movieError);

  return (
    <>
      <input
        placeholder="Name..."
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Username..."
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Age..."
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        placeholder="Nationality..."
        type="text"
        value={nationality}
        onChange={(e) => setNationality(e.target.value.toUpperCase())}
      />

      <button
        onClick={() => {
          createUser({
            variables: {
              input: {
                name,
                username,
                age: Number(age),
                nationality,
              },
            },
          });

          refetch();
        }}
      >
        Create User
      </button>

      {data &&
        data.users.map((user) => (
          <div key={user.id}>
            <h1>Name: {user.name}</h1>
            <p>Age: {user.age}</p>
            <p>Username: {user.usernames}</p>
            <p>Nationality: {user.nationality}</p>
            <button
              onClick={() => {
                deleteUser({
                  variables: {
                    deleteUserId: user.id,
                  },
                });
                refetch();
              }}
            >
              Delete
            </button>
          </div>
        ))}

      {movieData &&
        movieData.movies.map((movie) => (
          <h2 key={movie.name}>Movie Name: {movie.name}</h2>
        ))}

      <div>
        <input
          placeholder="Interstellar..."
          type="text"
          onChange={handleChange}
        />
        <button
          onClick={() => {
            fetchMovie({
              variables: {
                name: movieSearched,
              },
            });
          }}
        >
          Fetch Data
        </button>
        <div>
          {movieSearchedData && (
            <div>
              <h2>MovieName: {movieSearchedData.movie.name}</h2>
              <p>
                Year Of Publication: {movieSearchedData.movie.yearOfPublication}
              </p>
            </div>
          )}
          {movieError && <h1> There was an error fetching the data</h1>}
        </div>
      </div>
    </>
  );
};

export default DisplayData;
