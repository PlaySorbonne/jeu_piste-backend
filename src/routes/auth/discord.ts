import express from "express";
import { RequestWPrisma, ResponseTyped } from "../../utils/types";
import { HttpCodes, sessionTTL } from "../../utils/constants";
import { requireAuth } from "../../services/middlewares";
import { generateSession } from "../../utils";
import { Session } from "@prisma/client";

const router = express.Router();

router.get("/discord", async (req: RequestWPrisma, res: ResponseTyped) => {
	// TODO: replace redirect_uri with frontend url
	res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A${process.env.PORT}%2Fapi%2Fauth%2Fdiscord%2Fredirect&scope=identify+email`)
});

router.get("/discord/redirect", async (req: RequestWPrisma, res: ResponseTyped) => {
	const code = req.query.code

	if (!code) {
		let httpCode = HttpCodes.INTERNAL_ERROR;
		res
			.status(httpCode)
			.json({
				message: "Error during the OAuth2 process",
				status: httpCode,
				isError: true,
			})
			.end();
		return;
	}

	const tokenReq = await fetch("https://discord.com/api/oauth2/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			"grant_type": "authorization_code",
			"code": code,
			"redirect_uri": "http://localhost:3000/api/auth/discord/redirect",
			"client_id": process.env.DISCORD_CLIENT_ID!,
			"client_secret": process.env.DISCORD_CLIENT_SECRET!,
		}),
	})
	const tokenRes = await tokenReq.json()

	if (tokenRes.error) {
		let httpCode = HttpCodes.INTERNAL_ERROR;
		res
			.status(httpCode)
			.json({
				message: "Error during the OAuth2 process",
				status: httpCode,
				isError: true,
			})
			.end();
		return;
	}

	const infosReq = await fetch("https://discord.com/api/v10/users/@me", {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Authorization': `Bearer ${tokenRes.access_token}`
		}
	})
	const infosRes = await infosReq.json()
	// TODO: maybe save the token to use refresh token instead of getting a new token each time (not very useful)

	let olds = await req.prisma!.user.findMany({
		where: {
			email: infosRes.email,
		},
	});

	let userId = infosRes.username

	// Register if user not in database
	if (!olds[0]) {
		let user = await req.prisma!.user.create({
			data: {
				name: userId,
				email: infosRes.email,
				password: null,
			},
		});

		let player = await req.prisma!.player.create({
			data: {
				name: userId,
			},
		});
	}

	let session: Session = await req.prisma!.session.create({
		data: {
			userId: userId,
			id: generateSession(userId),
			expires:
				sessionTTL === -1
					? new Date(2147483647000)
					: new Date(Date.now() + sessionTTL),
		},
	});
	let httpCode = HttpCodes.OK;
	res
		.cookie("session", session.id, {
			expires:
				sessionTTL === -1
					? new Date(2147483647000)
					: new Date(Date.now() + sessionTTL - 60 * 1000),
		})
		.status(httpCode)
		.json({
			message: "",
			status: httpCode,
			isError: false,
			data: session,
		});
})



export default router;
