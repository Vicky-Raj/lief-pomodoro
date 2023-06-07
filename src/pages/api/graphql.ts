import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { GraphQLError } from "graphql";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import {
  buildSchema,
  Resolver,
  Query,
  Arg,
  ObjectType,
  Field,
  ID,
  Ctx,
} from "type-graphql";
import { getSession } from "@auth0/nextjs-auth0";
import prisma from "../../../lib/prisma";
import {
  TaskResolver,
  UserResolver,
  DayResolver,
} from "../../../graphql/resolvers";

// @ObjectType()
// class Dog {
//   @Field(() => ID)
//   name: string;
// }

// @Resolver(Dog)
// class DogResolver {
//   @Query(() => Dog)
//   async getdog(@Ctx() context: any, @Arg("name") name: string) {
//     return { name: name };
//   }
//   @Query(() => Dog)
//   async getcat(@Ctx() context: any, @Arg("name") name: string) {
//     return { name: name };
//   }
// }

const apolloServer = new ApolloServer({
  schema: await buildSchema({
    resolvers: [TaskResolver, UserResolver, DayResolver],
  }),
});
export default startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => {
    const session = await getSession(req, res);

    // if the user is not logged in, return null
    if (!session || typeof session === "undefined") {
      throw new GraphQLError("not logged in!", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: { name: session.user.name, email: session.user.email },
    });

    return {
      user,
    };
  },
});
