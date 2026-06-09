import { readJsonFile, writeJsonFile } from "@/lib/jsonStorage";

export type Certificate = {
  studentName: string;
  courseName: string;
  issueDate: string;
  code: string;
};

const certificateFile = "certificates.json";

export async function readCertificates(): Promise<Certificate[]> {
  return readJsonFile<Certificate[]>(certificateFile, []);
}

export async function writeCertificates(certificates: Certificate[]) {
  await writeJsonFile(certificateFile, certificates);
}

export async function findCertificate(code: string) {
  const normalizedCode = code.trim().toUpperCase();
  const certificates = await readCertificates();
  return certificates.find((certificate) => certificate.code.toUpperCase() === normalizedCode) ?? null;
}

export async function addCertificate(input: Certificate) {
  const certificates = await readCertificates();
  const nextCertificate = {
    ...input,
    code: input.code.trim().toUpperCase() || generateCertificateCode(input.studentName, certificates),
  };

  if (certificates.some((certificate) => certificate.code.toUpperCase() === nextCertificate.code)) {
    throw new Error("Certificate code already exists.");
  }

  certificates.unshift(nextCertificate);
  await writeCertificates(certificates);
  return nextCertificate;
}

export async function addCertificates(inputs: Array<Omit<Certificate, "code"> & { code?: string }>) {
  const certificates = await readCertificates();
  const newCertificates: Certificate[] = [];
  const usedCodes = new Set(certificates.map((certificate) => certificate.code.toUpperCase()));

  for (const input of inputs) {
    const code = input.code?.trim().toUpperCase() || generateCertificateCode(input.studentName, [...certificates, ...newCertificates]);

    if (usedCodes.has(code)) {
      throw new Error(`Certificate code already exists: ${code}`);
    }

    usedCodes.add(code);
    newCertificates.push({
      studentName: input.studentName.trim(),
      courseName: input.courseName.trim(),
      issueDate: input.issueDate,
      code,
    });
  }

  await writeCertificates([...newCertificates.reverse(), ...certificates]);
  return newCertificates.reverse();
}

function generateCertificateCode(studentName: string, existingCertificates: Certificate[]) {
  const initials = studentName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const prefix = initials || "EB";
  const year = new Date().getFullYear();
  const existingCodes = new Set(existingCertificates.map((certificate) => certificate.code.toUpperCase()));

  for (let index = existingCertificates.length + 1; index < existingCertificates.length + 10000; index += 1) {
    const code = `EB-${year}-${prefix}-${String(index).padStart(4, "0")}`;

    if (!existingCodes.has(code)) {
      return code;
    }
  }

  return `EB-${year}-${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function deleteCertificate(code: string) {
  const normalizedCode = code.trim().toUpperCase();
  const certificates = await readCertificates();
  const remaining = certificates.filter((certificate) => certificate.code.toUpperCase() !== normalizedCode);

  if (remaining.length === certificates.length) {
    return false;
  }

  await writeCertificates(remaining);
  return true;
}
