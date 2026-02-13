-- CreateTable
CREATE TABLE "users" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'innovator',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ideas" (
    "idea_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Submitted',
    "innovator_id" INTEGER NOT NULL,
    "reviewer_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ideas_innovator_id_fkey" FOREIGN KEY ("innovator_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ideas_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users" ("user_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reviews" (
    "review_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idea_id" INTEGER NOT NULL,
    "reviewer_id" INTEGER NOT NULL,
    "innovation_score" INTEGER NOT NULL,
    "feasibility_score" INTEGER NOT NULL,
    "impact_score" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reviews_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "ideas" ("idea_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
