-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "usia" INTEGER,
    "instansi" TEXT,
    "pekerjaan" TEXT,
    "jabatan" TEXT,
    "discMostD" INTEGER NOT NULL DEFAULT 0,
    "discMostI" INTEGER NOT NULL DEFAULT 0,
    "discMostS" INTEGER NOT NULL DEFAULT 0,
    "discMostC" INTEGER NOT NULL DEFAULT 0,
    "discLeastD" INTEGER NOT NULL DEFAULT 0,
    "discLeastI" INTEGER NOT NULL DEFAULT 0,
    "discLeastS" INTEGER NOT NULL DEFAULT 0,
    "discLeastC" INTEGER NOT NULL DEFAULT 0,
    "discCompositeD" INTEGER NOT NULL DEFAULT 0,
    "discCompositeI" INTEGER NOT NULL DEFAULT 0,
    "discCompositeS" INTEGER NOT NULL DEFAULT 0,
    "discCompositeC" INTEGER NOT NULL DEFAULT 0,
    "discPattern" TEXT,
    "discPrimary" TEXT,
    "hexacoH" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hexacoE" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hexacoX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hexacoA" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hexacoC" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hexacoO" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hexacoFacetMeans" JSONB,
    "rawData" JSONB,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Submission_email_idx" ON "Submission"("email");

-- CreateIndex
CREATE INDEX "Submission_nama_idx" ON "Submission"("nama");

-- CreateIndex
CREATE INDEX "Submission_submittedAt_idx" ON "Submission"("submittedAt");
