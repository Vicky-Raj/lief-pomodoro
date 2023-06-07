import { type } from "os";
import "reflect-metadata";
import {
  buildSchema,
  Resolver,
  Query,
  Arg,
  ObjectType,
  Field,
  ID,
  Ctx,
  Mutation,
  InputType,
} from "type-graphql";

import prisma from "../lib/prisma";
import dayjs from "dayjs";

@ObjectType()
class User {
  @Field()
  id: number;
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  pomoDuration: number;
  @Field()
  shortDuration: number;
  @Field()
  longDuration: number;
  @Field((type) => [Day])
  days: Day[];
}

@ObjectType()
class Day {
  @Field()
  id: number;
  @Field()
  date: Date;
  @Field()
  done: number;
  @Field()
  focusTime: number;
  @Field()
  tomatoes: number;
  @Field()
  user: User;
}

@ObjectType()
class Task {
  @Field()
  id: number;
  @Field()
  createdAt: Date;
  @Field()
  description: string;
  @Field()
  dueDate: Date;
  @Field()
  priority: number;
  @Field()
  pomodoros: number;
  @Field()
  tomatoes: number;
  @Field()
  remaining: number;
  @Field()
  completed: boolean;
  @Field()
  user: User;
}

@ObjectType()
class Message {
  @Field()
  message: string;
}
@ObjectType()
class TasksMeta {
  @Field()
  todo: number;
  @Field()
  done: number;
}

@Resolver()
export class TaskResolver {
  @Query(() => Task)
  async getTask(@Arg("id") id: number, @Ctx() { user }: { user: User }) {
    const task = await prisma.task.findFirst({
      where: {
        userId: user.id,
        id: id,
      },
    });
    return task;
  }

  @Mutation(() => Task)
  async completeTask(@Arg("id") id: number, @Ctx() { user }: { user: User }) {
    const prev = await prisma.task.findFirst({
      where: {
        userId: user.id,
        id: id,
      },
    });
    await prisma.task.updateMany({
      where: {
        userId: user.id,
        id: id,
      },
      data: {
        pomodoros: prev?.tomatoes,
        remaining: 0,
        completed: true,
      },
    });
    await prisma.day.updateMany({
      where: {
        userId: user.id,
        date: {
          lte: dayjs().endOf("day").toDate(),
          gte: dayjs().startOf("day").toDate(),
        },
      },
      data: {
        done: {
          increment: !prev!.completed ? 1 : 0,
        },
      },
    });
    const task = await prisma.task.findFirst({
      where: {
        userId: user.id,
        id: id,
      },
    });
    return task;
  }

  @Mutation(() => Message)
  async addPomo(
    @Ctx() { user }: { user: User },
    @Arg("id", { nullable: true }) id: number
  ) {
    if (!id) {
      await prisma.day.updateMany({
        where: {
          userId: user.id,
          date: {
            lte: dayjs().endOf("day").toDate(),
            gte: dayjs().startOf("day").toDate(),
          },
        },
        data: {
          focusTime: {
            increment: user.pomoDuration,
          },
          tomatoes: {
            increment: 1,
          },
        },
      });
      return { message: "success" };
    }
    const task = await prisma.task.findFirst({
      where: {
        userId: user.id,
        id: id,
      },
    });
    await prisma.task.updateMany({
      where: {
        userId: user.id,
        id: id,
      },
      data: {
        pomodoros:
          task!.pomodoros < task!.tomatoes
            ? task!.pomodoros + 1
            : task!.pomodoros,
        remaining:
          task!.tomatoes - task!.pomodoros + 1 < 0
            ? 0
            : task!.tomatoes - task!.pomodoros + 1,
        completed: task!.completed || task!.pomodoros + 1 === task!.tomatoes,
      },
    });
    await prisma.day.updateMany({
      where: {
        userId: user.id,
        date: {
          lte: dayjs().endOf("day").toDate(),
          gte: dayjs().startOf("day").toDate(),
        },
      },
      data: {
        done: {
          increment:
            !task!.completed && task!.pomodoros + 1 === task!.tomatoes ? 1 : 0,
        },
        tomatoes: {
          increment: 1,
        },
        focusTime: {
          increment: user.pomoDuration,
        },
      },
    });
    return { message: "success" };
  }

  @Query(() => TasksMeta!)
  async getTasksMeta(@Ctx() { user }: { user: User }) {
    const todo = await prisma.task.count({
      where: {
        userId: user.id,
        completed: false,
      },
    });
    const done = await prisma.task.count({
      where: {
        userId: user.id,
        completed: true,
      },
    });
    return { todo: todo, done: done };
  }

  @Query(() => [Task]!)
  async getTasks(
    @Ctx() { user }: { user: User },
    @Arg("show") show: string,
    @Arg("sort") sort: string,
    @Arg("order") order: string
  ) {
    const showWhere: any = {
      All: {},
      Todo: { completed: false },
      Completed: { completed: true },
      Overdue: { dueDate: { lt: dayjs().startOf("day").toDate() } },
    };
    order = order.toLowerCase();
    const sortOrderby: any = {
      Due: { dueDate: order },
      Pomodoros: { remaining: order },
      Priority: { priority: order },
      Created: { createdAt: order },
    };

    const where = {
      userId: user.id,
      ...showWhere[show],
    };

    const tasks = await prisma.task.findMany({
      where: where,
      orderBy: sortOrderby[sort],
    });
    return tasks;
  }
  @Mutation(() => Task)
  async addTask(
    @Arg("description") description: string,
    @Arg("dueDate") dueDate: string,
    @Arg("priority") priority: number,
    @Arg("tomatoes") tomatoes: number,
    @Ctx() { user }: { user: User }
  ) {
    const task = await prisma.task.create({
      data: {
        userId: user.id,
        description: description,
        dueDate: dayjs(dueDate).toDate(),
        tomatoes: tomatoes,
        priority: priority,
      },
    });
    return task;
  }
  @Mutation(() => Task)
  async updateTask(
    @Arg("id") id: number,
    @Arg("description") description: string,
    @Arg("dueDate") dueDate: string,
    @Arg("priority") priority: number,
    @Arg("tomatoes") tomatoes: number,
    @Ctx() { user }: { user: User }
  ) {
    const prev = await prisma.task.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    });
    await prisma.task.updateMany({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        description: description,
        dueDate: dayjs(dueDate).toDate(),
        tomatoes: tomatoes,
        priority: priority,
        pomodoros: prev?.tomatoes != tomatoes ? 0 : prev?.pomodoros,
        remaining: prev?.tomatoes != tomatoes ? tomatoes : prev?.remaining,
        completed: prev?.tomatoes != tomatoes ? false : prev?.completed,
      },
    });
    const task = await prisma.task.findFirst({
      where: { id: id, userId: user.id },
    });
    return task;
  }
  @Mutation(() => Message)
  async deleteTask(@Arg("id") id: number, @Ctx() { user }: { user: User }) {
    await prisma.task.deleteMany({ where: { id: id, userId: user.id } });
    return { message: "success" };
  }
}

@Resolver()
export class UserResolver {
  @Query(() => User)
  async getUser(@Ctx() { user }: { user: User }) {
    return user;
  }
  @Mutation(() => Message)
  async updateDuration(
    @Arg("pomo") pomo: number,
    @Arg("short") short: number,
    @Arg("long") long: number,
    @Ctx() { user }: { user: User }
  ) {
    await prisma.user.updateMany({
      where: { id: user.id },
      data: {
        pomoDuration: pomo,
        shortDuration: short,
        longDuration: long,
      },
    });
    return { message: "success" };
  }
}

@Resolver()
export class DayResolver {
  @Query(() => Day)
  async getToday(@Ctx() { user }: { user: User }) {
    let today = await prisma.day.findFirst({
      where: {
        userId: user.id,
        date: {
          lte: dayjs().endOf("day").toDate(),
          gte: dayjs().startOf("day").toDate(),
        },
      },
    });
    if (today) return today;
    today = await prisma.day.create({
      data: {
        userId: user.id,
        date: dayjs().toDate(),
      },
    });
    return today;
  }
  @Query(() => [Day]!)
  async getWeek(@Ctx() { user }: { user: User }) {
    const days = await prisma.day.findMany({
      where: {
        userId: user.id,
        date: {
          lte: dayjs().add(1,"day").startOf("day").toDate(),
          gte: dayjs().subtract(7, "day").startOf("day").toDate(),
        },
      },
      orderBy: {
        date: "asc",
      },
    });
    return days;
  }
}
