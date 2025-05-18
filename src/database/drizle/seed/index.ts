import "dotenv/config";
import { db } from "../..";
import { userRolesTable, usersTable } from "../schema";

async function main() {
	const hashedPassword = await Bun.password.hash("changeme");
	const userData: typeof usersTable.$inferInsert = {
		name: "irsan mansyur",
		username: "irsan",
		gender: "male",
		email: "irsan00mansyur@gmail.com",
		password: hashedPassword,
	};

	const [user] = await db.insert(usersTable).values(userData);
	console.log("New user created!");

	const rolesData = [{ name: "super-admin" }, { name: "admin" }];
	await db
		.insert(userRolesTable)
		.values(
			rolesData.map((role) => ({ name: role.name, userId: user.insertId })),
		)
		.$returningId();
	console.log("New ROles created!");
}

main();
