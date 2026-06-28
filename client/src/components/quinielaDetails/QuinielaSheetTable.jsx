import React from "react";
import "./QuinielaSheetTable.css";

export default function QuinielaSheetTable({ games, allPredictions }) {
    //Get unique users from predictions
    const users = React.useMemo(() => {
        const byUserId = new Map();

        allPredictions.forEach(p => {
            if (!byUserId.has(p.user_id)) {
                byUserId.set(p.user_id, {
                    user_id: p.user_id,
                    username: p.username,
                });
            }
        });

        return Array.from(byUserId.values());
    }, [allPredictions]);

    // Create a map for quick lookup of predictions by user_id and game_id
    const predictionMap = React.useMemo(() => {
        const map = new Map();

        allPredictions.forEach(p => {
            const key = `${p.user_id}-${p.game_id}`;
            map.set(key, p);
        });

        return map;
    }, [allPredictions]);

    return (
        <div className="sheet-table-container">
            <table className="sheet-table">
                <thead>
                    <tr>
                        <th className="sticky-col">Player</th>
                        {games.map((g) => (
                            <th key={g.game_id}>
                                <div className="header-cell">
                                    <div>
                                        <img
                                            src={`/flag-icons/${g.home_logo}`}
                                            className="flag-icon-th"
                                            alt={`${g.home_sn} flag`}
                                        />
                                        {g.home_sn} {g.home_score}
                                        {g.home_score===g.away_score && g.penalty_winner_team_id === g.home_team_id && (
                                            <span style={{ fontSize: "0.8em", marginLeft: "4px" }}>⚽</span>
                                        )}
                                    </div>

                                    <div>
                                        <img
                                            src={`/flag-icons/${g.away_logo}`}
                                            className="flag-icon-th"
                                            alt={`${g.away_sn} flag`}
                                        />
                                        {g.away_sn} {g.away_score}
                                        {g.home_score===g.away_score && g.penalty_winner_team_id === g.away_team_id && (
                                            <span style={{ fontSize: "0.8em", marginLeft: "4px" }}>⚽</span>
                                        )}
                                    </div>
                                </div>
                            </th>

                        ))}
                    </tr>
                </thead>

                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td className="sticky-col">{user.username}</td>

                            {games.map(game => {
                                const key = `${user.user_id}-${game.game_id}`;
                                const prediction = predictionMap.get(key);

                                const isDraw =
                                    prediction &&
                                    prediction.predicted_home_score === prediction.predicted_away_score;

                                const hasPenaltyWinner = prediction?.predicted_penalty_winner_team_id;

                                const winnerIsHome =
                                    hasPenaltyWinner &&
                                    prediction.predicted_penalty_winner_team_id === game.home_team_id;

                                const winnerIsAway =
                                    hasPenaltyWinner &&
                                    prediction.predicted_penalty_winner_team_id === game.away_team_id;

                                const cellStyle = {
                                    backgroundColor:
                                        isDraw && hasPenaltyWinner
                                            ? winnerIsHome
                                                ? "#d4f1c5" // home wins on penalties
                                                : "#c5d9f1" // away wins on penalties
                                            : "transparent",
                                };

                                return (
                                    <td key={game.game_id} style={cellStyle}>
                                        {prediction ? (
                                            <>
                                                {/* HOME SCORE */}
                                                <span
                                                    style={{
                                                        fontWeight: winnerIsHome ? "bold" : "normal",
                                                    }}
                                                >
                                                    {winnerIsHome && isDraw && hasPenaltyWinner && (
                                                        <span style={{ fontSize: "0.8em", marginLeft: "4px" }}>⚽</span>
                                                    )}
                                                    {prediction.predicted_home_score}
                                                </span>

                                                {" - "}

                                                {/* AWAY SCORE */}
                                                <span
                                                    style={{
                                                        fontWeight: winnerIsAway ? "bold" : "normal",
                                                    }}
                                                >
                                                    {prediction.predicted_away_score}
                                                    {winnerIsAway && isDraw && hasPenaltyWinner && (
                                                        <span style={{ fontSize: "0.8em", marginLeft: "4px" }}>⚽</span>
                                                    )}
                                                </span>
                                            </>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}