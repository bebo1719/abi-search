// apolloServer.js
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const { typeDefs, resolvers } = require('./graphql'); // Define typeDefs and resolvers
const { authMiddleware } = require('./middleware/auth'); // Custom auth middleware

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Auth Middleware to get the user from the token
    const user = authMiddleware(req);
    return { user }; // Pass user info in the context for queries/mutations
  },
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Connect to MongoDB Atlas
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer();
