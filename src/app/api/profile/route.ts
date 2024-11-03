// app/api/profile/route.ts
import { query } from "~/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, modelPath } = await request.json();

    if (!userId || !modelPath) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if the user already has a model path saved
    const existingRecord = await query(
      `SELECT * FROM user_profiles WHERE user_id = $1`,
      [userId],
    );

    let result;
    if (existingRecord.rows.length > 0) {
      // Update the existing record with the new model path
      result = await query(
        `UPDATE user_profiles SET model_path = $2 WHERE user_id = $1 RETURNING *`,
        [userId, modelPath],
      );
    } else {
      // Insert a new record with the user ID and model path
      result = await query(
        `INSERT INTO user_profiles (user_id, model_path) VALUES ($1, $2) RETURNING *`,
        [userId, modelPath],
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error saving model path:", error);
    return NextResponse.json(
      { error: "Failed to save model path" },
      { status: 500 },
    );
  }
}
