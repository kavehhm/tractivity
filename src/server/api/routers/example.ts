import { z } from "zod";
import { utapi } from "uploadthing/server";
import { clerkClient } from "@clerk/nextjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAllActivitiesInSet: protectedProcedure
    .input(z.object({ userId: z.string(), activitySetId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.activity.findMany({
        where: {
          creatorId: input.userId,
          ActivitySet: {
            some: {
              activitySetId: input.activitySetId,
            },
          },
        },
      });
    }),

  getAllActivities: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.activity.findMany({
        where: {
          creatorId: input.userId,
        },
      });
    }),
  getAllUnsetActivities: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.activity.findMany({
        where: {
          creatorId: input.userId,
          ActivitySet: {
            none: {},
          },
        },
      });
    }),

  createActivity: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        name: z.string(),
        description: z.string(),
        reflection: z.string(),
        creatorId: z.string(),
        hoursPerWeek: z.number(),
        activitySetIds: z.string().array().optional(),
        stillActive: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        description,
        startDate,
        endDate,
        creatorId,
        reflection,
        hoursPerWeek,
        activitySetIds,
        stillActive,
      } = input;

      let activity;

      if (activitySetIds && activitySetIds.length > 0) {
        const connectSets = [];
        for (let i = 0; i < activitySetIds.length; i++) {
          connectSets.push({ activitySetId: activitySetIds[i] });
        }

        activity = await ctx.db.activity.create({
          data: {
            name,
            description,
            creatorId,
            startDate: startDate && startDate,
            endDate: endDate && endDate,
            Reflection: reflection,
            hoursPerWeek,
            stillActive,
            ActivitySet: {
              createMany: {
                data: connectSets,
              },
            },
          },
        });
      } else {
        activity = await ctx.db.activity.create({
          data: {
            name,
            description,
            creatorId,
            startDate,
            endDate,
            Reflection: reflection,
            hoursPerWeek,
          },
        });
      }
      const activityIdAsString = activity.id.toString();

      // Return the activity ID as a string in the response
      return activityIdAsString;
    }),
  getSingleActivity: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const ACTIVITY = await ctx.db.activity.findUnique({
        where: {
          id: input.id,
        },
        include: {
          awardImageURL: true,
          ActivitySet: {
            include: {
              activitySet: true,
            },
          },
        },
      });
      if (!ACTIVITY) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No activity",
        });
      } else {
        return ACTIVITY;
      }

      // if (ACTIVITY.creatorId == ctx.auth.user?.id ) {
      //   return ACTIVITY;
      // } else {
      //   throw new TRPCError({
      //     code: "FORBIDDEN",
      //     message: "You are not permitted to view",
      //   });
      // }
    }),

  deleteSingleActivity: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const activity = await ctx.db.activity.findUnique({
        where: {
          id: input.id,
        },
        include: {
          ActivitySet: true,
        },
      });

      if (ctx.auth.userId !== activity?.creatorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Forbidden action",
        });
      }

      const awards = await ctx.db.awards.findMany({
        where: { activityId: input.id },
      });

      const deleteArr = [];
      for (let i = 0; i < awards.length; i++) {
        const url = awards[i]?.imageUrl;
        if (url) {
          const startIndex =
            url.indexOf("https://utfs.io/f/") + "https://utfs.io/f/".length;
          const result = url.substring(startIndex);
          deleteArr.push(result);
        }
      }

      if (deleteArr.length > 0) {
        await utapi.deleteFiles(deleteArr);
        await ctx.db.userData.updateMany({
          where: {
            userId: ctx.auth.userId
          },
          data: {
            uploads: {
              decrement: deleteArr.length
            }
          }
        })
      }

      if (activity?.ActivitySet && activity.ActivitySet.length > 0) {
        await ctx.db.activityLinkSet.deleteMany({
          where: {
            activityId: input.id,
          },
        });
      }

      return await ctx.db.activity.delete({
        where: {
          id: input.id,
        },
      });
    }),

  updateActivity: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        name: z.string(),
        description: z.string(),
        reflection: z.string(),
        creatorId: z.string(),
        hoursPerWeek: z.number(),
        stillActive: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        description,
        startDate,
        endDate,
        creatorId,
        reflection,
        id,
        hoursPerWeek,
        stillActive,
      } = input;

      if (ctx.auth.userId !== creatorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Forbidden action",
        });
      }

      return await ctx.db.activity.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          creatorId,
          startDate: startDate ? startDate : null,
          endDate: endDate ? endDate : null,
          Reflection: reflection,
          hoursPerWeek,
          stillActive,
        },
      });
    }),

  createImage: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string(),
        activityId: z.string(),
      }),
    )
    .mutation(async ({ input: { imageUrl, activityId }, ctx }) => {
      const userData = await ctx.db.userData.findUnique({
        where: {
          userId: ctx.auth.userId
        }
      })

      let newUserData;

      if (!userData)
      {
        newUserData = await ctx.db.userData.create({
          data: {
            userId: ctx.auth.userId,
            uploads: 0
          }
        })
      }

      if ((newUserData?.uploads ?? 0) < 100)
      {

        await ctx.db.awards.create({
          data: {
            imageUrl: imageUrl,
            Activity: {
              connect: {
                id: activityId,
              },
            },
          },
        });

        await ctx.db.userData.update({
          where: {
            userId: ctx.auth.userId
          },
          data: 
          {
            uploads: {
              increment: 1
            }
          }
        })
      }

      else{
        throw new TRPCError({code: "UNAUTHORIZED", message: "You have exceeded 100 uploads"})
      }

      

     


      // if user does not have connected userdata, create
      // userdata connection and set it to 1.
    }),

  deleteAward: protectedProcedure
    .input(
      z.object({
        awardId: z.string(),
      }),
    )
    .mutation(async ({ input: { awardId }, ctx }) => {
      const award = await ctx.db.awards.findUnique({
        where: { id: awardId },
      });

      await ctx.db.awards.delete({
        where: {
          id: awardId,
        },
      });

      const url = award?.imageUrl;
      if (url) {
        const startIndex =
          url.indexOf("https://utfs.io/f/") + "https://utfs.io/f/".length;
        const result = url.substring(startIndex);
        await utapi.deleteFiles(result);
        await ctx.db.userData.update({
          where: {
            userId: ctx.auth.userId
          },
          data: {
            uploads: {
              decrement: 1
            }
          }
        })
      }
    }),
  deleteFiles: protectedProcedure
    .input(z.string().array())
    .mutation(async ({ input, ctx }) => {
      const deleteArr = [];
      for (let i = 0; i < input.length; i++) {
        const url = input[i]!;
        const startIndex =
          url.indexOf("https://utfs.io/f/") + "https://utfs.io/f/".length;
        const result = url.substring(startIndex);
        deleteArr.push(result);
      }
      if (deleteArr.length > 0) {
        await utapi.deleteFiles(deleteArr);
        await ctx.db.userData.updateMany({
          where: {
            userId: ctx.auth.userId
          },
          data: {
            uploads: {
              decrement: input.length
            }
          }
        })
      }

      
      
    }),
  deleteFile: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
        const url = input!;
        const startIndex =
          url.indexOf("https://utfs.io/f/") + "https://utfs.io/f/".length;
        const result = url.substring(startIndex);
        await utapi.deleteFiles(result);
        await ctx.db.userData.updateMany({
          where: {
            userId: ctx.auth.userId
          },
          data: {
            uploads: {
              decrement: 1
            }
          }
        })
      
    }),

  createActivitySet: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        creatorId: z.string(),
        description: z.string().max(100),
      }),
    )
    .mutation(async ({ input: { name, creatorId, description }, ctx }) => {
      return await ctx.db.activitySet.create({
        data: {
          name,
          creatorId,
          description,
        },
      });
    }),

  getAllActivitySets: protectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.db.activitySet.findMany({
        where: {
          creatorId: input,
        },
        include: {
          activityList: {
            select: {
              activity: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      });
    }),

  getActivitySet: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const SET = await ctx.db.activitySet.findUnique({
        where: {
          id: input,
        },
        include: {
          activityList: {
            select: {
              activity: true,
            },
          },
        },
      });
      if (!SET) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No set",
        });
      }

      if (ctx.auth.userId == SET.creatorId) {
        return SET;
      } else {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not permitted to view",
        });
      }
    }),

  addActivityToSets: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
        activitySets: z.string().array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      for (let i = 0; i < input.activitySets.length; i++) {
        if (input.activitySets[i]) {
          await ctx.db.activity.update({
            where: {
              id: input.activityId,
            },
            data: {
              ActivitySet: {
                connectOrCreate: [
                  {
                    create: {
                      activitySet: {
                        connect: {
                          id: input.activitySets[i],
                        },
                      },
                    },
                    where: {
                      activitySetId_activityId: {
                        activityId: input.activityId,
                        activitySetId: input.activitySets[i]!,
                      },
                    },
                  },
                ],
              },
            },
          });
        }
      }
    }),

  removeActivityFromSets: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
        activitySets: z.string().array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      for (let i = 0; i < input.activitySets.length; i++) {
        if (input.activitySets[i]) {
          await ctx.db.activityLinkSet.delete({
            where: {
              activitySetId_activityId: {
                activityId: input.activityId,
                activitySetId: input.activitySets[i]!,
              },
            },
          });
        }
      }
    }),

  addActivitiesToSet: protectedProcedure
    .input(
      z.object({
        activitySetId: z.string(),
        activities: z.string().array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      for (let i = 0; i < input.activities.length; i++) {
        if (input.activities[i]) {
          await ctx.db.activitySet.update({
            where: {
              id: input.activitySetId,
            },
            data: {
              activityList: {
                connectOrCreate: [
                  {
                    create: {
                      activity: {
                        connect: {
                          id: input.activities[i],
                        },
                      },
                    },
                    where: {
                      activitySetId_activityId: {
                        activityId: input.activities[i]!,
                        activitySetId: input.activitySetId[i]!,
                      },
                    },
                  },
                ],
              },
            },
          });
        }
      }
    }),

  removeActivitiesFromSet: protectedProcedure
    .input(
      z.object({
        activitySetId: z.string(),
        activities: z.string().array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      for (let i = 0; i < input.activities.length; i++) {
        if (input.activities[i]) {
          await ctx.db.activityLinkSet.delete({
            where: {
              activitySetId_activityId: {
                activityId: input.activities[i]!,
                activitySetId: input.activitySetId,
              },
            },
          });
        }
      }
    }),

  deleteActivitySet: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.db.activityLinkSet.deleteMany({
        where: {
          activitySetId: input,
        },
      });

      return await ctx.db.activitySet.delete({
        where: {
          id: input,
        },
      });
    }),

    getUserData: protectedProcedure
    
    .query(async ({  ctx }) => {
      return await ctx.db.userData.findUnique({
        where: {
          userId: ctx.auth.userId
        }
      })

      
    }),

});
