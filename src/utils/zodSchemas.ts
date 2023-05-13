import { z } from "zod";

export const followFollowResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    error: z.array(z.string()),
  }),
]);

export const followRequestSchema = z.object({
  followingId: z.number({
    required_error: "Takip edilecek kullanıcı id'si zorunludur.",
    invalid_type_error:
      "Takip edilecek kullanıcı id'si sayı tipinde olmalıdır.",
  }),
});

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const loginResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    message: z.string(),
    id: z.number(),
    token: z.string(),
  }),
  z.object({
    success: z.literal(false),
    errors: z.array(z.string()),
  }),
]);

export const registerRequestSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Kullanıcı adı 3 karakterden fazla olmalıdır." })
    .max(25, { message: "Kullanıcı adı 20 karakterden fazla olamaz." }),
  email: z
    .string()
    .email({ message: "Lütfen geçerli bir e-mail adresi giriniz." }),
  password: z
    .string()
    .min(7, { message: "Parola 7 karakterden fazla olmalıdir." }),
});
export const registerResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    username: z.string(),
    email: z.string(),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    errors: z.array(z.string()),
  }),
]);

export const unfollowResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    errors: z.array(z.string()),
  }),
]);

export const unfollowRequestSchema = z.object({
  followingId: z.number({
    required_error: "Takipten çıkılacak kullanıcı id'si zorunludur.",
    invalid_type_error:
      "Takipten çıkılacak kullanıcı id'si sayı tipinde olmalıdır.",
  }),
});

export const getPetByUserResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    pet: z.object({
      id: z.number(),
      name: z.string(),
      breed: z.string(),
      type: z.string(),
      birthdate: z.date(),
    }),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    errors: z.array(z.string()),
  }),
]);

export const handlerPetResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    errors: z.array(z.string()),
  }),
]);

export const handlerPetRequestSchema = z.object({
  name: z.string(),
  breed: z.string(),
  birthdate: z.date(),
  pet_photo: z.string().url(),
  type: z.string(),
  bio: z.string(),
});

export const fetchAllPetsResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    fetchPets: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        breed: z.string(),
        type: z.string(),
        age: z.number(),
      }),
    ),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    errors: z.array(z.string()),
  }),
]);

export const commentRequestSchema = z.object({
  postId: z.number(),
  text: z.string(),
});

export const postRequestSchema = z.object({
  caption: z
    .string()
    .max(280, { message: "Caption must be less than 280 characters" }),
  postImage: z.string().url(),
});

export const fetchFeedResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    posts: z.array(
      z.object({
        id: z.number(),
        caption: z.string(),
        postImage: z.string().url(),
        createdAt: z.date(),
        updatedAt: z.date(),
        authorId: z.number(),
      }),
    ),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    errors: z.array(z.string()),
  }),
]);
