import express from "express";
import competitionsRouter from "./src/routes/competitions.js";
import seasonsRouter from "./src/routes/seasons.js";
import stagesRouter from "./src/routes/stages.js";
import competitionFormatsRouter from "./src/routes/competitionFormats.js";
import teamsRouter from "./src/routes/teams.js";
import teamSeasonsRouter from "./src/routes/teamSeasons.js";
import gamesRouter from "./src/routes/games.js";
import usersRouter from "./src/routes/users.js";
import quinielasRouter from "./src/routes/quinielas.js"
import quinielasParticipantRouter from "./src/routes/qunielaParticipants.js"
import rolesRouter from "./src/routes/roles.js";
import predictionsRouter from "./src/routes/predictions.js";
import invitationsRouter from "./src/routes/invitations.js";
import pointsRouter from "./src/routes/points.js";
import userRolesRouter from "./src/routes/userRoles.js";
import scoringRulesRouter from "./src/routes/scoringRules.js";
import scoringRouter from "./src/routes/scoringRoutes.js";
import leaderboardRoutes from "./src/routes/leaderboardRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import { authenticateUser } from "./src/middleware/authMiddleware.js";
import adminGamesRoutes from "./src/routes/adminGames.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

//Format returned data into JSon format
const app = express();
app.use(express.json());
app.use(cookieParser());

// All routes go here
app.use("/competitions", competitionsRouter);
app.use("/seasons", seasonsRouter);
app.use("/stages", stagesRouter);
app.use("/competition-formats", competitionFormatsRouter);
app.use("/teams", teamsRouter);
app.use("/team-seasons", teamSeasonsRouter);
app.use("/games", gamesRouter);
app.use("/users", usersRouter);
app.use("/api/quinielas", quinielasRouter);
app.use("/quinielas-participant", quinielasParticipantRouter);
app.use("/roles", rolesRouter);
app.use("/api/predictions", predictionsRouter);
app.use("/invitations", invitationsRouter);
app.use("/points", pointsRouter);
app.use("/user-roles", userRolesRouter);
app.use("/scoring-rules", scoringRulesRouter);
app.use("/scoring", scoringRouter);
app.use("/leaderboard", leaderboardRoutes);
app.use("/auth", authRoutes);
app.use("/api/dashboard", authenticateUser, dashboardRoutes);
app.use("/api/admin", adminGamesRoutes);

// Start the server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await pool.end();
  process.exit(0);
});