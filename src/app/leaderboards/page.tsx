"use client";
import { useState, useEffect } from 'react';

interface LeaderboardItem {
    id: number;
    user_id: number;
    name: string;
    email: string;
    song: string;
    dance_duration: string;
    average_score: number;
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
}

export default function Leaderboards() {
    const [data, setData] = useState<LeaderboardItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/leaderboards');

                if (!response.ok) {
                    throw new Error("Leaderboard data could not be fetched.");
                }
                // console.log(response.json());
                const result = await response.json();
                console.log(result);
                setData(result);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch leaderboard data.");
            }
        };

        

        fetchData();
    }, []);

    // Log the data whenever it changes
    useEffect(() => {
        console.log(data);
    }, [data]);

    if (error) {
        return <div>{error}</div>;
    }

    if (data.length === 0) {
        return <div>Loading leaderboard data...</div>;
    }

    return (
        <div>
            <h1>Leaderboards</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Song</th>
                        <th>Dance Duration</th>
                        <th>Average Score</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item: LeaderboardItem) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.user_id}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.song}</td>
                            <td>{item.dance_duration}</td>
                            <td>{item.average_score}</td>
                            <td>
                                {/* Convert the timestamp to a readable format */}
                                {new Date(item.timestamp.seconds * 1000).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
