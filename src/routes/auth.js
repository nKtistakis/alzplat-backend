import { generateTokens, generateAdminTokens, refresh } from "../auth/jwt.js";
import ClientError from "../helpers/client_error.js";
import { Response, catchAsync, authRoute, express } from "./route_helpers.js";

const router = express.Router();

const accessCookieName = process.env.JWT_ACCESS_TOKEN_NAME;
const refreshCookieName = process.env.JWT_REFRESH_TOKEN_NAME;

router.post(
  "/login",
  catchAsync(async (req, res) => {
    if (!req.body.credentials) {
      throw new ClientError("Access Denied. Request is malformed.", 401);
    }

    const { accessToken, refreshToken, doctor } = await generateTokens(
      req.body.credentials
    );

    res.cookie(accessCookieName, accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.cookie(refreshCookieName, refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json(
      new Response({
        doctor: doctor,
      })
    );

    //res.json(new Response(doctor));
  })
);

router.post(
  "/refresh",
  catchAsync(async (req, res) => {
    const accessToken = await refresh(req.cookies[refreshCookieName]);

    res.cookie(accessCookieName, accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json(new Response("Refreshed Access token!"));
  })
);

router.post(
  "/admin/login",
  catchAsync(async (req, res) => {
    const adminCode = req.headers[process.env.JWT_ADMIN_HEADER_NAME];

    if (!adminCode) {
      res.status(400);
      throw new ClientError("Access Denied. Request is malformed", 401);
    }

    const { accessToken, refreshToken } = await generateAdminTokens(
      adminCode,
      res
    );

    res.cookie(accessCookieName, accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
      maxAge: 30 * 60 * 1000, // 30 minutes
    });

    res.cookie(refreshCookieName, refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json(new Response("Admin Logged In"));
  })
);

router.post("/logout", authRoute, (req, res) => {
  res.clearCookie(accessCookieName);
  res.clearCookie(refreshCookieName);
  res.json(new Response("Succefully Logged Out"));
});

export default router;
