import { z } from "zod";

/**
 * Follow API Schemas
 */
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

/**
 * Unfollow API Schemas
 */
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
    required_error: "Takipten çıkılacak kullanıcı ID'si zorunludur.",
    invalid_type_error:
      "Takipten çıkılacak kullanıcı ID'si sayı tipinde olmalıdır.",
  }),
});

/**
 * Login API Schemas
 */
export const loginRequestSchema = z.object({
  email: z
    .string()
    .email({ message: "Lütfen geçerli bir e-mail adresi giriniz." }),
  password: z.string({ required_error: "Parola gereklidir." }),
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

/**
 * Register API Schemas
 */
export const registerRequestSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Kullanıcı adı 3 karakterden fazla olmalıdır." })
    .max(25, { message: "Kullanıcı adı 20 karakterden fazla olamaz." }),
  email: z
    .string({
      required_error: "E-mail adresi gereklidir.",
      invalid_type_error: "E-mail adresi string tipinde olmalıdır.",
    })
    .email({ message: "Lütfen geçerli bir e-mail adresi giriniz." }),
  password: z
    .string({ required_error: "Parola gereklidir." })
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

/**
 * Get Pets API Schemas
 */
export const getPetByUserRequest = z.object({
  userId: z
    .string({
      invalid_type_error: "Kullanıcı ID'si sayı olmalıdır.",
      required_error: "Kullanıcı ID'si gereklidir.",
    })
    .transform(Number),
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

/**
 * Create Pet Schemas
 */
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
  name: z.string({
    required_error: "Evcil hayvan ismi gereklidir.",
    invalid_type_error: "Evcil hayvan ismi string tipinde olmalıdır.",
  }),
  breed: z.string({
    required_error: "Evcil hayvan cinsi gereklidir.",
    invalid_type_error: "Evcil hayvan cinsi string tipinde olmalıdır.",
  }),
  birthdate: z.date({
    required_error: "Evcil hayvanın doğum tarihi gereklidir.",
    invalid_type_error: "Evcil hayvan doğum tarihi date tipinde olmalıdır.",
  }),
  pet_photo: z
    .string({
      required_error: "Evcil hayvan görseli gereklidir.",
      invalid_type_error: "Evcil hayvan görseli fotoğraf şeklinde olmalıdır.",
    })
    .url(),
  type: z.string({
    required_error: "Evcil hayvan türü gereklidir.",
    invalid_type_error: "Evcil hayvan türü string tipinde olmalıdır.",
  }),
  bio: z.string({
    required_error: "Evcil hayvan biyografisi gereklidir.",
    invalid_type_error: "Evcil hayvan biyografisi string tipinde olmalıdır.",
  }),
});

/**
 * Fetch All Pets Schema
 */
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

/**
 * Comment API Schema
 */
export const commentRequestSchema = z.object({
  postId: z.number({
    invalid_type_error: "Post ID sayı tipinde olmalıdır.",
    required_error: "Post ID gereklidir.",
  }),
  text: z.string(),
});

/**
 * Create Post API Schema
 */
export const postRequestSchema = z.object({
  caption: z
    .string({
      invalid_type_error: "Gönderi yazısı string tipinde olmalıdır.",
      required_error: "Gönderi yazısı gereklidir.",
    })
    .max(280, { message: "Gönderi yazısı en fazla 280 karakter olabilir" }),
  postImage: z
    .string({
      invalid_type_error: "Gönderi görseli URL şeklinde olmalıdır",
      required_error: "Gönderi görseli gereklidir",
    })
    .url(),
});

/**
 * Fetch Feed API Schema
 */
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

/**
 * Infinite Scroll Query API Schemas
 */

export const infiniteScrollRequestQuerySchema = z.object({
  page: z
    .string({
      invalid_type_error: "Sayfa numarası sayı tipinde olmalıdır.",
      required_error: "Sayfa numarası gereklidir.",
    })
    .min(1, { message: "Sayfa numarası 1'den küçük olamaz." })
    .default("1")
    .transform(Number)
    .refine((val) => val >= 1, {
      message: "Sayfa numarası 1'den küçük olamaz.",
    }),

  pageSize: z
    .string({
      invalid_type_error: "Sayfa büyüklüğü sayı tipinde olmalıdır.",
      required_error: "Sayfa büyüklüğü gereklidir.",
    })
    .default("10")
    .transform(Number)
    .refine((val) => val >= 1, {
      message: "Sayfa büyüklüğü 1'den küçük olamaz.",
    })
    .refine((val) => val <= 100, {
      message: "Sayfa büyüklüğü 100'den büyük olamaz.",
    }),
});

export const infiniteScrollResponseSchema = z.discriminatedUnion("success", [
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
        author: z.object({
          profile_picture: z.string().url().nullable(),
          username: z.string(),
        }),
      }),
    ),
    message: z.string(),
  }),

  z.object({
    success: z.literal(false),
    errors: z.array(z.string()),
  }),
]);

/**
 * Like API Schemas
 */
export const likeResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    like: z.object({
      id: z.number(),
      postId: z.number(),
      userId: z.number(),
    }),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    errors: z.array(z.string()),
  }),
]);

export const likeRequest = z.object({
  postId: z.number({
    required_error: "Post ID'si gereklidir.",
    invalid_type_error: "Post ID'si sayı tipinde olmalıdır.",
  }),
});

/**
 * Unlike API Schemas
 */

export const unlikeResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    like: z.object({
      id: z.number(),
      postId: z.number(),
      userId: z.number(),
    }),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    errors: z.array(z.string()),
  }),
]);

export const unlikeRequest = z.object({
  postId: z.number({
    required_error: "Post ID'si gereklidir.",
    invalid_type_error: "Post ID'si sayı tipinde olmalıdır.",
  }),
});
