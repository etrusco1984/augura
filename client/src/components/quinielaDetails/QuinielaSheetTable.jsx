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
                                    <div>{g.home_sn} {g.home_score}</div>
                                    <div>{g.away_sn} {g.away_score}</div>
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

                                const cellText = prediction
                                    ? `${prediction.predicted_home_score}-${prediction.predicted_away_score}`
                                    : "—";

                                return (
                                    <td key={game.game_id}>
                                        {cellText}
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