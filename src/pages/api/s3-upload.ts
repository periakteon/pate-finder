import authMiddleware from "@/middleware/authMiddleware";
import { APIRoute } from "next-s3-upload";

const APIRouteWithMiddleware = authMiddleware(APIRoute);

export default APIRouteWithMiddleware;
